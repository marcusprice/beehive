const {
  minutesToMilliseconds,
  enoughTimePassed,
  incrementLoginAttempt,
  handleTime,
} = require('../../utils/auth');
const bannedIPs = {};
const bannedIpTime = minutesToMilliseconds(1440); // 24 hours
const lockedOutTime = minutesToMilliseconds(15);

const verifyLoginAttempts = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // if ip is banned, check if 24 hours has passed
  if (
    bannedIPs[ip]?.status &&
    enoughTimePassed(bannedIPs[ip]?.time, bannedIpTime)
  ) {
    req.session.loginAttempts = 0;
    bannedIPs[ip].status = false;
    bannedIPs[ip].time = null;
  }

  // if locked out, check if 15 minutes has passed
  if (
    req.session.lockedOut?.status &&
    enoughTimePassed(req.session.lockedOut.time, lockedOutTime)
  ) {
    // user is locked out, but 15 minutes has passed so it can be reset
    req.session.lockedOut.status = false;
    req.session.time = null;
    req.session.currentLoginAttempts = 0;
  }

  // increment login attempts
  req.session.loginAttempts = incrementLoginAttempt(req.session?.loginAttempts);

  req.session.currentLoginAttempts = incrementLoginAttempt(
    req.session?.currentLoginAttempts
  );

  const loginAttempts = req.session.loginAttempts;
  const currentLoginAttempts = req.session.currentLoginAttempts;

  if (loginAttempts > 100 || bannedIPs[ip]) {
    // more than 100 attempts, block IP address
    bannedIPs[ip] = {
      status: true,
      time: handleTime(loginAttempts),
    };
    res.status(403).send('Forbidden: IP is banned');
  } else if (currentLoginAttempts > 5) {
    // temporarily block user access
    const time = (req.session.lockedOut = {
      status: true,
      time: handleTime(req.session.lockedOut),
    });

    res.status(403).send('Forbidden: Too many unsuccessful login attempts');
  } else {
    next();
  }
}; //end of verifyLoginAttempts

exports.verifyLoginAttempts = verifyLoginAttempts;
