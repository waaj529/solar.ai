import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserIdFromStoredToken, runLoadAnalysis } from '../lib/api';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import leftGraphic from '../assets/Empower.png';
import verticalGraphic from '../assets/Group 1171277870.png';
import ClarifyWizard from '../components/ClarifyWizard';
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
  const [query, setQuery] = useState('');

  const ensureUserId = (): string => {
    const isObjectId = (v: string) => /^[a-f0-9]{24}$/i.test(v);
    const encrypted = localStorage.getItem('encrypted_user_id');
    if (encrypted && isObjectId(encrypted)) return encrypted;
    const tokenUserId = getUserIdFromStoredToken();
    if (tokenUserId && isObjectId(String(tokenUserId))) return String(tokenUserId);
    let anon = localStorage.getItem('anon_user_id');
    if (!anon) {
      const getHex = (len: number) => {
        const bytes = new Uint8Array(len / 2);
        crypto.getRandomValues(bytes);
        return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
      };
      anon = getHex(24);
      localStorage.setItem('anon_user_id', anon);
    }
    if (!/^[a-f0-9]{24}$/i.test(anon)) {
      const regen = anon.slice(0, 24).padEnd(24, '0');
      localStorage.setItem('anon_user_id', regen);
      return regen;
    }
    return anon;
  };

  // Handle energy icon click - call dashboard API and navigate to dashboard
  const handleEnergyIconClick = async () => {
    try {
      // Kick off load analysis if we have a recent NLP id
      const userId = ensureUserId();
      const nlpId = localStorage.getItem('latest_nlp_id') || '';
      if (nlpId) {
        const triggerKey = `load_triggered_${nlpId}`;
        if (!localStorage.getItem(triggerKey)) {
          localStorage.setItem(triggerKey, 'pending');
          try {
            const res = await runLoadAnalysis({ user_id: userId, nlp_id: nlpId });
            const loadId = (res as any)?.load_id;
            if (loadId) localStorage.setItem('latest_load_id', String(loadId));
            localStorage.setItem(triggerKey, 'done');
            if (import.meta.env.DEV) console.log('Empower → load analysis started:', res);
          } catch (e) {
            localStorage.removeItem(triggerKey);
            if (import.meta.env.DEV) console.error('Empower → load analysis failed to start:', e);
          }
        }
      }
      // Still ping dashboard endpoint (optional, non-blocking)
      void api.get('/dashboard').catch(() => {});
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

  return (
    <main className="relative overflow-x-hidden w-full min-h-screen">
      {/* Global Navigation (responsive) */}
      <Navigation />

      {/* Background decorations */}
      <img
        src={leftGraphic}
        alt="Empower graphic"
        className="absolute top-72 left-20 h-96 hidden xl:block pointer-events-none"
      />
      <img
        src={verticalGraphic}
        alt="Vertical text graphic"
        className="absolute top-0 left-0 h-[30rem] w-auto hidden xl:block pointer-events-none"
      />

      {/* Search box and tabs */}
      <div className="text-center mt-8 px-4 relative z-10 max-w-2xl mx-auto">
        <h1 className="text-lg md:text-[20px] text-center italic font-semibold font-montserrat">
          Design A Complete
          <span className="text-green-600 font-bold italic"> Solar System</span> With One Simple Sentence
        </h1>
        <div className="mt-6 flex justify-center">
          <ClarifyWizard afterFinishNavigateTo="/dashboard" />
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
      <div className="mt-8">
        <Footer />
      </div>
    </main>
  );
};

export default Empower;