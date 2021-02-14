const express = require('express');
const server = express();
const port = process.env.PORT || 5000;
const { createNewUser } = require('./controllers/user');

//middleware for post requests
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.post('/createUser', async (req, res) => {
  try {
    const user = await createNewUser(req.body);
    res.json(user);
  } catch (error) {
    res.json({ error: error.toString() });
  }
});

server.listen(port, () => {
  console.log('server listneing on port ' + port);
});
