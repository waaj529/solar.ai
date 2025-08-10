import React from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import boltIcon from '@icons/image (202) 2 (1).png';
import leftGraphic from '../assets/ENGINEER.png';
import verticalGraphic from '../assets/Group 1171277870.png';
import ClarifyWizard from '../components/ClarifyWizard';

/**
 * Engineer page replicates the Engineer marketing page.  It shares the
 * search bar and tab navigation from other pages but introduces a
 * description of the Solar AI core and two columns of bullet points.
 */
const Engineer: React.FC = () => {

  return (
    <main className="relative overflow-x-hidden w-full min-h-screen">
      {/* Global Navigation (responsive) */}
      <Navigation />

      {/* Background images */}
      <img
        src={leftGraphic}
        alt="Engineer graphic"
        className="absolute top-72 left-20 h-96 hidden xl:block pointer-events-none"
      />
      <img
        src={verticalGraphic}
        alt="Vertical text graphic"
        className="absolute top-0 left-0 h-[30rem] w-auto hidden xl:block pointer-events-none"
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
              <img src={boltIcon} alt="" className="h-4 w-4 mt-1 mr-2" />
              Natural Language AI Extracts Specs, Locations, Constraints
            </li>
            <li>
              <img src={boltIcon} alt="" className="h-4 w-4 mt-1 mr-2" />
              Weather And Irradiance Are Factored Dynamically
            </li>
            <li>
              <img src={boltIcon} alt="" className="h-4 w-4 mt-1 mr-2" />
              Outputs Are Tailored To Delivery Timelines And Sourcing
            </li>
          </ul>
          <ul className="feature-list space-y-4">
            <li>
              <img src={boltIcon} alt="" className="h-4 w-4 mt-1 mr-2" />
              Solar Logic Calculates Load, Autonomy, Battery Sizing
            </li>
            <li>
              <img src={boltIcon} alt="" className="h-4 w-4 mt-1 mr-2" />
              Inventory‑Aware Design Adapts In Real Time
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
      <div className="mt-8">
        <Footer />
      </div>
    </main>
  );
};

export default Engineer;