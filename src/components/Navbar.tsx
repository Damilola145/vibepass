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
    <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3 shadow-lg">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
          <TicketIcon size={24} />
        </div>
        <span className="text-2xl font-bold font-display tracking-tight text-zinc-900">VibePass</span>
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
        <div className="flex items-center gap-2 px-2 py-1 bg-zinc-50 rounded-xl border border-zinc-100">
          <div className="flex items-center gap-2 px-2">
            <UserIcon size={16} className="text-indigo-600" />
            <span className="text-sm font-bold text-zinc-700">
              {user.name.split(' ')[0]}
            </span>
          </div>
          <div className="w-px h-6 bg-zinc-200"></div>
          <button 
            onClick={onLogout}
            className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
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
