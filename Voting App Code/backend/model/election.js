const mongoose = require('mongoose');

// Define the Election schema
const electionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create the Election model
const Election = mongoose.model('Election', electionSchema);

module.exports = Election;
