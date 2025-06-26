import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../api';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { 
  User, 
  Calendar, 
  Users, 
  Heart, 
  Settings, 
  Edit,
  Save,
  X,
  Eye,
  Play,
  Clock,
  ExternalLink,
  MapPin,
  Link as LinkIcon
} from 'lucide-react';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [userStreams, setUserStreams] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: ''
  });

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    if (username) {
      fetchUserProfile();
      fetchUserStreams();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // For demo, create mock user data
      const mockUser = {
        id: "user_" + username,
        username: username,
        full_name: `${username}'s Full Name`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: `Hi! I'm ${username}. I love streaming and creating content for my amazing community! 🎮✨`,
        location: 'Streaming from the Cloud',
        website: 'https://example.com',
        followers_count: Math.floor(Math.random() * 50000) + 1000,
        following_count: Math.floor(Math.random() * 1000) + 100,
        is_streaming: Math.random() > 0.5,
        created_at: new Date(Date.now() - Math.random() * 31536000000).toISOString() // Random date within last year
      };
      
      setUser(mockUser);
      setEditForm({
        full_name: mockUser.full_name || '',
        bio: mockUser.bio || '',
        location: mockUser.location || '',
        website: mockUser.website || ''
      });
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStreams = async () => {
    try {
      // Mock user's recent streams
      const mockStreams = [
        {
          id: 1,
          title: "Epic Gaming Session - Road to Victory!",
          category: "Gaming",
          thumbnail_url: "https://images.pexels.com/photos/8728386/pexels-photo-8728386.jpeg",
          viewer_count: Math.floor(Math.random() * 5000),
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          duration: "3h 45m"
        },
        {
          id: 2,
          title: "Chill Music & Chat Session",
          category: "Music",
          thumbnail_url: "https://images.pexels.com/photos/7233189/pexels-photo-7233189.jpeg",
          viewer_count: Math.floor(Math.random() * 3000),
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          duration: "2h 15m"
        },
        {
          id: 3,
          title: "Art Creation & Design Tips",
          category: "Art",
          thumbnail_url: "https://images.unsplash.com/photo-1646614871839-881108ea8407",
          viewer_count: Math.floor(Math.random() * 2000),
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          duration: "1h 30m"
        }
      ];
      
      setUserStreams(mockStreams);
    } catch (error) {
      console.error('Error fetching user streams:', error);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) return;
    
    try {
      if (isFollowing) {
        await apiService.unfollowUser(username);
        setIsFollowing(false);
        setUser(prev => prev ? {...prev, followers_count: prev.followers_count - 1} : null);
      } else {
        await apiService.followUser(username);
        setIsFollowing(true);
        setUser(prev => prev ? {...prev, followers_count: prev.followers_count + 1} : null);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: editForm.full_name || auth.currentUser.displayName
        });
      }
      
      // Update local user state
      setUser(prev => prev ? {...prev, ...editForm} : null);
      setIsEditing(false);
      
      // Show success message (you could add a toast here)
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatStreamDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="pt-20 p-6 max-w-screen-2xl mx-auto">
        <div className="animate-pulse">
          <div className="bg-twitch-dark-light rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 bg-twitch-gray rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-twitch-gray rounded mb-4"></div>
                <div className="h-4 bg-twitch-gray rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-twitch-gray rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 p-6 max-w-screen-2xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">User not found</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-twitch-purple hover:text-twitch-purple-light transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 p-6 max-w-screen-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-twitch-dark-light rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <img 
              src={user.avatar_url}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover"
            />
            {user.is_streaming && (
              <div className="absolute -bottom-2 -right-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                LIVE
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                {user.full_name && (
                  <p className="text-xl text-twitch-gray-light mb-2">{user.full_name}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-twitch-gray-light">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{user.followers_count.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{user.following_count.toLocaleString()} following</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatJoinDate(user.created_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-twitch-purple hover:bg-twitch-purple-dark px-4 py-2 rounded-md text-white font-medium transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </div>
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="bg-twitch-dark-lighter hover:bg-twitch-gray px-4 py-2 rounded-md text-white transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={!isAuthenticated}
                      className={`px-6 py-2 rounded-md font-medium transition-all ${
                        isFollowing 
                          ? 'bg-twitch-gray text-white hover:bg-twitch-gray/80' 
                          : 'bg-twitch-purple text-white hover:bg-twitch-purple-dark'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                      </div>
                    </button>
                    {user.is_streaming && (
                      <button
                        onClick={() => navigate(`/stream/${user.username}`)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-medium transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Play className="w-4 h-4" />
                          <span>Watch Live</span>
                        </div>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bio and Details */}
            {!isEditing ? (
              <div className="space-y-3">
                {user.bio && (
                  <p className="text-white leading-relaxed">{user.bio}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-twitch-gray-light">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.website && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="w-4 h-4" />
                      <a 
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-twitch-purple hover:text-twitch-purple-light transition-colors"
                      >
                        Website
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(prev => ({...prev, full_name: e.target.value}))}
                    placeholder="Your display name"
                    className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-2 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Tell people about yourself..."
                    rows="3"
                    className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-2 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({...prev, location: e.target.value}))}
                      placeholder="Where are you from?"
                      className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-2 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm(prev => ({...prev, website: e.target.value}))}
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-2 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-twitch-purple hover:bg-twitch-purple-dark disabled:opacity-50 flex items-center space-x-2 px-6 py-2 rounded-md text-white font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-twitch-dark-lighter hover:bg-twitch-gray px-4 py-2 rounded-md text-white transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </div>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Recent Streams */}
      <div className="bg-twitch-dark-light rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Streams</h2>
          <span className="text-twitch-gray-light">{userStreams.length} streams</span>
        </div>

        {userStreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userStreams.map((stream) => (
              <div
                key={stream.id}
                className="bg-twitch-dark-lighter rounded-lg overflow-hidden hover:bg-twitch-gray/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/stream/${user.username}`)}
              >
                <div className="relative">
                  <img 
                    src={stream.thumbnail_url}
                    alt={stream.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{stream.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-medium mb-2 line-clamp-2">{stream.title}</h3>
                  <div className="flex items-center justify-between text-sm text-twitch-gray-light">
                    <span>{stream.category}</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{stream.viewer_count.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-twitch-gray-light mt-2">
                    {formatStreamDate(stream.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-twitch-gray-light mx-auto mb-4" />
            <p className="text-twitch-gray-light text-lg mb-2">No recent streams</p>
            <p className="text-twitch-gray-light">
              {isOwnProfile ? "Start streaming to see your content here!" : `${user.username} hasn't streamed recently.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;