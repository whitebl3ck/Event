import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/venues/${id}`);
        if (!res.ok) throw new Error('Failed to fetch venue');
        const data = await res.json();
        setVenue(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div className=" mx-auto p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
          <p className="mt-4 text-gray-600">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className=" mx-auto p-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Venue not found</h3>
          <p className="text-gray-500">The venue you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-8 bg-white">
      {/* Back button */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gold-600 hover:text-gold-700 transition-colors duration-200 mb-6"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Venues
        </button>

        {/* Header */}
        <div className="shadow-lg rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{venue.name}</h1>
          <p className="text-xl text-gray-600 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {venue.location}
          </p>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
        {venue.images && venue.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venue.images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={`http://localhost:5000${img}`}
                  alt={`${venue.name} - Image ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-gray-400 text-4xl mb-2">📷</div>
              <p className="text-gray-500">No images available</p>
            </div>
          </div>
        )}
      </div>

      {/* Venue Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              About This Venue
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">{venue.description}</p>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              In-House Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(venue.inHouseServices || {}).map(([key, value]) => {
                if (!value) return null;
                const serviceName = key === 'others' ? venue.inHouseServices.othersDescription : key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <div key={key} className="flex items-center gap-2 p-3 bg-gold-50 rounded-xl">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">{serviceName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Support */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Technical Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(venue.technicalSupport || {}).map(([key, value]) => {
                if (!value) return null;
                const techName = key === 'av' ? 'Audio/Visual' : key.toUpperCase();
                return (
                  <div key={key} className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">{techName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rules */}
          {venue.rules && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Rules & Regulations
              </h2>
              <p className="text-gray-700 leading-relaxed">{venue.rules}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Capacity */}
          <div className="bg-gradient-to-br from-gold-50 to-yellow-50 rounded-2xl shadow-lg p-6 border border-gold-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Capacity
            </h3>
            <p className="text-2xl font-bold text-gold-700">{venue.capacity} guests</p>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Pricing
            </h3>
            <p className="text-2xl font-bold text-green-700">
              {venue.costCurrency} {venue.costAmount}
            </p>
            <p className="text-sm text-gray-600 mt-1">({venue.costType})</p>
          </div>

          {/* Availability */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Availability
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Open Days</p>
                <p className="text-gray-800">{venue.availability.openDays.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Hours</p>
                <p className="text-gray-800">
                  {venue.availability.openHours.start} - {venue.availability.openHours.end}
                </p>
              </div>
            </div>
          </div>

          {/* Parking */}
          {venue.parkingAvailable && (
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl shadow-lg p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Parking
              </h3>
              <p className="text-lg font-bold text-purple-700">
                {venue.parkingSpaces > 0 ? `${venue.parkingSpaces} spaces` : 'Available'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {(location.state?.from !== 'managevenues') && (
            <div className="space-y-3">
              <button className="w-full bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Venue
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
