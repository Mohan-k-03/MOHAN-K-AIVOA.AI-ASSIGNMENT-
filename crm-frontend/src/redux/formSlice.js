// src/redux/formSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hcpName: '',
  interactionType: 'Meeting',
  date: '',
  time: '',
  attendees: '',
  topicsDiscussed: '',
  materialsShared: [],
  samplesDistributed: [],
  sentiment: '', // Positive, Neutral, Negative
  outcomes: '',
  followUpActions: '',
  chatHistory: [] // To store the conversation with the AI
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // Updates the entire form payload (used by the log_interaction tool)
    updateForm: (state, action) => {
      return { ...state, ...action.payload };
    },
    // Updates a single field (used by the edit_interaction tool)
    updateField: (state, action) => {
      const { field, value } = action.payload;
      if (state.hasOwnProperty(field)) {
        state[field] = value;
      }
    },
    // Adds a new message to the chat UI
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    }
  }
});

export const { updateForm, updateField, addChatMessage } = formSlice.actions;
export default formSlice.reducer;