const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'code', 'example', 'exercise', 'quiz'],
    required: true 
  },
  content: { type: String, required: true },
  codeLanguage: { type: String },
  examples: [{
    title: String,
    code: String,
    explanation: String
  }],
  exercises: [{
    question: String,
    answer: String,
    hints: [String]
  }],
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);
