const express = require('express');
const router = express.Router();
const { doesEmailExist } = require('../data/users');
const userData = require('../data/users');
const error = require('../error');

router.post('/', async (req, res) => {
  try {
    const userBody = req.body;
    try {
      // Test all invalid scenarios; throw 400 if true
      error.str(userBody?.firstName);
      error.str(userBody.lastName);
      error.str(userBody?.email);
      error.str(userBody?.password);
      error.validPassword(userBody?.password);
      error.str(userBody?.role);
      error.validRole(userBody?.role);
      const exists = await doesEmailExist(userBody?.email);
      if (exists) throw new Error('Email already exists');
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // Create a user
    await userData.createUser(
      userBody?.firstName,
      userBody?.lastName,
      userBody?.email,
      userBody?.password,
      userBody?.role
    );

    return res.status(200).json({ status: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
