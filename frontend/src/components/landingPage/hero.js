import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ImageSlideshow({ images, intervalMs = 10000, className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images, intervalMs]);

  const currentSrc = images[currentIndex];
  return (
    <img
      src={currentSrc}
      alt="Event visual"
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
    />
  );
}

function Hero() {
  const topImages = [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515165562835-c3b8c9530f89?q=80&w=1600&auto=format&fit=crop',
  ];
  const bottomImages = [
    'https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
  ];

  const [hovered, setHovered] = useState(null); // 'top' | 'bottom' | null

  const topZ = hovered === 'top' ? 'z-30' : hovered === 'bottom' ? 'z-10' : 'z-20';
  const bottomZ = hovered === 'bottom' ? 'z-30' : hovered === 'top' ? 'z-10' : 'z-10';

  return (
    <section className="min-h-screen flex pt-32 px-10 bg-blue-100 font-raleway">
      <div className="max-w-9xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Section */}
          <div className="space-y-10">
            <h1 className="text-5xl lg:text-8xl font-bold text-blue-800 font-raleway">
              Manage Your Events
              <span className="block text-gold-500">Like a Pro</span>
            </h1>
            <p className="text-3xl text-black leading-loose font-bold font-raleway">
              Streamline your event planning process with our comprehensive management platform. 
              From small gatherings to large conferences, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-gold-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors font-raleway">
                Get Started
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-gold-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors font-raleway">
                Contact Us
              </button>
            </div>
          </div>

          {/* Right Section: Overlapping slideshows */}
          <div className="flex justify-center lg:pr-0">
            <div className="w-full max-w-3xl lg:max-w-5xl">
              <div className="relative h-[40rem]">
                {/* Top Card */}
                <div
                  className={`absolute top-0 left-0 w-[78%] h-[62%] rounded-2xl overflow-hidden shadow-2xl bg-gray-200 ${topZ} transition-transform duration-300 hover:scale-[1.02]`}
                  onMouseEnter={() => setHovered('top')}
                  onMouseLeave={() => setHovered(null)}
                >
                  <ImageSlideshow images={topImages} />
                </div>

                {/* Bottom Card */}
                <div
                  className={`absolute bottom-0 right-0 w-[78%] h-[62%] rounded-2xl overflow-hidden shadow-2xl bg-gray-200 ${bottomZ} transition-transform duration-300 hover:scale-[1.02]`}
                  onMouseEnter={() => setHovered('bottom')}
                  onMouseLeave={() => setHovered(null)}
                >
                  <ImageSlideshow images={bottomImages} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;