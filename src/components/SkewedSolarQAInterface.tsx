import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useSolarQAFlow } from '../shared/hooks/use-solar-qa-flow';

interface SkewedSolarQAInterfaceProps {
  onEnergyIconClick?: () => void;
}

export const SkewedSolarQAInterface: React.FC<SkewedSolarQAInterfaceProps> = ({ 
  onEnergyIconClick 
}) => {
  const [currentInput, setCurrentInput] = useState('');
  const [showingQuestion, setShowingQuestion] = useState(false);
  
  const {
    isLoading,
    qaSession,
    startConversation,
    submitAnswer,
  } = useSolarQAFlow();

  // Get current question
  const getCurrentQuestion = () => {
    if (!qaSession || qaSession.isComplete) return null;
    return qaSession.questions[qaSession.currentQuestionIndex];
  };

  const currentQuestion = getCurrentQuestion();

  // Update the input placeholder when there's a question
  useEffect(() => {
    if (currentQuestion && !showingQuestion) {
      setShowingQuestion(true);
      setCurrentInput(''); // Clear any previous input
    }
  }, [currentQuestion, showingQuestion]);

  // Handle when Q&A session is complete - show completion message
  useEffect(() => {
    if (qaSession?.isComplete) {
      setShowingQuestion(false);
      setCurrentInput('');
    }
  }, [qaSession?.isComplete]);

  const handleInitialSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentInput.trim() || isLoading) return;

    if (!qaSession) {
      // Start the Q&A conversation
      try {
        await startConversation(currentInput);
        setCurrentInput('');
      } catch (error) {
        console.error('Failed to start conversation:', error);
      }
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentInput.trim() || !currentQuestion || isLoading) return;
    
    try {
      await submitAnswer(currentInput);
      setCurrentInput('');
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleEnergyIconClick = () => {
    if (qaSession?.isComplete) {
      // If Q&A is complete and we have the completion message, don't do anything
      // The hook will handle navigation automatically
      return;
    }
    
    if (currentQuestion) {
      // If we're in Q&A mode, submit the answer
      handleAnswerSubmit();
    } else if (currentInput.trim()) {
      // If there's text but no question, start conversation
      handleInitialSubmit();
    } else if (onEnergyIconClick) {
      // If no text, call the dashboard navigation
      onEnergyIconClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (qaSession?.isComplete) {
        // Don't handle enter when complete
        return;
      }
      
      if (currentQuestion) {
        handleAnswerSubmit();
      } else {
        handleInitialSubmit();
      }
    }
  };

  // Show completion state
  if (qaSession?.isComplete) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <Loader2 className="h-6 w-6 text-green-600 animate-spin mr-2" />
          <div className="text-sm text-black font-medium slanted-text">
            Generating your solar system design...
          </div>
        </div>
        <div className="text-xs text-gray-600 slanted-text">
          Redirecting to dashboard...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Question display - shown above the skewed box when in Q&A mode */}
      {currentQuestion && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 font-medium mb-1 slanted-text">
            Question {qaSession!.currentQuestionIndex + 1} of {qaSession!.questions.length}
          </div>
          <div className="text-sm sm:text-base text-black font-medium slanted-text">
            {currentQuestion.text}
          </div>
        </div>
      )}

      <div className="flex items-start">
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder={currentQuestion ? "Type your answer here..." : "Let's Talk Energy"}
          className={`flex-1 bg-transparent border-none outline-none slanted-text text-black font-medium ${
            currentQuestion 
              ? 'text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base placeholder:not-italic placeholder:font-normal' 
              : 'text-sm sm:text-base md:text-lg italic placeholder:italic'
          } placeholder:text-gray-500`}
          disabled={isLoading}
          onKeyDown={handleKeyDown}
        />
        <div className="ml-2 sm:ml-4 flex items-center gap-2 h-full">
          {/* Lightning bolt - for submission or dashboard */}
          {isLoading ? (
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400 cursor-pointer hover:text-green-600 transition-colors duration-200 touch-manipulation"
              viewBox="0 0 24 24"
              fill="none"
              onClick={handleEnergyIconClick}
            >
              <title>{currentQuestion ? "Submit Answer" : "Connect to Dashboard"}</title>
              <polygon
                points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                fill="#D1FF3A"
                stroke="#B6E51D"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </div>
      </div>
      
      {/* Icons - show in Q&A mode */}
      {qaSession && !qaSession.isComplete && (
        <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3 ml-1">
          <span className="material-icons h-5 w-5 sm:h-7 sm:w-7 text-gray-400 hover:text-green-600 hover:shadow-lg transition cursor-pointer touch-manipulation text-lg sm:text-xl">
            mic
          </span>
          <span className="material-icons h-4 w-4 sm:h-6 sm:w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation text-base sm:text-lg">
            image
          </span>
          <span className="material-icons h-4 w-4 sm:h-6 sm:w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation text-base sm:text-lg">
            attach_file
          </span>
        </div>
      )}
      
      {/* Original icons - only show when not in Q&A mode */}
      {!qaSession && (
        <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-4 ml-1">
          <span className="material-icons h-5 w-5 sm:h-7 sm:w-7 text-gray-400 hover:text-green-600 hover:shadow-lg transition cursor-pointer touch-manipulation text-lg sm:text-xl">
            mic
          </span>
          <span className="material-icons h-4 w-4 sm:h-6 sm:w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation text-base sm:text-lg">
            image
          </span>
          <span className="material-icons h-4 w-4 sm:h-6 sm:w-6 text-gray-400 hover:text-green-600 cursor-pointer touch-manipulation text-base sm:text-lg">
            attach_file
          </span>
        </div>
      )}
    </>
  );
};