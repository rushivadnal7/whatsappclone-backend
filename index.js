import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { connectDB } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import limiter from './middleware/rateLimiter.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

import webhookRoutes from './routes/webhook.js';
import messageRoutes from './routes/messages.js';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = createServer(app);

// Parse CORS origins
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:5173"];

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WhatsApp Clone API is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Authenticate socket connection
  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user) {
        socket.userId = user._id;
        socket.user = user;
        socket.wa_id = user.wa_id;
        
        // Join user's personal room
        socket.join(`user-${user._id}`);
        socket.join(`wa-${user.wa_id}`);
        
        // Update user's online status
        await User.findByIdAndUpdate(user._id, {
          isOnline: true,
          lastSeen: new Date()
        });
        
        // Notify other users that this user is online
        socket.broadcast.emit('user-online', {
          userId: user._id,
          wa_id: user.wa_id,
          isOnline: true
        });
        
        console.log(`User ${user.username} authenticated and connected`);
      } else {
        socket.emit('auth-error', 'Invalid token');
      }
    } catch (error) {
      socket.emit('auth-error', 'Authentication failed');
    }
  });

  // Join a conversation room
  socket.on('join-conversation', (wa_id) => {
    if (socket.userId) {
      socket.join(`conversation-${wa_id}`);
      console.log(`User ${socket.user.username} joined conversation ${wa_id}`);
    }
  });

  // Leave a conversation room
  socket.on('leave-conversation', (wa_id) => {
    socket.leave(`conversation-${wa_id}`);
    console.log(`User ${socket.user?.username || 'Unknown'} left conversation ${wa_id}`);
  });

  // Send message
  socket.on('send-message', async (messageData) => {
    if (!socket.userId) return;
    
    try {
      // Emit to conversation room
      io.to(`conversation-${messageData.wa_id}`).emit('new-message', {
        ...messageData,
        sender: socket.user
      });
      
      // Emit to recipient's personal room
      io.to(`wa-${messageData.to}`).emit('message-received', {
        ...messageData,
        sender: socket.user
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
  
  // Typing indicators
  socket.on('typing-start', (wa_id) => {
    if (socket.userId) {
      socket.to(`conversation-${wa_id}`).emit('user-typing', {
        wa_id: socket.wa_id,
        isTyping: true
      });
    }
  });

  socket.on('typing-stop', (wa_id) => {
    if (socket.userId) {
      socket.to(`conversation-${wa_id}`).emit('user-typing', {
        wa_id: socket.wa_id,
        isTyping: false
      });
    }
  });

  socket.on('disconnect', async () => {
    if (socket.userId) {
      // Update user's offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });
      
      // Notify other users that this user is offline
      socket.broadcast.emit('user-offline', {
        userId: socket.userId,
        wa_id: socket.wa_id,
        isOnline: false
      });
      
      console.log(`User ${socket.user?.username || 'Unknown'} disconnected`);
    } else {
      console.log('Client disconnected:', socket.id);
    }
  });
});

// Make io available to other modules
app.set('io', io);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
}); 