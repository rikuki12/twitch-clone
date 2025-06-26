const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8001';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getAuthHeaders() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Users
  async getUserProfile(username) {
    return this.request(`/api/users/profile/${username}`);
  }

  async updateProfile(profileData) {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async followUser(username) {
    return this.request(`/api/users/follow/${username}`, {
      method: 'POST',
    });
  }

  async unfollowUser(username) {
    return this.request(`/api/users/unfollow/${username}`, {
      method: 'DELETE',
    });
  }

  async getFollowing() {
    return this.request('/api/users/following');
  }

  // Streams
  async getLiveStreams(category = null, limit = 20, skip = 0) {
    const params = new URLSearchParams({ limit, skip });
    if (category) params.append('category', category);
    return this.request(`/api/streams/live?${params}`);
  }

  async getStream(streamId) {
    return this.request(`/api/streams/${streamId}`);
  }

  async getUserStreams(username) {
    return this.request(`/api/streams/user/${username}`);
  }

  async createStream(streamData) {
    return this.request('/api/streams/create', {
      method: 'POST',
      body: JSON.stringify(streamData),
    });
  }

  async startStream(streamId) {
    return this.request(`/api/streams/${streamId}/start`, {
      method: 'PUT',
    });
  }

  async stopStream(streamId) {
    return this.request(`/api/streams/${streamId}/stop`, {
      method: 'PUT',
    });
  }

  // Categories
  async getCategories(limit = 20, skip = 0) {
    return this.request(`/api/categories?limit=${limit}&skip=${skip}`);
  }

  async getCategory(categorySlug) {
    return this.request(`/api/categories/${categorySlug}`);
  }

  async getCategoryStreams(categorySlug, limit = 20, skip = 0) {
    return this.request(`/api/categories/${categorySlug}/streams?limit=${limit}&skip=${skip}`);
  }

  // Chat
  async getChatMessages(streamId, limit = 50, skip = 0) {
    return this.request(`/api/chat/${streamId}/messages?limit=${limit}&skip=${skip}`);
  }

  async sendChatMessage(streamId, message) {
    return this.request(`/api/chat/${streamId}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // WebSocket for real-time chat
  connectToChat(streamId, onMessage, onConnect, onDisconnect) {
    const ws = new WebSocket(`${WS_BASE_URL}/ws/chat/${streamId}`);
    
    ws.onopen = (event) => {
      console.log('Connected to chat:', streamId);
      if (onConnect) onConnect(event);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    
    ws.onclose = (event) => {
      console.log('Disconnected from chat:', streamId);
      if (onDisconnect) onDisconnect(event);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return {
      send: (message) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      },
      close: () => ws.close(),
    };
  }
}

export const apiService = new ApiService();
export default apiService;