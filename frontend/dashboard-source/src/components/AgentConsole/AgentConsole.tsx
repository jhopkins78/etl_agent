import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const AgentConsole: React.FC = () => {
  const { isLoading } = useDashboard();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'agent', content: 'Hello! I\'m your Insight Agent. How can I help you understand the analysis?' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Example suggested queries
  const suggestedQueries = [
    'What was the most important feature?',
    'Is the model underfitting?',
    'Can you re-run with K=5?',
    'How accurate is the model?'
  ];
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { role: 'user', content: message }]);
    setMessage('');
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate response after delay
    setTimeout(() => {
      let response = '';
      
      if (message.toLowerCase().includes('important feature')) {
        response = 'Based on the analysis, the most important feature is "Overall Quality" with a relative importance of 100%. This is followed by "Ground Living Area" (87%) and "Total Basement Square Feet" (65%).';
      } else if (message.toLowerCase().includes('underfitting')) {
        response = 'The model does not appear to be underfitting. The XGBoost model achieved an R² of 0.912 on the validation set, which indicates it explains about 91.2% of the variance in housing prices. The learning curves also show that both training and validation errors converge to a low value.';
      } else if (message.toLowerCase().includes('k=5')) {
        response = 'I\'ve re-run the cross-validation with K=5. The results are similar to our previous run with slightly tighter confidence intervals. The XGBoost model still performs best with an average R² of 0.908 across all 5 folds.';
      } else if (message.toLowerCase().includes('accurate') || message.toLowerCase().includes('accuracy')) {
        response = 'The best performing model (XGBoost) achieved an RMSE of 17,682 and an R² of 0.912. This means it explains about 91.2% of the variance in housing prices and has an average prediction error of around $17,682.';
      } else {
        response = 'I\'ll analyze that question based on the housing price model results. The XGBoost model performed best with an R² of 0.912, and the most important features were Overall Quality, Ground Living Area, and Total Basement Square Feet.';
      }
      
      setChatHistory([...chatHistory, { role: 'user', content: message }, { role: 'agent', content: response }]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSuggestedQuery = (query: string) => {
    setMessage(query);
  };
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Agent Console</h2>
        <span className="badge badge-primary">GPT-4</span>
      </div>
      
      <div className="chat-container mb-md">
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`${
              msg.role === 'user' 
                ? 'chat-message chat-message-user self-end' 
                : 'chat-message chat-message-agent self-start ' + (msg.role === 'agent' ? 'glow' : '')
            } mb-sm`}
          >
            {msg.content}
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-message chat-message-agent self-start mb-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-md">
        <div className="text-sm font-medium mb-xs">Suggested Queries:</div>
        <div className="flex flex-wrap gap-sm">
          {suggestedQueries.map((query, index) => (
            <button 
              key={index}
              onClick={() => handleSuggestedQuery(query)}
              className="text-sm px-sm py-xs rounded-full bg-card-alt dark:bg-card-alt-dark hover:bg-primary hover:bg-opacity-10 dark:hover:bg-opacity-20 transition-colors"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-end">
        <textarea 
          className="chat-input"
          placeholder="Ask me about the analysis..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={2}
        ></textarea>
        <button 
          className="ml-sm btn btn-primary h-10 w-10 flex items-center justify-center"
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AgentConsole;
