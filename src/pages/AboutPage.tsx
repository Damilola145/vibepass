import React from 'react';
import { motion } from 'motion/react';
import { Users, Globe, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold font-display text-zinc-900 mb-6">
          We Connect People Through <span className="text-indigo-600">Experiences</span>
        </h1>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
          VibePass is more than just a ticketing platform. We're a community of event lovers, creators, and explorers dedicated to making every moment count.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img 
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200" 
            alt="Team working together" 
            className="rounded-[2.5rem] shadow-2xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-zinc-900">Our Mission</h2>
          <p className="text-zinc-600 leading-relaxed text-lg">
            Founded in 2024, VibePass was born from a simple idea: finding and booking events should be as exciting as attending them. We believe that shared experiences have the power to bring people together, spark creativity, and create lasting memories.
          </p>
          <p className="text-zinc-600 leading-relaxed text-lg">
            Our platform empowers organizers to reach wider audiences while giving attendees a seamless, secure, and personalized way to discover their next adventure.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {[
          { icon: Users, title: 'Community First', desc: 'Building connections that last beyond the event.' },
          { icon: Globe, title: 'Global Reach', desc: 'Connecting cultures through shared experiences.' },
          { icon: Award, title: 'Excellence', desc: 'Committed to the highest quality in everything we do.' },
          { icon: Heart, title: 'Passion', desc: 'We love what we do and it shows in our platform.' }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">{item.title}</h3>
            <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full transform -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-8">Ready to start your journey?</h2>
          <p className="text-zinc-300 text-lg mb-10">
            Join thousands of others who are discovering amazing events every day.
          </p>
          <button className="bg-white text-zinc-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-zinc-100 transition-colors shadow-lg shadow-white/10">
            Explore Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
