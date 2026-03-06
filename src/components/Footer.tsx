import React from 'react';
import { Ticket as TicketIcon, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <TicketIcon size={18} />
              </div>
              <span className="text-xl font-bold font-display tracking-tight">VibePass</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your premier destination for discovering and booking the best events in your city. From concerts to tech summits, we've got you covered.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/events" className="hover:text-indigo-400 transition-colors">Explore Events</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/my-tickets" className="hover:text-indigo-400 transition-colors">My Tickets</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Become an Organizer</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-indigo-500" />
                <span>123 Event Street, Tech District<br />San Francisco, CA 94105</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-indigo-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-indigo-500" />
                <span>support@vibepass.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6">Newsletter</h3>
            <p className="text-sm mb-4">Subscribe to get updates on upcoming events and special offers.</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 VibePass Ticketing. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
