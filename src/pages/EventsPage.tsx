import React, { useState, useEffect } from 'react';
import { Filter, Search, X, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { MOCK_EVENTS, CATEGORIES, Event, User } from '../types';
import { API_BASE } from '../constants';
import EventCard from '../components/EventCard';
import PaymentModal from '../components/PaymentModal';
import SuccessModal from '../components/SuccessModal';
import AuthModal from '../components/AuthModal';
import { cn } from '../lib/utils';

interface EventsPageProps {
  user: User | null;
  setUser: (user: User | null) => void;
  onSignIn: () => void;
}

const EventsPage = ({ user, setUser, onSignIn }: EventsPageProps) => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [purchasedTicketId, setPurchasedTicketId] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/events`);
        setEvents(data.events);
      } catch (err) {
        console.error('Failed to fetch events', err);
        // Fallback to mock events if API fails (optional, but good for dev)
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookNow = () => {
    if (!user) {
      onSignIn();
    } else {
      setShowPayment(true);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 relative z-30 pt-24">
      <div className="mb-8">
        <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-zinc-400" size={20} />
            </div>
            <input
            type="text"
            value={searchQuery}
            placeholder="Search events..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-2xl py-3 pl-12 pr-4 text-zinc-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar">
        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm border border-zinc-100 mr-2">
          <Filter size={18} className="text-zinc-400" />
          <span className="text-sm font-bold text-zinc-700 whitespace-nowrap">Filter by</span>
        </div>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap shadow-sm border",
              selectedCategory === category
                ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100"
                : "bg-white text-zinc-600 border-zinc-100 hover:border-indigo-200 hover:text-indigo-600"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-display text-zinc-900">
            {selectedCategory === 'All' ? 'Upcoming Events' : `${selectedCategory} Events`}
          </h2>
          <p className="text-zinc-500 font-medium">{filteredEvents.length} events found</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] h-[400px] animate-pulse border border-zinc-100" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-zinc-100 shadow-sm">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No events found</h3>
            <p className="text-zinc-500">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedEvent && !showPayment && !purchasedTicketId && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setSelectedEvent(null)}
            />
            <motion.div
              layoutId={`event-card-${selectedEvent.id}`}
              className="relative bg-white rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
              </div>
              
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[80vh]">
                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-4">
                  {selectedEvent.category}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-zinc-900 mb-6 leading-tight">
                  {selectedEvent.title}
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Date and Time</p>
                      <p className="text-sm text-zinc-500">{format(new Date(selectedEvent.date), 'EEEE, MMMM dd, yyyy • h:mm a')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Location</p>
                      <p className="text-sm text-zinc-500">{selectedEvent.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-zinc-900 mb-2 uppercase tracking-wider">About this event</h4>
                  <p className="text-zinc-600 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-8 border-t border-zinc-100">
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">Price per ticket</p>
                    <p className="text-3xl font-bold text-zinc-900">₦{selectedEvent.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handleBookNow}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                  >
                    {user ? 'Book Now' : 'Sign In to Book'} <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showPayment && selectedEvent && user && (
          <PaymentModal
            event={selectedEvent}
            user={user}
            onCancel={() => setShowPayment(false)}
            onComplete={(id) => {
              setPurchasedTicketId(id);
              setShowPayment(false);
            }}
          />
        )}

        {purchasedTicketId && selectedEvent && user && (
          <SuccessModal
            ticketId={purchasedTicketId}
            event={selectedEvent}
            user={user}
            onClose={() => {
              setPurchasedTicketId(null);
              setSelectedEvent(null);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default EventsPage;
