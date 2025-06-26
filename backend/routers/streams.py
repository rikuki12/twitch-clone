from fastapi import APIRouter, HTTPException, status, Depends, Query
from database import get_streams_collection, get_users_collection, get_categories_collection
from models import StreamCreate, StreamUpdate, Stream
from auth_utils import get_current_user
from bson import ObjectId
from typing import List, Optional
from datetime import datetime
import random

router = APIRouter()

@router.post("/create", response_model=dict)
async def create_stream(
    stream_data: StreamCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new stream"""
    streams_collection = await get_streams_collection()
    users_collection = await get_users_collection()
    
    # Check if user is already streaming
    existing_stream = await streams_collection.find_one({
        "streamer_id": ObjectId(current_user["_id"]),
        "is_live": True
    })
    
    if existing_stream:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already streaming"
        )
    
    # Create stream
    stream = {
        "streamer_id": ObjectId(current_user["_id"]),
        "streamer_username": current_user["username"],
        "title": stream_data.title,
        "category": stream_data.category,
        "thumbnail_url": stream_data.thumbnail_url or f"https://picsum.photos/320/180?random={random.randint(1, 1000)}",
        "description": stream_data.description,
        "is_live": False,
        "viewer_count": 0,
        "started_at": None,
        "ended_at": None,
        "created_at": datetime.utcnow()
    }
    
    result = await streams_collection.insert_one(stream)
    
    return {
        "message": "Stream created successfully",
        "stream_id": str(result.inserted_id),
        "stream": {
            "id": str(result.inserted_id),
            "title": stream_data.title,
            "category": stream_data.category,
            "is_live": False
        }
    }

@router.put("/{stream_id}/start")
async def start_stream(
    stream_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Start a stream (go live)"""
    streams_collection = await get_streams_collection()
    users_collection = await get_users_collection()
    
    # Validate stream ID
    if not ObjectId.is_valid(stream_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid stream ID"
        )
    
    # Find stream
    stream = await streams_collection.find_one({
        "_id": ObjectId(stream_id),
        "streamer_id": ObjectId(current_user["_id"])
    })
    
    if not stream:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stream not found"
        )
    
    if stream["is_live"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stream is already live"
        )
    
    # Start stream
    await streams_collection.update_one(
        {"_id": ObjectId(stream_id)},
        {
            "$set": {
                "is_live": True,
                "started_at": datetime.utcnow(),
                "ended_at": None
            }
        }
    )
    
    # Update user streaming status
    await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"is_streaming": True}}
    )
    
    return {"message": "Stream started successfully"}

@router.put("/{stream_id}/stop")
async def stop_stream(
    stream_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Stop a stream (go offline)"""
    streams_collection = await get_streams_collection()
    users_collection = await get_users_collection()
    
    # Validate stream ID
    if not ObjectId.is_valid(stream_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid stream ID"
        )
    
    # Find stream
    stream = await streams_collection.find_one({
        "_id": ObjectId(stream_id),
        "streamer_id": ObjectId(current_user["_id"])
    })
    
    if not stream:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stream not found"
        )
    
    if not stream["is_live"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stream is not live"
        )
    
    # Stop stream
    await streams_collection.update_one(
        {"_id": ObjectId(stream_id)},
        {
            "$set": {
                "is_live": False,
                "ended_at": datetime.utcnow(),
                "viewer_count": 0
            }
        }
    )
    
    # Update user streaming status
    await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"is_streaming": False}}
    )
    
    return {"message": "Stream stopped successfully"}

@router.get("/live", response_model=List[dict])
async def get_live_streams(
    category: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    skip: int = Query(0, ge=0)
):
    """Get live streams with optional category filter"""
    streams_collection = await get_streams_collection()
    
    # Build query
    query = {"is_live": True}
    if category and category.lower() != "all":
        query["category"] = {"$regex": category, "$options": "i"}
    
    # Get streams
    streams = await streams_collection.find(query).sort("viewer_count", -1).skip(skip).limit(limit).to_list(length=None)
    
    # Format response
    formatted_streams = []
    for stream in streams:
        formatted_streams.append({
            "id": str(stream["_id"]),
            "streamer_id": str(stream["streamer_id"]),
            "streamer_username": stream["streamer_username"],
            "title": stream["title"],
            "category": stream["category"],
            "thumbnail_url": stream["thumbnail_url"],
            "viewer_count": stream["viewer_count"],
            "is_live": stream["is_live"],
            "started_at": stream["started_at"]
        })
    
    return formatted_streams

@router.get("/{stream_id}", response_model=dict)
async def get_stream(stream_id: str):
    """Get stream details"""
    streams_collection = await get_streams_collection()
    
    # Validate stream ID
    if not ObjectId.is_valid(stream_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid stream ID"
        )
    
    stream = await streams_collection.find_one({"_id": ObjectId(stream_id)})
    
    if not stream:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stream not found"
        )
    
    return {
        "id": str(stream["_id"]),
        "streamer_id": str(stream["streamer_id"]),
        "streamer_username": stream["streamer_username"],
        "title": stream["title"],
        "category": stream["category"],
        "thumbnail_url": stream["thumbnail_url"],
        "description": stream.get("description"),
        "viewer_count": stream["viewer_count"],
        "is_live": stream["is_live"],
        "started_at": stream["started_at"],
        "created_at": stream["created_at"]
    }

@router.get("/user/{username}", response_model=List[dict])
async def get_user_streams(username: str):
    """Get all streams by a specific user"""
    streams_collection = await get_streams_collection()
    
    streams = await streams_collection.find({
        "streamer_username": username
    }).sort("created_at", -1).to_list(length=None)
    
    formatted_streams = []
    for stream in streams:
        formatted_streams.append({
            "id": str(stream["_id"]),
            "title": stream["title"],
            "category": stream["category"],
            "thumbnail_url": stream["thumbnail_url"],
            "viewer_count": stream["viewer_count"],
            "is_live": stream["is_live"],
            "started_at": stream["started_at"],
            "ended_at": stream.get("ended_at"),
            "created_at": stream["created_at"]
        })
    
    return formatted_streams