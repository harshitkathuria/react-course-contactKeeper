const express = require('express');
const router = express.Router();

// Get logged in user
router.get('/', (req, res) => {
  res.send('Get logged in user');
})

// Login
router.post('/', (req, res) => {
  res.send('Login user');
})

module.exports = router;