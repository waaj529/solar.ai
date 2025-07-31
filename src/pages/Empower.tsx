import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import leftGraphic from '../assets/Empower.png';
import verticalGraphic from '../assets/Group 1171277870.png';

/**
 * Empower page mirrors the EMP0WER marketing page.  It features a
 * slanted input box with interactive icons, a series of navigation
 * tabs and a two‑column list of output artefacts.  The layout
 * gracefully stacks on small screens and maintains the distinctive
 * gradients and skewed edges found in the original design.
 */
const Empower: React.FC = () => {
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

      {/* Background decorations */}
      <img
        src={leftGraphic}
        alt="Empower graphic"
        className="absolute top-72 left-20 h-96 hidden md:block"
      />
      <img
        src={verticalGraphic}
        alt="Vertical text graphic"
        className="absolute top-0 left-0 h-[30rem] w-auto hidden md:block"
      />

      {/* Search box and tabs */}
      <div className="text-center mt-8 px-4 relative z-10 max-w-2xl mx-auto">
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
                  {/* Lightning bolt icon drawn inline */}
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
              {/* Icons row */}
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
        {/* Navigation tabs */}
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

      {/* Solar blueprint section */}
      <section className="mt-8 relative z-10 px-4">
        <h2 className="text-center text-2xl md:text-3xl italic font-medium mb-4">
          Your Entire <span className="text-green-600">Solar</span> Blueprint. Delivered.
        </h2>
        <p className="text-base md:text-lg leading-relaxed text-center mx-auto max-w-3xl mb-8">
          <span className="font-bold text-green-600">GREEN Infina</span> Produces What{' '}
          <span className="font-bold text-green-600">EPC</span> Professionals Actually Use. Not Mockups. Not Estimates.
          <br />Real, Build‑Ready Documents.
        </p>
        <div className="features grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 px-4">
          <div className="feature flex gap-4 items-start">
            <span className="material-icons feature-icon">straighten</span>
            <div className="feature-content">
              <div className="feature-title font-semibold italic">SLDs (Single Line Diagrams)</div>
              <div className="feature-desc italic text-gray-500">
                Accurate And Export‑Ready In PDF And SVG
              </div>
            </div>
          </div>
          <div className="feature flex gap-4 items-start">
            <span className="material-icons feature-icon">description</span>
            <div className="feature-content">
              <div className="feature-title font-semibold italic">BOM (Bill Of Materials)</div>
              <div className="feature-desc italic text-gray-500">
                Fully Itemized, Real‑Time Spec And Quantity
              </div>
            </div>
          </div>
          <div className="feature flex gap-4 items-start">
            <span className="material-icons feature-icon">view_in_ar</span>
            <div className="feature-content">
              <div className="feature-title font-semibold italic">Layouts</div>
              <div className="feature-desc italic text-gray-500">
                Rooftop Or Site‑Rendered CAD Visuals In DXF Or PNG
              </div>
            </div>
          </div>
          <div className="feature flex gap-4 items-start">
            <span className="material-icons feature-icon">bar_chart</span>
            <div className="feature-content">
              <div className="feature-title font-semibold italic">Projections</div>
              <div className="feature-desc italic text-gray-500">
                Timeline, Performance Yield, Lead‑Time Calculation
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mb-4">
          <div className="text-lg italic font-normal">
            <span className="italic font-normal">Download. Share.</span>{' '}
            <span className="text-green-600 italic font-bold">Execute.</span>
          </div>
          <div className="text-base italic font-bold text-black">
            From AI To Engineering, Nothing Lost In Translation.
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Empower;