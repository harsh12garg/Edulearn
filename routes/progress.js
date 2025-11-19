const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Update progress
router.post('/', auth, async (req, res) => {
  try {
    const { topicId, completed } = req.body;
    const user = await User.findById(req.user.id);
    
    const progressIndex = user.progress.findIndex(p => p.topic.toString() === topicId);
    
    if (progressIndex > -1) {
      user.progress[progressIndex].completed = completed;
      user.progress[progressIndex].lastAccessed = Date.now();
    } else {
      user.progress.push({ topic: topicId, completed, lastAccessed: Date.now() });
    }
    
    await user.save();
    res.json(user.progress);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('progress.topic');
    res.json(user.progress);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
