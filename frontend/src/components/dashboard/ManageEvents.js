import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/events/mine', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else if (response.status === 401) {
          setError('Session expired or not authenticated. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else {
          const errText = await response.text();
          setError(`Failed to fetch events (${response.status}). ${errText || ''}`.trim());
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [navigate]);

  // Navigate to add event form (to be implemented)
  const handleAddEvent = () => {
    navigate('/dashboard/events/add');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {/* Header with Add New Event Button */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Events</h1>
            <p className="text-gray-600">View and manage all your planned events</p>
          </div>
          <button
            onClick={handleAddEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Event
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Total events: <span className="font-semibold text-blue-600">{events.length}</span>
          </p>
        </div>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500 mb-4">Add your first event to get started.</p>
          <button
            onClick={handleAddEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 inline-flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {events.map((event, idx) => (
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
                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/events/edit/${event._id}`)}
                    className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this event?')) {
                        try {
                          const token = localStorage.getItem('token');
                          const res = await fetch(`http://localhost:5000/api/events/${event._id}`, {
                            method: 'DELETE',
                            headers: {
                              'Authorization': token ? `Bearer ${token}` : ''
                            }
                          });
                          if (res.ok) {
                            setEvents(prev => prev.filter(e => e._id !== event._id));
                          } else {
                            alert('Failed to delete event.');
                          }
                        } catch (err) {
                          alert('Error deleting event.');
                        }
                      }
                    }}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
