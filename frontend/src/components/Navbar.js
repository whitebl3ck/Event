import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 font-raleway bg-white">
      <div className="max-w-9xl mx-auto px-auto sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo/Brand - Moved further left */}
          <div className="flex items-center">
            <Link to="/" className="text-4xl font-bold text-blue-800 hover:text-blue-900 transition-colors">
              EventManager
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-baseline space-x-4">
              <button
                onClick={() => scrollToSection('goals-section')}
                className={`text-2xl px-3 py-2 rounded-md font-medium transition-colors text-blue-700 hover:text-gold-500`}
              >
                Our Goals
              </button>
              <button
                onClick={() => scrollToSection('categories-section')}
                className={`px-3 py-2 rounded-md text-2xl font-medium transition-colors text-blue-700 hover:text-gold-500`}
              >
                Categories
              </button>
              <button
                onClick={() => scrollToSection('offer-section')}
                className={`px-3 py-2 rounded-md text-2xl font-medium transition-colors text-blue-700 hover:text-gold-500`}
              >
                What We Offer
              </button>
              <button
                onClick={() => scrollToSection('contact-section')}
                className={`px-3 py-2 rounded-md text-2xl font-medium transition-colors text-blue-700 hover:text-gold-500`}
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Action Buttons - Right Side */}
          <div className="hidden md:flex items-center space-x-4 px-4">
            <Link 
              to="/login"
              className="text-blue-700 hover:text-gold-500 px-4 py-2 text-lg font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              className="bg-blue-600 hover:bg-gold-500 text-white px-6 py-2 rounded-3xl text-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-blue-700 hover:text-blue-900 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;