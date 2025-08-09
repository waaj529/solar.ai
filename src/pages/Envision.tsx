import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';
import api, { saveQuestionAndAnswers as saveQAFromLib, getUserIdFromStoredToken, getStoredToken, runLoadAnalysis } from '../lib/api';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import leftGraphic from '../assets/Envision.png';
import verticalGraphic from '../assets/Group 1171277870.png';

/**
 * Envision page captures the "ENVISION" section from the original site.
 * It features the same search bar and tabs as other pages, a bold
 * headline inviting users to speak their vision, example glow panels
 * showing typical prompts and a closing tagline.
 */
const Envision: React.FC = () => {
  const navigate = useNavigate();
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const [query, setQuery] = useState<string>('');
  const [basePrompt, setBasePrompt] = useState<string>('');
  const [clarifications, setClarifications] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const isFinishingRef = useRef(false);

  // Local API helpers

  const callSolarClarify = async (text: string): Promise<string[]> => {
    const endpoint = import.meta.env.VITE_SOLAR_CLARIFY_ENDPOINT || '/solar/clarify';
    const response = await api.post(endpoint, { prompt: text });
    const data = response?.data;
    const clarifications =
      (Array.isArray(data) && data) ||
      (Array.isArray(data?.clarifications) && data?.clarifications) ||
      (Array.isArray(data?.data) && data?.data) ||
      [];
    return clarifications as string[];
  };

  const saveQuestionAndAnswers = async (
    params: { user_id: string | number; prompt: string; answers: string[] }
  ): Promise<unknown> => {
    return await saveQAFromLib(params);
  };

  const triggerClarify = async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      setClarifications([]);
      return;
    }
    try {
      setBasePrompt(trimmed);
      const result = await callSolarClarify(trimmed);
      setClarifications(result || []);
      console.log('Clarify →', result);
    } catch (error) {
      console.error('Clarify request failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  // Submit handler is the single source of truth for starting clarification
  const handleClarifySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    await triggerClarify(trimmed);
  };

  const ensureUserId = (): string => {
    const isObjectId = (v: string) => /^[a-f0-9]{24}$/i.test(v);
    // Prefer encrypted user id persisted from signup/login
    const encrypted = localStorage.getItem('encrypted_user_id');
    if (encrypted && isObjectId(encrypted)) return encrypted;
    if (user?.id) {
      const candidate = String(user.id);
      if (isObjectId(candidate)) return candidate;
    }
    // Try to extract user id from JWT if available
    const tokenUserId = getUserIdFromStoredToken();
    if (tokenUserId && isObjectId(String(tokenUserId))) {
      return String(tokenUserId);
    }
    let anon = localStorage.getItem('anon_user_id');
    if (!anon) {
      try {
        // Generate a Mongo-like ObjectId (24 hex chars)
        const getHex = (len: number) => {
          if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
            const bytes = new Uint8Array(len / 2);
            crypto.getRandomValues(bytes);
            return Array.from(bytes)
              .map((b) => b.toString(16).padStart(2, '0'))
              .join('');
          }
          let out = '';
          for (let i = 0; i < len; i++) {
            out += Math.floor(Math.random() * 16).toString(16);
          }
          return out;
        };
        anon = getHex(24);
      } catch {
        // Fallback simple hex string
        anon = `${Date.now().toString(16)}${Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, '0')}`
          .slice(0, 24)
          .padEnd(24, '0');
      }
      localStorage.setItem('anon_user_id', anon);
    }
    // If stored anon is malformed, regenerate
    if (!/^[a-f0-9]{24}$/i.test(anon)) {
      const regen = anon.slice(0, 24).padEnd(24, '0');
      localStorage.setItem('anon_user_id', regen);
      return regen;
    }
    return anon;
  };

  const handleSubmit = async (): Promise<string | null> => {
    try {
      const uid = ensureUserId();
      const promptToSend = (query.trim() || basePrompt).trim();
      const normalizedAnswers = (answers || [])
        .map((a) => String(a || '').trim())
        .filter((a) => a.length > 0);

      const payload = {
        user_id: uid,
        prompt: promptToSend,
        answers: normalizedAnswers,
      };

      // Debug logs to mirror the expected successful console output
      // eslint-disable-next-line no-console
      console.groupCollapsed('=== SAVING Q&A ANSWERS ===');
      // eslint-disable-next-line no-console
      console.log('User object:', user);
      // eslint-disable-next-line no-console
      console.log('Access token available:', getStoredToken() ? 'Yes' : 'No');
      const tokenUserId = getUserIdFromStoredToken();
      if (tokenUserId) {
        // eslint-disable-next-line no-console
        console.log('Extracted user_id from JWT token sub field:', tokenUserId);
      }
      // eslint-disable-next-line no-console
      console.log('Final user_id being used:', uid);
      // eslint-disable-next-line no-console
      console.log('API payload:', JSON.stringify(payload, null, 2));

      const res = (await saveQuestionAndAnswers(payload)) as { nlp_id?: string; id?: string; message?: string };

      // eslint-disable-next-line no-console
      console.log('✅ Q&A SAVE SUCCESS:', res);
      // eslint-disable-next-line no-console
      console.groupEnd();
      return res?.nlp_id || res?.id || null;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Save question/answers failed:', error?.response?.data || error?.message || error);
      try {
        // eslint-disable-next-line no-console
        console.groupEnd();
      } catch {}
      return null;
    }
  };

  // Reset answers and index when a new set of clarifications arrives
  useEffect(() => {
    if (clarifications.length > 0) {
      setAnswers(clarifications.map(() => ''));
      setCurrentIndex(0);
    } else {
      setAnswers([]);
      setCurrentIndex(0);
    }
  }, [clarifications]);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const isLastQuestion =
    clarifications.length > 0 && currentIndex === clarifications.length - 1;

  const handleNext = async () => {
    if (isFinishingRef.current) return; // guard against double-invoke
    // Require a non-empty answer
    const currentAnswer = (answers[currentIndex] ?? '').trim();
    // Require answer for intermediate steps, but allow finishing with blank last answer
    if (!isLastQuestion && !currentAnswer) return;

    if (isLastQuestion) {
      isFinishingRef.current = true;
      setIsFinishing(true);
      const nlpId = await handleSubmit();
      const userId = ensureUserId();
      if (nlpId) {
        localStorage.setItem('latest_nlp_id', nlpId);
        // Guard against duplicate triggers (StrictMode, rapid mounts)
        const triggerKey = `load_triggered_${nlpId}`;
        if (!localStorage.getItem(triggerKey)) {
          localStorage.setItem(triggerKey, 'pending');
          // Attempt to run load analysis immediately before navigation
          try {
            const res = await runLoadAnalysis({ user_id: userId, nlp_id: nlpId });
            // Persist load_id so dashboard/tab can fetch details
            const loadId = (res as any)?.load_id;
            if (loadId) {
              localStorage.setItem('latest_load_id', String(loadId));
            }
            localStorage.setItem(triggerKey, 'done');
            // eslint-disable-next-line no-console
            console.log('✅ Load analysis started:', res);
          } catch (e) {
            localStorage.removeItem(triggerKey);
            // eslint-disable-next-line no-console
            console.error('Load analysis failed to start:', e);
          }
        }
      }
      // eslint-disable-next-line no-console
      console.log('🚀 Navigating to dashboard...');
      navigate('/dashboard');
      setIsFinishing(false);
      isFinishingRef.current = false;
      return;
    }

    setCurrentIndex((idx) => Math.min(idx + 1, clarifications.length - 1));
  };

  // helper for active nav link classes
  // const navClass = ({ isActive }: { isActive: boolean }) =>
  //   isActive ? 'text-green-600 font-semibold' : 'hover:text-green-600';

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  // const closeMenu = () => {
  //   setIsMenuOpen(false);
  // };

  // Removed separate energy icon click path; form submission handles it

  // Handle logout
  // const handleLogout = () => {
  //   logout();
  //   navigate('/signin');
  // };

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
              <div className="slanted-box px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-2 sm:pb-3">
                <form onSubmit={handleClarifySubmit} className="flex items-start justify-between">
                  <input
                    type="text"
                    placeholder="Let's Talk Energy"
                    className="flex-1 text-sm sm:text-base md:text-lg italic font-medium text-gray-500 bg-transparent border-none outline-none slanted-text placeholder:italic placeholder:text-gray-500"
                    value={query}
                    onChange={handleInputChange}
                  />
                  {/* Energy icon at the top-right (original position) */}
                  <button type="submit" className="ml-2 sm:ml-4 flex items-center h-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400 cursor-pointer hover:text-green-600 transition-colors duration-200 touch-manipulation"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <title>Start</title>
                      <polygon
                        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                        fill="#D1FF3A"
                        stroke="#B6E51D"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </form>
                {/* Clarification wizard: show one question at a time */}
                {clarifications.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>
                        Question {currentIndex + 1} of {clarifications.length}
                      </span>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <div className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
                        {clarifications[currentIndex]}
                      </div>
                      <input
                        type="text"
                        value={answers[currentIndex] || ''}
                        onChange={(e) => handleAnswerChange(currentIndex, e.target.value)}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (!isFinishingRef.current) handleNext();
                          }
                        }}
                        placeholder="Your answer"
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                )}
                {/* Bottom actions row: icons left, action button right */}
                <div className="pt-2 sm:pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 ml-1">
                    <span className="material-icons h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-green-600 transition cursor-pointer touch-manipulation text-lg">
                      mic
                    </span>
                    <span className="material-icons h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation text-lg">
                      image
                    </span>
                    <span className="material-icons h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation text-lg">
                      attach_file
                    </span>
                  </div>
                  {clarifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isFinishing || (!isLastQuestion && !((answers[currentIndex] || '').trim().length))}
                      className="inline-flex items-center gap-2 rounded-md bg-green-600 text-white text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLastQuestion ? 'Finish' : 'Next'}
                    </button>
                  )}
                </div>
              </div>
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