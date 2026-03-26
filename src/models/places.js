const mongoose = require('mongoose');

const worldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    population: {
      type: Number,
      min: 0,
    },
    technologyLevel: {
      type: String,
      trim: true,
    },
    notableLocations: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('World', worldSchema);
