import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';
import Footer from '../components/Footer';
import leftGraphic from '../assets/Envision.png';
import verticalGraphic from '../assets/Group 1171277870.png';

/**
 * Envision page captures the "ENVISION" section from the original site.
 * It features the same search bar and tabs as other pages, a bold
 * headline inviting users to speak their vision, example glow panels
 * showing typical prompts and a closing tagline.
 */
const Envision: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // helper for active nav link classes
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-green-600 font-semibold' : 'hover:text-green-600';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle energy icon click - call dashboard API and navigate to dashboard
  const handleEnergyIconClick = async () => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const basicAuth = localStorage.getItem('basic_auth');
      const userEmail = localStorage.getItem('user_email');
      const userPassword = localStorage.getItem('user_password');
      
      console.log('🔑 Auth token from localStorage:', authToken ? 'Found' : 'Not found');
      console.log('🔑 Basic auth from localStorage:', basicAuth ? 'Found' : 'Not found');
      console.log('🔑 User credentials from localStorage:', userEmail ? 'Found' : 'Not found');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Try multiple authentication methods
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
        console.log('🔐 Adding Bearer token to request');
      } else if (basicAuth) {
        headers['Authorization'] = `Basic ${basicAuth}`;
        console.log('🔐 Adding Basic auth to request');
      } else if (userEmail && userPassword) {
        const basicAuthFallback = btoa(`${userEmail}:${userPassword}`);
        headers['Authorization'] = `Basic ${basicAuthFallback}`;
        console.log('🔐 Adding Basic auth (from credentials) to request');
      } else {
        console.log('⚠️ No authentication available for dashboard request');
      }

      console.log('🚀 Making dashboard API call...');
      const response = await fetch('http://34.239.246.193:5001/dashboard', {
        method: 'GET',
        headers,
      });

      console.log('📡 Dashboard API response status:', response.status);

      if (response.ok) {
        const dashboardData = await response.json();
        console.log('✅ Dashboard data received:', dashboardData);
        // Navigate to dashboard after successful API call
        navigate('/dashboard');
      } else {
        console.error('❌ Dashboard API call failed:', response.status);
        
        // Try to get error details
        try {
          const errorData = await response.json();
          console.error('📋 Error details:', errorData);
        } catch (e) {
          console.error('📋 Could not parse error response');
        }
        
        // Still navigate to dashboard even if API fails
        console.log('🔀 Navigating to dashboard anyway...');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('🚨 Dashboard API error:', error);
      // Still navigate to dashboard even if API fails
      console.log('🔀 Navigating to dashboard anyway due to error...');
      navigate('/dashboard');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <main className="relative overflow-x-hidden w-full min-h-screen">
      {/* Navigation - Mobile First with Hamburger Menu */}
      <nav className="relative w-full">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center p-4 text-gray-600 font-medium">
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user?.firstName}</span>
          </div>
          <div className="flex items-center space-x-6">
            <NavLink to="/envision" className={navClass}>
              ENVISION
            </NavLink>
            <NavLink to="/engineer" className={navClass}>
              ENGINEER
            </NavLink>
            <NavLink to="/empower" className={navClass}>
              EMPOWER
            </NavLink>
            <NavLink to="/evolve" className={navClass}>
              EVOLVE
            </NavLink>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              SIGN OUT
            </button>
          </div>
        </div>

        {/* Mobile Navigation Header */}
        <div className="md:hidden flex justify-between items-center p-3 relative z-30">
          {/* Logo - clicking goes to home */}
          <NavLink to="/" className="text-lg sm:text-xl font-bold text-green-600">
            GREEN<span className="text-gray-700"> INFINA</span>
          </NavLink>
          
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="relative z-50 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 touch-manipulation"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-gray-600 transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                }`}
              ></span>
              <span
                className={`absolute top-2.5 left-0 w-6 h-0.5 bg-gray-600 transform transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`absolute top-5 left-0 w-6 h-0.5 bg-gray-600 transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 touch-manipulation" 
            onClick={closeMenu}
          ></div>
        )}

        {/* Mobile Menu Drawer */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col pt-16 px-6 space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
            </div>
            <NavLink
              to="/envision"
              className={({ isActive }) =>
                `block py-3 text-lg font-medium touch-manipulation ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`
              }
              onClick={closeMenu}
            >
              ENVISION
            </NavLink>
            <NavLink
              to="/engineer"
              className={({ isActive }) =>
                `block py-3 text-lg font-medium touch-manipulation ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`
              }
              onClick={closeMenu}
            >
              ENGINEER
            </NavLink>
            <NavLink
              to="/empower"
              className={({ isActive }) =>
                `block py-3 text-lg font-medium touch-manipulation ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`
              }
              onClick={closeMenu}
            >
              EMPOWER
            </NavLink>
            <NavLink
              to="/evolve"
              className={({ isActive }) =>
                `block py-3 text-lg font-medium touch-manipulation ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`
              }
              onClick={closeMenu}
            >
              EVOLVE
            </NavLink>
            <button
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
              className="block py-3 text-lg font-medium text-red-600 hover:text-red-700 touch-manipulation text-left"
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </nav>

      {/* Background images - completely hidden on mobile */}
      <img
        src={leftGraphic}
        alt="Envision graphic"
        className="absolute top-72 left-20 h-96 hidden xl:block pointer-events-none"
      />
      <img
        src={verticalGraphic}
        alt="Vertical text graphic"
        className="absolute top-0 left-0 h-[30rem] w-auto hidden xl:block pointer-events-none"
      />

      {/* Main content - Mobile optimized */}
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        {/* Heading and search */}
        <div className="text-center mt-4 sm:mt-6 md:mt-8">
          <h1 className="text-base sm:text-lg md:text-xl font-semibold italic font-montserrat text-center mb-4 sm:mb-6 px-2">
            Design A Complete
            <span className="text-green-600 font-bold italic"> Solar System</span> With One Simple Sentence
          </h1>
          
          {/* Search container - Mobile responsive */}
          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="slanted-box px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-2 sm:pb-3">
                <div className="flex items-start">
                  <input
                    type="text"
                    placeholder="Let's Talk Energy"
                    className="flex-1 text-sm sm:text-base md:text-lg italic font-medium text-gray-500 bg-transparent border-none outline-none slanted-text placeholder:italic placeholder:text-gray-500"
                  />
                  <div className="ml-2 sm:ml-4 flex items-center h-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400 cursor-pointer hover:text-green-600 transition-colors duration-200 touch-manipulation"
                      viewBox="0 0 24 24"
                      fill="none"
                      onClick={handleEnergyIconClick}
                    >
                      <title>Connect to Dashboard</title>
                      <polygon
                        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                        fill="#D1FF3A"
                        stroke="#B6E51D"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-4 ml-1">
                  <span className="material-icons h-5 w-5 sm:h-7 sm:w-7 text-gray-400 hover:text-green-600 hover:shadow-lg transition cursor-pointer touch-manipulation text-lg sm:text-xl">
                    mic
                  </span>
                  <span className="material-icons h-4 w-4 sm:h-6 sm:w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation text-base sm:text-lg">
                    image
                  </span>
                  <span className="material-icons h-4 w-4 sm:h-6 sm:w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation text-base sm:text-lg">
                    attach_file
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs - Mobile responsive */}
          <div className="mt-3 sm:mt-4 flex justify-start sm:justify-center gap-2 overflow-x-auto px-2 pb-2">
            <div className="tab flex-shrink-0">
              <span>Solar Diagram</span>
            </div>
            <div className="tab flex-shrink-0">
              <span>How Do Solar Panels Work?</span>
            </div>
            <div className="tab flex-shrink-0">
              <span>Solar CAD Diagrams</span>
            </div>
            <div className="tab flex-shrink-0">
              <span>Benefits Of Using Solar Energy</span>
            </div>
          </div>

          {/* Say it section - Mobile optimized */}
          <div className="mt-6 sm:mt-8 text-center px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-2 sm:mb-4">
              Say It. See It <span className="text-green-600">Built.</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">You don't fill forms. You speak your vision.</p>
            <p className="text-sm sm:text-base md:text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed">
              <span className="font-medium text-green-600">GREEN Infina</span> reads your intent — size, location, storage, backup needs
              <br className="hidden sm:block" /> and launches a precision‑engineered solar design in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Example glow panels - Mobile responsive */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center sm:items-stretch gap-4 sm:gap-8 overflow-x-auto px-3 sm:px-4 relative z-10">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div className="glow-panel flex-shrink-0 w-full sm:w-auto max-w-xs sm:max-w-none" key={idx}>
            <div className="left-group">
              <div className="title">"10kW hybrid solar system"</div>
              <div className="actions">
                <span className="material-icons touch-manipulation">mic</span>
                <span className="material-icons touch-manipulation">image</span>
                <span className="material-icons touch-manipulation">attach_file</span>
              </div>
            </div>
            <span className="material-icons bolt touch-manipulation">flash_on</span>
          </div>
        ))}
      </div>

      {/* Final tagline - Mobile responsive */}
      <div className="mt-6 sm:mt-8 text-center text-sm sm:text-base md:text-lg font-semibold relative z-10 mb-4 sm:mb-6 px-4">
        <span className="italic font-normal">No Menus. No Blueprints.</span>{' '}
        <span className="text-green-600 italic font-bold">Just Your Words.</span>{' '}
        <span className="italic font-normal">Instantly Mapped To Megawatts.</span>
      </div>
      
      <Footer />
    </main>
  );
};

export default Envision;