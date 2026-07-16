from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, Optional
from agent import app_graph, AgentState
from langchain_core.messages import HumanMessage, SystemMessage
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI-First CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    current_form_data: Optional[Dict[str, Any]] = {}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # This ultra-strict prompt forces the LLM to route to the correct tool
    system_prompt = """You are an AI CRM Assistant. You MUST use the correct tool:
    1. If the user asks "When did I last meet..." or about history -> USE 'crm_history_lookup'
    2. If the user asks "What materials..." or for recommendations -> USE 'recommend_content'
    3. If the user says "Remind me..." or schedule -> USE 'schedule_follow_up'
    4. If the user is describing a NEW meeting -> USE 'log_interaction'
    5. If the user corrects a mistake -> USE 'edit_interaction'
    
    CRITICAL: DO NOT use 'log_interaction' if the user is just asking a question!"""

    initial_state = AgentState(
        messages=[
            SystemMessage(content=system_prompt),
            HumanMessage(content=request.message)
        ],
        current_form_data=request.current_form_data,
        final_response=""
    )

    try:
        result = app_graph.invoke(initial_state)
        return {
            "reply": result["final_response"],
            "updated_form_data": result["current_form_data"]
        }
    except Exception as e:
        print(f"Server Error: {e}")
        return {
            "reply": f"System Error: {str(e)}",
            "updated_form_data": request.current_form_data
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)