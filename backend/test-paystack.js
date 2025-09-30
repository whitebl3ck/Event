// test-paystack.js
// Run this file with: node test-paystack.js

const https = require('https');
require('dotenv').config();

console.log('🧪 Testing Paystack Backend Integration...\n');

// Test 1: Check if environment variables are set
console.log('📋 Environment Variables Check:');
console.log('PAYSTACK_SECRET_KEY:', process.env.PAYSTACK_SECRET_KEY ? '✅ Set' : '❌ Missing');
console.log('PAYSTACK_PUBLIC_KEY:', process.env.PAYSTACK_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
console.log('PAYSTACK_WEBHOOK_SECRET:', process.env.PAYSTACK_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');
console.log('');

if (!process.env.PAYSTACK_SECRET_KEY) {
  console.log('❌ Please set your PAYSTACK_SECRET_KEY in .env file');
  process.exit(1);
}

// Test 2: Initialize a test transaction
console.log('🚀 Testing Transaction Initialization...');

const testTransactionData = JSON.stringify({
  email: 'test@example.com',
  amount: 500000, // 5000 NGN in kobo
  currency: 'NGN',
  reference: `test_${Date.now()}`,
  metadata: {
    eventName: 'Backend Test Event',
    customerName: 'Test User'
  }
});

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.status) {
        console.log('✅ Transaction initialization successful!');
        console.log('📊 Response data:');
        console.log('   Reference:', response.data.reference);
        console.log('   Access Code:', response.data.access_code);
        console.log('   Authorization URL:', response.data.authorization_url);
        console.log('');
        
        // Test 3: Verify the transaction (should return pending)
        testTransactionVerification(response.data.reference);
      } else {
        console.log('❌ Transaction initialization failed:');
        console.log('   Message:', response.message);
        console.log('   Full response:', JSON.stringify(response, null, 2));
      }
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
      console.log('   Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
  console.log('');
  console.log('💡 Possible issues:');
  console.log('   - Check your internet connection');
  console.log('   - Verify your PAYSTACK_SECRET_KEY is correct');
  console.log('   - Ensure the key starts with sk_test_ or sk_live_');
});

req.write(testTransactionData);
req.end();

// Function to test transaction verification
function testTransactionVerification(reference) {
  console.log('🔍 Testing Transaction Verification...');
  
  const verifyOptions = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    }
  };

  const verifyReq = https.request(verifyOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (response.status) {
          console.log('✅ Transaction verification successful!');
          console.log('📊 Transaction status:', response.data.status);
          console.log('💰 Amount:', response.data.amount / 100, response.data.currency);
          console.log('📧 Customer email:', response.data.customer.email);
        } else {
          console.log('⚠️  Transaction not found (expected for test)');
          console.log('   Message:', response.message);
        }
        
        console.log('');
        console.log('🎉 Backend integration test completed!');
        console.log('');
        console.log('📝 Next steps:');
        console.log('   1. The backend can communicate with Paystack ✅');
        console.log('   2. Transaction initialization works ✅');
        console.log('   3. Ready for frontend integration 🚀');
        
      } catch (error) {
        console.log('❌ Error parsing verification response:', error.message);
      }
    });
  });

  verifyReq.on('error', (error) => {
    console.log('❌ Verification request error:', error.message);
  });

  verifyReq.end();
}

// Test 4: Check if server endpoints are accessible (if server is running)
function testServerEndpoints() {
  console.log('🌐 Testing local server endpoints...');
  
  const testInitialize = JSON.stringify({
    email: 'test@example.com',
    amount: 1000,
    currency: 'NGN',
    eventName: 'Test Event',
    customerName: 'Test Customer'
  });

  const serverOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/paystack/initialize',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const serverReq = https.request(serverOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('✅ Local server endpoint accessible');
      console.log('📊 Response:', JSON.parse(data));
    });
  });

  serverReq.on('error', (error) => {
    console.log('⚠️  Local server not running or not accessible');
    console.log('   Make sure to start your server with: npm start');
  });

  serverReq.write(testInitialize);
  serverReq.end();
}

// Uncomment the line below to test server endpoints (make sure your server is running)
setTimeout(testServerEndpoints, 2000);