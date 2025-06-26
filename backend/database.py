from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/twitch_clone")

class Database:
    client: AsyncIOMotorClient = None
    database_name = "twitch_clone"

db = Database()

async def get_database():
    if db.client is None:
        try:
            db.client = AsyncIOMotorClient(MONGO_URL)
            # Test the connection
            await db.client.admin.command('ping')
            print(f"✅ Connected to MongoDB: {MONGO_URL}")
        except ConnectionFailure as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            raise e
    
    return db.client[db.database_name]

async def close_database_connection():
    if db.client:
        db.client.close()
        print("👋 Disconnected from MongoDB")

# Collections
async def get_users_collection():
    database = await get_database()
    return database.users

async def get_streams_collection():
    database = await get_database()
    return database.streams

async def get_chat_collection():
    database = await get_database()
    return database.chat_messages

async def get_categories_collection():
    database = await get_database()
    return database.categories

async def get_follows_collection():
    database = await get_database()
    return database.follows