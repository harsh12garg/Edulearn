const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
  estimatedTime: { type: Number }, // in minutes
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', TopicSchema);
