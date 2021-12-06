const env = require('../env');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { checkUser, getUser } = require('../data/users');
const error = require('../error');

router.post('/', async (req, res) => {
  try {
    const userBody = req.body;
    let foundUserIdObj = null;
    try {
      error.str(userBody?.email);
      error.str(userBody?.password);
      foundUserIdObj = await checkUser(userBody?.email, userBody?.password);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    if (!foundUserIdObj) {
      throw new Error('Invalid email or password');
    }
    const user = await getUser(foundUserIdObj.userId);
    const { email, userId, role, firstName, lastName } = user;
    const payload = { 
      email,
      userId,
      role, 
      firstName, 
      lastName,
    };
    const secret = env.secret;
    const token = jwt.sign(payload, secret, {
      expiresIn: '1h',
    });
    
    res.cookie('token', token, { httpOnly: true });

    const response = {
      authenticated: true,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: user?.role,
      id: foundUserIdObj.userId,
      token,
      _id: user?._id,
    };
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
