import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const AgentConsole: React.FC = () => {
  const { isLoading } = useDashboard();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Insight Agent. I can help you understand the analysis results and answer questions about the data. What would you like to know?",
      sender: 'agent',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Example suggested queries
  const suggestedQueries = [
    'What was the most important feature?',
    'Why did the model choose these parameters?',
    'Is the model underfitting?',
    'How accurate is the model?',
    'Can you explain the correlation matrix?'
  ];
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const responses = [
        "Based on the analysis, the most important feature was 'Weight' with a relative importance of 0.42. This suggests that weight is the strongest predictor of abalone age.",
        "The model selected these parameters through Bayesian optimization to minimize RMSE while avoiding overfitting. The relatively low learning rate (0.1) helps the model generalize better.",
        "No, the model is not underfitting. The R² score of 0.76 indicates a good fit, and the learning curves show that both training and validation errors converge appropriately.",
        "The Gradient Boosting model achieved an R² score of 0.76, meaning it explains about 76% of the variance in the target variable. The RMSE is 2.06, which represents the average prediction error in years.",
        "The correlation matrix shows strong relationships between physical measurements. Length and diameter have a correlation of 0.98, indicating they're almost perfectly correlated. Weight measurements are moderately correlated with age (0.54-0.63)."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newAgentMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAgentMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle pressing Enter to send
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle clicking a suggested query
  const handleSuggestedQuery = (query: string) => {
    setInputValue(query);
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-xl font-semibold">Agent Console</h2>
        <div className="flex items-center">
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary mr-sm">
            {isTyping ? 'Thinking...' : 'Ready'}
          </span>
          {isTyping ? (
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-slow"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-success"></div>
          )}
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="bg-card-alt dark:bg-dark-card-alt rounded-2xl p-md mb-md h-96 overflow-y-auto flex flex-col">
        <div className="flex-grow space-y-md">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`chat-message ${message.sender === 'user' ? 'chat-message-user' : 'chat-message-agent'}`}>
                <div className="mb-xs">
                  {message.text}
                </div>
                <div className={`text-xs ${message.sender === 'user' ? 'text-white text-opacity-70' : 'text-text-tertiary dark:text-dark-text-tertiary'} text-right`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-message chat-message-agent py-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-text-tertiary dark:bg-dark-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-text-tertiary dark:bg-dark-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-text-tertiary dark:bg-dark-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Suggested queries */}
      <div className="mb-md overflow-x-auto scrollbar-hide">
        <div className="flex space-x-sm">
          {suggestedQueries.map((query, index) => (
            <button
              key={index}
              className="btn btn-secondary text-sm whitespace-nowrap"
              onClick={() => handleSuggestedQuery(query)}
              disabled={isTyping || isLoading}
            >
              {query}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input area */}
      <div className="flex space-x-sm">
        <textarea
          className="chat-input"
          placeholder="Ask a question about the analysis..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping || isLoading}
          rows={1}
        />
        <button
          className="btn btn-primary"
          onClick={handleSendMessage}
          disabled={inputValue.trim() === '' || isTyping || isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AgentConsole;
