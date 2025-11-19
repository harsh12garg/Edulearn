const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String },
  category: { 
    type: String, 
    enum: ['programming', 'mathematics', 'languages', 'science', 'other'],
    required: true 
  },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all'] },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', SubjectSchema);
