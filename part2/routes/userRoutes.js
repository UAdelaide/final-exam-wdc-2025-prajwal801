router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 🚨 Debug print
  console.log('Login attempt with:', username, password);

  try {
    const [rows] = await db.query(
      'SELECT user_id, username, role FROM Users WHERE username = ? AND password_hash = ?',
      [username, password]
    );

    // 🚨 Debug print
    console.log('Query result:', rows);

    if (rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    // Login success
    const user = rows[0];
    req.session.user = { id: user.user_id, username: user.username, role: user.role };

    if (user.role === 'owner') {
      return res.redirect('/owner-dashboard.html');
    }
    return res.redirect('/walker-dashboard.html');

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});
