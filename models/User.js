const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, default: 'en' }
  },
  progress: [{
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    completed: { type: Boolean, default: false },
    lastAccessed: { type: Date, default: Date.now }
  }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
