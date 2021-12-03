const env = require('../env');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { checkUser, getUser } = require('../data/users');
const error = require('../error');

router.post('/', async (req, res) => {
  try {
    const userBody = req.body;
    let foundUser = null;
    try {
      error.str(userBody?.email);
      error.str(userBody?.password);
      foundUser = await checkUser(userBody?.email, userBody?.password);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const { email } = userBody;
    const payload = { email };
    const secret = env.secret;
    const token = jwt.sign(payload, secret, {
      expiresIn: '1h',
    });

    let user = null;
    if (foundUser) {
      user = await getUser(foundUser.userId);
    }

    res.cookie('token', token, { httpOnly: true });

    const response = {
      authenticated: true,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: user?.role,
      token,
    };
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
