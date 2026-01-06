
import os
import logging
from datetime import datetime

# Frameworks
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Database
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base

# AI (DeepSeek via OpenAI SDK)
from openai import OpenAI

# --- Configuration ---
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
DATABASE_URL = os.environ.get("DATABASE_URL") 

# --- Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PlanexaDeepSeek")

# --- Database Schema ---
Base = declarative_base()

class ConversationHistory(Base):
    __tablename__ = "conversation_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True) 
    role = Column(String) 
    text = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

class EventType(Base):
    __tablename__ = "event_types" 
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    duration = Column(Integer)
    is_active = Column(Boolean, default=True)

# --- DB Connection ---
engine = None
SessionLocal = None

if DATABASE_URL:
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base.metadata.create_all(bind=engine)
        logger.info("Database connected.")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
else:
    logger.warning("DATABASE_URL not set. Running in-memory.")

# --- DeepSeek Client Setup ---
client = None
if DEEPSEEK_API_KEY:
    try:
        client = OpenAI(
            api_key=DEEPSEEK_API_KEY, 
            base_url="https://api.deepseek.com"
        )
        logger.info("DeepSeek Client Initialized")
    except Exception as e:
        logger.error(f"DeepSeek Init Failed: {e}")

# --- FastAPI App ---
app = FastAPI(title="Planexa DeepSeek Monolith")

class PlanRequest(BaseModel):
    user_id: str
    query: str

@app.get("/")
def health_check():
    return {
        "service": "planexa-deepseek",
        "ai_status": "ready" if client else "configured_but_unchecked"
    }

@app.post("/plan")
async def generate_plan(request: PlanRequest):
    user_id = request.user_id
    query = request.query
    
    logger.info(f"Request from {user_id}")

    if not client:
        raise HTTPException(status_code=503, detail="AI Service Not Configured (Missing Key)")

    db = SessionLocal() if SessionLocal else None
    
    # 1. Context Retrieval
    services_text = "No specific services listed."
    history_text = ""

    if db:
        try:
            services = db.query(EventType).filter(EventType.is_active == True).all()
            if services:
                services_text = "\n".join([f"- {s.title} ({s.duration} min)" for s in services])
            
            history = db.query(ConversationHistory)\
                .filter(ConversationHistory.user_id == user_id)\
                .order_by(ConversationHistory.timestamp.desc())\
                .limit(5).all()
            history_text = "\n".join([f"{h.role}: {h.text}" for h in sorted(history, key=lambda x: x.timestamp)])
        except Exception as e:
            logger.error(f"DB Read Error: {e}")
            # Non-critical, continue without history/context
    
    # 2. DeepSeek Prompt
    system_prompt = f"""
You are the AI Assistant for 'Clinique Planexa'.
Services:
{services_text}

History:
{history_text}

User: {query}

Instructions:
- Suggest appointments for tomorrow 10am/2pm if needed.
- Be polite and concise.
"""

    # 3. Call DeepSeek
    response_text = ""
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query},
            ],
            stream=False
        )
        response_text = response.choices[0].message.content
    except Exception as e:
        logger.error(f"DeepSeek Error: {e}")
        raise HTTPException(status_code=502, detail=f"AI Provider Error: {str(e)}")

    # 4. Save
    if db:
        try:
            db.add(ConversationHistory(user_id=user_id, role="user", text=query))
            db.add(ConversationHistory(user_id=user_id, role="model", text=response_text))
            db.commit()
        except Exception as e:
            logger.error(f"DB Save Error: {e}")
        finally:
            db.close()

    return {"response": response_text}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
