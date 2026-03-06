import React from 'react';
import Hero from '../components/Hero';
import { Features, HowItWorks, Testimonials } from '../components/LandingSections';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleSearch = (q: string) => {
    navigate(`/events?search=${encodeURIComponent(q)}`);
  };

  return (
    <div>
      <Hero onSearch={handleSearch} />
      <Features />
      <HowItWorks />
      <Testimonials />
    </div>
  );
};

export default LandingPage;
