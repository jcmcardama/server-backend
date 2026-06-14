import { hashPassword, comparePassword, generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../utils/authUtils';

describe('Auth Utilities - Unit Tests', () => {
  describe('Password Cryptography Engine', () => {
    it('should hash a text password and return true when verified', async () => {
      const pass = 'BoilerplateSecret1!';
      const hash = await hashPassword(pass);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(pass);

      const isMatch = await comparePassword(pass, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false if password comparison does not match the hash', async () => {
      const hash = await hashPassword('CorrectOne');
      const isMatch = await comparePassword('WrongOne', hash);
      expect(isMatch).toBe(false);
    });
  });

  describe('JWT Cryptographic Tokens', () => {
    const userId = 'sample-user-uuid';

    it('should successfully issue and verify an Access Token', () => {
      const token = generateAccessToken(userId);
      expect(token).toBeDefined();

      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(userId);
    });

    it('should successfully issue and verify a Refresh Token', () => {
      const token = generateRefreshToken(userId);
      expect(token).toBeDefined();

      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(userId);
    });
  });
});