import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddEvent from './AddEvent';

const EditEvent = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/events/${id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        if (!res.ok) throw new Error('Failed to fetch event');
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!initialData) return null;

  // AddEvent will need to accept initialData and a prop to switch to edit mode
  return <AddEvent initialData={initialData} editMode={true} />;
};

export default EditEvent;
