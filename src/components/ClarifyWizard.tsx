import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, {
  solarClarify,
  saveQuestionAndAnswers as saveQA,
  getUserIdFromStoredToken,
  runLoadAnalysis,
} from '../lib/api';

interface ClarifyWizardProps {
  afterFinishNavigateTo?: string;
}

/**
 * Reusable wizard that:
 * - Takes a free-text prompt
 * - Calls backend to get clarification questions
 * - Captures answers, saves Q&A, triggers load analysis
 * - Navigates to dashboard (or provided route) on finish
 */
const ClarifyWizard: React.FC<ClarifyWizardProps> = ({ afterFinishNavigateTo = '/dashboard' }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>('');
  const [basePrompt, setBasePrompt] = useState<string>('');
  const [clarifications, setClarifications] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const isFinishingRef = useRef(false);

  const ensureUserId = (): string => {
    const isObjectId = (v: string) => /^[a-f0-9]{24}$/i.test(v);
    const encrypted = localStorage.getItem('encrypted_user_id');
    if (encrypted && isObjectId(encrypted)) return encrypted;

    const tokenUserId = getUserIdFromStoredToken();
    if (tokenUserId && isObjectId(String(tokenUserId))) return String(tokenUserId);

    let anon = localStorage.getItem('anon_user_id');
    if (!anon) {
      try {
        const getHex = (len: number) => {
          const bytes = new Uint8Array(len / 2);
          crypto.getRandomValues(bytes);
          return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
        };
        anon = getHex(24);
      } catch {
        anon = `${Date.now().toString(16)}${Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, '0')}`
          .slice(0, 24)
          .padEnd(24, '0');
      }
      localStorage.setItem('anon_user_id', anon);
    }
    if (!/^[a-f0-9]{24}$/i.test(anon)) {
      const regen = anon.slice(0, 24).padEnd(24, '0');
      localStorage.setItem('anon_user_id', regen);
      return regen;
    }
    return anon;
  };

  const triggerClarify = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setClarifications([]);
      return;
    }
    setBasePrompt(trimmed);
    const result = await solarClarify(trimmed);
    setClarifications(result || []);
  };

  const handleClarifySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    await triggerClarify(query.trim());
  };

  // Reset answers when new clarifications arrive
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

  const isLastQuestion = clarifications.length > 0 && currentIndex === clarifications.length - 1;

  const handleNext = async () => {
    if (isFinishingRef.current) return;
    const currentAnswer = (answers[currentIndex] ?? '').trim();
    if (!isLastQuestion && !currentAnswer) return;

    if (isLastQuestion) {
      isFinishingRef.current = true;
      setIsFinishing(true);
      // Save Q&A and trigger load analysis
      const uid = ensureUserId();
      const promptToSend = (query.trim() || basePrompt).trim();
      try {
        const res = (await saveQA({ user_id: uid, prompt: promptToSend, answers: answers.map(a => String(a).trim()) })) as { nlp_id?: string; id?: string };
        const nlpId = res?.nlp_id || res?.id || null;
        if (nlpId) {
          localStorage.setItem('latest_nlp_id', nlpId);
          const triggerKey = `load_triggered_${nlpId}`;
          if (!localStorage.getItem(triggerKey)) {
            localStorage.setItem(triggerKey, 'pending');
            try {
              const la = await runLoadAnalysis({ user_id: uid, nlp_id: nlpId });
              const loadId = (la as any)?.load_id;
              if (loadId) localStorage.setItem('latest_load_id', String(loadId));
              localStorage.setItem(triggerKey, 'done');
            } catch (e) {
              localStorage.removeItem(triggerKey);
            }
          }
        }
      } catch {
        // ignore save errors here; still navigate
      }

      navigate(afterFinishNavigateTo);
      setIsFinishing(false);
      isFinishingRef.current = false;
      return;
    }

    setCurrentIndex((idx) => Math.min(idx + 1, clarifications.length - 1));
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="slanted-box px-8 pt-6 pb-3">
        <form onSubmit={handleClarifySubmit} className="flex items-start justify-between">
          <input
            type="text"
            placeholder="Let's Talk Energy"
            className="flex-1 text-lg italic font-medium text-gray-500 bg-transparent border-none outline-none slanted-text placeholder:italic placeholder:text-gray-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="ml-4 flex items-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-yellow-400 cursor-pointer hover:text-green-600 transition-colors duration-200 touch-manipulation"
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

        {clarifications.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-gray-600 mb-2">Question {currentIndex + 1} of {clarifications.length}</div>
            <div className="px-3 py-2 text-sm rounded-full bg-green-50 text-green-700 border border-green-200 inline-block mb-2">
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
        )}

        <div className="pt-3 flex items-center justify-between">
          <div className="flex items-center gap-4 ml-1">
            <span className="material-icons h-6 w-6 text-gray-400 hover:text-green-600 transition cursor-pointer touch-manipulation">mic</span>
            <span className="material-icons h-6 w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation">image</span>
            <span className="material-icons h-6 w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation">attach_file</span>
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
  );
};

export default ClarifyWizard;

