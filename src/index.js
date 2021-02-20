require('dotenv').config();
const express = require('express'),
  server = express(),
  port = process.env.PORT || 5000,
  helmet = require('helmet'),
  session = require('express-session'),
  { verifyLoginAttempts } = require('./middleware/auth');

// helmet middlware
server.use(helmet());

// middleware for post requests
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// session middleware
server.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// auth middleware
server.use('/api/authenticate', verifyLoginAttempts);

// routes
require('./routes/user')(server);

server.listen(port, () => {
  console.log('server listneing on port ' + port);
});
