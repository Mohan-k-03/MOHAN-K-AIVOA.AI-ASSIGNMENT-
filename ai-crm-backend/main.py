from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, Optional
from agent import app_graph, AgentState
from langchain_core.messages import HumanMessage
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI-First CRM API")

# Allow frontend to connect
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
    # Initialize state
    initial_state = AgentState(
        messages=[HumanMessage(content=request.message)],
        current_form_data=request.current_form_data,
        final_response=""
    )
    
    # Run the LangGraph agent
    result = app_graph.invoke(initial_state)
    
    # Return the updated form data and the AI's chat response
    return {
        "reply": result["final_response"],
        "updated_form_data": result["current_form_data"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)