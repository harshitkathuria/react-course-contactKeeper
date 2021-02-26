const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');

const auth = require('../middleware/auth');
const User = require('../models/User');

// Get logged in user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// Login
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {

  // Check for validation erorrs
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if(!user) {
      res.status(400).json({ msg: 'Invalid Credentials '});
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      res.status(400).json({ msg: 'Invalid Credentials '});
    }

    // Issue JWT
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 360000
    }, (err, token) => {
      if(err) throw err;
      res.json({ token });
    })

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

module.exports = router;