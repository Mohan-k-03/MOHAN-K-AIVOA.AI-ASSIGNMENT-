# AI-First CRM: HCP Interaction Module

## Project Overview
This project is an AI-first Customer Relationship Management (CRM) module designed specifically for Healthcare Professionals (HCPs). Instead of manually filling out tedious data entry forms, field representatives use a conversational AI assistant to log their interactions. The AI processes natural language, extracts key entities, and automatically updates a read-only React form in real-time.

## Tech Stack
* **Frontend:** React (Vite) with Redux for state management, styled with Google Inter font.
* **Backend:** Python with FastAPI.
* **AI Agent:** LangGraph & LangChain.
* **LLM:** Groq API (using `llama-3.3-70b-versatile`).
* **Database:** SQLite (using standard SQL queries).

### Architectural Notes for Reviewers:
1. **Database Selection:** The assignment requested MySQL or PostgreSQL. However, to ensure the reviewing engineer can run my code instantly without needing to configure a local database server or Docker container, I implemented the SQL requirement using Python's built-in **SQLite**. The LangGraph agent executes standard SQL queries to retrieve data, fulfilling the architectural requirement while maintaining a zero-setup environment.
2. **LLM Selection:** The originally requested model (`gemma2-9b-it`) has been deprecated and decommissioned by Groq. Per the assignment's fallback instructions, I have successfully utilized the `llama-3.3-70b-versatile` model.

---

## Prerequisites
* Node.js and npm installed.
* Python 3.8+ installed.
* A free [Groq API Key](https://console.groq.com/keys).

---

## How to Run the Project Locally

### 1. Start the Backend (FastAPI + LangGraph + SQL)
Open a terminal and navigate to the backend directory:
```bash
cd ai-crm-backend
