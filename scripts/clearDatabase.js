const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Content = require('../models/Content');
const User = require('../models/User');

dotenv.config();

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    console.log('🗑️  Clearing database...\n');

    // Count before deletion
    const subjectsCount = await Subject.countDocuments();
    const topicsCount = await Topic.countDocuments();
    const contentsCount = await Content.countDocuments();
    const usersCount = await User.countDocuments();

    console.log('📊 Current Data:');
    console.log(`   Subjects: ${subjectsCount}`);
    console.log(`   Topics: ${topicsCount}`);
    console.log(`   Contents: ${contentsCount}`);
    console.log(`   Users: ${usersCount}`);
    console.log('');

    // Delete all data
    console.log('🗑️  Deleting all content...');
    await Content.deleteMany({});
    console.log('   ✅ All contents deleted');

    await Topic.deleteMany({});
    console.log('   ✅ All topics deleted');

    await Subject.deleteMany({});
    console.log('   ✅ All subjects deleted');

    await User.deleteMany({});
    console.log('   ✅ All users deleted');

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Database cleared successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📝 Summary:');
    console.log(`   Deleted ${subjectsCount} subjects`);
    console.log(`   Deleted ${topicsCount} topics`);
    console.log(`   Deleted ${contentsCount} contents`);
    console.log(`   Deleted ${usersCount} users`);
    console.log('');
    console.log('⚠️  Note: Admin accounts are NOT deleted');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Go to admin panel: http://localhost:3000/admin/dashboard');
    console.log('   2. Click "Bulk Upload Content"');
    console.log('   3. Upload your fresh content!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

clearDatabase();
