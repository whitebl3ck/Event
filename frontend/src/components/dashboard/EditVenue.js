import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VenueForm from './AddVenue';

const EditVenue = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/venues/${id}`);
        if (!res.ok) throw new Error('Failed to fetch venue');
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!initialData) return null;

  // VenueForm will need to accept initialData and a prop to switch to edit mode
  return <VenueForm initialData={initialData} editMode={true} />;
};

export default EditVenue;
