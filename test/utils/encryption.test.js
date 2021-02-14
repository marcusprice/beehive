const { generateHash } = require('../../utils/encryption');

describe('generateHash', () => {
  test('should consistently generate the same output', () => {
    expect(generateHash('test')).toBe(generateHash('test'));

    expect(generateHash('12345test12###')).toBe(generateHash('12345test12###'));

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
