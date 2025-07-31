import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import leftGraphic from '../assets/Evolve.png';
import verticalGraphic from '../assets/Group 1171277870.png';

/**
 * Evolve page recreates the EVOLVE marketing page.  It shares the
 * familiar search bar and tab navigation but introduces a future‑focused
 * message about GREEN's innovations along with a trio of features and a
 * global tagline.
 */
const Evolve: React.FC = () => {
  const navigate = useNavigate();

  // helper for active nav link classes
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-green-600 font-semibold' : 'hover:text-green-600';

  // Handle energy icon click - navigate to dashboard
  const handleEnergyIconClick = () => {
    navigate('/dashboard');
  };

  return (
    <main className="relative overflow-x-hidden">
      {/* Navigation links at the top */}
      <nav className="flex justify-end items-center p-4 space-x-6 text-gray-600 font-medium">
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
      </nav>

      {/* Background images */}
      <img
        src={leftGraphic}
        alt="Evolve graphic"
        className="absolute top-72 left-20 h-80 hidden md:block"
      />
      <img
        src={verticalGraphic}
        alt="Vertical text graphic"
        className="absolute top-0 left-0 h-[30rem] w-auto block z-0"
      />

      {/* Search and tabs */}
      <div className="text-center mt-8 px-4 relative z-10 max-w-2xl mx-auto">
        <h1 className="text-lg md:text-[20px] text-center italic font-semibold font-montserrat">
          Design A Complete
          <span className="text-green-600 font-bold italic"> Solar System</span> With One Simple Sentence
        </h1>
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="slanted-box px-8 pt-6 pb-3">
              <div className="flex items-start">
                <input
                  type="text"
                  placeholder="Let's Talk Energy"
                  className="flex-1 text-lg italic font-medium text-gray-500 bg-transparent border-none outline-none slanted-text placeholder:italic placeholder:text-gray-500"
                />
                <div className="ml-4 flex items-center h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-yellow-400 cursor-pointer hover:text-green-600 transition-colors duration-200"
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
              <div className="flex items-center gap-4 mt-4 ml-1">
                <span className="material-icons h-7 w-7 text-gray-400 hover:text-green-600 hover:shadow-lg transition cursor-pointer">
                  mic
                </span>
                <span className="material-icons h-6 w-6 text-gray-400 hover:text-green-600 cursor-pointer">
                  image
                </span>
                <span className="material-icons h-6 w-6 text-gray-400 hover:text-green-600 cursor-pointer">
                  attach_file
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <div className="tab">
            <span>Solar Diagram</span>
          </div>
          <div className="tab">
            <span>How Do Solar Panels Work?</span>
          </div>
          <div className="tab">
            <span>Solar CAD Diagrams</span>
          </div>
          <div className="tab">
            <span>Benefits Of Using Solar Energy</span>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="content-container relative z-10">
        <h1 className="hero-heading">
          <span className="content-green">GREEN's</span>
          <span className="italic"> Future Is Intelligent.</span>
        </h1>
        <p className="subheading">
          <span className="content-green">GREEN Infina</span> is not just an innovation. It is the new foundation for how
          solar is designed, sold, and delivered.
        </p>
        <p className="description">
          Created by <span className="content-green">GREEN</span> Limited, a solar
          <span className="content-green"> EPC</span> leader, Infina compresses weeks of technical work
          <br /> into seconds of intelligent processing.
        </p>
        <div className="features">
          <div className="feature">
            <span className="icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2v11h3v9l7-12h-4l-6-8z" />
              </svg>
            </span>
            <span className="text">Fully IP‑Secured And EPC‑Grade</span>
          </div>
          <div className="feature">
            <span className="icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2v11h3v9l7-12h-4l-6-8z" />
              </svg>
            </span>
            <span className="text">Engineered By Professionals, Not Platforms</span>
          </div>
          <div className="feature">
            <span className="icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2v11h3v9l7-12h-4l-6-8z" />
              </svg>
            </span>
            <span className="text">Scalable, Integrable, Future‑Proof</span>
          </div>
        </div>
        <h2 className="subfoot">
          <span className="italic font-normal">From</span>{' '}
          <span className="italic content-green font-bold">Papua New Guinea</span>{' '}
          <span className="italic font-normal">To The World</span>
        </h2>
        <p className="tagline">— Solar Design Now Operates At The Speed Of Thought.</p>
      </div>
      <Footer />
    </main>
  );
};

export default Evolve;