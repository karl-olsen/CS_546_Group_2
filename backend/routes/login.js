const env = require('../env');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { checkUser } = require('../data/users');
const error = require('../error');

router.post('/', async (req, res) => {
  try {
    const userBody = req.body;
    try {
      error.str(userBody?.email);
      error.str(userBody?.password);
      await checkUser(userBody?.email, userBody?.password);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const { email } = userBody;
    const payload = { email };
    const secret = env.secret;
    const token = jwt.sign(payload, secret, {
      expiresIn: '1h',
    });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ authenticated: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
