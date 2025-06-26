from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from database import get_users_collection
from models import UserCreate, UserLogin, Token, UserProfile
from auth_utils import verify_password, get_password_hash, create_access_token
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=dict)
async def register_user(user: UserCreate):
    """Register a new user"""
    users_collection = await get_users_collection()
    
    # Check if username already exists
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = await users_collection.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_data = {
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "avatar_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user.username}",
        "bio": "",
        "followers_count": 0,
        "following_count": 0,
        "is_streaming": False,
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_data)
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@router.post("/login", response_model=Token)
async def login_user(user: UserLogin):
    """Login user and return access token"""
    users_collection = await get_users_collection()
    
    # Find user by username
    db_user = await users_collection.find_one({"username": user.username})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=dict)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    # Remove sensitive information
    user_profile = {
        "id": str(current_user["_id"]),
        "username": current_user["username"],
        "email": current_user["email"],
        "full_name": current_user.get("full_name"),
        "avatar_url": current_user.get("avatar_url"),
        "bio": current_user.get("bio", ""),
        "followers_count": current_user.get("followers_count", 0),
        "following_count": current_user.get("following_count", 0),
        "is_streaming": current_user.get("is_streaming", False),
        "created_at": current_user.get("created_at")
    }
    return user_profile

# Import here to avoid circular imports
from auth_utils import get_current_user