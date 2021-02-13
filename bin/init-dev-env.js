#!/usr/bin/env node
require('dotenv').config();
const { exec } = require('child_process');
const { user } = require('../src/models/db');
const command = __dirname + '/init-dev-env.sh ' + process.env.DB_PASSWORD;

exec(command, (err, stdout, stderr) => {
  console.log('made it here');

  if (err || stderr) {
    console.error(err || stderr);
  } else {
    console.log(stdout);
    user.sync();
  }
});
