import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './VenueDetails';

function Search() {
  // Dummy user profile data
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [searchCategory, setSearchCategory] = useState('venues');
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();
  const user = storedUser || {
    firstName: "User",
    role: "Event Planner",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  const displayName = (() => {
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    if (full) return full;
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  })();

  const userEmail = user?.email || '';

  const initials = (() => {
    const source = displayName || 'User';
    const parts = source.trim().split(/\s+/);
    const first = parts[0]?.[0] || 'U';
    const second = parts[1]?.[0] || '';
    return (first + second).toUpperCase();
  })();

  // Fetch venues from API
  const fetchVenues = async (qParam) => {
    try {
      setLoading(true);
      const url = new URL('http://localhost:5000/api/venues');
      const q = typeof qParam === 'string' ? qParam : searchQuery;
      if (q && q.trim()) url.searchParams.set('q', q.trim());
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        // Venues are already sorted by backend (newest first)
        setVenues(data);
        setError('');
      } else {
        setError('Failed to fetch venues');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events from API
  const fetchEvents = async (qParam) => {
    try {
      setLoading(true);
      const url = new URL('http://localhost:5000/api/events');
      const q = typeof qParam === 'string' ? qParam : searchQuery;
      if (q && q.trim()) url.searchParams.set('q', q.trim());
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setError('');
      } else {
        setError('Failed to fetch events');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
    fetchEvents();
  }, []);

  // Debounce venue search when typing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchCategory === 'venues') {
        fetchVenues(searchQuery);
      } else if (searchCategory === 'events') {
        fetchEvents(searchQuery);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, searchCategory]);

  // Initialize from URL params on mount
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const qParam = searchParams.get('q');
    if (typeParam === 'events' || typeParam === 'venues') {
      setSearchCategory(typeParam);
    }
    if (qParam !== null) {
      setSearchQuery(qParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync with category and query
  useEffect(() => {
    const params = {};
    if (searchCategory) params.type = searchCategory;
    if (searchQuery.trim()) params.q = searchQuery;
    setSearchParams(params, { replace: true });
  }, [searchCategory, searchQuery, setSearchParams]);

  // Filter venues by search query
  const filteredVenues = venues.filter((venue) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (venue.name || '').toLowerCase();
    const location = (venue.location || '').toLowerCase();
    const description = (venue.description || '').toLowerCase();
    const capacityStr = String(venue.capacity || '');
    return (
      name.includes(q) ||
      location.includes(q) ||
      description.includes(q) ||
      capacityStr.includes(q)
    );
  });

  // Dummy event data with images



  return (
    <div className="p-8 bg-white flex-1 text-blue-900">
      <div className="flex items-center justify-between mb-8">
        {/* Welcome Message */}
        <div className=" rounded-2xl p-8 flex-1 mr-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {displayName}!</h1>
          <p className="text-lg text-blue-700">Find and manage your events easily.</p>
        </div>
        {/* User Profile */}
        <div className="flex flex-col items-center  rounded-2xl p-6 w-56 ">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-blue-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full mb-4 border-4 border-blue-200 bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>
          )}
          <span className="text-xl font-bold">{displayName}</span>
          <span className="text-blue-600 text-base">{userEmail || user.role}</span>
        </div>
      </div>
      <div className="flex justify-center pb-5">
        <div className="w-1/2 relative mb-8 mr-4">
          <input
            type="text"
            placeholder="Search venues by name or location"
            className="w-full p-4 border border-gray-300 rounded-xl pr-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={() => {
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
              if (searchCategory === 'venues') {
                fetchVenues(searchQuery);
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-600 transition-colors"
            aria-label="Search"
            title="Search"
          >
            <svg className="w-7 h-7 pr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </button>
        </div>
        <div className="mb-8">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="h-full p-4 border border-gray-300 rounded-xl text-gray-700 bg-white"
          >
            <option value="venues">Venues</option>
            <option value="events">Events</option>
          </select>
        </div>
      </div>
      {/* Results */}
      {searchCategory === 'events' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching events</h3>
              <p className="text-gray-500">Try a different search term or clear the search.</p>
            </div>
          ) : (
            events.map((event, idx) => (
              <div
                key={`event-${idx}`}
                className="bg-blue-50 border border-blue-200 rounded-2xl shadow-xl flex flex-col"
                style={{ minHeight: '420px' }}
              >
                {/* Image */}
                {event.images && event.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${event.images[0]}`}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-2xl flex items-center justify-center text-4xl">
                    🎉
                  </div>
                )}

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="text-2xl font-bold mb-3">{event.name}</h2>
                  <p className="text-base text-gray-600 mb-2">
                    {event.location} • Capacity: {event.capacity}
                  </p>
                  <p className="text-lg text-blue-900 mb-6 flex-1">{event.description}</p>
                  <div className="flex gap-4 mt-auto">
                    <button onClick={() => navigate(`/dashboard/events/${event._id}`)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    <button 
                      onClick={() => navigate(`/events/${event._id}/register`)}
                      className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-colors">
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
              <p className="mt-4 text-gray-600">Loading venues...</p>
            </div>
          ) : error ? (
            <div className="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching venues</h3>
              <p className="text-gray-500">Try a different search term or clear the search.</p>
            </div>
          ) : (
            filteredVenues.map((venue, idx) => (
              <div
                key={`venue-${idx}`}
                className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-xl flex flex-col"
                style={{ minHeight: '420px' }}
              >
                {venue.images && venue.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${venue.images[0]}`}
                    alt={venue.name}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-2xl flex items-center justify-center text-4xl">
                    🏢
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="text-2xl font-bold mb-3">{venue.name}</h2>
                  <p className="text-base text-gray-600 mb-2">{venue.location} • Capacity: {venue.capacity}</p>
                  <p className="text-lg text-blue-900 mb-6 flex-1">{venue.description}</p>
                  <div className="flex gap-4 mt-auto">
                    <button
                      onClick={() => navigate(`/dashboard/venues/${venue._id}`, { state: { from: 'search' } })}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Search;