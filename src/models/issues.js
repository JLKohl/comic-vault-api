const mongoose = require('mongoose');

const comicIssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issueNumber: {
    type: Number,
    required: true,
    min: 1
  },
  releaseDate: {
    type: Date,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  charactersFeatured: [{
    type: String,
    required: true
  }],
  place: {
    type: String,
    required: true
  },
  storyArc: {
    type: String,
    required: true
  },
  pageCount: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ComicIssue', comicIssueSchema);