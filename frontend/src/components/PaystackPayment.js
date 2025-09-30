import React, { useState, useEffect } from 'react';

const PaystackPayment = ({ 
  email, 
  amount, 
  currency, 
  eventName, 
  customerName,
  registrationId,
  onSuccess, 
  onClose,
  publicKey,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Load Paystack script
  useEffect(() => {
    // Check if Paystack is already loaded
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Paystack script loaded successfully');
      setPaystackLoaded(true);
      setLoadError(false);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Paystack script');
      setLoadError(true);
      setPaystackLoaded(false);
    };

    // Add script to document
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializePayment = async () => {
    if (disabled || isProcessing || !paystackLoaded) return;
    
    setIsProcessing(true);

    try {
      // Generate unique reference
      const reference = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('🚀 Initializing Paystack payment:', {
        email,
        amount,
        currency,
        reference
      });

      // Optional: Initialize on backend first
      try {
        const initResponse = await fetch('http://localhost:5000/api/paystack/initialize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            amount,
            currency: currency || 'NGN',
            eventName,
            customerName,
            registrationId
          })
        });

        const initData = await initResponse.json();
        console.log('Backend initialization response:', initData);
      } catch (backendError) {
        console.warn('Backend initialization failed, continuing with direct payment:', backendError);
      }

      // Configure Paystack
      const paystackConfig = {
        key: publicKey || process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: Math.round(amount * 100), // Convert to kobo/cents
        currency: currency || 'NGN',
        ref: reference,
        metadata: {
          eventName: eventName || 'Event Registration',
          customerName: customerName || 'Customer',
          registrationId: registrationId || 'N/A',
          custom_fields: [
            {
              display_name: "Event Name",
              variable_name: "event_name",
              value: eventName || 'Event Registration'
            },
            {
              display_name: "Customer Name", 
              variable_name: "customer_name",
              value: customerName || 'Customer'
            }
          ]
        },
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        
        callback: function(response) {
          console.log('✅ Payment callback received:', response);
          setIsProcessing(false);
          
          // Handle payment verification
          const handleVerification = async () => {
            try {
              // Verify payment on backend
              const verifyResponse = await fetch(`http://localhost:5000/api/paystack/verify/${response.reference}`);
              const verifyData = await verifyResponse.json();
              
              console.log('Payment verification result:', verifyData);
              
              if (verifyData.status && verifyData.data?.status === 'success') {
                onSuccess({
                  reference: response.reference,
                  status: 'success',
                  message: 'Payment completed successfully!',
                  paymentData: verifyData.data
                });
              } else {
                // Even if verification fails, we got a successful callback
                onSuccess({
                  reference: response.reference,
                  status: 'pending',
                  message: 'Payment submitted successfully. Verification in progress...',
                  paymentData: response
                });
              }
            } catch (verifyError) {
              console.error('Payment verification error:', verifyError);
              // Still count as success since we got the callback
              onSuccess({
                reference: response.reference,
                status: 'pending', 
                message: 'Payment submitted. Verification in progress...',
                error: verifyError.message
              });
            }
          };
          
          // Call verification
          handleVerification();
        },
        
        onClose: function() {
          console.log('💭 Payment dialog closed by user');
          setIsProcessing(false);
          if (onClose) onClose();
        }
      };

      console.log('🔧 Paystack config:', paystackConfig);

      // Launch Paystack popup
      const handler = window.PaystackPop.setup(paystackConfig);
      handler.openIframe();

    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      setIsProcessing(false);
      alert(`Payment Error: ${error.message}`);
    }
  };

  // Loading state
  if (loadError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Payment Service Unavailable</span>
          </div>
          <p className="text-sm text-red-700 mt-1">
            Unable to load payment service. Please check your internet connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!paystackLoaded) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">Loading Paystack...</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Setting up secure payment service
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Method Info */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-green-800">Paystack Payment</h3>
        </div>
        <p className="text-sm text-green-700">
          Secure payment with cards, bank transfer, USSD, and mobile money
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="px-2 py-1 bg-white rounded text-xs text-green-700 border border-green-300">💳 Card</span>
          <span className="px-2 py-1 bg-white rounded text-xs text-green-700 border border-green-300">🏦 Bank Transfer</span>
          <span className="px-2 py-1 bg-white rounded text-xs text-green-700 border border-green-300">📱 USSD</span>
          <span className="px-2 py-1 bg-white rounded text-xs text-green-700 border border-green-300">💰 Mobile Money</span>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Payment Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Event:</span>
            <span className="text-gray-800 text-right flex-1 ml-2">{eventName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="text-gray-800 font-semibold">{currency || 'NGN'} {amount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="text-gray-800 text-right flex-1 ml-2 truncate">{email}</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={initializePayment}
        disabled={disabled || isProcessing || !email || !amount || !paystackLoaded}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
          disabled || isProcessing || !email || !amount || !paystackLoaded
            ? 'bg-gray-400 cursor-not-allowed text-gray-200'
            : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pay with Paystack
          </>
        )}
      </button>

      {/* Security Notice */}
      <p className="text-xs text-gray-500 text-center">
        🔒 Your payment is secured by Paystack's industry-standard encryption
      </p>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer">Debug Info</summary>
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
            <div>Public Key: {publicKey || process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ? 'Set' : 'Missing'}</div>
            <div>Paystack Loaded: {paystackLoaded ? 'Yes' : 'No'}</div>
            <div>Amount: {amount} {currency}</div>
            <div>Email: {email}</div>
          </div>
        </details>
      )}
    </div>
  );
};

export default PaystackPayment;