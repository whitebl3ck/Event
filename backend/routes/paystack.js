const express = require('express');
const router = express.Router();
const { 
  initializeTransaction, 
  verifyTransaction, 
  handleWebhook,
  getTransactionStatus
} = require('../controllers/paystack');

// Initialize a new transaction
// POST /api/paystack/initialize
router.post('/initialize', initializeTransaction);

// Verify a transaction by reference
// GET /api/paystack/verify/:reference
router.get('/verify/:reference', verifyTransaction);

// Handle Paystack webhooks
// POST /api/paystack/webhook
router.post('/webhook', handleWebhook);

// Get transaction status by reference
// GET /api/paystack/status/:reference  
router.get('/status/:reference', getTransactionStatus);

module.exports = router;