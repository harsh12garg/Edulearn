const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Delete all existing admins
    console.log('🗑️  Deleting all existing admins...');
    const deleteResult = await Admin.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} admin(s)\n`);

    // Create fresh admin
    console.log('👤 Creating new admin account...');
    const admin = new Admin({
      username: 'admin',
      email: 'admin@edulearn.com',
      password: 'admin123',
      role: 'superadmin',
      isActive: true
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash('admin123', salt);

    await admin.save();
    
    console.log('✅ Admin created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Admin Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Email:    admin@edulearn.com');
    console.log('   Password: admin123');
    console.log('   Role:     superadmin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Verify password
    const testMatch = await bcrypt.compare('admin123', admin.password);
    console.log('🔐 Password verification:', testMatch ? '✅ Success' : '❌ Failed');
    console.log('');
    console.log('🌐 Admin Panel URLs:');
    console.log('   Login:     http://localhost:3000/admin/login');
    console.log('   Dashboard: http://localhost:3000/admin/dashboard');
    console.log('');
    console.log('⚠️  IMPORTANT: Restart your backend server!');
    console.log('   1. Press Ctrl+C in server terminal');
    console.log('   2. Run: npm run server');
    console.log('   3. Then login to admin panel');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

resetAdmin();
