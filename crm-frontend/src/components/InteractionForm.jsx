// src/components/InteractionForm.js
import React from 'react';
import { useSelector } from 'react-redux';

const InteractionForm = () => {
  // This hooks into the Redux store we built earlier to read the AI-populated data
  const formData = useSelector((state) => state.form);

  const inputStyle = {
    width: '100%', 
    padding: '8px', 
    borderRadius: '4px', 
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    color: '#374151',
    boxSizing: 'border-box'
  };

  const labelStyle = { 
    display: 'block', 
    marginBottom: '8px', 
    fontWeight: '500',
    fontSize: '0.9rem'
  };

  return (
    <div>
      <h2>Interaction Details</h2>
      <form>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>HCP Name</label>
          <input 
            type="text" 
            value={formData.hcpName} 
            readOnly 
            style={inputStyle}
            placeholder="Search or select HCP..."
          />
        </div>
        
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date</label>
            <input 
              type="text" 
              value={formData.date} 
              readOnly 
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Interaction Type</label>
            <input 
              type="text" 
              value={formData.interactionType} 
              readOnly 
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Topics Discussed</label>
          <textarea 
            value={formData.topicsDiscussed} 
            readOnly 
            rows="3"
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Observed/Inferred HCP Sentiment</label>
          <input 
            type="text" 
            value={formData.sentiment} 
            readOnly 
            style={inputStyle}
          />
        </div>
        
        <p style={{ fontSize: '0.85rem', color: '#ef4444', marginTop: '24px' }}>
          * Form is read-only. Please use the AI Assistant chat to log interaction details.
        </p>
      </form>
    </div>
  );
};

export default InteractionForm;