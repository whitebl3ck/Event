const https = require('https');
const crypto = require('crypto');
const EventRegistration = require('../models/EventRegistration');

// Helper function to make HTTPS requests with retry logic
const makePaystackRequest = (options, data = null, retries = 3) => {
  return new Promise((resolve, reject) => {
    const attemptRequest = (attemptNumber) => {
      console.log(`🔄 Paystack API attempt ${attemptNumber}/${retries}`);
      
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            console.log(`✅ Paystack API success (attempt ${attemptNumber})`);
            resolve(parsedData);
          } catch (parseError) {
            console.error(`❌ JSON parse error (attempt ${attemptNumber}):`, parseError.message);
            if (attemptNumber < retries) {
              setTimeout(() => attemptRequest(attemptNumber + 1), 1000 * attemptNumber);
            } else {
              reject(new Error(`Failed to parse response after ${retries} attempts`));
            }
          }
        });
      });

      req.on('error', (error) => {
        console.error(`❌ Request error (attempt ${attemptNumber}):`, error.message);
        
        if (attemptNumber < retries && (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED')) {
          console.log(`🔄 Retrying in ${attemptNumber} seconds...`);
          setTimeout(() => attemptRequest(attemptNumber + 1), 1000 * attemptNumber);
        } else {
          reject(error);
        }
      });

      req.on('timeout', () => {
        console.error(`⏰ Request timeout (attempt ${attemptNumber})`);
        req.destroy();
        if (attemptNumber < retries) {
          setTimeout(() => attemptRequest(attemptNumber + 1), 1000 * attemptNumber);
        } else {
          reject(new Error(`Request timeout after ${retries} attempts`));
        }
      });

      // Set timeout
      req.setTimeout(15000); // 15 seconds

      // Write data if provided
      if (data) {
        req.write(data);
      }
      
      req.end();
    };

    attemptRequest(1);
  });
};

// Initialize transaction with retry logic
exports.initializeTransaction = async (req, res) => {
  try {
    const { email, amount, currency, eventName, customerName, registrationId } = req.body;
    
    // Validate required fields
    if (!email || !amount) {
      return res.status(400).json({
        status: false,
        message: 'Email and amount are required'
      });
    }

    // Generate unique reference
    const reference = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const requestData = JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Convert to kobo/cents
      currency: currency || 'NGN',
      reference,
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
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/callback`
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    console.log(`🚀 Initializing Paystack transaction:`, {
      email,
      amount,
      currency,
      reference
    });

    const response = await makePaystackRequest(options, requestData);
    
    if (response.status && response.data) {
      // Store Paystack data in registration if registrationId provided
      if (registrationId) {
        try {
          await EventRegistration.findByIdAndUpdate(registrationId, {
            paymentMethod: 'paystack',
            paymentReference: reference,
            paystackData: {
              reference: response.data.reference,
              access_code: response.data.access_code,
              authorization_url: response.data.authorization_url
            }
          });
          console.log(`✅ Registration ${registrationId} updated with Paystack data`);
        } catch (dbError) {
          console.error('Database update error:', dbError);
          // Don't fail the request if DB update fails
        }
      }
      
      res.json({
        status: true,
        message: 'Transaction initialized successfully',
        data: response.data
      });
    } else {
      res.status(400).json({
        status: false,
        message: response.message || 'Failed to initialize transaction',
        data: response
      });
    }

  } catch (error) {
    console.error('Initialize transaction error:', error);
    
    // Provide specific error messages based on error type
    let errorMessage = 'Payment service temporarily unavailable';
    
    if (error.code === 'ECONNRESET') {
      errorMessage = 'Connection to payment service was reset. Please try again.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Unable to reach payment service. Please check your connection.';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Payment service refused connection. Please try again later.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Payment service timeout. Please try again.';
    }

    res.status(500).json({
      status: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify transaction with retry logic
exports.verifyTransaction = async (req, res) => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      return res.status(400).json({
        status: false,
        message: 'Transaction reference is required'
      });
    }

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    };

    console.log(`🔍 Verifying Paystack transaction: ${reference}`);

    const response = await makePaystackRequest(options);
    
    if (response.status && response.data) {
      // Update registration payment status if successful
      if (response.data.status === 'success') {
        try {
          const registration = await EventRegistration.findOne({
            paymentReference: reference
          });
          
          if (registration) {
            registration.paymentStatus = 'paid';
            await registration.save();
            console.log(`✅ Registration ${registration._id} marked as paid`);
          }
        } catch (dbError) {
          console.error('Database update error during verification:', dbError);
          // Don't fail the verification if DB update fails
        }
      }
      
      res.json({
        status: true,
        message: 'Transaction verification successful',
        data: response.data
      });
    } else {
      res.status(400).json({
        status: false,
        message: response.message || 'Transaction verification failed',
        data: response
      });
    }

  } catch (error) {
    console.error('Verify transaction error:', error);
    
    let errorMessage = 'Verification service temporarily unavailable';
    
    if (error.code === 'ECONNRESET') {
      errorMessage = 'Connection to verification service was reset. Please try again.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Unable to reach verification service. Please check your connection.';
    }

    res.status(500).json({
      status: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Webhook handler (unchanged)
exports.handleWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      console.log('❌ Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;
    console.log(`📨 Webhook received: ${event.event}`);

    // Handle successful charge
    if (event.event === 'charge.success') {
      const { reference, status, amount, currency, customer } = event.data;
      
      console.log(`💰 Payment successful: ${reference}, Amount: ${amount/100} ${currency}`);
      
      // Find and update the registration
      const registration = await EventRegistration.findOne({
        paymentReference: reference
      }).populate('event');
      
      if (registration) {
        registration.paymentStatus = 'paid';
        await registration.save();
        console.log(`✅ Registration ${registration._id} payment status updated to paid`);
      } else {
        console.log(`⚠️ No registration found for reference: ${reference}`);
      }
    }
    
    // Handle failed charge
    if (event.event === 'charge.failed') {
      const { reference } = event.data;
      
      const registration = await EventRegistration.findOne({
        paymentReference: reference
      });
      
      if (registration) {
        registration.paymentStatus = 'failed';
        await registration.save();
        console.log(`❌ Registration ${registration._id} payment status updated to failed`);
      }
    }
    
    res.status(200).send('OK');

  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).send('Webhook processing failed');
  }
};

// Get transaction status
exports.getTransactionStatus = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const registration = await EventRegistration.findOne({
      paymentReference: reference
    }).populate('event');
    
    if (!registration) {
      return res.status(404).json({
        status: false,
        message: 'Registration not found'
      });
    }
    
    res.json({
      status: true,
      data: {
        paymentStatus: registration.paymentStatus,
        paymentMethod: registration.paymentMethod,
        amount: registration.totalAmount,
        eventName: registration.event.name,
        customerName: registration.customerName
      }
    });

  } catch (error) {
    console.error('Get transaction status error:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};