import React, { useState, useEffect } from 'react';

function Categories() {
  const [currentCategory, setCurrentCategory] = useState(0);

  const categories = [
    {
      id: 0,
      title: "Corporate Events",
      icon: "💼",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop",
      description: "Conferences, seminars, team building, and business meetings."
    },
    {
      id: 1,
      title: "Weddings",
      icon: "💍",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      description: "Romantic ceremonies and unforgettable celebrations."
    },
    {
      id: 2,
      title: "Social Gatherings",
      icon: "🎉",
      image: "https://images.unsplash.com/photo-1515165562835-c3b8c9530f89?q=80&w=1600&auto=format&fit=crop",
      description: "Birthdays, anniversaries, and special celebrations."
    },
    {
      id: 3,
      title: "Cultural Events",
      icon: "🎭",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
      description: "Festivals, exhibitions, and cultural celebrations."
    },
    {
      id: 4,
      title: "Sports Events",
      icon: "⚽",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop",
      description: "Tournaments, competitions, and athletic events."
    },
    {
      id: 5,
      title: "Virtual Events",
      icon: "💻",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
      description: "Online conferences, webinars, and digital experiences."
    }
  ];

  // Auto-advance slideshow every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % categories.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [categories.length]);

  const currentCat = categories[currentCategory];

  return (
    <div id="categories-section" className="min-h-screen relative overflow-hidden font-raleway">
      {/* Full-screen Slideshow */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: `url(${currentCat.image})` }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h2 className="text-6xl lg:text-8xl font-bold mb-6 drop-shadow-2xl font-raleway">
              {currentCat.title}
            </h2>
            <p className="text-2xl lg:text-3xl font-medium max-w-4xl mx-auto px-8 drop-shadow-lg font-raleway">
              {currentCat.description}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Icons - Overlapping the slideshow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setCurrentCategory(index)}
              className={`flex flex-col items-center space-y-2 transition-all duration-500 ${
                currentCategory === index 
                  ? 'scale-125 text-gold-500' 
                  : 'text-white hover:text-gold-300 hover:scale-110'
              }`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm transition-all duration-300 ${
                currentCategory === index 
                  ? 'bg-gold-500 text-white shadow-2xl ring-4 ring-white ring-opacity-50' 
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 border-2 border-white border-opacity-30'
              }`}>
                {category.icon}
              </div>
              <span className={`text-sm font-bold drop-shadow-lg font-raleway ${
                currentCategory === index ? 'text-gold-500' : 'text-white'
              }`}>
                {category.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrentCategory((prev) => prev === 0 ? categories.length - 1 : prev - 1)}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all duration-300 hover:scale-110"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={() => setCurrentCategory((prev) => (prev + 1) % categories.length)}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all duration-300 hover:scale-110"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Progress Indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {categories.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                currentCategory === index 
                  ? 'bg-gold-500 scale-125' 
                  : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;