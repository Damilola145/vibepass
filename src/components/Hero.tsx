import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';

const Hero = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1920'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={images[currentImage]}
            alt="Hero Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 text-center px-6 max-w-4xl">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold font-display text-white mb-6 leading-tight"
        >
          Experience the <span className="text-indigo-400">Best Events</span> Around You
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-zinc-200 mb-10 max-w-2xl mx-auto"
        >
          Discover concerts, art shows, tech summits, and more. Book your spot in seconds.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-xl mx-auto"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-zinc-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search events, artists, or venues..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-white/95 backdrop-blur-sm border-none rounded-2xl py-4 pl-12 pr-4 text-zinc-900 shadow-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
