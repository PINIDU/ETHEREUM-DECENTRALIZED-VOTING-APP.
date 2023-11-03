const express = require('express');
const router = express.Router();
const Election = require('../model/election');
const he = require('he');
const { body, param, validationResult } = require('express-validator');
const sanitize = require('mongo-sanitize');

// Get all elections
router.get('/', async (req, res) => {
  try {
    const elections = await Election.find();

    // Encode the data before sending it as a response
    const encodedElections = elections.map(election => ({
      name: he.encode(election.name),
      startDate: he.encode(election.startDate),
      endDate: he.encode(election.endDate),
    }));

    res.json(encodedElections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a specific election by ID
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid election ID')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.json(election);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new election
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('endDate').notEmpty().withMessage('End date is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, startDate, endDate } = sanitize(req.body);
    const newElection = new Election({ name, startDate, endDate });
    const savedElection = await newElection.save();
    res.status(201).json(savedElection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update an existing election
router.put('/:id', async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const updatedElection = await Election.findByIdAndUpdate(
      req.params.id,
      { name, startDate, endDate },
      { new: true }
    );
    if (!updatedElection) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.json(updatedElection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete an election
router.delete('/:id', async (req, res) => {
  try {
    const deletedElection = await Election.findByIdAndRemove(req.params.id);
    if (!deletedElection) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.json({ message: 'Election deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;