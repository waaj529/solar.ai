import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before being redirected to signin
  const from = location.state?.from?.pathname || '/';

  // Handle success message and email pre-fill from signup
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    const success = await login(email, password);
    
    if (success) {
      // Navigate to the intended destination or home page
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <NavLink to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-green-600 text-white flex size-8 items-center justify-center rounded-md">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">GREEN Infina</span>
          </NavLink>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="rounded-lg border bg-white text-gray-800 shadow-sm p-6">
              <div className="flex flex-col space-y-1.5 p-6 pb-4">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Sign in to your account</h3>
                <p className="text-sm text-gray-600">Enter your credentials to access GREEN Infina</p>
              </div>
              <div className="p-6 pt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                      {successMessage}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2 w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                  <div className="text-center">
                    <a
                      href="/forgot-password"
                      className="text-sm text-green-600 hover:text-green-700 underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <NavLink
                  to="/signup"
                  className="text-green-600 hover:text-green-700 font-medium underline"
                >
                  Sign up
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-100 via-yellow-50 to-green-200 relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-800 p-8">
            <h2 className="text-4xl font-bold mb-4">Welcome to Solar Planning</h2>
            <p className="text-xl opacity-90">
              Design sustainable energy solutions with our advanced AI-powered platform
            </p>
          </div>
        </div>
        <div className="absolute top-8 left-8 right-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-gray-800">
            <h3 className="font-semibold mb-2">✨ What you'll get:</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• AI-powered load analysis and solar yield calculations</li>
              <li>• Advanced rooftop layout and SLD diagram tools</li>
              <li>• Comprehensive bill of materials and project timelines</li>
              <li>• Professional download center for all your documents</li>
            </ul>
          </div>
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-gray-800">
            <h3 className="font-semibold mb-2">Empower • Envision • Engineer • Evolve</h3>
            <p className="text-sm opacity-90">
              Join thousands of solar professionals using GREEN Infina's comprehensive planning tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;