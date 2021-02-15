const { generateHash, encrypt, decrypt } = require('../../utils/encryption'),
  fs = require('fs'),
  longText = fs.readFileSync(__dirname + '/longText.txt', 'utf8');

describe('encryption utilities', () => {
  describe('generateHash', () => {
    test('should consistently generate the same output', () => {
      expect(generateHash('test')).toBe(generateHash('test'));

      expect(generateHash('12345test12###')).toBe(
        generateHash('12345test12###')
      );

      expect(generateHash('!!!!ooooo44444fffff')).toBe(
        generateHash('!!!!ooooo44444fffff')
      );
    });

    test('output should always generate a hash (even with no input)', () => {
      expect(generateHash('').length).not.toBe(0);
      expect(generateHash('').length).toBeGreaterThan(0);
    });

    test('output should generate different hashes for different input', () => {
      const hashOne = generateHash('123hashOne#');
      const hashTwo = generateHash('123hashTwo#');

      expect(hashOne).not.toBe(hashTwo);
    });

    test('output should always be 64 characters long', () => {
      const hashOne = generateHash('');
      const hashTwo = generateHash('123456-1!!!');
      const hashThree = generateHash('Duis !!!! irure 11121 in');
      const hashFour = generateHash('password');

      expect(hashOne.length).toBe(64);
      expect(hashTwo.length).toBe(64);
      expect(hashThree.length).toBe(64);
      expect(hashFour.length).toBe(64);
    });
  });

  describe('encrypt', () => {
    test('that output is a string', () => {
      expect(typeof encrypt('value')).toBe('string');
    });

    test('output should not match original text', () => {
      const inputValue =
        "I'm trying to free your mind, Neo. But I can only show you the door. You're the one that has to walk through it.";
      expect(encrypt(inputValue)).not.toBe(inputValue);
    });

    test('should generate string even with no input', () => {
      expect(encrypt('').length).toBeGreaterThan(0);
    });

    test('should be able to encrypt long string of text', () => {
      expect(encrypt(longText)).not.toBe(longText);
      expect(encrypt(longText)).not.toBe('');
      expect(encrypt(longText).length).toBeGreaterThan(longText.length);
    });
  });

  describe('decrypt', () => {
    test('output should match original value before encryption', () => {
      const testValue1 = 'The Runners 4';
      const testValue2 = '123456789-98766544322';
      const testValue3 = '!!!$$$!@$@#^$%*()---@#^   23423 258';
      const testValue4 = '"""""""\'\'\'\'\'\'"""""""';

      expect(decrypt(encrypt(testValue1))).toBe(testValue1);
      expect(decrypt(encrypt(testValue2))).toBe(testValue2);
      expect(decrypt(encrypt(testValue3))).toBe(testValue3);
      expect(decrypt(encrypt(testValue4))).toBe(testValue4);
    });

    test('output is a string', () => {
      expect(typeof decrypt(encrypt('test1234'))).toBe('string');
    });

    test('decrypts empty string correctly', () => {
      expect(decrypt(encrypt(''))).toBe('');
    });

    test('decrypts long text correctly', () => {
      expect(decrypt(encrypt(longText))).toBe(longText);
    });
  });
});
