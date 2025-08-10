import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { isConnected, mockDataService } from '../config/database.js';

// Process incoming message webhook
export const processMessageWebhook = async (req, res) => {
  try {
    const { payload_type, metaData } = req.body;

    if (payload_type !== 'whatsapp_webhook') {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload type'
      });
    }

    const entry = metaData.entry[0];
    const changes = entry.changes[0];

    if (changes.field === 'messages') {
      const value = changes.value;
      const contacts = value.contacts[0];
      const message = value.messages[0];

      // Extract message data
      const messageData = {
        wa_id: contacts.wa_id,
        meta_msg_id: message.id,
        message_id: message.id,
        from: message.from,
        to: value.metadata.phone_number_id,
        text: message.text.body,
        type: message.type,
        status: 'sent',
        timestamp: message.timestamp,
        conversation_id: `${contacts.wa_id}_${value.metadata.phone_number_id}`,
        contact_name: contacts.profile.name,
        is_outgoing: false
      };

      if (isConnected) {
        // Save message to database
        const newMessage = new Message(messageData);
        await newMessage.save();

        // Update or create conversation
        await Conversation.findOneAndUpdate(
          { wa_id: contacts.wa_id },
          {
            wa_id: contacts.wa_id,
            contact_name: contacts.profile.name,
            last_message: message.text.body,
            last_message_time: message.timestamp,
            updated_at: new Date()
          },
          { upsert: true, new: true }
        );
      } else {
        // Use mock data service
        await mockDataService.addMessage(messageData);
        await mockDataService.updateConversation(contacts.wa_id, {
          contact_name: contacts.profile.name,
          last_message: message.text.body,
          last_message_time: message.timestamp,
          updated_at: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        message: 'Message processed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid field type'
      });
    }
  } catch (error) {
    console.error('Error processing message webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Process status update webhook
export const processStatusWebhook = async (req, res) => {
  try {
    const { payload_type, metaData } = req.body;

    if (payload_type !== 'whatsapp_webhook') {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload type'
      });
    }

    const entry = metaData.entry[0];
    const changes = entry.changes[0];

    if (changes.field === 'messages') {
      const value = changes.value;
      
      if (value.statuses && value.statuses.length > 0) {
        const status = value.statuses[0];
        
        if (isConnected) {
          // Update message status
          const updatedMessage = await Message.findOneAndUpdate(
            { meta_msg_id: status.meta_msg_id },
            { 
              status: status.status,
              updated_at: new Date()
            },
            { new: true }
          );

          if (!updatedMessage) {
            return res.status(404).json({
              success: false,
              error: 'Message not found'
            });
          }
        } else {
          // Use mock data service
          const updatedMessage = await mockDataService.updateMessageStatus(
            status.meta_msg_id, 
            status.status, 
            status.wa_id || 'unknown'
          );

          if (!updatedMessage) {
            return res.status(404).json({
              success: false,
              error: 'Message not found'
            });
          }
        }

        res.status(200).json({
          success: true,
          message: 'Status updated successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'No status data found'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid field type'
      });
    }
  } catch (error) {
    console.error('Error processing status webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}; 