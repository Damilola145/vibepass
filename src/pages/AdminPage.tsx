import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, DollarSign, Image, Tag, User, Plus, Upload, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../constants';
import { CATEGORIES } from '../types';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    category: 'Music',
    image: '',
    organizer: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('location', formData.location);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('organizer', formData.organizer);

    if (useFileUpload && imageFile) {
      data.append('image', imageFile);
    } else if (!useFileUpload && formData.image) {
      data.append('image', formData.image);
    } else {
      setMessage('Please provide an image (URL or File)');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE}/events`, data, { 
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Event created successfully!');
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        price: '',
        category: 'Music',
        image: '',
        organizer: ''
      });
      setImageFile(null);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl p-8 border border-zinc-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <Plus size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-zinc-900">Add New Event</h1>
              <p className="text-zinc-500">Create a new event listing for the platform.</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Summer Jazz Festival"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Organizer</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Vibe Productions"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="Describe the event..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Central Park"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Price (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">₦</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Category</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-700">Event Image</label>
                <div className="flex bg-zinc-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setUseFileUpload(false)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${!useFileUpload ? 'bg-white shadow-sm text-indigo-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                    <div className="flex items-center gap-1">
                      <LinkIcon size={12} /> URL
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseFileUpload(true)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${useFileUpload ? 'bg-white shadow-sm text-indigo-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                    <div className="flex items-center gap-1">
                      <Upload size={12} /> Upload
                    </div>
                  </button>
                </div>
              </div>
              
              {useFileUpload ? (
                <div className="relative">
                  <div className="border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors bg-zinc-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                      <Upload size={32} className="text-zinc-300" />
                      <p className="font-medium">
                        {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required={!useFileUpload}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
