const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// 🔧 Add body parsers for forms and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔐 Add session middleware
app.use(session({
  secret: 'dog-secret-key',
  resave: false,
  saveUninitialized: false
}));

// 📁 Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// 🔗 Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
