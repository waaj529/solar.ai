import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import leftGraphic from '../assets/ENGINEER.png';
import verticalGraphic from '../assets/Group 1171277870.png';
import { useAuth } from '../features/auth/services/AuthContext';

/**
 * Engineer page replicates the Engineer marketing page.  It shares the
 * search bar and tab navigation from other pages but introduces a
 * description of the Solar AI core and two columns of bullet points.
 */
const Engineer: React.FC = () => {
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
        <NavLink to="/signout" className="text-gray-600 hover:text-green-600">
          SIGN OUT
        </NavLink>
      </nav>

      {/* Background images */}
      <img
        src={leftGraphic}
        alt="Engineer graphic"
        className="absolute top-72 left-20 h-96 hidden md:block"
      />
      <img
        src={verticalGraphic}
        alt="Vertical text graphic"
        className="absolute top-0 left-0 h-[30rem] w-auto hidden md:block"
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

      {/* Thinking core section */}
      <section className="mt-8 relative z-10 px-4">
        <h1 className="text-center text-2xl md:text-3xl italic font-medium mb-4">
          The Thinking Core Of <span className="text-green-600 font-semibold">Solar AI.</span>
        </h1>
        <p className="text-center text-base md:text-lg mx-auto max-w-4xl leading-relaxed mb-6">
          <span className="font-bold text-green-600">GREEN Infina</span> is more than software. It's cognition built into
          kilowatts. With every input,
          <br className="hidden md:block" /> it thinks like your best engineer — only faster.
        </p>
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <ul className="feature-list space-y-4">
            <li>
              <span className="bullet-icon">bolt</span>Natural Language AI Extracts Specs, Locations, Constraints
            </li>
            <li>
              <span className="bullet-icon">bolt</span>Weather And Irradiance Are Factored Dynamically
            </li>
            <li>
              <span className="bullet-icon">bolt</span>Outputs Are Tailored To Delivery Timelines And Sourcing
            </li>
          </ul>
          <ul className="feature-list space-y-4">
            <li>
              <span className="bullet-icon">bolt</span>Solar Logic Calculates Load, Autonomy, Battery Sizing
            </li>
            <li>
              <span className="bullet-icon">bolt</span>Inventory‑Aware Design Adapts In Real Time
            </li>
          </ul>
        </div>
      </section>

      {/* Final tagline */}
      <div className="mt-8 text-center text-lg md:text-lg font-semibold relative z-10 mb-4">
        <span className="italic font-normal">One</span>{' '}
        <span className="text-green-600 italic font-bold">Prompt.</span>{' '}
        <span className="italic font-normal">One Brain. One Design</span>
      </div>
      <Footer />
    </main>
  );
};

export default Engineer;