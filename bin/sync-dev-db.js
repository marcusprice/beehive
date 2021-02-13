#!/usr/bin/env node
const { user } = require('../src/models/db');
user.sync();
