import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await signup({
      firstName,
      lastName,
      email,
      password
    });
    
    if (success) {
      // Navigate to home page after successful signup
      navigate('/', { replace: true });
    } else {
      setError('Failed to create account. Please try again.');
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
          <div className="w-full max-w-md">
            <div className="rounded-lg border bg-white text-gray-800 shadow-sm p-6">
              <div className="flex flex-col space-y-1.5 p-6 pb-4">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Create an account</h3>
                <p className="text-sm text-gray-600">Enter your information to get started with GREEN Infina</p>
              </div>
              <div className="p-6 pt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First name
                      </label>
                      <input
                        id="first-name"
                        type="text"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">
                        Last name
                      </label>
                      <input
                        id="last-name"
                        type="text"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
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
                      placeholder="Create a password"
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
                    {isLoading ? "Creating account..." : "Create account"}
                  </button>
                </form>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <NavLink
                  to="/signin"
                  className="text-green-600 hover:text-green-700 font-medium underline"
                >
                  Sign in
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-yellow-100 via-green-50 to-yellow-200 relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-800 p-8">
            <h2 className="text-4xl font-bold mb-4">Start Your Solar Journey</h2>
            <p className="text-xl opacity-90">
              Transform the future of energy with cutting-edge solar planning technology
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
            <h3 className="font-semibold mb-2">🌱 GREEN Infina Platform</h3>
            <p className="text-sm opacity-90">
              Trusted by solar professionals worldwide for sustainable energy solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;