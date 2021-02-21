// utils/auth.js
// utility functions for authorization

/**
 * @function minutesToMilliseconds
 * @description converts minutes to ms
 *
 * @param {number} minutes - number of minutes to be converted to milliseconds
 * @returns {number} - the minutes input converted to milliseconds
 */

const minutesToMilliseconds = (minutes) => minutes * 60000;

/**
 * @function incrementLoginAttempt
 * @description handles either setting or incrementing a login attempt
 *
 * @param {number} loginAttempts - number to be incremented
 * @returns {number} - if loginAttempts is defined it returns incremented value,
 * otherwise returns 1
 */
const incrementLoginAttempt = (loginAttempts) =>
  loginAttempts ? loginAttempts + 1 : 1;

/**
 * @function enoughTimePassed
 * @description determines if enough time has passed
 *
 * @param {number} time - the time to be checked
 * @param {number} lockedOutTime - the amount of time that needs to pass to return true
 * @returns {boolean} - if enough time has passed true is returned, false if not
 */
const enoughTimePassed = (time, lockedOutTime) => {
  const now = new Date().getTime();
  return now - time > lockedOutTime;
};

/**
 * @function handleTime
 * @description handles whether to keep current time or generate new timestamp
 *
 * @param {number} time - the time to be checked
 * @returns {number} - returns time if it is defined, otherwise a new timestamp is returned
 */
const handleTime = (lockedOut) =>
  lockedOut?.status ? lockedOut.time : new Date().getTime();

exports.minutesToMilliseconds = minutesToMilliseconds;
exports.incrementLoginAttempt = incrementLoginAttempt;
exports.enoughTimePassed = enoughTimePassed;
exports.handleTime = handleTime;
