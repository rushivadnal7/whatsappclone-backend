import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

console.log('Setting up environment variables...');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('.env file already exists');
  process.exit(0);
}

// Read the example file
if (!fs.existsSync(envExamplePath)) {
  console.error('env.example file not found');
  process.exit(1);
}

const envExample = fs.readFileSync(envExamplePath, 'utf8');

// Create .env with default values
const envContent = envExample
  .replace('mongodb+srv://your_username:your_password@your_cluster.mongodb.net/whatsapp?retryWrites=true&w=majority', 'mongodb://localhost:27017/whatsapp-clone')
  .replace('your_jwt_secret_key_here', 'dev_jwt_secret_key_change_in_production');

fs.writeFileSync(envPath, envContent);

console.log('.env file created successfully!');
console.log('Please update the MONGODB_URI with your actual MongoDB connection string');
console.log('For local development, you can use: mongodb://localhost:27017/whatsapp-clone');
console.log('For MongoDB Atlas, use your connection string from the Atlas dashboard'); 