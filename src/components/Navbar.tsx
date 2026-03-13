import React from 'react';
import { Ticket as TicketIcon, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: User | null;
  onSignIn: () => void;
  onLogout: () => void;
}

const Navbar = ({ user, onSignIn, onLogout }: NavbarProps) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-4 sm:px-6 py-3 shadow-lg gap-2 sm:gap-4">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg shrink-0">
          <TicketIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-zinc-900">VibePass</span>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
        <Link to="/events" className="hover:text-indigo-600 transition-colors">Explore</Link>
        <Link to="/my-tickets" className="hover:text-indigo-600 transition-colors">My Tickets</Link>
        <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
        {user?.isAdmin && (
          <Link to="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
        )}
      </div>
      
      {user ? (
        <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 py-1 bg-zinc-50 rounded-xl border border-zinc-100 shrink min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 px-1 sm:px-2 min-w-0">
            <UserIcon size={16} className="text-indigo-600 shrink-0" />
            <span className="text-sm font-bold text-zinc-700 truncate">
              {user.name.split(' ')[0]}
            </span>
          </div>
          <div className="w-px h-6 bg-zinc-200 shrink-0"></div>
          <button 
            onClick={onLogout}
            className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all shrink-0"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <button 
          onClick={onSignIn}
          className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all shadow-md"
        >
          Sign In
        </button>
      )}
    </div>
  </nav>
);

export default Navbar;
