import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence } from 'motion/react';
import { Ticket as TicketIcon } from 'lucide-react';
import { User } from './types';
import { API_BASE } from './constants';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import MyTicketsPage from './pages/MyTicketsPage';
import AdminPage from './pages/AdminPage';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

// --- API Configuration ---
axios.defaults.withCredentials = true;

// Wrapper to use hooks
const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE}/auth/me`);
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await axios.post(`${API_BASE}/auth/logout`);
    setUser(null);
    navigate('/');
  };

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    setShowAuth(false);
    // Redirect to events page after login if not already there
    if (location.pathname !== '/events') {
      navigate('/events');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar 
        user={user} 
        onSignIn={() => setShowAuth(true)} 
        onLogout={handleLogout} 
      />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/events" 
            element={
              <EventsPage 
                user={user} 
                setUser={setUser} 
                onSignIn={() => setShowAuth(true)} 
              />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage user={user} />} />
          <Route 
            path="/admin" 
            element={user?.isAdmin ? <AdminPage /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </div>

      <AnimatePresence>
        {showAuth && (
          <AuthModal 
            onClose={() => setShowAuth(false)} 
            onSuccess={handleAuthSuccess} 
          />
        )}
      </AnimatePresence>

      <Footer />
      <CookieConsent />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
