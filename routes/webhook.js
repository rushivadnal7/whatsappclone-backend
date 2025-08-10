import express from 'express';
import { processMessageWebhook, processStatusWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Webhook endpoint for processing WhatsApp payloads
router.post('/message', processMessageWebhook);
router.post('/status', processStatusWebhook);

export default router; 