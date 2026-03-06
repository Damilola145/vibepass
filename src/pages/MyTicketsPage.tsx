import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { Ticket, User } from '../types';
import { API_BASE } from '../constants';
import { Link } from 'react-router-dom';
import { Ticket as TicketIcon, Calendar, MapPin, Search } from 'lucide-react';
import { format } from 'date-fns';

interface MyTicketsPageProps {
  user: User | null;
}

const MyTicketsPage = ({ user }: MyTicketsPageProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}/tickets`);
        setTickets(response.data.tickets);
      } catch (err) {
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-24">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
          <TicketIcon size={32} className="text-zinc-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Sign in to view your tickets</h2>
        <p className="text-zinc-500 mb-8">You need to be logged in to access your purchased tickets.</p>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold font-display text-zinc-900 mb-8">My Tickets</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-zinc-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold font-display text-zinc-900 mb-8">My Tickets</h1>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-zinc-900 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Event Ticket</p>
                  <h3 className="text-xl font-bold font-display leading-tight mb-4">{ticket.eventTitle}</h3>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                    <Calendar size={14} />
                    <span>{format(new Date(ticket.eventDate), 'MMM dd, yyyy • h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <MapPin size={14} />
                    <span>{ticket.eventLocation}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Ticket ID</p>
                    <p className="text-sm font-mono font-bold text-zinc-900">{ticket.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Purchased</p>
                    <p className="text-sm font-bold text-zinc-900">{format(new Date(ticket.purchaseDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                
                <div className="bg-zinc-50 p-4 rounded-2xl flex items-center justify-center border border-zinc-100 border-dashed">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.qrValue)}`} 
                    alt="QR Code" 
                    className="w-32 h-32 mix-blend-multiply"
                  />
                </div>
                <p className="text-center text-xs text-zinc-400 mt-4">Scan this code at the entrance</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-zinc-100 shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <TicketIcon size={32} className="text-zinc-300" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 mb-3">No tickets found</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            You haven't purchased any tickets yet. Explore our events to find your next experience!
          </p>
          <Link 
            to="/events" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Search size={20} />
            Explore Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
