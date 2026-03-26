const mongoose = require('mongoose');

const storyArcSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    mainCharacters: {
      type: [String],
    },

    startIssue: {
      type: Number,
    },

    endIssue: {
      type: Number,
    },

    status: {
      type: String,
      enum: ['Planned', 'Ongoing', 'Completed'],
      default: 'Planned',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(storyArcSchema);
