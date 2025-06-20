const express = require('express');
const router = express.Router();
const db = require('../models/db'); // keep this
const session = require('express-session');

// Optional: only needed if session not defined in app.js
router.use(session({
  secret: 'dogwalk-secret',
  resave: false,
  saveUninitialized: true
}));

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE email = ? AND password_hash = ?
    `, [email, password]);

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
    } else {
      return res.redirect('/walker-dashboard.html');
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});
