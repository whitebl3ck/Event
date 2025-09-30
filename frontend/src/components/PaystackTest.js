import React, { useState } from 'react';
import PaystackPayment from './PaystackPayment';

const PaystackTest = () => {
  const [testData, setTestData] = useState({
    email: 'test@example.com',
    amount: 1000,
    currency: 'NGN',
    eventName: 'Test Event',
    customerName: 'Test Customer'
  });

  const [result, setResult] = useState(null);

  const handleSuccess = (paymentData) => {
    setResult({ type: 'success', data: paymentData });
  };

  const handleClose = () => {
    setResult({ type: 'closed', message: 'Payment dialog was closed' });
  };

  const resetTest = () => {
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Paystack Integration Test</h1>
        
        {/* Test Data Form */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={testData.email}
              onChange={(e) => setTestData({...testData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={testData.amount}
                onChange={(e) => setTestData({...testData, amount: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={testData.currency}
                onChange={(e) => setTestData({...testData, currency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="GHS">GHS</option>
                <option value="KES">KES</option>
                <option value="ZAR">ZAR</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              value={testData.customerName}
              onChange={(e) => setTestData({...testData, customerName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
            <input
              type="text"
              value={testData.eventName}
              onChange={(e) => setTestData({...testData, eventName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Test Results */}
        {result && (
          <div className={`mb-6 p-4 rounded-lg ${
            result.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              result.type === 'success' ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {result.type === 'success' ? '✅ Payment Successful!' : '⚠️ Payment Closed'}
            </h3>
            
            {result.type === 'success' ? (
              <div className="space-y-2 text-sm">
                <div><strong>Reference:</strong> {result.data.reference}</div>
                <div><strong>Status:</strong> {result.data.status}</div>
                <div><strong>Message:</strong> {result.data.message}</div>
                {result.data.paymentData && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Payment Details</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result.data.paymentData, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ) : (
              <p className="text-sm text-yellow-700">{result.message}</p>
            )}
            
            <button
              onClick={resetTest}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset Test
            </button>
          </div>
        )}

        {/* Paystack Payment Component */}
        {!result && (
          <PaystackPayment
            email={testData.email}
            amount={testData.amount}
            currency={testData.currency}
            eventName={testData.eventName}
            customerName={testData.customerName}
            onSuccess={handleSuccess}
            onClose={handleClose}
            publicKey={process.env.REACT_APP_PAYSTACK_PUBLIC_KEY}
          />
        )}

        {/* Test Card Information */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">🧪 Test Card Information</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div><strong>Successful Payment:</strong> 4084084084084081</div>
            <div><strong>Failed Payment:</strong> 4084084084084085</div>
            <div><strong>CVV:</strong> Any 3 digits</div>
            <div><strong>Expiry:</strong> Any future date</div>
            <div><strong>PIN:</strong> 1234 (for local cards)</div>
          </div>
        </div>

        {/* Environment Check */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Environment Status</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Paystack Public Key:</span>
              <span className={process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ? 'text-green-600' : 'text-red-600'}>
                {process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Backend Server:</span>
              <span className="text-blue-600">http://localhost:5000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackTest;