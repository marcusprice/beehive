const { createNewUser } = require('../../src/controllers/user');
const { db, user } = require('../../src/models/db');
const { generateHash } = require('../../utils/encryption');
const userData = {
  email: 'person@example.com',
  password: 'password69',
};

describe('user controller', () => {
  describe('createNewUser', () => {
    test('should throw an error if email aready exists in db', async () => {
      await user.sync({ force: true });
      await createNewUser(userData);

      await expect(
        createNewUser({
          email: 'person@example.com',
          password: 'password',
        })
      ).rejects.toThrow('Validation error');
    });

    test('should not return the password after user is created', async () => {
      await user.sync({ force: true });
      const newUser = await createNewUser(userData);

      expect(newUser.dataValues).not.toHaveProperty('password');
    });

    test('that the password is encrypted when new user is created', async () => {
      await user.sync({ force: true });
      await createNewUser(userData);
      const newUser = await user.findAll({
        where: { lookupValue: generateHash(userData.email) },
      });

      expect(newUser[0].dataValues.password.length).toBe(64);
    });
  });
});

//closes db after test suite process is closed
const cleanup = () => {
  db.close();
};

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGUSR1', cleanup);
process.on('SIGUSR2', cleanup);
