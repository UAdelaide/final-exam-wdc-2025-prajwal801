const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
  secret: 'dog-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, '/public')));


const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
