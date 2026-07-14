// src/components/AIChat.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { addChatMessage, updateForm } from '../redux/formSlice';

const AIChat = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatHistory = useSelector((state) => state.form.chatHistory);
  const currentFormData = useSelector((state) => state.form);
  const dispatch = useDispatch();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add user message to the chat UI
    const userMessage = { sender: 'user', text: input };
    dispatch(addChatMessage(userMessage));
    setInput('');
    setIsLoading(true);

    try {
      // 2. Send the message and the current state of the form to our FastAPI backend
      const response = await axios.post('http://localhost:8000/api/chat', {
        message: userMessage.text,
        current_form_data: currentFormData 
      });

      // 3. Add the AI's response to the chat UI
      const aiMessage = { sender: 'ai', text: response.data.reply };
      dispatch(addChatMessage(aiMessage));

      // 4. If the AI extracted new data, update the Redux form on the left!
      if (response.data.updated_form_data) {
        dispatch(updateForm(response.data.updated_form_data));
      }

    } catch (error) {
      console.error("Error communicating with AI:", error);
      dispatch(addChatMessage({ 
        sender: 'ai', 
        text: 'Sorry, I encountered an error. Please make sure the backend is running on port 8000.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🤖</span>
        <h2>AI Assistant</h2>
      </div>
      
      {/* Chat History Area */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        {chatHistory.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>
            Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment...") or ask for help.
          </p>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} style={{ 
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              marginBottom: '12px'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '10px 14px',
                borderRadius: '16px',
                backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#e5e7eb',
                color: msg.sender === 'user' ? 'white' : '#1f2937',
                maxWidth: '85%',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                {msg.text}
              </span>
            </div>
          ))
        )}
        {isLoading && <div style={{ textAlign: 'left', color: '#6b7280', fontSize: '0.85rem' }}>AI is thinking...</div>}
      </div>

      {/* Input Form Area */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe Interaction..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontFamily: 'inherit'
          }}
        >
          Log
        </button>
      </form>
    </div>
  );
};

export default AIChat;