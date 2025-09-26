
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RegisterEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const imageTimer = useRef(null);
  // Image carousel effect
  useEffect(() => {
    if (event?.images && event.images.length > 1) {
      imageTimer.current = setInterval(() => {
        setCurrentImage(prev => (prev + 1) % event.images.length);
      }, 10000);
      return () => clearInterval(imageTimer.current);
    }
    return () => {};
  }, [event]);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    ticketType: '',
    ticketQuantity: 1,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!res.ok) throw new Error('Failed to fetch event');
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    // Calculate total amount based on ticket type and quantity
    if (event && form.ticketType) {
      const pkg = event.ticketPackages?.find(p => p.label === form.ticketType);
      if (pkg) {
        setTotalAmount(pkg.price * form.ticketQuantity);
      } else {
        setTotalAmount(0);
      }
    }
  }, [form.ticketType, form.ticketQuantity, event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    try {
      const payload = {
        event: id,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        ticketType: form.ticketType,
        ticketQuantity: Number(form.ticketQuantity),
        totalAmount: totalAmount,
      };
      const res = await fetch('http://localhost:5000/api/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        if (totalAmount > 0) {
          setShowPayment(true);
        } else {
          setSubmitMessage('Registration successful!');
          setTimeout(() => navigate(`/events/${id}`), 2000);
        }
      } else {
        const err = await res.json();
        setSubmitMessage(err.error || 'Registration failed.');
      }
    } catch (err) {
      setSubmitMessage('Registration failed.');
    }
  };

  if (loading) return <div className="p-8">Loading event info...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!event) return <div className="p-8">Event not found.</div>;

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Images Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-100 p-8">
        {event?.images && event.images.length > 0 ? (
          <img
            src={event.images[currentImage]}
            alt={`Event ${event.name}`}
            className="object-cover rounded-2xl shadow-lg w-full h-96 max-h-[32rem]"
          />
        ) : (
          <div className="text-gray-400 text-xl">No event images available.</div>
        )}
      </div>
      {/* Registration Form Section */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-8 h-screen">
        <div className="bg-white rounded-3xl shadow-xl p-12 pt-8 w-full max-w-4xl relative">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-6 top-6 text-blue-600 hover:text-blue-900 font-semibold flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold mb-6 text-center">Register for {event.name}</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Name</label>
              <input type="text" name="customerName" value={form.customerName} onChange={handleChange} required className="w-full pl-4 pr-4 py-4 text-base border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Enter your name" />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} required className="w-full pl-4 pr-4 py-4 text-base border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Phone</label>
              <input type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange} required className="w-full pl-4 pr-4 py-4 text-base border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Enter your phone number" />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Ticket Type</label>
              <select name="ticketType" value={form.ticketType} onChange={handleChange} required className="w-full pl-4 pr-4 py-4 text-base border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option value="">Select a package</option>
                {event.ticketPackages?.map((pkg, idx) => (
                  <option key={idx} value={pkg.label}>{pkg.label} ({pkg.currency} {pkg.price})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Quantity</label>
              <input type="number" name="ticketQuantity" min={1} value={form.ticketQuantity} onChange={handleChange} required className="w-full pl-4 pr-4 py-4 text-base border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Enter quantity" />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Total Amount</label>
              <div className="p-4 border rounded-2xl bg-gray-50 font-bold">{event.ticketPackages?.find(p => p.label === form.ticketType)?.currency || 'USD'} {totalAmount}</div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              {(totalAmount > 0) ? 'Buy Tickets' : 'Register'}
            </button>
            {submitMessage && <div className="mt-4 text-center text-lg text-blue-700 font-semibold">{submitMessage}</div>}
          </form>
          {/* Payment Modal */}
          {showPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center relative">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setShowPayment(false)}>
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Payment Required</h2>
                <p className="mb-6">Please pay <span className="font-bold">{event.ticketPackages?.find(p => p.label === form.ticketType)?.currency || 'USD'} {totalAmount}</span> to complete your registration.</p>
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-lg transition-colors"
                  onClick={async () => {
                    // Call backend to create Stripe Checkout session
                    try {
                      const res = await fetch('http://localhost:5000/api/stripe/create-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          eventName: event.name,
                          customerEmail: form.customerEmail,
                          amount: totalAmount,
                          currency: event.ticketPackages?.find(p => p.label === form.ticketType)?.currency || 'USD',
                        })
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        setSubmitMessage('Payment failed to initialize.');
                        setShowPayment(false);
                      }
                    } catch (err) {
                      setSubmitMessage('Payment failed to initialize.');
                      setShowPayment(false);
                    }
                  }}
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterEvent;
