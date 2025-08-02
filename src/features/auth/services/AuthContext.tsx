import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://34.239.246.193:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('🔍 Full Login Response:', responseData); // Enhanced debug log
        
        // Store authentication token if provided
        let token = null;
        if (responseData.token) {
          token = responseData.token;
          console.log('📝 Found token:', token);
        } else if (responseData.access_token) {
          token = responseData.access_token;
          console.log('📝 Found access_token:', token);
        } else if (responseData.accessToken) {
          token = responseData.accessToken;
          console.log('📝 Found accessToken:', token);
        } else {
          console.log('⚠️ No token found in response, checking for session-based auth');
          // For session-based authentication, we might not get a token
          // but the login itself confirms authentication
        }
        
        if (token) {
          localStorage.setItem('auth_token', token);
          console.log('💾 Token stored in localStorage');
        } else {
          // If no token but login successful, store user credentials for Basic Auth
          const basicAuth = btoa(`${email}:${password}`);
          localStorage.setItem('basic_auth', basicAuth);
          console.log('💾 Basic auth credentials stored for dashboard access');
        }
        
        // Store user credentials as fallback for dashboard authentication
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_password', password);
        
        // Create user object from response data
        const userData: User = {
          id: responseData.id || responseData.user_id || Date.now().toString(),
          email: responseData.email || email,
          firstName: responseData.firstName || responseData.first_name || responseData.name?.split(' ')[0] || email.split('@')[0] || 'User',
          lastName: responseData.lastName || responseData.last_name || responseData.name?.split(' ')[1] || 'Demo'
        };
        
        console.log('👤 Created user object:', userData);
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        console.error('❌ Login failed:', errorData);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('🚨 Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (userData: { email: string; password: string; firstName: string; lastName: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://34.239.246.193:5001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          password: userData.password,
          profile: {}
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Create user object from response data
        const newUser: User = {
          id: responseData.id || Date.now().toString(),
          email: responseData.email || userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Signup failed' }));
        console.error('Signup failed:', errorData);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};