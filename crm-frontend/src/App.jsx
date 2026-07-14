// src/App.js
import React from 'react';
import './App.css';
import InteractionForm from './components/InteractionForm';
import AIChat from './components/AIChat';

function App() {
  return (
    <div className="app-container">
      {/* Left Side: The Read-Only Form */}
      <div className="left-panel">
        <InteractionForm />
      </div>

      {/* Right Side: The AI Assistant Chat */}
      <div className="right-panel">
        <AIChat />
      </div>
    </div>
  );
}

export default App;