// Mock data service for development without MongoDB
class MockDataService {
  constructor() {
    this.conversations = new Map();
    this.messages = new Map();
    this.initializeMockData();
  }

  initializeMockData() {
    // Mock conversations
    const mockConversations = [
      {
        _id: '1',
        wa_id: '1234567890',
        contact_name: 'R&R Imp',
        last_message: 'Koushik 1.5ft: chal rah hai',
        last_message_time: '1703123456',
        unread_count: 0,
        is_online: true,
        last_seen: '2023-12-21T10:30:00Z',
        created_at: '2023-12-20T10:00:00Z',
        updated_at: '2023-12-21T10:30:00Z'
      },
      {
        _id: '2',
        wa_id: '9876543210',
        contact_name: 'Resolute & Rowe- Design',
        last_message: 'Sandesh Designer: Ok',
        last_message_time: '1703120000',
        unread_count: 0,
        is_online: false,
        last_seen: '2023-12-21T09:15:00Z',
        created_at: '2023-12-19T15:00:00Z',
        updated_at: '2023-12-21T09:15:00Z'
      },
      {
        _id: '3',
        wa_id: '5556667777',
        contact_name: 'Koushik 1.5ft',
        last_message: '✓✓ Tune rnd kiya?',
        last_message_time: '1703118000',
        unread_count: 0,
        is_online: true,
        last_seen: '2023-12-21T08:45:00Z',
        created_at: '2023-12-18T12:00:00Z',
        updated_at: '2023-12-21T08:45:00Z'
      },
      {
        _id: '4',
        wa_id: '1112223333',
        contact_name: 'Vaidehi',
        last_message: '✓✓ Haaa thankyou',
        last_message_time: '1703117500',
        unread_count: 0,
        is_online: false,
        last_seen: '2023-12-21T08:30:00Z',
        created_at: '2023-12-18T10:00:00Z',
        updated_at: '2023-12-21T08:30:00Z'
      },
      {
        _id: '5',
        wa_id: '4445556666',
        contact_name: 'Hotwheels Sellers',
        last_message: 'Meet: 🚫 *This message was deleted*',
        last_message_time: '1703031200',
        unread_count: 37,
        is_online: false,
        last_seen: '2023-12-20T12:00:00Z',
        created_at: '2023-12-17T14:00:00Z',
        updated_at: '2023-12-20T12:00:00Z'
      },
      {
        _id: '6',
        wa_id: '7778889999',
        contact_name: 'Sareekaas Ventures -Actify',
        last_message: 'Project update needed',
        last_message_time: '1703030000',
        unread_count: 0,
        is_online: false,
        last_seen: '2023-12-20T11:30:00Z',
        created_at: '2023-12-16T09:00:00Z',
        updated_at: '2023-12-20T11:30:00Z'
      }
    ];

    // Mock messages
    const mockMessages = [
      {
        _id: 'msg1',
        wa_id: '1234567890',
        meta_msg_id: 'meta1',
        message_id: 'msg1',
        from: '1234567890',
        to: 'me',
        text: 'Koushik 1.5ft: chal rah hai',
        type: 'text',
        status: 'read',
        timestamp: '1703123456',
        conversation_id: 'conv1',
        contact_name: 'R&R Imp',
        is_outgoing: false,
        created_at: '2023-12-21T10:30:00Z',
        updated_at: '2023-12-21T10:30:00Z'
      },
      {
        _id: 'msg2',
        wa_id: '9876543210',
        meta_msg_id: 'meta2',
        message_id: 'msg2',
        from: '9876543210',
        to: 'me',
        text: 'Sandesh Designer: Ok',
        type: 'text',
        status: 'read',
        timestamp: '1703120000',
        conversation_id: 'conv2',
        contact_name: 'Resolute & Rowe- Design',
        is_outgoing: false,
        created_at: '2023-12-21T09:15:00Z',
        updated_at: '2023-12-21T09:15:00Z'
      },
      {
        _id: 'msg3',
        wa_id: '5556667777',
        meta_msg_id: 'meta3',
        message_id: 'msg3',
        from: '5556667777',
        to: 'me',
        text: 'Tune rnd kiya?',
        type: 'text',
        status: 'read',
        timestamp: '1703118000',
        conversation_id: 'conv3',
        contact_name: 'Koushik 1.5ft',
        is_outgoing: false,
        created_at: '2023-12-21T08:45:00Z',
        updated_at: '2023-12-21T08:45:00Z'
      },
      {
        _id: 'msg4',
        wa_id: '1112223333',
        meta_msg_id: 'meta4',
        message_id: 'msg4',
        from: '1112223333',
        to: 'me',
        text: 'Haaa thankyou',
        type: 'text',
        status: 'read',
        timestamp: '1703117500',
        conversation_id: 'conv4',
        contact_name: 'Vaidehi',
        is_outgoing: false,
        created_at: '2023-12-21T08:30:00Z',
        updated_at: '2023-12-21T08:30:00Z'
      },
      {
        _id: 'msg5',
        wa_id: '4445556666',
        meta_msg_id: 'meta5',
        message_id: 'msg5',
        from: '4445556666',
        to: 'me',
        text: '🚫 *This message was deleted*',
        type: 'text',
        status: 'read',
        timestamp: '1703031200',
        conversation_id: 'conv5',
        contact_name: 'Hotwheels Sellers',
        is_outgoing: false,
        created_at: '2023-12-20T12:00:00Z',
        updated_at: '2023-12-20T12:00:00Z'
      }
    ];

    // Store conversations
    mockConversations.forEach(conv => {
      this.conversations.set(conv.wa_id, conv);
    });

    // Store messages by conversation
    mockMessages.forEach(msg => {
      if (!this.messages.has(msg.wa_id)) {
        this.messages.set(msg.wa_id, []);
      }
      this.messages.get(msg.wa_id).push(msg);
    });
  }

  // Conversation methods
  async getConversations(filter = 'all') {
    let conversations = Array.from(this.conversations.values());
    
    // Apply filter
    if (filter === 'unread') {
      conversations = conversations.filter(conv => conv.unread_count > 0);
    }
    
    return conversations;
  }

  async getConversation(wa_id) {
    return this.conversations.get(wa_id) || null;
  }

  async updateConversation(wa_id, updates) {
    const conversation = this.conversations.get(wa_id);
    if (conversation) {
      Object.assign(conversation, updates);
      this.conversations.set(wa_id, conversation);
    }
    return conversation;
  }

  async markConversationAsRead(wa_id) {
    // Update conversation unread count to 0
    await this.updateConversation(wa_id, {
      unread_count: 0,
      updated_at: new Date().toISOString()
    });

    // Mark all incoming messages in this conversation as read
    const messages = this.messages.get(wa_id) || [];
    messages.forEach(msg => {
      if (!msg.is_outgoing) {
        msg.status = 'read';
        msg.updated_at = new Date().toISOString();
      }
    });
  }

  // Message methods
  async getMessages(wa_id, page = 1, limit = 50) {
    const messages = this.messages.get(wa_id) || [];
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = messages.slice(startIndex, endIndex);
    
    return {
      messages: paginatedMessages,
      pagination: {
        current: page,
        limit,
        total: messages.length,
        hasMore: endIndex < messages.length
      }
    };
  }

  async addMessage(message) {
    const wa_id = message.wa_id;
    if (!this.messages.has(wa_id)) {
      this.messages.set(wa_id, []);
    }
    
    const newMessage = {
      ...message,
      _id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.messages.get(wa_id).push(newMessage);
    
    // Update conversation's last message
    await this.updateConversation(wa_id, {
      last_message: message.text,
      last_message_time: message.timestamp,
      updated_at: new Date().toISOString()
    });
    
    return newMessage;
  }

  async updateMessageStatus(meta_msg_id, status, wa_id) {
    const messages = this.messages.get(wa_id);
    if (messages) {
      const message = messages.find(msg => msg.meta_msg_id === meta_msg_id);
      if (message) {
        message.status = status;
        message.updated_at = new Date().toISOString();
        return message;
      }
    }
    return null;
  }
}

export default MockDataService; 