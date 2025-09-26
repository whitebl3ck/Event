import React from 'react';
import Navbar from '../Navbar';
import Hero from './hero';
import Goals from './goals';
import Categories from './categories';
import Offer from './offer';
import Contact from './contact';

function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar at the top */}
      <Navbar />
      <Hero />
      <Goals />
      <Categories />
      <Offer />
      <Contact />
    </div>
  );
}

export default LandingPage;
