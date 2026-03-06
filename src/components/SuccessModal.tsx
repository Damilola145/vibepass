import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { Event, User } from '../types';

const SuccessModal = ({ ticketId, event, user, onClose }: { ticketId: string; event: Event; user: User; onClose: () => void }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md"
    />
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-full max-w-lg"
    >
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-emerald-500 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-3xl font-bold font-display">Payment Successful!</h3>
          <p className="text-emerald-100 mt-2">Your ticket is ready and has been sent to {user.email}</p>
        </div>
        
        <div className="p-8">
          <div className="bg-zinc-50 rounded-3xl p-6 border-2 border-dashed border-zinc-200 relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-inner" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-inner" />
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <QRCodeSVG value={`VIBEPASS-${ticketId}-${user.email}`} size={160} level="H" includeMargin={true} className="rounded-xl" />
                <p className="text-[10px] font-mono text-zinc-400 mt-2 tracking-widest uppercase">ID: {ticketId}</p>
              </div>
              
              <div className="space-y-2 mb-6">
                <h4 className="text-xl font-bold font-display text-zinc-900">{event.title}</h4>
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                  <Calendar size={14} />
                  <span>{format(new Date(event.date), 'MMM dd, yyyy • h:mm a')}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-8 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

export default SuccessModal;
