import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage }) => {
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
    <nav className="relative">
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-end items-center p-4 space-x-6 text-gray-600 font-medium">
        {currentPage !== 'home' && (
          <NavLink to="/" className={navClass}>
            HOME
          </NavLink>
        )}
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
      <div className="md:hidden flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-xl font-bold text-green-600">
          GREEN<span className="text-gray-700"> INFINA</span>
        </div>
        
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="relative z-50 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
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
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={closeMenu}></div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col pt-16 px-6 space-y-6">
          {currentPage !== 'home' && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 text-lg font-medium ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`
              }
              onClick={closeMenu}
            >
              HOME
            </NavLink>
          )}
          <NavLink
            to="/envision"
            className={({ isActive }) =>
              `block py-2 text-lg font-medium ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`
            }
            onClick={closeMenu}
          >
            ENVISION
          </NavLink>
          <NavLink
            to="/engineer"
            className={({ isActive }) =>
              `block py-2 text-lg font-medium ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`
            }
            onClick={closeMenu}
          >
            ENGINEER
          </NavLink>
          <NavLink
            to="/empower"
            className={({ isActive }) =>
              `block py-2 text-lg font-medium ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`
            }
            onClick={closeMenu}
          >
            EMPOWER
          </NavLink>
          <NavLink
            to="/evolve"
            className={({ isActive }) =>
              `block py-2 text-lg font-medium ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'}`
            }
            onClick={closeMenu}
          >
            EVOLVE
          </NavLink>
          <NavLink
            to="/signin"
            className="block py-2 text-lg font-medium text-gray-600 hover:text-green-600"
            onClick={closeMenu}
          >
            SIGN IN
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;