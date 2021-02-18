const { createNewUser, authenticateUser } = require('../controllers/user'),
  jwt = require('jsonwebtoken');

module.exports = (server) => {
  server.post('/api/createUser', async (req, res) => {
    try {
      const user = await createNewUser(req.body);
      res.json(user);
    } catch (error) {
      res.json({ error: error.toString() });
    }
  });

  server.get('/api/authenticate', async (req, res) => {
    const email = req.query.email,
      password = req.query.password;

    try {
      const userData = await authenticateUser(email, password);
      jwt.sign({ userData }, process.env.JWT_SECRET_KEY, (error, token) => {
        res.json({ token });
      });
    } catch (error) {
      res.json({ error });
    }
  });
};
