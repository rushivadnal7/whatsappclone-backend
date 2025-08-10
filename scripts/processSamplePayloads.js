import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the sample payloads
const payloadsDir = path.join(__dirname, '../../client/whatsapp sample payloads');

const processPayloads = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Read all JSON files from th  e payloads directory
    const files = fs.readdirSync(payloadsDir).filter(file => file.endsWith('.json'));
    console.log(`Found ${files.length} payload files to process`);

    // Process files in order (messages first, then statuses)
    const messageFiles = files.filter(file => file.includes('message'));
    const statusFiles = files.filter(file => file.includes('status'));

    console.log(`Processing ${messageFiles.length} message files...`);

    // Process message payloads first
    for (const file of messageFiles) {
      console.log(`Processing ${file}...`);
      const filePath = path.join(payloadsDir, file);
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (payload.payload_type === 'whatsapp_webhook' && payload.metaData) {
        const entry = payload.metaData.entry[0];
        const changes = entry.changes[0];

        if (changes.field === 'messages' && changes.value.messages) {
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

          // Check if message already exists
          const existingMessage = await Message.findOne({ meta_msg_id: message.id });
          if (!existingMessage) {
            const newMessage = new Message(messageData);
            await newMessage.save();
            console.log(`✅ Saved message: ${message.text.body.substring(0, 50)}...`);
          } else {
            console.log(`⏭️  Message already exists: ${message.id}`);
          }

          // Update or create conversation
          const conversationData = {
            wa_id: contacts.wa_id,
            contact_name: contacts.profile.name,
            last_message: message.text.body,
            last_message_time: message.timestamp,
            unread_count: 1,
            is_online: true,
            last_seen: new Date().toISOString()
          };

          await Conversation.findOneAndUpdate(
            { wa_id: contacts.wa_id },
            conversationData,
            { upsert: true, new: true }
          );
          console.log(`✅ Updated conversation for ${contacts.profile.name}`);
        }
      }
    }

    console.log(`\nProcessing ${statusFiles.length} status files...`);

    // Process status payloads
    for (const file of statusFiles) {
      console.log(`Processing ${file}...`);
      const filePath = path.join(payloadsDir, file);
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (payload.payload_type === 'whatsapp_webhook' && payload.metaData) {
        const entry = payload.metaData.entry[0];
        const changes = entry.changes[0];

        if (changes.field === 'messages' && changes.value.statuses) {
          const status = changes.value.statuses[0];

          // Update message status
          const updatedMessage = await Message.findOneAndUpdate(
            { meta_msg_id: status.meta_msg_id },
            { 
              status: status.status,
              updated_at: new Date()
            },
            { new: true }
          );

          if (updatedMessage) {
            console.log(`✅ Updated message status to ${status.status}: ${status.meta_msg_id}`);
          } else {
            console.log(`❌ Message not found for status update: ${status.meta_msg_id}`);
          }
        }
      }
    }

    // Display summary
    const totalMessages = await Message.countDocuments();
    const totalConversations = await Conversation.countDocuments();

    console.log('\n📊 Database Population Summary:');
    console.log(`📨 Total Messages: ${totalMessages}`);
    console.log(`💬 Total Conversations: ${totalConversations}`);

    // Show conversations
    const conversations = await Conversation.find().sort({ updated_at: -1 });
    console.log('\n💬 Conversations:');
    conversations.forEach(conv => {
      console.log(`   - ${conv.contact_name} (${conv.wa_id}): "${conv.last_message}"`);
    });

    console.log('\n✅ Sample data population completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error processing payloads:', error);
    process.exit(1);
  }
};

processPayloads(); 