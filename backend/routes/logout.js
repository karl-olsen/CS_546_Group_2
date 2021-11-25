const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);

    res.cookie('token', '', { expires: anHourAgo });
    res.clearCookie('token');

    res.status(200).json({ status: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
