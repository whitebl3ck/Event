import React from 'react';

function Offer() {
  return (
    <div id="offer-section" className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20 font-raleway">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-6xl font-bold text-blue-800 mb-6 font-raleway">
            What We Offer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-raleway">
            Comprehensive event management solutions designed to make your events seamless, successful, and memorable.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Event Planning */}
          <div className="group relative">
            <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                             {/* Icon */}
               <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              
              {/* Content */}
              <h3 className="text-3xl font-bold text-gray-900 mb-6 font-raleway">Event Planning</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 font-raleway">
                From concept to execution, we handle every detail of your event planning process with precision and creativity.
              </p>
              
              {/* Features List */}
              <ul className="space-y-4 mb-8">
                                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Strategic planning and timeline management</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Vendor coordination and management</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Budget planning and cost control</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Risk management and contingency planning</span>
                 </li>
              </ul>
              
              {/* CTA Button */}
              <button className="w-full bg-blue-600 hover:bg-gold-500 text-white py-4 rounded-3xl font-semibold text-lg transition-all duration-300 hover:scale-105 font-raleway">
                Learn More
              </button>
            </div>
          </div>

          {/* Event Registration */}
          <div className="group relative">
            <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                             {/* Icon */}
               <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {/* Content */}
              <h3 className="text-3xl font-bold text-gray-900 mb-6 font-raleway">Event Registration</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 font-raleway">
                Streamlined registration systems that make it easy for attendees to sign up and for you to manage participation.
              </p>
              
              {/* Features List */}
              <ul className="space-y-4 mb-8">
                                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Custom registration forms and surveys</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Payment processing and ticket management</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Attendee tracking and analytics</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Automated confirmation and reminders</span>
                 </li>
              </ul>
              
                             {/* CTA Button */}
               <button className="w-full bg-blue-600 hover:bg-gold-500 text-white py-4 rounded-3xl font-semibold text-lg transition-all duration-300 hover:scale-105 font-raleway">
                 Learn More
               </button>
            </div>
          </div>

          {/* Venue Management */}
          <div className="group relative">
            <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                             {/* Icon */}
               <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              {/* Content */}
              <h3 className="text-3xl font-bold text-gray-900 mb-6 font-raleway">Venue Management</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 font-raleway">
                Comprehensive venue solutions including selection, setup, logistics, and on-site management for flawless execution.
              </p>
              
              {/* Features List */}
              <ul className="space-y-4 mb-8">
                                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Venue selection and negotiation</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Layout design and space optimization</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">Technical setup and equipment management</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-black rounded-full"></div>
                   <span className="text-gray-700 font-raleway">On-site coordination and supervision</span>
                 </li>
              </ul>
              
                             {/* CTA Button */}
               <button className="w-full bg-blue-600 hover:bg-gold-500 text-white py-4 rounded-3xl font-semibold text-lg transition-all duration-300 hover:scale-105 font-raleway">
                 Learn More
               </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20">
          <div className="p-12 text-black">
            <h2 className="text-4xl font-bold mb-6 font-raleway">
              Ready to Transform Your Events?
            </h2>
            <p className="text-xl mb-8 opacity-90 font-raleway">
              Let us handle the details while you focus on what matters most - creating unforgettable experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-3xl font-semibold text-lg transition-colors font-raleway">
                Get Started Today
              </button>
              <button className="border-2 border-white text-black hover:bg-white hover:text-blue-600 px-8 py-4 rounded-3xl font-semibold text-lg transition-colors font-raleway">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Offer;