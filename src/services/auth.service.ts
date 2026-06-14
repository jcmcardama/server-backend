import { prisma } from '../config/db';
import { AppError } from '../utils/appError';
import { 
  hashPassword, 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/authUtils';

/**
 * Business logic to register a brand new user
 */
export const registerUser = async (userData: any) => {
  const { username, email, password } = userData;

  // 1. Fail fast if email or username is already taken
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  });

  if (existingUser) {
    throw new AppError('Email or Username already exists', 409); // 409 Conflict
  }

  // 2. Securely hash the password
  const hashedPassword = await hashPassword(password);

  // 3. Persist the new user records
  const newUser = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  // 4. Return user object without the sensitive hashed password field
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Business logic to verify a user's credentials and issue new tokens
 */
export const loginUser = async (credentials: any) => {
  const { email, password } = credentials;

  // 1. Locate the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401); // 401 Unauthorized
  }

  // 2. Validate the secret cryptographic hash match
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // 3. Issue cryptographic tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // 4. Save the active session refresh token to the database for token rotation tracking
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  return { userId: user.id, username: user.username, accessToken, refreshToken };
};

/**
 * Clears the user's active session tracking state in the database
 */
export const logoutUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null } // Wipe the token out entirely
  });
};

/**
 * Uses a valid Refresh Token to rotate and mint a brand-new access token
 */
export const refreshSession = async (incomingRefreshToken: string) => {
  if (!incomingRefreshToken) {
    throw new AppError('Authentication refresh token missing', 401);
  }

  try {
    // 1. Strictly decode and cryptographically verify the incoming token string
    const decoded = verifyRefreshToken(incomingRefreshToken);

    // 2. Cross-reference the database to ensure this specific token matches the user's current session
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new AppError('Invalid or expired refresh token session', 401);
    }

    // 3. Mint a brand-new short-lived access token
    const newAccessToken = generateAccessToken(user.id);
    return { newAccessToken };
  } catch (error) {
    throw new AppError('Invalid or expired refresh token session', 401);
  }
};