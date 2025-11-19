const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// Get content by topic
router.get('/topic/:topicId', async (req, res) => {
  try {
    const content = await Content.find({ topic: req.params.topicId }).sort({ order: 1 });
    res.json(content);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
