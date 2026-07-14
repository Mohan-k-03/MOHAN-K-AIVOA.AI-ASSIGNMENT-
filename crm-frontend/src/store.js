import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to send user message to FastAPI backend
export const sendChatMessage = createAsyncThunk(
  'crm/sendChatMessage',
  async ({ message, currentFormData }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          current_form_data: currentFormData,
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const crmSlice = createSlice({
  name: 'crm',
  initialState: {
    formData: {
      hcp_name: '',
      interaction_type: '',
      date: '',
      sentiment: '',
      materials_shared: [],
    },
    chatHistory: [
      { sender: 'ai', text: 'Hi! I am your CRM Copilot. Tell me about your interaction (e.g., "Met with Dr. Smith today, it was positive, we discussed Product X and left some brochures").' }
    ],
    loading: false,
  },
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        state.loading = true;
        // Append user's message immediately to the chat history
        state.chatHistory.push({ sender: 'user', text: action.meta.arg.message });
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory.push({ sender: 'ai', text: action.payload.reply });
        if (action.payload.updated_form_data) {
          // Merge newly returned form values from our LangGraph Agent
          state.formData = { ...state.formData, ...action.payload.updated_form_data };
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.chatHistory.push({ sender: 'ai', text: 'Sorry, I had trouble communicating with the server. Is the backend running?' });
      });
  },
});

export const { updateField } = crmSlice.actions;
export const store = configureStore({ reducer: { crm: crmSlice.reducer } });