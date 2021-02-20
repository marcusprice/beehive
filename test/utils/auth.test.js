const {
  minutesToMilliseconds,
  incrementLoginAttempt,
  enoughTimePassed,
  handleTime,
} = require('../../utils/auth');
const fiveMinutes = minutesToMilliseconds(5);
const tenMinutes = minutesToMilliseconds(10);

describe('auth utilties', () => {
  describe('minutesToMilliseconds', () => {
    test('correctly convert minutes to milliseconds', () => {
      expect(minutesToMilliseconds(1)).toBe(60000);
      expect(minutesToMilliseconds(2)).toBe(120000);
      expect(minutesToMilliseconds(4)).toBe(240000);
      expect(minutesToMilliseconds(8)).toBe(480000);
      expect(minutesToMilliseconds(16)).toBe(960000);
      expect(minutesToMilliseconds(128)).toBe(7680000);
      expect(minutesToMilliseconds(256)).toBe(15360000);
      expect(minutesToMilliseconds(512)).toBe(30720000);
      expect(minutesToMilliseconds(1024)).toBe(61440000);
    });
  });

  describe('incrementLoginAttempt', () => {
    test('correctly increments if there are current attempts', () => {
      expect(incrementLoginAttempt(1)).toBe(2);
      expect(incrementLoginAttempt(5)).toBe(6);
      expect(incrementLoginAttempt(10)).toBe(11);
      expect(incrementLoginAttempt(50)).toBe(51);
      expect(incrementLoginAttempt(100)).toBe(101);
    });

    test('returns 1 if input undefined', () => {
      const blankObject = {};
      expect(incrementLoginAttempt(undefined)).toBe(1);
      expect(incrementLoginAttempt(blankObject?.loginAttempts)).toBe(1);
    });
  });

  describe('enoughTimePassed', () => {
    test('returns true when enough time passed', () => {
      const now = new Date().getTime();
      const tenMinutes = minutesToMilliseconds(10);
      expect(enoughTimePassed(now - (tenMinutes + 1), tenMinutes)).toBe(true);
    });

    test('returns false when not enough time has passed', () => {
      const now = new Date().getTime();
      expect(
        enoughTimePassed(now - (tenMinutes - fiveMinutes), tenMinutes)
      ).toBe(false);
    });
  });

  describe('handleTime', () => {
    test('should return updated time if locked out state is false', () => {
      expect(handleTime({ lockedOut: false, time: null })).toBe(
        new Date().getTime()
      );
    });

    test('should return saved time if locked out status is true', () => {
      const lockedOut = {
        status: true,
        time: new Date().getTime() - fiveMinutes,
      };

      expect(handleTime(lockedOut)).toBe(lockedOut.time);
    });
  });
});
