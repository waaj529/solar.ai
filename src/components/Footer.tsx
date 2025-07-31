import React from 'react';
import logo from '../assets/GREEN Logo - High 21.png';

/**
 * Small footer used across all pages.  It displays the "A Solution by"
 * tagline along with the GREEN logo.  Because the design uses
 * italicised Montserrat text and a specific spacing, these styles are
 * encapsulated here so individual pages remain clean.
 */
const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col sm:flex-row justify-center sm:justify-end items-center mb-4 sm:mb-8 px-4 sm:px-6 sm:mr-6 gap-2 sm:gap-0">
      <span className="font-montserrat italic text-xs sm:text-sm font-medium mr-0 sm:mr-2 text-black text-center sm:text-left">
        A Solution by
      </span>
      <img src={logo} alt="GREEN Logo" className="h-6 sm:h-8 w-auto" />
    </footer>
  );
};

export default Footer;