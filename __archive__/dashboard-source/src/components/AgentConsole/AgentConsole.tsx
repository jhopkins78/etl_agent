import React, { useState, useEffect } from 'react';
import api, { endpoints } from '../../api';
import { useDashboard } from '../../context/DashboardContext';

interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
  isLoading?: boolean;
}

const AgentConsole: React.FC = () => {
  const { isLoading: dashboardLoading, setIsLoading: setDashboardLoading } = useDashboard();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'agent', content: 'Hello! I\'m your Insight Agent. How can I help you with your data analysis?' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to query the backend for answers
  const queryAgent = async (query: string) => {
    try {
      setIsProcessing(true);
      
      // Add loading message
      setChatHistory(prev => [...prev, { 
        role: 'agent', 
        content: 'Thinking...', 
        isLoading: true 
      }]);
      
      // Call the backend API
      const response = await api.post('/query-agent', { query });
      
      // Remove loading message and add actual response
      setChatHistory(prev => {
        const newHistory = [...prev];
        // Replace the last message if it was a loading message
        if (newHistory.length > 0 && newHistory[newHistory.length - 1].isLoading) {
          newHistory.pop();
        }
        return [...newHistory, { role: 'agent', content: response.data.answer || 'I couldn\'t find an answer to that question.' }];
      });
      
    } catch (error) {
      console.error('Error querying agent:', error);
      
      // Remove loading message and add error message
      setChatHistory(prev => {
        const newHistory = [...prev];
        // Replace the last message if it was a loading message
        if (newHistory.length > 0 && newHistory[newHistory.length - 1].isLoading) {
          newHistory.pop();
        }
        return [...newHistory, { 
          role: 'agent', 
          content: 'Sorry, I encountered an error processing your request. Please try again or ask a different question.' 
        }];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === '' || isProcessing) return;
    
    // Add user message to chat history
    setChatHistory([...chatHistory, { role: 'user', content: message }]);
    
    // Store message before clearing
    const currentMessage = message;
    
    // Clear input field
    setMessage('');
    
    // For Phase I, we'll use the simulated responses but structure it for future API integration
    setTimeout(() => {
      let response = '';
      
      if (currentMessage.toLowerCase().includes('important feature')) {
        response = 'Based on the analysis, the most important feature for predicting abalone age is **Weight** with an importance score of 0.42, followed by Diameter (0.28) and Height (0.15).';
      } else if (currentMessage.toLowerCase().includes('re-run') || currentMessage.toLowerCase().includes('k=5')) {
        response = 'I\'ll re-run the analysis with K=5 clusters. This might take a moment...';
      } else if (currentMessage.toLowerCase().includes('accuracy') || currentMessage.toLowerCase().includes('model')) {
        response = 'The Gradient Boosting model achieved an R² score of 0.76 and RMSE of 2.06, which indicates good predictive performance for this dataset.';
      } else if (currentMessage.toLowerCase().includes('underfitting')) {
        response = 'Based on the learning curves, there\'s no evidence of underfitting. The training and validation scores are close, indicating a good fit.';
      } else {
        response = 'I\'ll analyze that question and get back to you shortly. In Phase II, I\'ll be able to provide more detailed answers based on the full report content.';
      }
      
      setChatHistory(prev => [...prev, { role: 'agent', content: response }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Example suggested queries
  const suggestedQueries = [
    'What was the most important feature?',
    'Can you re-run with K=5?',
    'How accurate is the model?',
    'Was the model underfitting?'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Agent Console</h2>
      
      <div className="flex-grow overflow-auto mb-4 bg-slate-50 rounded-md p-3">
        <div className="space-y-4">
          {chatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  chat.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-slate-200 text-slate-800 rounded-tl-none'
                } ${chat.isLoading ? 'animate-pulse' : ''}`}
              >
                {chat.content}
                {chat.isLoading && (
                  <div className="mt-2 flex space-x-1">
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((query, index) => (
            <button
              key={index}
              className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors"
              onClick={() => {
                setMessage(query);
                // Focus the input after setting the message
                const inputElement = document.getElementById('message-input');
                if (inputElement) {
                  inputElement.focus();
                }
              }}
            >
              {query}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex">
        <textarea
          id="message-input"
          className="flex-grow border border-slate-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
          placeholder="Ask a question about your analysis..."
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isProcessing}
        />
        <button
          className={`${isProcessing ? 'bg-slate-400' : 'bg-primary hover:bg-slate-600'} text-white px-4 rounded-r-md transition-colors flex items-center justify-center`}
          onClick={handleSendMessage}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default AgentConsole;
