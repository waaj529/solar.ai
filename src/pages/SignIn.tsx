import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';
import signinBg from '@/assets/background sign in page.png';
import greenLogo from '@/assets/GREEN Logo - High 21.png';
import leftTopBrand from '@/assets/Group 1171277870.png';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before being redirected to signin
  // Always land on Profile after login (consistent UX)
  const postLoginPath = '/profile';

  // Handle success message and email/name pre-fill from signup
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    // If coming directly from SignUp, persist the name so Profile can greet
    if (location.state?.signupName) {
      try {
        localStorage.setItem('last_signup_name', JSON.stringify(location.state.signupName));
      } catch {}
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    const success = await login(email, password);
    if (success) {
      navigate(postLoginPath, { replace: true, state: { showWelcomeOverlay: true } });
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-12 relative pb-16 md:pb-20 lg:pb-0">
      {/* Left visual panel from Figma: gradient + background image */}
      <div className="relative hidden lg:block lg:col-span-7">
        {/* Clipped background only */}
        <div className="absolute inset-0 auth-hero-clip overflow-hidden z-0">
          <img
            src={signinBg}
            alt="Sign in background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 via-white/50 to-green-200/40" />
          {/* Top-left brand overlay image inside clipped area */}
          <img
            src={leftTopBrand}
            alt="GREEN Infina motif"
            className="absolute left-0 top-0 w-56 md:w-64 lg:w-72 select-none"
            draggable={false}
          />
        </div>
        {/* Copy block (not clipped) */}
        <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 sm:px-10 lg:pl-28 xl:pl-36 pr-8 md:pr-14 lg:pr-28 text-gray-900">
          <div className="max-w-[500px] md:max-w-[540px] text-left font-montserrat mt-10 lg:-mt-10 xl:-mt-12">
            <h2 className="text-[28px] md:text-[30px] lg:text-[32px] leading-[1.25] font-extrabold italic">
              <span className="font-semibold">Welcome To </span>
              <span className="text-[#23B14D]">GREEN Infina</span>
            </h2>
            <p className="mt-2 text-base md:text-lg font-semibold">
              <span className="text-[#23B14D]">AI</span>-Powered Solar Design Begins Here.
            </p>
            <p className="mt-4 text-[15px] md:text-[16px] lg:text-[17px] leading-relaxed font-medium italic opacity-95">
              Sign in to access your designs, generate new systems, and unlock the full
              capabilities of <span className="text-[#23B14D] font-semibold italic">GREEN Infina</span> — the world’s most advanced solar intelligence engine.
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-5">
        <div className="flex flex-1 items-start lg:items-center justify-center pt-6 lg:pt-0">
          <div className="w-full max-w-[860px]">
            {/* Mobile hero background wedge */}
            <div className="lg:hidden relative h-40 sm:h-48 mb-6">
              <div className="absolute inset-0 auth-hero-clip overflow-hidden z-0">
                <img
                  src={signinBg}
                  alt="Sign in background"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 via-white/50 to-green-200/40" />
                <img
                  src={leftTopBrand}
                  alt="GREEN Infina motif"
                  className="absolute left-0 top-0 w-40 sm:w-48 select-none"
                  draggable={false}
                />
              </div>
            </div>
            {/* Mobile hero copy (only on small screens) */}
            <div className="lg:hidden mb-6">
              <div className="text-left font-montserrat">
                <h2 className="text-[22px] sm:text-[24px] leading-[1.25] font-extrabold italic">
                  <span className="font-semibold">Welcome To </span>
                  <span className="text-[#23B14D]">GREEN Infina</span>
                </h2>
                <p className="mt-1 text-sm sm:text-base font-semibold">
                  <span className="text-[#23B14D]">AI</span>-Powered Solar Design Begins Here.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed font-medium italic opacity-95">
                  Sign in to access your designs, generate new systems, and unlock the full
                  capabilities of <span className="text-[#23B14D] font-semibold italic">GREEN Infina</span> — the world’s most advanced solar intelligence engine.
                </p>
              </div>
            </div>
            {/* Header block (no card) */}
            <div className="text-center mb-8 md:mb-10">
              <h3 className="text-3xl md:text-[34px] font-extrabold tracking-wide uppercase font-montserrat">
                Sign in to your account
              </h3>
              <p className="mt-2 text-sm md:text-base text-gray-700 font-montserrat italic">
                Enter your credentials to access <span className="text-[#23B14D] font-semibold italic">GREEN Infina</span>
              </p>
            </div>
            <div className="px-2 md:px-0">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="skew-field">
                  <input
                    id="email"
                    type="email"
                    placeholder="E-MAIL ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="skew-field-input"
                  />
                </div>
                <div className="skew-field">
                  <input
                    id="password"
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="skew-field-input"
                  />
                </div>
                <div className="flex items-center justify-end -mt-2">
                  <label htmlFor="remember-me" className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                    />
                    Remember me
                  </label>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="cta-gradient-button w-[250px] text-black text-xl font-semibold font-montserrat focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Login'}
                  </button>
                </div>
                <div className="text-center">
                  <a href="/forgot-password" className="text-sm text-[#23B14D] hover:text-green-700 underline font-bold">
                    Forgot your password?
                  </a>
                </div>
              </form>
            </div>
            <div className="mt-6 text-center font-montserrat">
              <p className="text-sm text-gray-700">
                Don't have an account?{' '}
                <NavLink to="/signup" className="text-[#23B14D] hover:text-green-700 font-bold underline">
                  Signup
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer/help - sticky on desktop, stacked on mobile */}
      <div className="z-30 pb-5 md:pb-5 lg:pl-14 w-full px-4 lg:px-0 lg:absolute lg:inset-x-0 lg:bottom-4">
        <p className="text-center text-xs sm:text-sm text-gray-700 font-medium font-montserrat">
          Need help? Contact us at team infina@green.com.pg
        </p>
        <div className="hidden sm:flex absolute right-6 bottom-5 md:bottom-5 items-center gap-3">
          <span className="text-sm font-bold tracking-wide text-gray-800 font-montserrat">A Solution BY</span>
          <img src={greenLogo} alt="GREEN" className="h-8 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;