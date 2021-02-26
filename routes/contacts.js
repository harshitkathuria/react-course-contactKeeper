const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Contact = require('../models/Contact');

// Get all user's contact
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// Add contact
router.post('/', [auth, 
  check('name', 'Name is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  const { name, email, phone, type } = req.body;
  try {
    const newContact = new Contact({
      name,
      email,
      phone,
      type,
      user: req.user.id
    });
    
    const contact = await newContact.save();
    res.status(200).json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500),send('Server Error');
  }
})

// Update contact
router.patch('/:id', auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body);
  res.status(201).json({ msg: 'User Updated', user });
})

// Delete contact
router.delete('/:id', auth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  res.status(204).json({ msg: 'User Deleted '});
})

module.exports = router;