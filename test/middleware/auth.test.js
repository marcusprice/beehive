const { verifyLoginAttempts } = require('../../src/middleware/auth');
// request
const request = {
  session: {
    overallLoginAttempts: 0,
    currentLoginAttempts: 0,
  },
  headers: { ['x-forwarded-for']: '172.217.14.228' }, // (ip address for google.com)
};

// response
const response = {
  status: jest.fn(() => {
    return response;
  }),
  send: jest.fn(() => {
    return response;
  }),
};

// next
const next = jest.fn();

beforeEach(() => {
  request.session.overallLoginAttempts = 0;
  request.session.currentLoginAttempts = 0;
  jest.clearAllMocks();
});

describe('auth middleware', () => {
  describe('verifyLoginAttempts', () => {
    test('calls next function if there are less than 5 & 100', () => {
      //with no attempts
      verifyLoginAttempts(request, response, next);
      expect(next.mock.calls.length).toBe(1);
      // at the limit of attempts
      request.session.overallLoginAttempts = 99;
      request.session.currentLoginAttempts = 4;
      verifyLoginAttempts(request, response, next);
      expect(next.mock.calls.length).toBe(2);
    });

    test('should call status 403 when there are over 5 current attempts to sign in', () => {
      request.session.currentLoginAttempts = 6;

      verifyLoginAttempts(request, response, next);
      expect(response.status.mock.calls.length).toBe(1);
      expect(response.status.mock.calls[0][0]).toBe(403);
      expect(response.send.mock.calls.length).toBe(1);
      expect(response.send.mock.calls[0][0]).toBe(
        'Forbidden: Too many unsuccessful login attempts'
      );
    });

    test('should call status 403 when there are over 100 overall attempts to sign in', () => {
      request.session.overallLoginAttempts = 101;
      verifyLoginAttempts(request, response, next);
      expect(response.status.mock.calls.length).toBe(1);
      expect(response.status.mock.calls[0][0]).toBe(403);
      expect(response.send.mock.calls.length).toBe(1);
      expect(response.send.mock.calls[0][0]).toBe('Forbidden: IP is banned');
    });

    test('should send message if IP is banned', () => {
      // ip should be banned from previous/3rd test
      verifyLoginAttempts(request, response, next);
      expect(response.send.mock.calls.length).toBe(1);
      expect(response.send.mock.calls[0][0]).toBe('Forbidden: IP is banned');
    });
  });
});
