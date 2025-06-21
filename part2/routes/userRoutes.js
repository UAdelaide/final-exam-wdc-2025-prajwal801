const express = require('express');
const router = express.Router();
const db = require('../models/db');

// 🔐 Login route
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

// ✅ NEW: Get all dogs owned by the currently logged-in owner
router.get('/dogs', async (req, res) => {
  const ownerId = req.session?.user?.id;

  if (!ownerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [rows] = await db.query(`
      SELECT dog_id, name
      FROM Dogs
      WHERE owner_id = ?
    `, [ownerId]);

    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching owner dogs:', error.message);
    res.status(500).json({ error: 'Failed to fetch owner dogs' });
  }
});

module.exports = router;
