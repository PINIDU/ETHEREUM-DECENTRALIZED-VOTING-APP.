const mongoose = require('mongoose');

const electionResultSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  votes: {
    type: Number,
    required: true
  }
});

const ElectionResult = mongoose.model('ElectionResult', electionResultSchema);

module.exports = ElectionResult;
