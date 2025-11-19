const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Content = require('../models/Content');

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    req.admin = decoded.admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 Admin login attempt:', { email, passwordLength: password?.length });

    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      console.log('❌ Admin not found or inactive:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    console.log('✅ Admin found:', admin.email);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('🔐 Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      admin: { id: admin.id },
      isAdmin: true
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          admin: {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: admin.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create admin (protected - only superadmin can create)
router.post('/create', adminAuth, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    admin = new Admin({ username, email, password, role });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();
    res.json({ msg: 'Admin created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all subjects (admin)
router.get('/subjects', adminAuth, async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ order: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create subject
router.post('/subjects', adminAuth, async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update subject
router.put('/subjects/:id', adminAuth, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(subject);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete subject
router.delete('/subjects/:id', adminAuth, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Subject deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Bulk upload subjects, topics, and content
router.post('/bulk-upload', adminAuth, async (req, res) => {
  try {
    const { subjects } = req.body;
    const results = [];

    for (const subjectData of subjects) {
      // Create or update subject
      let subject = await Subject.findOne({ slug: subjectData.slug });
      if (!subject) {
        subject = new Subject({
          name: subjectData.name,
          slug: subjectData.slug,
          description: subjectData.description,
          icon: subjectData.icon,
          category: subjectData.category,
          level: subjectData.level,
          order: subjectData.order
        });
        await subject.save();
      }

      const topicResults = [];

      // Create topics
      if (subjectData.topics && subjectData.topics.length > 0) {
        for (const topicData of subjectData.topics) {
          let topic = await Topic.findOne({ slug: topicData.slug, subject: subject._id });
          if (!topic) {
            topic = new Topic({
              subject: subject._id,
              title: topicData.title,
              slug: topicData.slug,
              description: topicData.description,
              order: topicData.order,
              estimatedTime: topicData.estimatedTime,
              difficulty: topicData.difficulty
            });
            await topic.save();
          }

          // Create content
          if (topicData.contents && topicData.contents.length > 0) {
            for (const contentData of topicData.contents) {
              const content = new Content({
                topic: topic._id,
                title: contentData.title,
                type: contentData.type,
                content: contentData.content,
                codeLanguage: contentData.codeLanguage,
                examples: contentData.examples,
                exercises: contentData.exercises,
                order: contentData.order
              });
              await content.save();
            }
          }

          topicResults.push({ topic: topic.title, slug: topic.slug });
        }
      }

      results.push({
        subject: subject.name,
        slug: subject.slug,
        topics: topicResults
      });
    }

    res.json({ 
      msg: 'Bulk upload successful',
      results 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const Note = require('../models/Note');
    
    const subjectsCount = await Subject.countDocuments();
    const topicsCount = await Topic.countDocuments();
    const contentsCount = await Content.countDocuments();
    const notesCount = await Note.countDocuments();
    
    // Calculate total downloads
    const notesWithDownloads = await Note.find({}, 'downloads');
    const totalDownloads = notesWithDownloads.reduce((sum, note) => sum + (note.downloads || 0), 0);
    
    res.json({
      subjects: subjectsCount,
      topics: topicsCount,
      contents: contentsCount,
      notes: notesCount,
      totalDownloads: totalDownloads
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
