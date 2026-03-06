import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard } from 'lucide-react';
import axios from 'axios';
import { Event, User } from '../types';
import { API_BASE } from '../constants';

const PaymentModal = ({ event, user, onComplete, onCancel }: { event: Event; user: User; onComplete: (ticketId: string) => void; onCancel: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${API_BASE}/payments/initialize`, {
        eventId: event.id,
        amount: event.price + 250,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location
      });
      
      const { link } = response.data;
      const paymentWindow = window.open(link, 'Flutterwave', 'width=600,height=700');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'PAYMENT_SUCCESS') {
          onComplete(event.data.ticketId);
          window.removeEventListener('message', handleMessage);
        }
      };
      
      window.addEventListener('message', handleMessage);
    } catch (err) {
      alert('Failed to initialize payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="bg-indigo-600 p-8 text-white">
          <h3 className="text-2xl font-bold font-display mb-2">Secure Checkout</h3>
          <p className="text-indigo-100 text-sm">Complete your purchase for {event.title}</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-500">Ticket Price</span>
              <span className="font-bold text-zinc-900">₦{event.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-zinc-500">Service Fee</span>
              <span className="font-bold text-zinc-900">₦250.00</span>
            </div>
            <div className="h-px bg-zinc-200 mb-4" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-zinc-900">Total</span>
              <span className="text-indigo-600">₦{(event.price + 250).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl bg-zinc-50/50">
              <CreditCard className="text-zinc-400" size={20} />
              <span className="text-sm font-medium text-zinc-600">Flutterwave Payment</span>
            </div>
            <button
              disabled={isProcessing}
              onClick={handlePayment}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₦${(event.price + 250).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
