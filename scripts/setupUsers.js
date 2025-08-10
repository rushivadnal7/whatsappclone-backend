import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    profile: {
      name: 'John Doe',
      avatar: '',
      status: 'Hey there! I am using WhatsApp Clone'
    },
    wa_id: '1234567890'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    profile: {
      name: 'Jane Smith',
      avatar: '',
      status: 'Available for chat'
    },
    wa_id: '9876543210'
  },
  {
    username: 'bob_wilson',
    email: 'bob@example.com',
    password: 'password123',
    profile: {
      name: 'Bob Wilson',
      avatar: '',
      status: 'In a meeting'
    },
    wa_id: '5556667777'
  },
  {
    username: 'alice_brown',
    email: 'alice@example.com',
    password: 'password123',
    profile: {
      name: 'Alice Brown',
      avatar: '',
      status: 'Busy with work'
    },
    wa_id: '1112223333'
  },
  {
    username: 'charlie_davis',
    email: 'charlie@example.com',
    password: 'password123',
    profile: {
      name: 'Charlie Davis',
      avatar: '',
      status: 'Online'
    },
    wa_id: '4445556666'
  }
];

async function setupUsers() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Setting up sample users...');
    
    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email },
          { username: userData.username },
          { wa_id: userData.wa_id }
        ]
      });
      
      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping...`);
        continue;
      }
      
      // Create new user
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.username} (${userData.email})`);
    }
    
    console.log('Sample users setup completed!');
    console.log('\nYou can now login with any of these accounts:');
    sampleUsers.forEach(user => {
      console.log(`- Email: ${user.email}, Password: ${user.password}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up users:', error);
    process.exit(1);
  }
}

setupUsers();
