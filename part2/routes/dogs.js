const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all dogs (used for homepage display)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT dog_id, name, size, owner_id
      FROM Dogs
    `);
    res.json(rows);
  } catch (err) {
    console.error('🐶 Error in /api/dogs:', err.message);
    res.status(500).json({ error: 'Failed to load dogs' });
  }
});

// GET dogs owned by currently logged-in owner
router.get('/my-dogs', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'owner') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const [rows] = await db.query(
      'SELECT dog_id, name FROM Dogs WHERE owner_id = ?',
      [req.session.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;
