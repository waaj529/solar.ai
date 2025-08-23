import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import leftGraphic from '../assets/Envision.png';
import verticalGraphic from '../assets/Group 1171277870.png';
import ClarifyWizard from '../components/ClarifyWizard';

/**
 * Envision page captures the "ENVISION" section from the original site.
 * It features the same search bar and tabs as other pages, a bold
 * headline inviting users to speak their vision, example glow panels
 * showing typical prompts and a closing tagline.
 */
const Envision: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="relative overflow-x-hidden w-full min-h-screen">
      {/* Global Navigation (reused responsive component) */}
      <Navigation />

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
              <ClarifyWizard afterFinishNavigateTo="/dashboard" />
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