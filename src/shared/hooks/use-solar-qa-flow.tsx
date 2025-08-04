import { useState, useCallback } from 'react';
import { useAuth } from '../../features/auth/services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStoredToken, decodeJWTToken } from '../../lib/api';

// Types for the Q&A flow
export interface Question {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'number';
  options?: string[];
}

export interface Answer {
  questionId: string;
  value: string;
}

export interface QASession {
  sessionId: string;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  isComplete: boolean;
  originalPrompt: string;
  nlpId?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'bot' | 'question';
  content: string;
  timestamp: Date;
  questionData?: Question;
}

export const useSolarQAFlow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [qaSession, setQASession] = useState<QASession | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Generate session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // API call to clarify endpoint - matches your working API
  const callClarifyAPI = useCallback(async (prompt: string) => {
    try {
      const response = await fetch('http://75.119.151.238:5001/solar/clarify', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to get clarification questions`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Clarify API error:', error);
      throw error;
    }
  }, []);

  // API call to save answers - FIX: Extract real user_id from JWT token
  const saveAnswersAPI = useCallback(async (prompt: string, answers: string[]) => {
    try {
      console.log('=== SAVING Q&A ANSWERS ===');
      console.log('User object:', user);
      
      const loginToken = getStoredToken();
      
      if (!loginToken) {
        throw new Error('Please sign in to save your solar system design');
      }
      
      if (!user) {
        throw new Error('User information not available. Please sign in again.');
      }
      
      console.log('Access token available:', loginToken ? 'Yes' : 'No');
      
      // Extract the real user_id from JWT token's 'sub' field
      // This should contain the MongoDB ObjectId like "688d0f0afeda1581cdcd239f"
      let userId = user.id;
      
      try {
        const tokenPayload = decodeJWTToken(loginToken);
        if (tokenPayload && tokenPayload.sub) {
          userId = tokenPayload.sub;
          console.log('Extracted user_id from JWT token sub field:', userId);
        } else {
          console.warn('Could not extract user_id from JWT token');
        }
      } catch (tokenError) {
        console.error('Error decoding JWT token:', tokenError);
        // Fall back to stored user ID
      }
      
      // Final validation - ensure we have a valid ObjectId format
      if (!userId || userId.length < 20) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID. Please sign in again to refresh your session.');
      }
      
      console.log('Final user_id being used:', userId);
      
      const payload = {
        user_id: userId,
        prompt: prompt,
        answers: answers,
      };
      
      console.log('API payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch('http://75.119.151.238:5001/question_ans_save', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginToken}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Q&A SAVE SUCCESS:', data);
        
        if (data.nlp_id) {
          localStorage.setItem('solar_nlp_id', data.nlp_id);
        }
        
        return data;
      } else {
        const errorText = await response.text();
        console.error('❌ Q&A SAVE FAILED:', errorText);
        
        // Try to parse error response for better error message
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              const userIdError = errorData.detail.find((err: any) => err.loc?.includes('user_id'));
              if (userIdError) {
                throw new Error('Invalid user ID format. Please sign in again to refresh your session.');
              }
            }
            throw new Error(typeof errorData.detail === 'string' ? errorData.detail : 'Server validation error');
          }
        } catch (parseError) {
          // If we can't parse the error, use the raw text
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to save answers'}`);
      }
      
    } catch (error) {
      console.error('Save answers API error:', error);
      throw error;
    }
  }, [user]);

  // API call to dashboard - FIX: Dashboard requires proper authentication
  const callDashboardAPI = useCallback(async () => {
    try {
      console.log('=== ACCESSING DASHBOARD ===');
      
      // Use the login access token for dashboard access
      const loginToken = getStoredToken();
      
      if (!loginToken) {
        throw new Error('No access token available. Please sign in.');
      }
      
      console.log('Using login token for dashboard access');
      
      const response = await fetch('http://75.119.151.238:5001/dashboard', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${loginToken}`,
        },
      });

      console.log('Dashboard API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ DASHBOARD ACCESS SUCCESS:', data);
        return data;
      } else if (response.status === 401) {
        // Handle authentication error specifically
        console.error('❌ DASHBOARD ACCESS UNAUTHORIZED - Token may be invalid or expired');
        throw new Error('Authentication failed. Please sign in again.');
      } else {
        const errorText = await response.text();
        console.error('❌ DASHBOARD ACCESS FAILED:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to access dashboard'}`);
      }
    } catch (error) {
      console.error('Dashboard API error:', error);
      throw error;
    }
  }, []);

  // Parse questions from API response
  const parseQuestionsFromResponse = useCallback((response: any): Question[] => {
    const questions: Question[] = [];
    
    if (response && Array.isArray(response)) {
      response.forEach((questionText: string, index: number) => {
        const cleanQuestion = questionText.trim();
        let questionType: 'text' | 'radio' | 'number' = 'text';
        let options: string[] | undefined;
        
        // Detect question type based on content
        const lowerQuestion = cleanQuestion.toLowerCase();
        
        // Multiple choice detection
        if (cleanQuestion.includes(' or ') || cleanQuestion.includes(', ')) {
          if (lowerQuestion.includes('choose') || lowerQuestion.includes('select') || 
              lowerQuestion.includes('option') || lowerQuestion.includes('prefer')) {
            questionType = 'radio';
            const optionMatch = cleanQuestion.match(/\((.*?)\)/);
            if (optionMatch) {
              options = optionMatch[1].split(/,|or/).map(opt => opt.trim());
            }
          }
        }
        
        // Numeric question detection
        if (lowerQuestion.includes('how many') || 
            lowerQuestion.includes('number of') ||
            lowerQuestion.includes('kw') ||
            lowerQuestion.includes('hours') ||
            lowerQuestion.includes('watts') ||
            lowerQuestion.includes('size')) {
          questionType = 'number';
        }
        
        questions.push({
          id: `q_${index + 1}`,
          text: cleanQuestion,
          type: questionType,
          options: options,
        });
      });
    }
    
    return questions;
  }, []);

  // Add message to the conversation
  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Start initial conversation
  const startConversation = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    // Add user message
    addMessage({
      type: 'user',
      content: prompt,
    });

    setIsLoading(true);
    try {
      const clarifyResponse = await callClarifyAPI(prompt);
      const questions = parseQuestionsFromResponse(clarifyResponse);
      
      if (questions.length > 0) {
        const session: QASession = {
          sessionId: generateSessionId(),
          questions: questions,
          answers: [],
          currentQuestionIndex: 0,
          isComplete: false,
          originalPrompt: prompt,
        };

        setQASession(session);
        
        // Add first question
        addMessage({
          type: 'question',
          content: `I need to ask you ${questions.length} questions to better understand your needs. Question 1 of ${questions.length}:`,
          questionData: questions[0],
        });
      } else {
        // No questions returned, show error
        addMessage({
          type: 'bot',
          content: 'I was unable to generate relevant questions for your request. Please try rephrasing your solar system requirements.',
        });
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      addMessage({
        type: 'bot',
        content: 'Sorry, I encountered an error processing your request. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage, callClarifyAPI, parseQuestionsFromResponse, generateSessionId]);

  // Submit answer to current question
  const submitAnswer = useCallback(async (answer: string) => {
    if (!qaSession || !answer.trim()) return;

    const currentQuestion = qaSession.questions[qaSession.currentQuestionIndex];
    
    // Add user's answer to messages
    addMessage({
      type: 'user',
      content: answer,
    });

    // Update session with the answer
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value: answer,
    };

    const updatedSession: QASession = {
      ...qaSession,
      answers: [...qaSession.answers, newAnswer],
      currentQuestionIndex: qaSession.currentQuestionIndex + 1,
    };

    // Check if we have more questions
    if (updatedSession.currentQuestionIndex < qaSession.questions.length) {
      // Show next question
      const nextQuestion = qaSession.questions[updatedSession.currentQuestionIndex];
      addMessage({
        type: 'question',
        content: `Question ${updatedSession.currentQuestionIndex + 1} of ${qaSession.questions.length}:`,
        questionData: nextQuestion,
      });

      setQASession(updatedSession);
    } else {
      // All questions answered, save to API
      updatedSession.isComplete = true;
      setQASession(updatedSession);
      
      setIsLoading(true);
      try {
        const answersArray = updatedSession.answers.map(a => a.value);
        
        // Save answers to get nlp_id
        const apiResponse = await saveAnswersAPI(updatedSession.originalPrompt, answersArray);
        
        // Store nlp_id for dashboard access
        if (apiResponse.nlp_id) {
          updatedSession.nlpId = apiResponse.nlp_id;
          setQASession(updatedSession);
        }
        
        // Automatically redirect to dashboard after successful Q&A save
        console.log('✅ Q&A answers saved successfully, redirecting to dashboard...');
        
        addMessage({
          type: 'bot',
          content: 'Perfect! I have all the information I need. Your solar system design is ready. Redirecting to your dashboard...',
        });

        // Always redirect to dashboard after successful Q&A save (no need to test dashboard API first)
        setTimeout(() => {
          console.log('🚀 Navigating to dashboard...');
          navigate('/dashboard');
        }, 2000);
        
      } catch (error) {
        console.error('Error saving answers:', error);
        addMessage({
          type: 'bot',
          content: 'There was an error processing your information. Please try again or contact support if the problem persists.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [qaSession, addMessage, saveAnswersAPI, navigate]);

  // Reset the conversation
  const resetConversation = useCallback(() => {
    setMessages([]);
    setQASession(null);
    setIsLoading(false);
    // Clear stored tokens
    localStorage.removeItem('solar_access_token');
    localStorage.removeItem('solar_user_id');
    localStorage.removeItem('solar_nlp_id');
  }, []);

  return {
    messages,
    isLoading,
    qaSession,
    startConversation,
    submitAnswer,
    resetConversation,
    callDashboardAPI,
  };
};