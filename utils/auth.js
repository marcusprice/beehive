const minutesToMilliseconds = (minutes) => minutes * 60000;

const incrementLoginAttempt = (loginAttempts) =>
  loginAttempts ? loginAttempts + 1 : 1;

const enoughTimePassed = (time, lockedOutTime) => {
  const now = new Date().getTime();
  return now - time > lockedOutTime;
};

const handleTime = (lockedOut) =>
  lockedOut?.status ? lockedOut.time : new Date().getTime();

exports.minutesToMilliseconds = minutesToMilliseconds;
exports.incrementLoginAttempt = incrementLoginAttempt;
exports.enoughTimePassed = enoughTimePassed;
exports.handleTime = handleTime;
