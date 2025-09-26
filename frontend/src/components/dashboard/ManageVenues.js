import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VenueDetails'; // Import custom CSS for additional styling if needed

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch venues from API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/venues/mine', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Venues are already sorted by backend (newest first)
          setVenues(data);
        } else if (response.status === 401) {
          setError('Session expired or not authenticated. Please log in again.');
          // Optional: redirect to login after short delay
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else {
          const errText = await response.text();
          setError(`Failed to fetch venues (${response.status}). ${errText || ''}`.trim());
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching venues:', err);
      } finally {
        setLoading(false);
      }
    };

    // Optimistically show just-created venue immediately
    try {
      const cached = sessionStorage.getItem('justCreatedVenue');
      if (cached) {
        const v = JSON.parse(cached);
        setVenues(prev => {
          const exists = prev.some(x => x._id === v._id);
          return exists ? prev : [v, ...prev];
        });
        sessionStorage.removeItem('justCreatedVenue');
      }
    } catch {}

    fetchVenues();
  }, []);

  // Format availability for display
  const formatAvailability = (availability) => {
    if (typeof availability === 'string') {
      return availability;
    }
    
    if (availability?.openDays && availability?.openHours) {
      const days = availability.openDays.length === 7 
        ? 'Daily' 
        : availability.openDays.join(', ');
      const startTime = `${availability.openHours.start} ${availability.openHours.startPeriod}`;
      const endTime = `${availability.openHours.end} ${availability.openHours.endPeriod}`;
      return `${days} | ${startTime} - ${endTime}`;
    }
    
    return 'Not specified';
  };

  // Format services for display
  const getSelectedServices = (services) => {
    const selectedServices = [];
    if (services?.catering) selectedServices.push('Catering');
    if (services?.bar) selectedServices.push('Bar');
    if (services?.decoration) selectedServices.push('Decoration');
    if (services?.cleaning) selectedServices.push('Cleaning');
    if (services?.others && services?.othersDescription) {
      selectedServices.push(services.othersDescription);
    }
    return selectedServices.length > 0 ? selectedServices.join(', ') : 'None';
  };

  // Format technical support
  const getTechnicalSupport = (tech) => {
    const support = [];
    if (tech?.av) support.push('A/V');
    if (tech?.wifi) support.push('WiFi');
    if (tech?.generator) support.push('Generator');
    return support.length > 0 ? support.join(', ') : 'None';
  };

  // Navigate to add venue form
  const handleAddVenue = () => {
    navigate('/dashboard/venues/add');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
          <p className="mt-4 text-gray-600">Loading venues...</p>
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
      {/* Header with Add New Venue Button */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Venues</h1>
            <p className="text-gray-600">View and manage all registered venues</p>
          </div>
          <button
            onClick={handleAddVenue}
            className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Venue
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Total venues: <span className="font-semibold text-gold-600">{venues.length}</span>
          </p>
        </div>
      </div>

     {/* Venues Grid */}
{venues.length === 0 ? (
  <div className="text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">🏢</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
    <p className="text-gray-500 mb-4">Add your first venue to get started.</p>
    <button
      onClick={handleAddVenue}
      className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 inline-flex items-center gap-2"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Your First Venue
    </button>
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
    {venues.map((venue, idx) => (
      <div
        key={`venue-${idx}`}
        className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-xl flex flex-col"
        style={{ minHeight: '420px' }}
      >
        {/* Image */}
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

        {/* Content */}
        <div className="p-8 flex flex-col flex-1">
          <h2 className="text-2xl font-bold mb-3">{venue.name}</h2>
          <p className="text-base text-gray-600 mb-2">
            {venue.location} • Capacity: {venue.capacity}
          </p>
          <p className="text-lg text-blue-900 mb-6 flex-1">{venue.description}</p>

          {/* Actions */}
          <div className="flex gap-4 mt-auto">
            <button
              onClick={() => navigate(`/dashboard/venues/${venue._id}`, { state: { from: 'managevenues' } })}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              View Details
            </button>
            <button onClick={() => navigate(`/dashboard/venues/edit/${venue._id}`)}
              className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
            >
              Edit
            </button>
            <button onClick={async () => {
              if (window.confirm('Are you sure you want to delete this venue?')) {
                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:5000/api/venues/${venue._id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': token ? `Bearer ${token}` : ''
                    }
                  });
                  if (response.ok) {
                    setVenues(vs => vs.filter(v => v._id !== venue._id));
                  } else {
                    alert('Failed to delete venue');
                  }
                } catch {
                  alert('Error deleting venue');
                }
              }
            }}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div> {/* End button group */}
        </div>
      </div>
    ))}
  </div>
 )}
    </div>
  );
}
export default ManageVenues;