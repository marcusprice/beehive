const {
    createNewUser,
    updateUser,
    authenticateUser,
  } = require('../controllers/user'),
  jwt = require('jsonwebtoken'),
  { signJWT, verifyJWT } = require('../../utils/jwt');

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
      const token = await signJWT(userData, process.env.JWT_SECRET_KEY);
      req.session.overallLoginAttempts = 0;
      req.session.currentLoginAttempts = 0;
      res.json({ token });
    } catch (error) {
      res.json({ error });
    }
  });

  server.get('/api/getUserData', async (req, res) => {
    try {
      const authData = await verifyJWT(req.token, process.env.JWT_SECRET_KEY);
      res.json(authData);
    } catch (error) {
      res.status(403).send('Forbidden');
    }
  });

  server.post('/api/updateUser', async (req, res) => {
    const email = req.body.email;
    const newUserData = JSON.parse(req.body.newUserData);

    try {
      await verifyJWT(req.token, process.env.JWT_SECRET_KEY);
      const updatedUserData = await updateUser(email, newUserData);
      const token = await signJWT(updatedUserData, process.env.JWT_SECRET_KEY);
      res.json({ token });
    } catch (error) {
      res.status(403).send('Forbidden');
    }
  });
};
