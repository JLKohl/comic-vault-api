const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
  title: { 
    type: String, 
    required: true 
  },

  issueNumber: { 
    type: Number, 
    required: true 
  },
  // Storing as string to match "YYYY-MM-DD" format
  releaseDate: {
     type: String 
  }, 
  // Storing as string to match "YYYY-MM-DD" format
  summary: { 
    type: String 
  },
  // Array of strings for the hero names
  charactersFeatured: [
    String
  ], 

  place: {
     ype: String 
  },

  storyArc: { 
    type: String 
  },

  pageCount: { 
    type: Number 
  }
}, 
{ timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);
