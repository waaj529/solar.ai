import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserIdFromStoredToken, runLoadAnalysis } from '../lib/api';
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
            if (import.meta.env.DEV) console.log('Evolve → load analysis started:', res);
          } catch (e) {
            localStorage.removeItem(triggerKey);
            if (import.meta.env.DEV) console.error('Evolve → load analysis failed to start:', e);
          }
        }
      }
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