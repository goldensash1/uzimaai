import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing UzimaAI Admin Database...');

    // Create admin table if it doesn't exist
    const createAdminTable = `
      CREATE TABLE IF NOT EXISTS admin (
        adminId INT AUTO_INCREMENT PRIMARY KEY,
        adminUsername VARCHAR(100) UNIQUE NOT NULL,
        adminEmail VARCHAR(100) UNIQUE NOT NULL,
        adminPhone VARCHAR(20),
        adminPassword VARCHAR(255) NOT NULL,
        adminStatus ENUM('active', 'inactive') DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await pool.execute(createAdminTable);
    console.log('✅ Admin table created/verified');

    // Check if default admin exists
    const [existingAdmin] = await pool.execute(
      'SELECT adminId FROM admin WHERE adminUsername = ? OR adminEmail = ?',
      ['admin', 'admin@uzimaai.com']
    );

    if (existingAdmin.length === 0) {
      // Create default admin user
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);

      await pool.execute(
        'INSERT INTO admin (adminUsername, adminEmail, adminPhone, adminPassword, adminStatus) VALUES (?, ?, ?, ?, ?)',
        ['admin', 'admin@uzimaai.com', '+1234567890', hashedPassword, 'active']
      );

      console.log('✅ Default admin user created');
      console.log('📧 Username: admin');
      console.log('📧 Email: admin@uzimaai.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the default password after first login!');
    } else {
      console.log('ℹ️  Default admin user already exists');
    }

    console.log('🎉 Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeDatabase(); 