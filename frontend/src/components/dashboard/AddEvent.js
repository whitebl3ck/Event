import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddEvent = ({ initialData, editMode }) => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    date: '',
    time: '',
    duration: '',
    durationUnit: 'hours',
    location: '',
    description: '',
    programSchedule: '',
    entryRequirements: '',
    ticketPackages: [],
    ticketLabel: '',
    ticketPrice: '',
    ticketCurrency: 'USD',
    ticketDescription: '',
    audienceSize: '',
    refundPolicy: '',
    showRefundPolicy: false,
    services: {
      showSpecialGuests: false,
      specialGuests: '',
      showCatering: false,
      catering: '',
      showParking: false,
      parking: '',
      showAccommodation: false,
      accommodation: '',
      others: false,
      othersDescription: ''
    },
    images: []
  });

  useEffect(() => {
    if (editMode && initialData) {
      // Pre-fill form with initialData
      setForm(prev => ({
        ...prev,
        ...initialData,
        duration: initialData.duration ? (typeof initialData.duration === 'string' ? initialData.duration.split(' ')[0] : initialData.duration) : '',
        durationUnit: initialData.duration ? (typeof initialData.duration === 'string' ? initialData.duration.split(' ')[1] || 'hours' : 'hours') : 'hours',
        ticketPackages: initialData.ticketPackages || [],
        services: initialData.services || prev.services,
        images: [] // don't prefill images
      }));
    }
  }, [editMode, initialData]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'images') {
      setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
    } else if (name.startsWith('services.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        services: {
          ...prev.services,
          [key]: type === 'checkbox' ? checked : value,
          ...(key === 'showSpecialGuests' && !checked ? { specialGuests: '' } : {}),
          ...(key === 'showCatering' && !checked ? { catering: '' } : {}),
          ...(key === 'showParking' && !checked ? { parking: '' } : {}),
          ...(key === 'showAccommodation' && !checked ? { accommodation: '' } : {}),
          ...(key === 'others' && !checked ? { othersDescription: '' } : {})
        }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Ticket package add
  const handleAddTicketPackage = (e) => {
    e.preventDefault();
    if (!form.ticketLabel || !form.ticketPrice) return;
    setForm((prev) => ({
      ...prev,
      ticketPackages: [
        ...prev.ticketPackages,
        {
          label: prev.ticketLabel,
          price: Number(prev.ticketPrice),
          currency: prev.ticketCurrency || 'USD',
          description: prev.ticketDescription
        }
      ],
      ticketLabel: '',
      ticketPrice: '',
      ticketCurrency: 'USD',
      ticketDescription: ''
    }));
  };

  const handleRemoveTicketPackage = (idx) => {
    setForm((prev) => ({
      ...prev,
      ticketPackages: prev.ticketPackages.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'ticketPackages') {
          formData.append('ticketPackages', JSON.stringify(value));
        } else if (key === 'images') {
          value.forEach((file) => formData.append('images', file));
        } else if (key === 'services') {
          formData.append('services', JSON.stringify(value));
        } else if (['ticketLabel','ticketPrice','ticketDescription','durationUnit'].includes(key)) {
          // skip temp ticket fields and durationUnit
        } else if (key === 'duration') {
          // combine duration and durationUnit
          formData.append('duration', value + (form.durationUnit ? ' ' + form.durationUnit : ''));
        } else {
          formData.append(key, value);
        }
      });
      let response;
      if (editMode && initialData && initialData._id) {
        response = await fetch(`http://localhost:5000/api/events/${initialData._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: formData
        });
      } else {
        response = await fetch('http://localhost:5000/api/events', {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: formData
        });
      }
      if (response.ok) {
        navigate('/dashboard/events');
      } else {
        const err = await response.json();
        setError(err.error || (editMode ? 'Failed to update event' : 'Failed to create event'));
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Event</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Event Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Type of Event</label>
          <select name="type" value={form.type} onChange={handleChange} required className="w-full border rounded px-3 py-2">
            <option value="">Select type</option>
            <option value="social gathering">Social Gathering</option>
            <option value="corporate">Corporate</option>
            <option value="wedding">Wedding</option>
            <option value="cultural">Cultural</option>
            <option value="sport">Sport</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Date</label>
            <input type="date" name="date" value={form.date ? form.date.slice(0,10) : ''} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Time</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Duration</label>
            <div className="flex gap-2">
              <input type="number" min="1" name="duration" value={form.duration} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Enter value" />
              <select name="durationUnit" value={form.durationUnit} onChange={handleChange} required className="border rounded px-3 py-2">
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Program Schedule</label>
          <textarea name="programSchedule" value={form.programSchedule} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Outline the event schedule" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Entry Requirements</label>
          <textarea name="entryRequirements" value={form.entryRequirements} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Tickets, invitations, age, dress code, etc." />
        </div>
        <div>
          <label className="block font-semibold mb-1">Ticket Price/Packages</label>
          <div className="flex gap-2 mb-2">
            <input type="text" name="ticketLabel" value={form.ticketLabel} onChange={handleChange} placeholder="Label (e.g. Early Bird)" className="border rounded px-2 py-1 flex-1" />
            <input type="number" name="ticketPrice" value={form.ticketPrice} onChange={handleChange} placeholder="Price" className="border rounded px-2 py-1 flex-1" />
            <select name="ticketCurrency" value={form.ticketCurrency} onChange={handleChange} className="border rounded px-2 py-1 flex-1">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="NGN">NGN</option>
            </select>
            <input type="text" name="ticketDescription" value={form.ticketDescription} onChange={handleChange} placeholder="Description (optional)" className="border rounded px-2 py-1 flex-2" />
            <button onClick={handleAddTicketPackage} className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
          </div>
          {form.ticketPackages.length > 0 && (
            <ul className="list-disc ml-6">
              {form.ticketPackages.map((pkg, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {pkg.label} - {pkg.price} {pkg.currency} {pkg.description && `(${pkg.description})`}
                  <button type="button" onClick={() => handleRemoveTicketPackage(idx)} className="ml-2 text-red-600 hover:underline">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Audience Size</label>
          <input type="number" name="audienceSize" value={form.audienceSize} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <fieldset className="border rounded p-4 mb-4">
          <legend className="font-semibold text-lg mb-2">Event Services</legend>
          <div className="mb-2">
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" name="services.showSpecialGuests" checked={form.services.showSpecialGuests} onChange={handleChange} />
              Special Guests/Performers
            </label>
            {form.services.showSpecialGuests && (
              <input type="text" name="services.specialGuests" value={form.services.specialGuests} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-2" />
            )}
          </div>
          <div className="mb-2">
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" name="services.showCatering" checked={form.services.showCatering} onChange={handleChange} />
              Catering/Refreshments
            </label>
            {form.services.showCatering && (
              <input type="text" name="services.catering" value={form.services.catering} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-2" placeholder="Will food and drinks be available/included?" />
            )}
          </div>
          <div className="mb-2">
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" name="services.showParking" checked={form.services.showParking} onChange={handleChange} />
              Parking & Transportation
            </label>
            {form.services.showParking && (
              <input type="text" name="services.parking" value={form.services.parking} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-2" placeholder="Parking, shuttle, etc." />
            )}
          </div>
          <div className="mb-2">
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" name="services.showAccommodation" checked={form.services.showAccommodation} onChange={handleChange} />
              Accommodation
            </label>
            {form.services.showAccommodation && (
              <input type="text" name="services.accommodation" value={form.services.accommodation} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-2" placeholder="Hotel partnerships, nearby lodging, etc." />
            )}
          </div>
          <div className="mb-2">
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" name="services.others" checked={form.services.others} onChange={handleChange} />
              Other Services
            </label>
            {form.services.others && (
              <input type="text" name="services.othersDescription" value={form.services.othersDescription} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-2" placeholder="Describe other services" />
            )}
          </div>
        </fieldset>
        <div>
          <label className="block font-semibold mb-1 flex items-center gap-2">
            <input type="checkbox" name="showRefundPolicy" checked={form.showRefundPolicy} onChange={e => setForm(f => ({ ...f, showRefundPolicy: e.target.checked, refundPolicy: e.target.checked ? f.refundPolicy : '' }))} />
            Refund & Cancellation Policy
          </label>
          {form.showRefundPolicy && (
            <textarea name="refundPolicy" value={form.refundPolicy} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-2" placeholder="If the event is postponed/cancelled, etc." />
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Images</label>
          <input type="file" name="images" accept="image/*" multiple onChange={handleChange} className="w-full" />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full">
          {loading ? (editMode ? 'Saving...' : 'Creating...') : (editMode ? 'Save' : 'Create Event')}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
