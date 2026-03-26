const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    alias: {
      type: String,
      trim: true,
    },
    species: {
      type: String,
      trim: true,
    },
    alignment: {
      type: String,
      trim: true,
    },
    abilities: [
      {
        type: String,
        trim: true,
      },
    ],
    firstAppearanceIssue: {
      type: String,
    },
    homePlace: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Character', characterSchema);
