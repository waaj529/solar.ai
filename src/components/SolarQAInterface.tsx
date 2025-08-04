import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../shared/ui/button';
import { Input } from '../shared/ui/input';
import { Card, CardContent } from '../shared/ui/card';
import { Textarea } from '../shared/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../shared/ui/radio-group';
import { Label } from '../shared/ui/label';
import { Loader2, Send, Bot, User, RotateCcw } from 'lucide-react';
import { cn } from '../shared/lib/utils';
import { useSolarQAFlow, type Message, type Question } from '../shared/hooks/use-solar-qa-flow';

export const SolarQAInterface: React.FC = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    qaSession,
    startConversation,
    submitAnswer,
    resetConversation,
  } = useSolarQAFlow();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isLoading) return;

    await startConversation(currentInput);
    setCurrentInput('');
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) return;
    
    await submitAnswer(currentAnswer);
    setCurrentAnswer('');
  };

  const handleReset = () => {
    resetConversation();
    setCurrentInput('');
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
      />
    );
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    const isQuestion = message.type === 'question';

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
          
          {isQuestion && message.questionData && (
            <Card className="mt-2 w-full max-w-md border-green-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium text-sm text-gray-900">{message.questionData.text}</p>
                    <div className="text-xs text-gray-500">
                      Question type: {message.questionData.type === 'radio' ? 'Multiple Choice' : 
                                   message.questionData.type === 'number' ? 'Numeric' : 'Text'}
                    </div>
                  </div>
                  
                  {renderQuestionInput(message.questionData)}
                  
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
              </CardContent>
            </Card>
          )}
          
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

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-gray-50">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Solar AI Assistant</h2>
          <p className="text-sm text-gray-600">Let's design your perfect solar system</p>
        </div>
        <div className="flex items-center gap-3">
          {qaSession && !qaSession.isComplete && (
            <div className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
              {qaSession.currentQuestionIndex + 1} of {qaSession.questions.length}
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium text-gray-700">Welcome to Solar AI Assistant!</p>
            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
              Describe your solar energy needs, and I'll ask you a few questions to create the perfect solar system design for you.
            </p>
            <div className="mt-4 p-3 bg-green-50 rounded-lg text-left max-w-md mx-auto">
              <p className="text-xs font-medium text-green-800 mb-1">Example prompts:</p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• "I need a 10kW solar system for my home"</li>
                <li>• "Solar panels for a warehouse with backup power"</li>
                <li>• "Off-grid solar system for remote cabin"</li>
              </ul>
            </div>
          </div>
        )}
        
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

      {/* Input Area - Only show if no active Q&A session */}
      {!qaSession && (
        <div className="border-t p-4 bg-white">
          <form onSubmit={handleInitialSubmit} className="flex gap-2">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Describe your solar system needs (e.g., '5kW residential system with battery backup')..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={!currentInput.trim() || isLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send your message, or click the send button
          </p>
        </div>
      )}
    </div>
  );
};