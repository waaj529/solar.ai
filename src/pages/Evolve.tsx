import React from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import boltIcon from '@icons/image (202) 2 (1).png';
import leftGraphic from '../assets/Evolve.png';
import verticalGraphic from '../assets/Group 1171277870.png';
import ClarifyWizard from '../components/ClarifyWizard';

/**
 * Evolve page presents the "EVOLVE" section with messaging about
 * continuously improving solar systems through AI insights.
 */
const Evolve: React.FC = () => {

  return (
    <main className="relative overflow-x-hidden w-full min-h-screen">
      {/* Global Navigation (responsive) */}
      <Navigation />

      {/* Background images */}
      <img
        src={leftGraphic}
        alt="Evolve graphic"
        className="absolute top-72 left-20 h-80 hidden xl:block pointer-events-none"
      />
      <img
        src={verticalGraphic}
        alt="Vertical text graphic"
        className="absolute top-0 left-0 h-[30rem] w-auto hidden xl:block z-0 pointer-events-none"
      />

      {/* Search and tabs */}
      <div className="text-center mt-8 px-4 relative z-10 max-w-2xl mx-auto">
        <h1 className="text-lg md:text-[20px] text-center italic font-semibold font-montserrat">
          Design A Complete
          <span className="text-green-600 font-bold italic"> Solar System</span> With One Simple Sentence
        </h1>
        <div className="mt-6 flex justify-center">
          <ClarifyWizard afterFinishNavigateTo="/dashboard" />
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
              <img src={boltIcon} alt="" className="w-5 h-5" />
            </span>
            <span className="text">Fully IP‑Secured And EPC‑Grade</span>
          </div>
          <div className="feature">
            <span className="icon">
              <img src={boltIcon} alt="" className="w-5 h-5" />
            </span>
            <span className="text">Engineered By Professionals, Not Platforms</span>
          </div>
          <div className="feature">
            <span className="icon">
              <img src={boltIcon} alt="" className="w-5 h-5" />
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
      <div className="mt-8">
        <Footer />
      </div>
    </main>
  );
};

export default Evolve;