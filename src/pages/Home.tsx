import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import leftGraphic from '../assets/GREEN Infina.png';
import verticalGraphic from '../assets/Group 1171277870.png';

/**
 * Home page component recreates the hero section from the original
 * marketing site.  It uses skewed containers, gradient borders and
 * layered background imagery to mirror the original design.  The
 * call‑to‑action navigates to the Envision page.
 */
const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // helper for active nav link classes
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-green-600 font-semibold' : 'hover:text-green-600';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <main className="relative overflow-x-hidden min-h-screen w-full">
      {/* Navigation - Mobile First with Hamburger Menu */}
      <nav className="relative w-full">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-end items-center p-4 space-x-6 text-gray-600 font-medium">
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
          <NavLink to="/signin" className="text-gray-600 hover:text-green-600">
            SIGN IN
          </NavLink>
        </div>

        {/* Mobile Navigation Header */}
        <div className="md:hidden flex justify-between items-center p-3 relative z-30">
          {/* Logo */}
          <div className="text-lg sm:text-xl font-bold text-green-600">
            GREEN<span className="text-gray-700"> INFINA</span>
          </div>
          
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
            <NavLink
              to="/signin"
              className="block py-3 text-lg font-medium text-gray-600 hover:text-green-600 touch-manipulation"
              onClick={closeMenu}
            >
              SIGN IN
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Decorative background images - hidden on mobile for better readability */}
      <img
        src={leftGraphic}
        alt="Left Side Graphic"
        className="absolute top-80 left-16 h-96 hidden xl:block opacity-80 pointer-events-none"
      />
      <img
        src={verticalGraphic}
        alt="Vertical Text Graphic"
        className="absolute top-0 left-0 h-[30rem] w-auto hidden xl:block opacity-60 pointer-events-none"
      />

      {/* Main content - fully responsive */}
      <div className="text-center mt-2 sm:mt-4 md:mt-8 px-3 sm:px-4 md:px-6 lg:px-8 relative z-10 w-full max-w-7xl mx-auto">
        <div className="space-y-8 sm:space-y-12 md:space-y-16">
          {/* Main headline */}
          <div className="space-y-2 sm:space-y-4">
            <h1 className="enhanced-heading">
              Design <span className="text-green-600 font-semibold">A Complete Solar System</span>
            </h1>
            <p className="enhanced-heading mt-2 text-black">With One Simple Sentence</p>
          </div>

          {/* Description paragraph - responsive */}
          <div className="w-full flex justify-center">
            <div className="group-1171280748">
              <div className="content">
                <span className="highlight">GREEN Infina</span> isn't just software — it's a solar engineer that never sleeps.
              </div>
            </div>
          </div>

          {/* Information row - responsive stack on mobile */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 text-center font-medium">
            <span className="font-montserrat font-bold italic text-green-600 text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Infina
            </span>
            <div className="info-divider mx-2" />
            <span className="font-montserrat text-black text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
              Transforms Your Solar Idea Into A Fully‑Engineered,
              <br className="hidden sm:block" /> Ready‑To‑Deploy System
            </span>
            <div className="info-divider mx-2" />
            <span className="font-montserrat font-bold italic text-green-600 text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Instantly
            </span>
          </div>

          {/* Call to action - responsive */}
          <div className="flex justify-center">
            <NavLink
              to="/envision"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-200 via-yellow-100 to-yellow-300 text-black font-semibold slanted-button hover:brightness-110 transition inline-block text-sm sm:text-base touch-manipulation"
            >
              Try GREEN Infina
            </NavLink>
          </div>
        </div>
      </div>
      
      {/* Footer with responsive spacing */}
      <div className="mt-12 sm:mt-16 md:mt-20">
        <Footer />
      </div>
    </main>
  );
};

export default Home;