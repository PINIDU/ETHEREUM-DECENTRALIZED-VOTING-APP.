const express = require('express');
const router = express.Router();
const ElectionResult = require('../model/election_result');
const he = require('he');
const { body, param, validationResult } = require('express-validator');
const sanitize = require('mongo-sanitize');

// Get all election results
router.get('/', async (req, res) => {
  try {
    const results = await ElectionResult.find();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create an election result
router.post('/', [
  // Validation using express-validator
  body('candidate').notEmpty().withMessage('Candidate is required'),
  body('votes').isInt({ min: 0 }).withMessage('Votes must be a positive integer')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { candidate, votes } = req.body;

    const newResult = new ElectionResult({
      candidate,
      votes
    });

    await newResult.save();

    res.status(201).json(newResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update an election result
router.put('/:id', async (req, res) => {
  try {
    const { candidate, votes } = req.body;

    const result = await ElectionResult.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    result.candidate = candidate;
    result.votes = votes;

    await result.save();

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete an election result
router.delete('/:id', async (req, res) => {
  try {
    const result = await ElectionResult.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    await result.remove();

    res.json({ message: 'Result removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
module.exports = router;