import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  getConversation,
  markConversationAsRead
} from '../controllers/messageController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get all conversations
router.get('/conversations', getConversations);

// Get conversation details
router.get('/conversations/:wa_id', getConversation);

// Mark conversation as read
router.put('/conversations/:wa_id/read', markConversationAsRead);

// Get messages for a conversation
router.get('/conversations/:wa_id/messages', getMessages);

// Send a new message
router.post('/send', sendMessage);

export default router; 