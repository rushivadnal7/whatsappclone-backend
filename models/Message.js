import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  wa_id: {
    type: String,
    required: true,
    index: true
  },
  meta_msg_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  message_id: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  timestamp: {
    type: String,
    required: true
  },
  conversation_id: {
    type: String,
    required: true
  },
  contact_name: {
    type: String,
    required: true
  },
  is_outgoing: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for efficient querying
messageSchema.index({ wa_id: 1, timestamp: -1 });
messageSchema.index({ conversation_id: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema, 'processed_messages');

export default Message; 