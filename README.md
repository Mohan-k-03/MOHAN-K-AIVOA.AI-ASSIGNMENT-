# AI-First CRM: HCP Interaction Module

## Project Overview
This project is an AI-first Customer Relationship Management (CRM) module designed for Healthcare Professionals (HCPs). Instead of manually filling out tedious data entry forms, field representatives use a conversational AI assistant to log their interactions. The AI processes natural language, extracts key entities, and automatically updates a read-only React form in real-time.

## Tech Stack
* **Frontend:** React (Vite) with Redux for state management.
* **Backend:** Python with FastAPI.
* **AI Agent:** LangGraph & LangChain.
* **LLM:** Groq API (llama-3.3-70b-versatile).

## Prerequisites
* Node.js and npm installed.
* Python 3.8+ installed.
* A Groq API Key.

## How to Run the Project

### 1. Start the Backend (FastAPI + LangGraph)
1. Open a terminal and navigate to the `ai-crm-backend` directory.
2. Create and activate a virtual environment:
   * Windows: `python -m venv venv` then `venv\Scripts\activate`
   * Mac/Linux: `python3 -m venv venv` then `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Add your Groq API key in `agent.py`.
5. Run the server: `python main.py`
*(The server will run on http://localhost:8000)*

### 2. Start the Frontend (React/Vite)
1. Open a second, separate terminal and navigate to the `crm-frontend` directory.
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
*(The app will launch on http://localhost:5173 or 5174)*

## Features (LangGraph Tools)
The AI Assistant utilizes 5 specific tools to manage CRM data:
1. **log_interaction:** Extracts core details to populate a new entry.
2. **edit_interaction:** Targets specific form fields for user corrections.
3. **schedule_follow_up:** Schedules future dates and action items.
4. **crm_history_lookup:** Retrieves simulated past interactions.
5. **recommend_content:** Suggests marketing materials based on discussion topics.
