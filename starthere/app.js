const express = require('express');
const path = require('path');
const session = require('express-session');
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'dog-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
