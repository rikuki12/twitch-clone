from fastapi import APIRouter, HTTPException, status, Depends
from database import get_users_collection, get_follows_collection
from models import UserProfile, UserUpdate, Follow
from auth_utils import get_current_user
from bson import ObjectId
from typing import List, Optional

router = APIRouter()

@router.get("/profile/{username}", response_model=dict)
async def get_user_profile(username: str):
    """Get user profile by username"""
    users_collection = await get_users_collection()
    user = await users_collection.find_one({"username": username})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return public profile information
    profile = {
        "id": str(user["_id"]),
        "username": user["username"],
        "full_name": user.get("full_name"),
        "avatar_url": user.get("avatar_url"),
        "bio": user.get("bio", ""),
        "followers_count": user.get("followers_count", 0),
        "following_count": user.get("following_count", 0),
        "is_streaming": user.get("is_streaming", False),
        "created_at": user.get("created_at")
    }
    return profile

@router.put("/profile", response_model=dict)
async def update_user_profile(
    profile_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update current user's profile"""
    users_collection = await get_users_collection()
    
    # Prepare update data
    update_data = {}
    if profile_update.full_name is not None:
        update_data["full_name"] = profile_update.full_name
    if profile_update.bio is not None:
        update_data["bio"] = profile_update.bio
    if profile_update.avatar_url is not None:
        update_data["avatar_url"] = profile_update.avatar_url
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data provided for update"
        )
    
    # Update user profile
    result = await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile update failed"
        )
    
    return {"message": "Profile updated successfully"}

@router.post("/follow/{username}")
async def follow_user(
    username: str,
    current_user: dict = Depends(get_current_user)
):
    """Follow a user"""
    if username == current_user["username"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot follow yourself"
        )
    
    users_collection = await get_users_collection()
    follows_collection = await get_follows_collection()
    
    # Check if target user exists
    target_user = await users_collection.find_one({"username": username})
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if already following
    existing_follow = await follows_collection.find_one({
        "follower_id": ObjectId(current_user["_id"]),
        "following_id": ObjectId(target_user["_id"])
    })
    
    if existing_follow:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already following this user"
        )
    
    # Create follow relationship
    follow_data = {
        "follower_id": ObjectId(current_user["_id"]),
        "following_id": ObjectId(target_user["_id"]),
        "created_at": datetime.utcnow()
    }
    
    await follows_collection.insert_one(follow_data)
    
    # Update follower and following counts
    await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$inc": {"following_count": 1}}
    )
    
    await users_collection.update_one(
        {"_id": ObjectId(target_user["_id"])},
        {"$inc": {"followers_count": 1}}
    )
    
    return {"message": f"Successfully followed {username}"}

@router.delete("/unfollow/{username}")
async def unfollow_user(
    username: str,
    current_user: dict = Depends(get_current_user)
):
    """Unfollow a user"""
    users_collection = await get_users_collection()
    follows_collection = await get_follows_collection()
    
    # Check if target user exists
    target_user = await users_collection.find_one({"username": username})
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Remove follow relationship
    result = await follows_collection.delete_one({
        "follower_id": ObjectId(current_user["_id"]),
        "following_id": ObjectId(target_user["_id"])
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not following this user"
        )
    
    # Update follower and following counts
    await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$inc": {"following_count": -1}}
    )
    
    await users_collection.update_one(
        {"_id": ObjectId(target_user["_id"])},
        {"$inc": {"followers_count": -1}}
    )
    
    return {"message": f"Successfully unfollowed {username}"}

@router.get("/following", response_model=List[dict])
async def get_following_list(current_user: dict = Depends(get_current_user)):
    """Get list of users that current user is following"""
    follows_collection = await get_follows_collection()
    users_collection = await get_users_collection()
    
    # Get all follows by current user
    follows = await follows_collection.find({
        "follower_id": ObjectId(current_user["_id"])
    }).to_list(length=None)
    
    following_list = []
    for follow in follows:
        user = await users_collection.find_one({"_id": follow["following_id"]})
        if user:
            following_list.append({
                "id": str(user["_id"]),
                "username": user["username"],
                "full_name": user.get("full_name"),
                "avatar_url": user.get("avatar_url"),
                "is_streaming": user.get("is_streaming", False),
                "followed_at": follow["created_at"]
            })
    
    return following_list

from datetime import datetime