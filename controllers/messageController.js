import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { isConnected, mockDataService } from '../config/database.js';

// Get all conversations with filtering
export const getConversations = async (req, res) => {
  try {
    const { filter = 'all' } = req.query;
    
    if (isConnected) {
      let query = {};
      
      // Apply filter
      if (filter === 'unread') {
        query.unread_count = { $gt: 0 };
      }
      
      const conversations = await Conversation.find(query)
        .sort({ updated_at: -1 })
        .lean();

      res.status(200).json({
        success: true,
        data: conversations
      });
    } else {
      const conversations = await mockDataService.getConversations(filter);
      res.status(200).json({
        success: true,
        data: conversations
      });
    }
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Mark conversation as read
export const markConversationAsRead = async (req, res) => {
  try {
    const { wa_id } = req.params;

    if (isConnected) {
      // Update conversation unread count to 0
      await Conversation.findOneAndUpdate(
        { wa_id },
        { unread_count: 0 },
        { new: true }
      );

      // Mark all messages in this conversation as read
      await Message.updateMany(
        { wa_id, is_outgoing: false },
        { status: 'read' }
      );

      res.status(200).json({
        success: true,
        message: 'Conversation marked as read'
      });
    } else {
      await mockDataService.markConversationAsRead(wa_id);
      res.status(200).json({
        success: true,
        message: 'Conversation marked as read'
      });
    }
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get messages for a specific conversation
export const getMessages = async (req, res) => {
  try {
    const { wa_id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (isConnected) {
      const skip = (page - 1) * limit;

      const messages = await Message.find({ wa_id })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Message.countDocuments({ wa_id });

      res.status(200).json({
        success: true,
        data: messages.reverse(), // Return in chronological order
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasMore: skip + messages.length < total
        }
      });
    } else {
      const result = await mockDataService.getMessages(wa_id, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        data: result.messages,
        pagination: result.pagination
      });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Send a new message (demo)
export const sendMessage = async (req, res) => {
  try {
    const { wa_id, text, contact_name } = req.body;

    if (!wa_id || !text || !contact_name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Generate unique message ID
    const messageId = `wamid.${Date.now()}.${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const messageData = {
      wa_id,
      meta_msg_id: messageId,
      message_id: messageId,
      from: '918329446654', // Business phone number
      to: wa_id,
      text,
      type: 'text',
      status: 'sent',
      timestamp,
      conversation_id: `${wa_id}_629305560276479`,
      contact_name,
      is_outgoing: true
    };

    if (isConnected) {
      const newMessage = new Message(messageData);
      await newMessage.save();

      // Update conversation
      await Conversation.findOneAndUpdate(
        { wa_id },
        {
          wa_id,
          contact_name,
          last_message: text,
          last_message_time: timestamp,
          updated_at: new Date()
        },
        { upsert: true, new: true }
      );

      res.status(201).json({
        success: true,
        data: newMessage
      });
    } else {
      const newMessage = await mockDataService.addMessage(messageData);
      res.status(201).json({
        success: true,
        data: newMessage
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get conversation details
export const getConversation = async (req, res) => {
  try {
    const { wa_id } = req.params;

    if (isConnected) {
      const conversation = await Conversation.findOne({ wa_id }).lean();

      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found'
        });
      }

      res.status(200).json({
        success: true,
        data: conversation
      });
    } else {
      const conversation = await mockDataService.getConversation(wa_id);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found'
        });
      }

      res.status(200).json({
        success: true,
        data: conversation
      });
    }
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}; 