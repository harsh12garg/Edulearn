const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true }).sort({ order: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get subject by slug
router.get('/:slug', async (req, res) => {
  try {
    const subject = await Subject.findOne({ slug: req.params.slug, isActive: true });
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }
    res.json(subject);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
