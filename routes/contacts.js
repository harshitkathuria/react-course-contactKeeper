const express = require('express');
const router = express.Router();

// Get all user's contact
router.get('/', (req, res) => {
  res.send('Get all contact');
})

// Add contact
router.post('/', (req, res) => {
  res.send('Add Contact');
})

// Update contact
router.patch('/:id', (req, res) => {
  res.send('Update Contact');
})

// Delete contact
router.delete('/:id', (req, res) => {
  res.send('Delete Contact');
})

module.exports = router;