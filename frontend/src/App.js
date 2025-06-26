import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Browse from './components/Browse';
import StreamPage from './components/StreamPage';
import UserProfile from './components/UserProfile';
import StreamerDashboardEnhanced from './components/StreamerDashboardEnhanced';
import LiveStreamViewer from './components/LiveStreamViewer';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="App bg-twitch-dark min-h-screen">
          <Navbar />
          <div className="flex">
            <Sidebar 
              collapsed={sidebarCollapsed} 
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
            />
            <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-12' : 'ml-64'}`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse/:category" element={<Browse />} />
                <Route path="/stream/:username" element={<StreamPage />} />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/dashboard" element={<StreamerDashboardEnhanced />} />
                <Route path="/watch/:roomId" element={<LiveStreamViewer />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;