const express = require('express');
const router = express.Router();

// Signup
router.post('/', (req, res) => {
  res.send('Register a user');
})

module.exports = router;