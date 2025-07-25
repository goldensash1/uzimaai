#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 UzimaAI Admin Dashboard Setup');
console.log('================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=uzimaaidb
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload (if needed)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
  console.log('⚠️  Please update the database password in .env file\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('📦 Installing frontend dependencies...');
try {
  execSync('cd client && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Create uploads directory
const uploadsDir = path.join(__dirname, 'server', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created\n');
}

console.log('🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Configure your MySQL database');
console.log('2. Import the database schema from database/uzimaaidb (3).sql');
console.log('3. Create an admin user in the database');
console.log('4. Update the .env file with your database credentials');
console.log('5. Run "npm run dev" to start the application');
console.log('\n🔐 Default admin credentials:');
console.log('   Username: admin');
console.log('   Password: admin123');
console.log('\n📖 For more information, see README.md'); 