const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');

// Get topics by subject
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const topics = await Topic.find({ 
      subject: req.params.subjectId, 
      isActive: true 
    }).sort({ order: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get topic by slug
router.get('/:slug', async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug, isActive: true })
      .populate('subject')
      .populate('prerequisites');
    if (!topic) {
      return res.status(404).json({ msg: 'Topic not found' });
    }
    res.json(topic);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
