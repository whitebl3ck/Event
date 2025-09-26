import React from 'react';

function Goals() {
  return (
    <div id="goals-section" className="min-h-screen bg-gray-50 py-20 font-raleway">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-blue-800 mb-6">
            Our Goals
          </h1>
          <p className="text-2xl text-black max-w-3xl mx-auto">
            We're committed to revolutionizing event management through innovative solutions and exceptional service.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Goal 1 */}
          <div className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Streamline Planning</h3>
            <p className="text-gray-600 leading-relaxed font-semibold text-xl">
              Simplify event planning with intuitive tools and automated workflows.
            </p>
          </div>

          {/* Goal 2 */}
          <div className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Enhance Security</h3>
            <p className="text-gray-600 leading-relaxed font-semibold text-xl">
              Provide robust security measures for safe event management.
            </p>
          </div>

          {/* Goal 3 */}
          <div className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Build Community</h3>
            <p className="text-gray-600 leading-relaxed font-semibold text-xl">
              Foster meaningful connections and create memorable experiences.
            </p>
          </div>

          {/* Goal 4 */}
          <div className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Drive Growth</h3>
            <p className="text-gray-600 leading-relaxed font-semibold text-xl">
              Enable businesses to scale events and expand their reach.
            </p>
          </div>

          {/* Goal 5 */}
          <div className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Deliver Excellence</h3>
            <p className="text-gray-600 leading-relaxed font-semibold text-xl">
              Maintain highest standards to exceed expectations.
            </p>
          </div>

          {/* Goal 6 */}
          <div className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovate Constantly</h3>
            <p className="text-gray-600 leading-relaxed font-semibold text-xl">
              Stay ahead with cutting-edge technology and features.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Ready to achieve these goals together?
          </p>
          <button className="bg-blue-600 hover:bg-gold-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}

export default Goals;