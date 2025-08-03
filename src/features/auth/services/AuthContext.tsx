import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { getStoredToken, setStoredToken, removeStoredToken } from '../../../lib/api';
import { User, SignupData, AuthResponse, AuthContextType } from '../../../types/auth';

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

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem('user');
      const token = getStoredToken();
      
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('user');
          removeStoredToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>('/login', {
        email,
        password
      });

      const responseData = response.data;
      console.log('Login Response:', responseData);
      
      // Extract token from response
      const token = responseData.access_token || responseData.token;
      if (token) {
        setStoredToken(token);
        console.log('Token stored successfully');
      } else {
        console.warn('No token found in login response');
      }
      
      // Create user object from response data
      const userData: User = {
        id: responseData.id || responseData.user_id || Date.now().toString(),
        email: responseData.email || email,
        firstName: responseData.firstName || responseData.first_name || responseData.name?.split(' ')[0] || email.split('@')[0] || 'User',
        lastName: responseData.lastName || responseData.last_name || responseData.name?.split(' ')[1] || 'Demo'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Login failed';
      console.error('Login failed:', errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>('/signup', {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
        profile: {}
      });

      console.log('Signup successful:', response.data);
      // Signup successful - but don't automatically log the user in
      // User will need to sign in separately with their credentials
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Signup failed';
      console.error('Signup failed:', errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    removeStoredToken();
    // Clear any other auth-related storage
    localStorage.removeItem('basic_auth');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_password');
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    token: getStoredToken()
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};