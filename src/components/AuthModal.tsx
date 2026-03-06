import React, { useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { User } from '../types';
import { API_BASE } from '../constants';

const AuthModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: (user: User) => void }) => {
  const [view, setView] = useState<'login' | 'signup' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (view === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (view === 'verify') {
        const response = await axios.post(`${API_BASE}/auth/verify`, { email, code: verificationCode });
        onSuccess(response.data.user);
        return;
      }

      const endpoint = view === 'login' ? '/auth/login' : '/auth/signup';
      const payload = view === 'login' ? { email, password } : { email, password, name };
      const response = await axios.post(`${API_BASE}${endpoint}`, payload);
      
      if (view === 'signup') {
        setSuccessMessage(response.data.message);
        setView('verify');
      } else {
        onSuccess(response.data.user);
      }
    } catch (err: any) {
      if (err.response?.data?.needsVerification) {
        setError('Please verify your email');
        setView('verify');
      } else {
        setError(err.response?.data?.error || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setSuccessMessage('');
      const response = await axios.get(`${API_BASE}/auth/google/url`);
      const { url, redirectUri } = response.data;
      console.log('Google OAuth Redirect URI being used:', redirectUri);
      const authWindow = window.open(url, 'Google Auth', 'width=600,height=700');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
          onSuccess(event.data.user);
          window.removeEventListener('message', handleMessage);
        } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
          setError(event.data.error || 'Google login failed');
          window.removeEventListener('message', handleMessage);
        }
      };
      
      window.addEventListener('message', handleMessage);
    } catch (err) {
      setError('Google login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white rounded-3xl sm:rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-indigo-600 p-5 sm:p-8 text-white text-center shrink-0">
          <h3 className="text-xl sm:text-2xl font-bold font-display mb-1 sm:mb-2">
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join VibePass' : 'Verify Email'}
          </h3>
          <p className="text-indigo-100 text-xs sm:text-sm">
            {view === 'verify' ? `We've sent a code to ${email}` : 'Discover and book the best local events.'}
          </p>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <form onSubmit={handleAuth} className="p-5 sm:p-8 space-y-3 sm:space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl text-center">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-xl text-center">
                {successMessage}
              </div>
            )}
            
            {view === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            )}
            
            {view !== 'verify' && (
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            )}
            
            {view !== 'verify' && (
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            )}

            {view === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Confirm Password</label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            )}

            {view === 'verify' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Verification Code</label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center text-2xl tracking-[1em] font-bold"
                  />
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        setError('');
                        setSuccessMessage('');
                        const response = await axios.post(`${API_BASE}/auth/resend`, { email });
                        setSuccessMessage(response.data.message);
                      } catch (err: any) {
                        setError(err.response?.data?.error || 'Failed to resend code');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    Didn't receive a code? Resend
                  </button>
                </div>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 mt-2 sm:mt-4"
            >
              {loading ? 'Processing...' : (view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Verify Code')}
            </button>

            {view !== 'verify' && (
              <>
                <div className="relative my-4 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-zinc-500">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 sm:py-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all font-semibold text-zinc-700"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Google
                </button>
              </>
            )}

            <p className="text-center text-sm text-zinc-500 mt-4 sm:mt-6 pb-2">
              {view === 'login' ? "Don't have an account?" : view === 'signup' ? "Already have an account?" : "Entered wrong email?"}{' '}
              <button
                type="button"
                onClick={() => {
                  if (view === 'verify') setView('signup');
                  else setView(view === 'login' ? 'signup' : 'login');
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                {view === 'login' ? 'Sign Up' : view === 'signup' ? 'Log In' : 'Go Back'}
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
