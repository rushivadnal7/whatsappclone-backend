import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let mockDataService = null;

// Initialize mock data service for development
const initializeMockService = async () => {
  if (!mockDataService) {
    const { default: MockDataService } = await import('../services/mockDataService.js');
    mockDataService = new MockDataService();
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in environment variables');
      console.error('Please create a .env file with your MongoDB connection string');
      console.error('Example: MONGODB_URI=mongodb://localhost:27017/whatsapp-clone');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    
    // Also initialize mock service for development/testing
    await initializeMockService();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('');
    console.error('Starting with mock data service for development...');
    console.error('');
    console.error('To use MongoDB:');
    console.error('1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/');
    console.error('2. Or use MongoDB Atlas: https://www.mongodb.com/atlas');
    console.error('3. Update your .env file with the correct MONGODB_URI');
    console.error('');
    console.error('For quick testing, you can use MongoDB Atlas free tier:');
    console.error('- Go to https://www.mongodb.com/atlas');
    console.error('- Create a free cluster');
    console.error('- Get your connection string and update .env file');
    console.error('');
    
    // Initialize mock data service
    await initializeMockService();
    console.log('Mock data service initialized');
  }
};

export { connectDB, isConnected, mockDataService }; 