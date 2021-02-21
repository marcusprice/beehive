// src/middleware/auth.js

const {
  minutesToMilliseconds,
  enoughTimePassed,
  incrementLoginAttempt,
  handleTime,
} = require('../../utils/auth');
const bannedIPs = {};
const bannedIpTime = minutesToMilliseconds(1440); // 24 hours
const lockedOutTime = minutesToMilliseconds(15);

/**
 * @function verifyLoginAttempts
 * @description This express middleware function monitors and manages current and overall login attempts.
 * Users have up to 5 current attempts to sign in successfully before being blocked for a specified
 * amount of time. Once that time is passed the current attempts will reset and they'll have another 5
 * attempts before they are locked out again.
 *
 * The user has 100 overall attempts to sign in before their IP is banned for a specified amount of time.
 *
 * Both current and overall login attempts need to be reset to 0 when the user successfully signs in.
 *
 * @param {object} req - express request object
 * @param {object} res - express response object
 * @param {function} next - express next function
 */

const verifyLoginAttempts = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // if ip is banned, check if 24 hours has passed
  if (
    bannedIPs[ip]?.status &&
    enoughTimePassed(bannedIPs[ip]?.time, bannedIpTime)
  ) {
    req.session.overallLoginAttempts = 0;
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
  req.session.overallLoginAttempts = incrementLoginAttempt(
    req.session?.overallLoginAttempts
  );

  req.session.currentLoginAttempts = incrementLoginAttempt(
    req.session?.currentLoginAttempts
  );

  const overallLoginAttempts = req.session.overallLoginAttempts;
  const currentLoginAttempts = req.session.currentLoginAttempts;

  if (overallLoginAttempts > 100 || bannedIPs[ip]) {
    // more than 100 attempts, block IP address
    bannedIPs[ip] = {
      status: true,
      time: handleTime(overallLoginAttempts),
    };
    res.status(403).send('Forbidden: IP is banned');
  } else if (currentLoginAttempts > 5) {
    // temporarily block user access
    req.session.lockedOut = {
      status: true,
      time: handleTime(req.session.lockedOut),
    };

    res.status(403).send('Forbidden: Too many unsuccessful login attempts');
  } else {
    next();
  }
}; //end of verifyLoginAttempts

exports.verifyLoginAttempts = verifyLoginAttempts;
