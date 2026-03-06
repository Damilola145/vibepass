import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../types';

const EventCard = ({ event, onClick }: { event: Event; onClick: () => void; key?: string }) => (
  <motion.div
    layoutId={`event-card-${event.id}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8 }}
    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100 cursor-pointer"
    onClick={onClick}
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
        {event.category}
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 text-zinc-500 text-sm mb-3">
        <Calendar size={14} />
        <span>{format(new Date(event.date), 'MMM dd, yyyy • h:mm a')}</span>
      </div>
      <h3 className="text-xl font-bold font-display text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors">
        {event.title}
      </h3>
      <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
        <MapPin size={14} />
        <span className="truncate">{event.location}</span>
      </div>
      <div className="flex items-center justify-between pt-4 border-top border-zinc-100">
        <span className="text-2xl font-bold text-zinc-900">₦{event.price.toLocaleString()}</span>
        <button className="bg-zinc-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
          Get Tickets
        </button>
      </div>
    </div>
  </motion.div>
);

export default EventCard;
