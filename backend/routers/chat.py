from fastapi import APIRouter, HTTPException, status, Depends, Query
from database import get_chat_collection, get_streams_collection
from models import ChatMessage, ChatMessageCreate
from auth_utils import get_current_user
from bson import ObjectId
from typing import List, Optional
from datetime import datetime
import random

router = APIRouter()

@router.post("/{stream_id}/message", response_model=dict)
async def send_chat_message(
    stream_id: str,
    message_data: ChatMessageCreate,
    current_user: dict = Depends(get_current_user)
):
    """Send a chat message to a stream"""
    chat_collection = await get_chat_collection()
    streams_collection = await get_streams_collection()
    
    # Validate stream ID
    if not ObjectId.is_valid(stream_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid stream ID"
        )
    
    # Check if stream exists and is live
    stream = await streams_collection.find_one({"_id": ObjectId(stream_id)})
    if not stream:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stream not found"
        )
    
    if not stream["is_live"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send message to offline stream"
        )
    
    # Create chat message
    colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3", "#54A0FF", "#5F27CD"]
    chat_message = {
        "stream_id": ObjectId(stream_id),
        "user_id": ObjectId(current_user["_id"]),
        "username": current_user["username"],
        "message": message_data.message,
        "color": random.choice(colors),
        "timestamp": datetime.utcnow()
    }
    
    result = await chat_collection.insert_one(chat_message)
    
    return {
        "message": "Chat message sent successfully",
        "message_id": str(result.inserted_id),
        "chat_message": {
            "id": str(result.inserted_id),
            "username": current_user["username"],
            "message": message_data.message,
            "color": chat_message["color"],
            "timestamp": chat_message["timestamp"]
        }
    }

@router.get("/{stream_id}/messages", response_model=List[dict])
async def get_chat_messages(
    stream_id: str,
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0)
):
    """Get chat messages for a stream"""
    chat_collection = await get_chat_collection()
    
    # Validate stream ID
    if not ObjectId.is_valid(stream_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid stream ID"
        )
    
    # Get messages
    messages = await chat_collection.find({
        "stream_id": ObjectId(stream_id)
    }).sort("timestamp", -1).skip(skip).limit(limit).to_list(length=None)
    
    # Format response (reverse to show oldest first)
    formatted_messages = []
    for message in reversed(messages):
        formatted_messages.append({
            "id": str(message["_id"]),
            "username": message["username"],
            "message": message["message"],
            "color": message["color"],
            "timestamp": message["timestamp"]
        })
    
    return formatted_messages

@router.delete("/{stream_id}/message/{message_id}")
async def delete_chat_message(
    stream_id: str,
    message_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a chat message (only message owner or stream owner can delete)"""
    chat_collection = await get_chat_collection()
    streams_collection = await get_streams_collection()
    
    # Validate IDs
    if not ObjectId.is_valid(stream_id) or not ObjectId.is_valid(message_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid stream ID or message ID"
        )
    
    # Get message
    message = await chat_collection.find_one({"_id": ObjectId(message_id)})
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Get stream
    stream = await streams_collection.find_one({"_id": ObjectId(stream_id)})
    if not stream:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stream not found"
        )
    
    # Check permissions (message owner or stream owner)
    if (message["user_id"] != ObjectId(current_user["_id"]) and 
        stream["streamer_id"] != ObjectId(current_user["_id"])):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this message"
        )
    
    # Delete message
    result = await chat_collection.delete_one({"_id": ObjectId(message_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete message"
        )
    
    return {"message": "Chat message deleted successfully"}