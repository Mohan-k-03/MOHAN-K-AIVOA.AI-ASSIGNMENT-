import os
import sqlite3
from typing import TypedDict, Dict, Any, List
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from langchain_core.tools import tool

# IMPORTANT: You must set your Groq API key here for the LLM to work!
os.environ["GROQ_API_KEY"] = "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"

# 1. Define the State
class AgentState(TypedDict):
    messages: List[Any]
    current_form_data: Dict[str, Any]
    final_response: str

# 2. Define the 5 LangGraph Tools
@tool
def log_interaction(hcp_name: str, interaction_type: str, date: str, sentiment: str, materials_shared: str, topics_discussed: str) -> Dict[str, Any]:
    """Use this tool to log a completely new interaction with a Healthcare Professional."""
    return {
        "action": "log",
        "data": {
            "hcpName": hcp_name,
            "interactionType": interaction_type,
            "date": date,
            "sentiment": sentiment,
            "materialsShared": [materials_shared],
            "topicsDiscussed": topics_discussed
        }
    }
@tool
def edit_interaction(field_to_update: str, new_value: Any) -> Dict[str, Any]:
    """Use this tool to modify or edit an ALREADY logged interaction if the user corrects you."""
    return {
        "action": "edit",
        "data": {
            "field": field_to_update,
            "value": new_value
        }
    }

@tool
def schedule_follow_up(date: str, action_item: str) -> Dict[str, Any]:
    """Use this tool to schedule a follow-up action or meeting."""
    return {
        "action": "edit",
        "data": {
            "field": "followUpActions",
            "value": f"{date}: {action_item}"
        }
    }

@tool
def crm_history_lookup(hcp_name: str) -> Dict[str, Any]:
    """Use this tool to look up past interactions with a specific HCP."""
    try:
        # Connect to our SQL database
        conn = sqlite3.connect('crm_data.db')
        cursor = conn.cursor()
        
        # Execute a real SQL Query to find the doctor
        cursor.execute("SELECT last_meeting_date, sentiment FROM past_interactions WHERE hcp_name LIKE ?", (f'%{hcp_name}%',))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            date, sentiment = result
            return {
                "action": "reply",
                "data": f"SQL Database indicates you last met with {hcp_name} on {date}. Sentiment was {sentiment}."
            }
        else:
            return {
                "action": "reply",
                "data": f"No past interaction records found for {hcp_name} in the SQL database."
            }
    except Exception as e:
        return {"action": "reply", "data": f"Database error: {str(e)}"}

@tool
def recommend_content(topic: str) -> Dict[str, Any]:
    """Use this tool to recommend marketing materials or brochures based on the discussion topic."""
    return {
        "action": "reply",
        "data": f"Recommended materials for {topic}: Phase 3 Clinical Trial Summary, Product Efficacy Brochure."
    }

# 3. Initialize the Groq Model (gemma2-9b-it as requested)
# 3. Initialize the Groq Model 
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
tools = [log_interaction, edit_interaction, schedule_follow_up, crm_history_lookup, recommend_content]
llm_with_tools = llm.bind_tools(tools)

# 4. Define Graph Nodes
def process_chat(state: AgentState):
    messages = state["messages"]
    
    try:
        response = llm_with_tools.invoke(messages)

        if response.tool_calls:
            tool_call = response.tool_calls[0]
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]

            # Use .func(**tool_args) to safely extract the raw dictionary
            if tool_name == "log_interaction":
                res = log_interaction.func(**tool_args)
                state["current_form_data"] = res["data"]
                state["final_response"] = f"Interaction logged successfully for {tool_args.get('hcp_name', 'the HCP')}."
                
            elif tool_name in ["edit_interaction", "schedule_follow_up"]:
                func = edit_interaction.func if tool_name == "edit_interaction" else schedule_follow_up.func
                res = func(**tool_args)
                field = res["data"]["field"]
                val = res["data"]["value"]
                state["current_form_data"][field] = val
                state["final_response"] = f"Updated {field} successfully."
                
            elif tool_name == "crm_history_lookup":
                state["final_response"] = crm_history_lookup.func(**tool_args)["data"]
                
            elif tool_name == "recommend_content":
                state["final_response"] = recommend_content.func(**tool_args)["data"]
        else:
            state["final_response"] = response.content
            
    except Exception as e:
        # If anything crashes, don't break the server. Send the error to the frontend!
        print(f"Backend Error Caught: {e}")
        state["final_response"] = f"System Error: {str(e)}"

    return state
# 5. Build the Graph
workflow = StateGraph(AgentState)
workflow.add_node("agent", process_chat)
workflow.set_entry_point("agent")
workflow.add_edge("agent", END)

app_graph = workflow.compile()