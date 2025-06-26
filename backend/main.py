from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import json
from typing import List, Dict, Any
from datetime import datetime

# Load environment variables
load_dotenv()

# Import routers
from routers import auth, users, streams, chat, categories
from database import get_database
from websocket_manager import ConnectionManager

# WebSocket connection manager
manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Twitch Clone Backend...")
    yield
    # Shutdown
    print("👋 Shutting down Twitch Clone Backend...")

app = FastAPI(
    title="Twitch Clone API",
    description="A powerful streaming platform backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(streams.router, prefix="/api/streams", tags=["Streams"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])

@app.get("/")
async def root():
    return {"message": "🎮 Twitch Clone API is running!", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    try:
        db = await get_database()
        # Simple ping to check database connection
        await db.command("ping")
        return {"status": "healthy", "database": "connected", "timestamp": datetime.utcnow()}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# WebSocket endpoint for real-time chat
@app.websocket("/ws/chat/{stream_id}")
async def websocket_chat_endpoint(websocket: WebSocket, stream_id: str):
    await manager.connect(websocket, stream_id)
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Broadcast message to all clients in this stream
            await manager.broadcast_to_stream(stream_id, {
                "type": "chat_message",
                "username": message_data.get("username", "Anonymous"),
                "message": message_data.get("message", ""),
                "timestamp": datetime.utcnow().isoformat(),
                "color": message_data.get("color", "#9146FF")
            })
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, stream_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)