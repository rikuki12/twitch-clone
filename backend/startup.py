"""
Startup script to initialize the database with sample data
"""
import asyncio
from database import get_database, get_users_collection, get_streams_collection, get_categories_collection
from auth_utils import get_password_hash
from datetime import datetime
import random

async def create_sample_users():
    """Create sample users for testing"""
    users_collection = await get_users_collection()
    
    # Check if users already exist
    existing_users = await users_collection.count_documents({})
    if existing_users > 0:
        print("Sample users already exist, skipping...")
        return
    
    sample_users = [
        {
            "username": "GamerPro123",
            "email": "gamer@example.com",
            "full_name": "Pro Gamer",
            "hashed_password": get_password_hash("password123"),
            "avatar_url": "https://images.pexels.com/photos/7562468/pexels-photo-7562468.jpeg",
            "bio": "Professional gamer and content creator",
            "followers_count": 15420,
            "following_count": 250,
            "is_streaming": True,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "username": "MusicMaster",
            "email": "music@example.com",
            "full_name": "Music Master",
            "hashed_password": get_password_hash("password123"),
            "avatar_url": "https://images.pexels.com/photos/8512609/pexels-photo-8512609.jpeg",
            "bio": "Music producer and live performer",
            "followers_count": 8750,
            "following_count": 180,
            "is_streaming": True,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "username": "CodeWithMe",
            "email": "coder@example.com",
            "full_name": "Code Master",
            "hashed_password": get_password_hash("password123"),
            "avatar_url": "https://images.pexels.com/photos/7776899/pexels-photo-7776899.jpeg",
            "bio": "Software developer and educator",
            "followers_count": 3200,
            "following_count": 120,
            "is_streaming": True,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "username": "ArtisticSoul",
            "email": "artist@example.com",
            "full_name": "Digital Artist",
            "hashed_password": get_password_hash("password123"),
            "avatar_url": "https://images.pexels.com/photos/7657856/pexels-photo-7657856.jpeg",
            "bio": "Digital artist and creative designer",
            "followers_count": 2100,
            "following_count": 95,
            "is_streaming": False,
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "username": "ChefStreamer",
            "email": "chef@example.com",
            "full_name": "Chef Supreme",
            "hashed_password": get_password_hash("password123"),
            "avatar_url": "https://images.unsplash.com/photo-1550828486-68812fa3f966",
            "bio": "Professional chef sharing cooking techniques",
            "followers_count": 1850,
            "following_count": 75,
            "is_streaming": True,
            "is_active": True,
            "created_at": datetime.utcnow()
        }
    ]
    
    result = await users_collection.insert_many(sample_users)
    print(f"✅ Created {len(result.inserted_ids)} sample users")
    return result.inserted_ids

async def create_sample_streams(user_ids):
    """Create sample streams for testing"""
    streams_collection = await get_streams_collection()
    
    # Check if streams already exist
    existing_streams = await streams_collection.count_documents({})
    if existing_streams > 0:
        print("Sample streams already exist, skipping...")
        return
    
    users_collection = await get_users_collection()
    users = await users_collection.find({}).to_list(length=None)
    
    thumbnails = [
        "https://images.pexels.com/photos/8728386/pexels-photo-8728386.jpeg",
        "https://images.pexels.com/photos/7233189/pexels-photo-7233189.jpeg",
        "https://images.unsplash.com/photo-1569965352022-f014c3ca4c5e",
        "https://images.unsplash.com/photo-1646614871839-881108ea8407",
        "https://images.unsplash.com/photo-1549476130-8afd7ecd8a45"
    ]
    
    sample_streams = []
    for i, user in enumerate(users):
        if user["is_streaming"]:
            stream = {
                "streamer_id": user["_id"],
                "streamer_username": user["username"],
                "title": f"Live Stream by {user['username']}",
                "category": ["Games", "Music", "Science & Technology", "Art", "Food & Drink"][i % 5],
                "thumbnail_url": thumbnails[i % len(thumbnails)],
                "description": f"Amazing live content from {user['username']}",
                "is_live": True,
                "viewer_count": random.randint(100, 20000),
                "started_at": datetime.utcnow(),
                "ended_at": None,
                "created_at": datetime.utcnow()
            }
            sample_streams.append(stream)
    
    if sample_streams:
        result = await streams_collection.insert_many(sample_streams)
        print(f"✅ Created {len(result.inserted_ids)} sample streams")

async def initialize_database():
    """Initialize database with sample data"""
    print("🚀 Initializing database with sample data...")
    
    try:
        # Test database connection
        db = await get_database()
        await db.command("ping")
        print("✅ Database connection successful")
        
        # Create sample data
        user_ids = await create_sample_users()
        await create_sample_streams(user_ids)
        
        print("✅ Database initialization complete!")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")

if __name__ == "__main__":
    asyncio.run(initialize_database())