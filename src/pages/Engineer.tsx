import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';
import api from '../lib/api';
import Footer from '../components/Footer';
import { SkewedSolarQAInterface } from '../components/SkewedSolarQAInterface';
import { QAConversationFlow } from '../components/QAConversationFlow';
import leftGraphic from '../assets/ENGINEER.png';
import verticalGraphic from '../assets/Group 1171277870.png';

/**
 * Engineer page replicates the Engineer marketing page.  It shares the
 * search bar and tab navigation from other pages but introduces a
 * description of the Solar AI core and two columns of bullet points.
 */
const Engineer: React.FC = () => {
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

      {/* Main content with Solar QA Interface */}
      <div className="text-center mt-8 px-4 relative z-10 max-w-2xl mx-auto">
        <h1 className="text-lg md:text-[20px] text-center italic font-semibold font-montserrat mb-6">
          Design A Complete
          <span className="text-green-600 font-bold italic"> Solar System</span> With One Simple Sentence
        </h1>
        
        {/* Search container with skewed box styling */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="slanted-box px-8 pt-6 pb-3">
              <SkewedSolarQAInterface onEnergyIconClick={handleEnergyIconClick} />
            </div>
          </div>
        </div>

        {/* Tabs */}
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

      {/* QA Conversation Flow - appears below original content when activated */}
      <QAConversationFlow />

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