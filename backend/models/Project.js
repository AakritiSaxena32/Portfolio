const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // e.g. 'Full-Stack', 'Frontend', 'Backend'
    description: { type: String, required: true },
    tech: [{ type: String, trim: true }],
    liveUrl: { type: String, trim: true },
    codeUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 } // lower shows first
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);