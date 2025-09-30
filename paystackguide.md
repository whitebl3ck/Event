# Paystack Integration Implementation Guide

## 🎯 Overview

This guide explains how to use the custom Paystack payment component throughout your EventManager application. The integration provides a seamless payment experience for event registrations with both Paystack and Stripe options.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── PaystackPayment.js      # Main Paystack component
│   │   ├── events/
│   │   │   ├── RegisterEvent.js    # Updated with Paystack
│   │   │   └── EventDetails.js
│   │   └── dashboard/
│   │       └── [other components]
│   ├── .env                        # Environment variables
│   └── App.js                      # Main app with routes

backend/
├── controllers/
│   └── paystack.js                 # Paystack API handlers
├── routes/
│   └── paystack.js                 # Paystack routes
├── models/
│   └── EventRegistration.js       # Updated model
└── .env                           # Backend environment variables
```

---

## 🔧 How the Paystack Component Works

### Core Functionality

The `PaystackPayment` component handles:

1. **Script Loading**: Automatically loads Paystack's JavaScript SDK
2. **Payment Initialization**: Sets up payment configuration
3. **Payment Processing**: Opens Paystack modal for user payment
4. **Verification**: Verifies payment status with backend
5. **Callback Handling**: Returns success/failure results to parent component

### Component Props

```javascript
<PaystackPayment
  email="user@example.com"           // Required: Customer email
  amount={5000}                      // Required: Amount in main currency units
  currency="NGN"                     // Optional: Currency (default: NGN)
  eventName="Conference 2024"        // Optional: Event name for reference
  customerName="John Doe"            // Optional: Customer name
  registrationId="reg_123"           // Optional: Registration ID for tracking
  onSuccess={handleSuccess}          // Required: Success callback function
  onClose={handleClose}              // Required: Close callback function
  publicKey="pk_test_..."            // Optional: Override default public key
  disabled={false}                   // Optional: Disable payment button
/>
```

### Success Callback Response

```javascript
const handleSuccess = (result) => {
  // result object contains:
  {
    reference: "evt_1234567890_abc123",  // Payment reference
    status: "success" | "pending",       // Payment status
    message: "Payment completed successfully!",
    paymentData: { /* Paystack response data */ },
    error: "Error message if any"        // Only if status is pending
  }
};
```

---

## 🚀 Implementation Examples

### 1. Basic Event Registration (Current Implementation)

**File**: `src/components/events/RegisterEvent.js`

```javascript
import PaystackPayment from '../PaystackPayment';

const RegisterEvent = () => {
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  
  const handlePaystackSuccess = (result) => {
    if (result.status === 'success') {
      alert('Payment successful! Registration complete.');
      navigate(`/events/${eventId}`);
    } else {
      alert('Payment submitted. Verification in progress...');
    }
  };

  return (
    <div>
      {/* Registration form */}
      
      {showPayment && paymentMethod === 'paystack' && (
        <PaystackPayment
          email={form.customerEmail}
          amount={totalAmount}
          currency={getCurrentCurrency()}
          eventName={event.name}
          customerName={form.customerName}
          registrationId={registrationId}
          onSuccess={handlePaystackSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};
```

### 2. Venue Booking Payments

**File**: `src/components/venues/BookVenue.js`

```javascript
import React, { useState } from 'react';
import PaystackPayment from '../PaystackPayment';

const BookVenue = ({ venue }) => {
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerEmail: '',
    bookingDate: '',
    duration: 1
  });
  const [showPayment, setShowPayment] = useState(false);

  const calculateAmount = () => {
    return venue.costAmount * bookingData.duration;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Create booking record first
    const booking = await createVenueBooking(bookingData);
    
    if (calculateAmount() > 0) {
      setShowPayment(true);
    } else {
      // Free booking
      completeBooking(booking.id);
    }
  };

  const handlePaymentSuccess = (result) => {
    console.log('Venue booking payment successful:', result);
    alert(`Venue booked successfully! Reference: ${result.reference}`);
    setShowPayment(false);
  };

  return (
    <div className="venue-booking">
      <h2>Book {venue.name}</h2>
      
      <form onSubmit={handleBookingSubmit}>
        {/* Booking form fields */}
        <input
          type="text"
          placeholder="Your Name"
          value={bookingData.customerName}
          onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
          required
        />
        
        <input
          type="email"
          placeholder="Your Email"
          value={bookingData.customerEmail}
          onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})}
          required
        />
        
        <input
          type="date"
          value={bookingData.bookingDate}
          onChange={(e) => setBookingData({...bookingData, bookingDate: e.target.value})}
          required
        />
        
        <input
          type="number"
          min="1"
          placeholder="Duration (days)"
          value={bookingData.duration}
          onChange={(e) => setBookingData({...bookingData, duration: parseInt(e.target.value)})}
          required
        />
        
        <div className="total-cost">
          Total: {venue.costCurrency} {calculateAmount().toLocaleString()}
        </div>
        
        <button type="submit">
          {calculateAmount() > 0 ? 'Proceed to Payment' : 'Book Free Venue'}
        </button>
      </form>

      {showPayment && (
        <div className="payment-modal">
          <PaystackPayment
            email={bookingData.customerEmail}
            amount={calculateAmount()}
            currency={venue.costCurrency}
            eventName={`Venue Booking - ${venue.name}`}
            customerName={bookingData.customerName}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPayment(false)}
          />
        </div>
      )}
    </div>
  );
};
```

### 3. Subscription/Membership Payments

**File**: `src/components/subscription/MembershipPayment.js`

```javascript
import React, { useState } from 'react';
import PaystackPayment from '../PaystackPayment';

const MembershipPayment = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  });

  const membershipPlans = [
    { id: 'basic', name: 'Basic Plan', price: 5000, currency: 'NGN', duration: 'Monthly' },
    { id: 'premium', name: 'Premium Plan', price: 15000, currency: 'NGN', duration: 'Monthly' },
    { id: 'enterprise', name: 'Enterprise Plan', price: 50000, currency: 'NGN', duration: 'Monthly' }
  ];

  const handleMembershipSuccess = (result) => {
    console.log('Membership payment successful:', result);
    
    // Update user membership status
    updateUserMembership(selectedPlan.id, result.reference);
    
    alert(`Welcome to ${selectedPlan.name}! Your membership is now active.`);
  };

  return (
    <div className="membership-payment">
      <h2>Choose Your Membership Plan</h2>
      
      <div className="plans-grid">
        {membershipPlans.map(plan => (
          <div 
            key={plan.id} 
            className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(plan)}
          >
            <h3>{plan.name}</h3>
            <div className="price">{plan.currency} {plan.price.toLocaleString()}</div>
            <div className="duration">{plan.duration}</div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="user-info-form">
          <input
            type="text"
            placeholder="Your Name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
          />
          
          {userInfo.name && userInfo.email && (
            <PaystackPayment
              email={userInfo.email}
              amount={selectedPlan.price}
              currency={selectedPlan.currency}
              eventName={`Membership - ${selectedPlan.name}`}
              customerName={userInfo.name}
              onSuccess={handleMembershipSuccess}
              onClose={() => setSelectedPlan(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};
```

### 4. Multi-Item Cart Payment

**File**: `src/components/cart/CartCheckout.js`

```javascript
import React, { useState } from 'react';
import PaystackPayment from '../PaystackPayment';

const CartCheckout = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Event Ticket - Tech Conference', price: 15000, quantity: 2 },
    { id: 2, name: 'Workshop - React Masterclass', price: 8000, quantity: 1 },
    { id: 3, name: 'Venue Booking - Conference Hall', price: 50000, quantity: 1 }
  ]);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCartPaymentSuccess = (result) => {
    console.log('Cart payment successful:', result);
    
    // Process each cart item
    cartItems.forEach(item => {
      processCartItem(item, result.reference);
    });
    
    // Clear cart
    setCartItems([]);
    
    alert(`Payment successful! Total paid: ₦${calculateTotal().toLocaleString()}`);
  };

  return (
    <div className="cart-checkout">
      <h2>Checkout</h2>
      
      {/* Cart Items */}
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <span className="item-name">{item.name}</span>
            <span className="item-quantity">Qty: {item.quantity}</span>
            <span className="item-total">₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        
        <div className="cart-total">
          <strong>Total: ₦{calculateTotal().toLocaleString()}</strong>
        </div>
      </div>

      {/* Customer Information */}
      <div className="customer-info">
        <input
          type="text"
          placeholder="Full Name"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
          required
        />
      </div>

      {/* Payment */}
      {customerInfo.name && customerInfo.email && cartItems.length > 0 && (
        <PaystackPayment
          email={customerInfo.email}
          amount={calculateTotal()}
          currency="NGN"
          eventName={`Cart Purchase - ${cartItems.length} items`}
          customerName={customerInfo.name}
          onSuccess={handleCartPaymentSuccess}
          onClose={() => console.log('Cart payment cancelled')}
        />
      )}
    </div>
  );
};
```

---

## 🔑 Environment Setup

### Frontend Environment (.env)

Create a `.env` file in your frontend root directory:

```env
# Paystack Configuration
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key_here

# Backend Configuration  
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Backend Environment (.env)

Ensure your backend `.env` includes:

```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here

# Frontend URL (for callbacks)
FRONTEND_URL=http://localhost:3000
```

---

## 🎨 Styling and Customization

### Custom Styling

The component uses Tailwind CSS classes. You can customize the appearance by:

1. **Modifying the component directly** for global changes
2. **Using CSS classes** to override specific styles
3. **Passing custom className props** (you can extend the component)

### Example Custom Styling

```css
/* Custom styles for payment components */
.paystack-payment-custom {
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.paystack-button-custom {
  background: #00C853;
  transition: all 0.3s ease;
}

.paystack-button-custom:hover {
  background: #00A043;
  transform: scale(1.05);
}
```

---

## 🔄 Backend Integration

### Required Backend Endpoints

Ensure these endpoints exist in your backend:

```javascript
// POST /api/paystack/initialize
// GET /api/paystack/verify/:reference
// POST /api/paystack/webhook
// GET /api/paystack/status/:reference
```

### Database Integration

Update your models to track payment methods:

```javascript
// Example: EventRegistration model update
{
  paymentMethod: 'paystack' | 'stripe' | 'manual',
  paymentReference: 'evt_1234567890_abc123',
  paymentStatus: 'pending' | 'paid' | 'failed',
  paystackData: {
    reference: String,
    access_code: String,
    authorization_url: String
  }
}
```

---

## 🧪 Testing

### Test Cards

For testing payments, use these Paystack test cards:

```
✅ Successful Payment: 4084084084084081
❌ Failed Payment: 4084084084084085
⏳ Timeout Payment: 4084084084084077

CVV: Any 3 digits (e.g., 123)
Expiry: Any future date (e.g., 12/25)
PIN: 1234 (for local cards)
```

### Testing Checklist

- [ ] Payment modal opens correctly
- [ ] Test card processes successfully
- [ ] Success callback receives correct data
- [ ] Backend verification works
- [ ] Database updates payment status
- [ ] Error handling works for failed payments
- [ ] Payment modal closes properly

---

## 🚨 Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|--------|----------|
| "Invalid Key" | Wrong/missing public key | Check .env file and Paystack dashboard |
| "Callback must be valid function" | Async callback function | Use regular function, not async |
| "Script not loaded" | Network issues | Check internet connection, retry |
| "Amount required" | Missing/invalid amount | Ensure amount is a number > 0 |
| "Email required" | Missing/invalid email | Validate email format |

### Error Handling Example

```javascript
const handlePaymentError = (error) => {
  console.error('Payment error:', error);
  
  // User-friendly error messages
  const errorMessages = {
    'invalid_key': 'Payment service configuration error. Please contact support.',
    'network_error': 'Network error. Please check your connection and try again.',
    'user_cancelled': 'Payment was cancelled.',
    'insufficient_funds': 'Insufficient funds. Please try a different payment method.',
    'card_declined': 'Card was declined. Please try a different card.'
  };
  
  const userMessage = errorMessages[error.code] || 'Payment failed. Please try again.';
  alert(userMessage);
};
```

---

## 📱 Mobile Responsiveness

The component is mobile-responsive by default, but consider:

1. **Touch-friendly buttons** (minimum 44px height)
2. **Readable text sizes** on small screens
3. **Accessible form inputs** with proper labels
4. **Loading states** for slower connections

---

## 🔐 Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify payments** on the backend
3. **Use HTTPS** in production
4. **Implement webhook verification** for real-time updates
5. **Validate all user inputs** before processing
6. **Log payment attempts** for audit trails
7. **Implement rate limiting** to prevent abuse

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Replace test keys with live keys
- [ ] Update webhook URLs in Paystack dashboard
- [ ] Test with real (small amount) transactions
- [ ] Set up monitoring and logging
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up backup payment methods
- [ ] Test all payment flows end-to-end

### Live Keys Setup

```env
# Production environment
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
```

---

## 💡 Best Practices

1. **Always validate on backend** - Never trust frontend-only validation
2. **Provide clear feedback** - Show loading states and clear success/error messages
3. **Handle edge cases** - Network failures, timeouts, user cancellations
4. **Log everything** - Payment attempts, successes, failures for debugging
5. **Test thoroughly** - With different devices, browsers, and network conditions
6. **Monitor performance** - Track payment completion rates and failure causes
7. **Keep it simple** - Don't overwhelm users with too many payment options

---

## 📞 Support and Troubleshooting

### Getting Help

1. **Check the browser console** for detailed error messages
2. **Use the debug component** to verify environment setup
3. **Test with manual key input** to isolate environment issues
4. **Check Paystack dashboard** for transaction logs
5. **Verify webhook endpoints** are receiving callbacks

### Support Resources

- **Paystack Documentation**: [paystack.com/docs](https://paystack.com/docs)
- **Test Cards**: [paystack.com/docs/payments/test-payments](https://paystack.com/docs/payments/test-payments)
- **Webhook Guide**: [paystack.com/docs/payments/webhooks](https://paystack.com/docs/payments/webhooks)

---

This integration provides a robust, scalable payment solution that can be easily implemented across your entire EventManager application! 🎉