from fastapi import APIRouter, HTTPException, status, Query
from database import get_categories_collection, get_streams_collection
from models import Category
from typing import List
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_categories(
    limit: int = Query(20, le=100),
    skip: int = Query(0, ge=0)
):
    """Get all streaming categories"""
    categories_collection = await get_categories_collection()
    streams_collection = await get_streams_collection()
    
    # Get categories
    categories = await categories_collection.find({}).skip(skip).limit(limit).to_list(length=None)
    
    # If no categories exist, create default ones
    if not categories:
        default_categories = [
            {
                "name": "Games",
                "slug": "games",
                "description": "Video games and gaming content",
                "thumbnail_url": "https://images.pexels.com/photos/7776899/pexels-photo-7776899.jpeg",
                "viewer_count": 0,
                "stream_count": 0
            },
            {
                "name": "Music",
                "slug": "music",
                "description": "Music performances and audio content",
                "thumbnail_url": "https://images.pexels.com/photos/7233194/pexels-photo-7233194.jpeg",
                "viewer_count": 0,
                "stream_count": 0
            },
            {
                "name": "Art",
                "slug": "art",
                "description": "Digital art, drawing, and creative content",
                "thumbnail_url": "https://images.unsplash.com/photo-1639759032532-c7f288e9ef4f",
                "viewer_count": 0,
                "stream_count": 0
            },
            {
                "name": "Science & Technology",
                "slug": "science-technology",
                "description": "Programming, tech talks, and educational content",
                "thumbnail_url": "https://images.unsplash.com/photo-1569965352022-f014c3ca4c5e",
                "viewer_count": 0,
                "stream_count": 0
            },
            {
                "name": "Food & Drink",
                "slug": "food-drink",
                "description": "Cooking shows and culinary content",
                "thumbnail_url": "https://images.unsplash.com/photo-1549476130-8afd7ecd8a45",
                "viewer_count": 0,
                "stream_count": 0
            },
            {
                "name": "Fitness & Health",
                "slug": "fitness-health",
                "description": "Workout routines and health content",
                "thumbnail_url": "https://images.pexels.com/photos/7657856/pexels-photo-7657856.jpeg",
                "viewer_count": 0,
                "stream_count": 0
            }
        ]
        
        await categories_collection.insert_many(default_categories)
        categories = await categories_collection.find({}).to_list(length=None)
    
    # Update stream counts for each category
    for category in categories:
        stream_count = await streams_collection.count_documents({
            "category": {"$regex": category["name"], "$options": "i"},
            "is_live": True
        })
        
        # Update category with current stream count
        await categories_collection.update_one(
            {"_id": category["_id"]},
            {"$set": {"stream_count": stream_count}}
        )
        category["stream_count"] = stream_count
    
    # Format response
    formatted_categories = []
    for category in categories:
        formatted_categories.append({
            "id": str(category["_id"]),
            "name": category["name"],
            "slug": category["slug"],
            "description": category.get("description"),
            "thumbnail_url": category.get("thumbnail_url"),
            "viewer_count": category.get("viewer_count", 0),
            "stream_count": category.get("stream_count", 0)
        })
    
    return formatted_categories

@router.get("/{category_slug}", response_model=dict)
async def get_category(category_slug: str):
    """Get category details by slug"""
    categories_collection = await get_categories_collection()
    streams_collection = await get_streams_collection()
    
    category = await categories_collection.find_one({"slug": category_slug})
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Get current stream count
    stream_count = await streams_collection.count_documents({
        "category": {"$regex": category["name"], "$options": "i"},
        "is_live": True
    })
    
    # Calculate total viewers in this category
    pipeline = [
        {"$match": {
            "category": {"$regex": category["name"], "$options": "i"},
            "is_live": True
        }},
        {"$group": {
            "_id": None,
            "total_viewers": {"$sum": "$viewer_count"}
        }}
    ]
    
    result = await streams_collection.aggregate(pipeline).to_list(length=1)
    total_viewers = result[0]["total_viewers"] if result else 0
    
    return {
        "id": str(category["_id"]),
        "name": category["name"],
        "slug": category["slug"],
        "description": category.get("description"),
        "thumbnail_url": category.get("thumbnail_url"),
        "viewer_count": total_viewers,
        "stream_count": stream_count
    }

@router.get("/{category_slug}/streams", response_model=List[dict])
async def get_category_streams(
    category_slug: str,
    limit: int = Query(20, le=100),
    skip: int = Query(0, ge=0)
):
    """Get streams in a specific category"""
    categories_collection = await get_categories_collection()
    streams_collection = await get_streams_collection()
    
    # Get category
    category = await categories_collection.find_one({"slug": category_slug})
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Get streams in this category
    streams = await streams_collection.find({
        "category": {"$regex": category["name"], "$options": "i"},
        "is_live": True
    }).sort("viewer_count", -1).skip(skip).limit(limit).to_list(length=None)
    
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