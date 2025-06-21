const express = require('express');
const router = express.Router(); // ✅ THIS LINE WAS MISSING
const db = require('../models/db');

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT user_id, username, role FROM Users WHERE username = ? AND password_hash = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const user = rows[0];
    req.session.user = {
      id: user.user_id,
      username: user.username,
      role: user.role
    };

    if (user.role === 'owner') {
      return res.redirect('/owner-dashboard.html');
    }
    return res.redirect('/walker-dashboard.html');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
