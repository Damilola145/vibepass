import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Ticket, Star, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Features = () => {
  const features = [
    {
      icon: <Ticket className="w-8 h-8 text-indigo-600" />,
      title: "Instant Booking",
      description: "Secure your spot in seconds with our streamlined checkout process. No hidden fees, just pure excitement."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
      title: "Verified Events",
      description: "Every event on VibePass is vetted for quality and authenticity, so you can book with confidence."
    },
    {
      icon: <Zap className="w-8 h-8 text-indigo-600" />,
      title: "Real-time Updates",
      description: "Get instant notifications about event changes, ticket availability, and exclusive offers."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-zinc-900 mb-4">Why Choose VibePass?</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">We're redefining how you discover and experience events. Simple, secure, and built for you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Discover",
      description: "Browse thousands of events across music, art, tech, and more."
    },
    {
      number: "02",
      title: "Book",
      description: "Select your tickets and pay securely with just a few clicks."
    },
    {
      number: "03",
      title: "Experience",
      description: "Show your QR code at the door and enjoy the moment."
    }
  ];

  return (
    <section className="py-24 bg-zinc-900 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">How It Works</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Your journey from screen to scene in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-zinc-800 z-0"></div>

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 text-center"
            >
              <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-zinc-900 text-3xl font-bold font-display text-indigo-400 shadow-xl shadow-indigo-900/20">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link to="/events" className="inline-block bg-white text-zinc-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10">
            Start Exploring
          </Link>
        </div>
      </div>
    </section>
  );
};

export const Stats = () => {
  return (
    <section className="py-20 bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Users", value: "50k+" },
            { label: "Events Hosted", value: "12k+" },
            { label: "Cities", value: "30+" },
            { label: "Tickets Sold", value: "1M+" }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-4xl md:text-5xl font-bold font-display mb-2">{stat.value}</div>
              <div className="text-indigo-200 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Testimonials = () => {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-zinc-900 mb-4">What People Say</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">Join the community of event lovers who trust VibePass.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Jenkins",
              role: "Music Enthusiast",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
              text: "VibePass made it incredibly easy to find tickets for the Neon Nights festival. The QR code entry was seamless!"
            },
            {
              name: "David Chen",
              role: "Tech Founder",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
              text: "I use VibePass for all my networking events. It's the best platform for discovering professional meetups in the city."
            },
            {
              name: "Emily Rodriguez",
              role: "Art Curator",
              image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
              text: "The curated selection of art exhibitions is fantastic. I've discovered so many hidden gems through this app."
            }
          ].map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-100"
            >
              <div className="flex items-center gap-1 text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-zinc-600 mb-8 leading-relaxed">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-zinc-900">{testimonial.name}</div>
                  <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
