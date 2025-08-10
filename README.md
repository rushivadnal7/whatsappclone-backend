# WhatsApp Clone Backend

A Node.js/Express backend for the WhatsApp Web clone application.

## Features

- RESTful API for WhatsApp-like messaging
- Webhook processing for WhatsApp Business API payloads
- Real-time messaging with Socket.IO
- MongoDB integration with Mongoose
- Rate limiting and security middleware
- Sample payload processing script

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

3. Update the `.env` file with your MongoDB connection string and other configurations.

4. Process sample payloads (optional):
```bash
npm run process-payloads
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Webhook Endpoints
- `POST /api/webhook/message` - Process incoming message webhooks
- `POST /api/webhook/status` - Process status update webhooks

### Message Endpoints
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/:wa_id` - Get conversation details
- `GET /api/messages/conversations/:wa_id/messages` - Get messages for a conversation
- `POST /api/messages/send` - Send a new message

### Health Check
- `GET /health` - API health status

## Database Schema

### Message Collection (`processed_messages`)
- `wa_id` - WhatsApp ID of the contact
- `meta_msg_id` - Unique message identifier
- `message_id` - Message ID
- `from` - Sender phone number
- `to` - Recipient phone number
- `text` - Message content
- `type` - Message type (text, image, etc.)
- `status` - Message status (sent, delivered, read)
- `timestamp` - Message timestamp
- `conversation_id` - Conversation identifier
- `contact_name` - Contact name
- `is_outgoing` - Whether message is outgoing

### Conversation Collection
- `wa_id` - WhatsApp ID of the contact
- `contact_name` - Contact name
- `last_message` - Last message content
- `last_message_time` - Last message timestamp
- `unread_count` - Number of unread messages
- `is_online` - Online status
- `last_seen` - Last seen timestamp

## Socket.IO Events

- `join-conversation` - Join a conversation room
- `leave-conversation` - Leave a conversation room

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `CORS_ORIGIN` - CORS origin URL
- `RATE_LIMIT_WINDOW_MS` - Rate limit window
- `RATE_LIMIT_MAX_REQUESTS` - Rate limit max requests 