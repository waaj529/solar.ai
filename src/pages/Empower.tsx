import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';
import api from '../lib/api';
import Footer from '../components/Footer';
import leftGraphic from '../assets/Empower.png';
import verticalGraphic from '../assets/Group 1171277870.png';
import iconSLD from '@icons/Vector.png';
import iconBOM from '@icons/Vector (1).png';
import iconProj from '@icons/Vector (2).png';
import iconLayouts from '@icons/Vector (3).png';

/**
 * Empower page mirrors the EMP0WER marketing page.  It features a
 * slanted input box with interactive icons, a series of navigation
 * tabs and a two‑column list of output artefacts.  The layout
 * gracefully stacks on small screens and maintains the distinctive
 * gradients and skewed edges found in the original design.
 */
const Empower: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // helper for active nav link classes
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-green-600 font-semibold' : 'hover:text-green-600';

  // Handle energy icon click - call dashboard API and navigate to dashboard
  const handleEnergyIconClick = async () => {
    try {
      console.log('🚀 Making dashboard API call...');
      const response = await api.get('/dashboard');

      console.log('📡 Dashboard API response status:', response.status);
      console.log('✅ Dashboard data received:', response.data);
      // Navigate to dashboard after successful API call
      navigate('/dashboard');
    } catch (error: any) {
      console.error('🚨 Dashboard API error:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Dashboard request failed';
      console.error('❌ Dashboard API call failed:', errorMessage);
      
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
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600 transition-colors"
        >
          SIGN OUT
        </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl mx-auto mb-14 px-4">
          <div className="flex items-start gap-4">
            <img src={iconSLD} alt="SLDs" className="h-5 w-5 md:h-6 md:w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-base md:text-lg font-semibold italic leading-snug whitespace-nowrap">SLDs (Single Line Diagrams)</h3>
              <p className="text-sm md:text-base italic text-gray-500 mt-1 whitespace-nowrap">Accurate And Export‑Ready In PDF And SVG</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <img src={iconBOM} alt="BOM" className="h-5 w-5 md:h-6 md:w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-base md:text-lg font-semibold italic leading-snug whitespace-nowrap">BOM (Bill Of Materials)</h3>
              <p className="text-sm md:text-base italic text-gray-500 mt-1 whitespace-nowrap">Fully Itemized, Real‑Time Spec And Quantity</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <img src={iconLayouts} alt="Layouts" className="h-5 w-5 md:h-6 md:w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-base md:text-lg font-semibold italic leading-snug whitespace-nowrap">Layouts</h3>
              <p className="text-sm md:text-base italic text-gray-500 mt-1 whitespace-nowrap">Rooftop Or Site‑Rendered CAD Visuals In DXF Or PNG</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <img src={iconProj} alt="Projections" className="h-5 w-5 md:h-6 md:w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-base md:text-lg font-semibold italic leading-snug whitespace-nowrap">Projections</h3>
              <p className="text-sm md:text-base italic text-gray-500 mt-1 whitespace-nowrap">Timeline, Performance Yield, Lead‑Time Calculation</p>
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
      {/* Output artefacts section removed as requested */}

      {/* Final tagline */}
      <div className="mt-8 text-center text-lg md:text-lg font-semibold relative z-10 mb-4">
        <span className="italic font-normal">One</span>{' '}
        <span className="text-green-600 italic font-bold">Sentence.</span>{' '}
        <span className="italic font-normal">One Build. One System</span>
      </div>
      <Footer />
    </main>
  );
};

export default Empower;