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
      console.error('Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('');
    console.error('Please check your MongoDB connection string in the .env file');
    console.error('For MongoDB Atlas:');
    console.error('1. Go to https://www.mongodb.com/atlas');
    console.error('2. Create a free cluster');
    console.error('3. Get your connection string and update .env file');
    console.error('');
    console.error('Example connection string:');
    console.error('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp?retryWrites=true&w=majority');
    console.error('');
    process.exit(1);
  }
};

export { connectDB, isConnected, mockDataService }; 