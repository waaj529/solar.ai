import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../shared/ui/button';
import { Input } from '../shared/ui/input';
import { Textarea } from '../shared/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../shared/ui/radio-group';
import { Label } from '../shared/ui/label';
import { Loader2, Send, Bot, User, RotateCcw } from 'lucide-react';
import { cn } from '../shared/lib/utils';
import { useSolarQAFlow, type Message, type Question } from '../shared/hooks/use-solar-qa-flow';

export const QAConversationFlow: React.FC = () => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    qaSession,
    submitAnswer,
    resetConversation,
  } = useSolarQAFlow();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) return;
    
    await submitAnswer(currentAnswer);
    setCurrentAnswer('');
  };

  const handleReset = () => {
    resetConversation();
    setCurrentAnswer('');
  };

  const renderQuestionInput = (question: Question) => {
    if (question.type === 'radio' && question.options) {
      return (
        <RadioGroup 
          value={currentAnswer} 
          onValueChange={setCurrentAnswer}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-sm cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (question.type === 'number') {
      return (
        <Input
          type="number"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Enter a number..."
          className="w-full"
          min="0"
        />
      );
    }

    return (
      <Textarea
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="min-h-[80px] resize-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAnswerSubmit();
          }
        }}
      />
    );
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';

    return (
      <div key={message.id} className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}>
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        
        <div className={cn(
          "flex flex-col max-w-[80%]",
          isUser && "items-end"
        )}>
          <div className={cn(
            "px-4 py-2 rounded-lg",
            isUser 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-900"
          )}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          
          <span className="text-xs text-gray-500 mt-1">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    );
  };

  const getCurrentQuestion = () => {
    if (!qaSession || qaSession.isComplete) return null;
    return qaSession.questions[qaSession.currentQuestionIndex];
  };

  const currentQuestion = getCurrentQuestion();

  // Only show if there are messages or an active session
  if (messages.length === 0 && !qaSession) {
    return null;
  }

  return (
    <div className="mt-8 max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-gray-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Solar AI Assistant</h3>
            <p className="text-sm text-gray-600">Designing your perfect solar system</p>
          </div>
          <div className="flex items-center gap-3">
            {qaSession && !qaSession.isComplete && (
              <div className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                Question {qaSession.currentQuestionIndex + 1} of {qaSession.questions.length}
              </div>
            )}
            {messages.length > 0 && (
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {messages.map(renderMessage)}
          
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  <span className="text-sm text-gray-600">
                    {qaSession ? 'Processing your answer...' : 'Analyzing your requirements...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Current Question Input */}
        {currentQuestion && (
          <div className="border-t p-4 bg-gray-50">
            <div className="space-y-4">
              <div>
                <p className="font-medium text-xs sm:text-sm text-gray-900 mb-2 leading-relaxed break-words">
                  {currentQuestion.text}
                </p>
                <div className="text-xs text-gray-500">
                  Question {qaSession!.currentQuestionIndex + 1} of {qaSession!.questions.length} • 
                  Type: {currentQuestion.type === 'radio' ? 'Multiple Choice' : 
                         currentQuestion.type === 'number' ? 'Numeric' : 'Text'}
                </div>
              </div>
              
              {renderQuestionInput(currentQuestion)}
              
              <Button 
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim() || isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit Answer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};