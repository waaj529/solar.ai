import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';
import api from '../lib/api';
import Footer from '../components/Footer';
import { SkewedSolarQAInterface } from '../components/SkewedSolarQAInterface';
import { QAConversationFlow } from '../components/QAConversationFlow';
import leftGraphic from '../assets/Evolve.png';
import verticalGraphic from '../assets/Group 1171277870.png';

/**
 * Evolve page presents the "EVOLVE" section with messaging about
 * continuously improving solar systems through AI insights.
 */
const Evolve: React.FC = () => {
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
              <SkewedSolarQAInterface onEnergyIconClick={handleEnergyIconClick} />
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

      {/* QA Conversation Flow - appears below original content when activated */}
      <QAConversationFlow />

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