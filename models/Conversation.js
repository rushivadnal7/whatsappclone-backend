import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  wa_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  contact_name: {
    type: String,
    required: true
  },
  last_message: {
    type: String,
    default: ''
  },
  last_message_time: {
    type: String,
    default: ''
  },
  unread_count: {
    type: Number,
    default: 0
  },
  is_online: {
    type: Boolean,
    default: false
  },
  last_seen: {
    type: Date,
    default: Date.now
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
conversationSchema.index({ updated_at: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation; 