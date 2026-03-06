import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[100] bg-white rounded-2xl shadow-2xl border border-zinc-100 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Cookie size={20} />
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-lg font-bold text-zinc-900 mb-2">We use cookies</h3>
          <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
