import { prisma } from '../config/db';
import { AppError } from '../utils/appError';

// Standard columns to select so we never expose passwords
const userSelection = {
  id: true,
  username: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({ select: userSelection });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelection,
  });

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  return user;
};

export const updateUser = async (id: string, updateData: any) => {
  // 1. Ensure the user exists first
  await getUserById(id);

  // 2. Handle uniqueness conflicts if they are updating email/username
  if (updateData.email || updateData.username) {
    const conflictUser = await prisma.user.findFirst({
      where: {
        NOT: { id },
        OR: [
          ...(updateData.email ? [{ email: updateData.email }] : []),
          ...(updateData.username ? [{ username: updateData.username }] : []),
        ],
      },
    });

    if (conflictUser) {
      throw new AppError('Username or Email is already taken', 409);
    }
  }

  // 3. Perform database record write modification
  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: userSelection,
  });
};

export const deleteUser = async (id: string) => {
  await getUserById(id);
  
  await prisma.user.delete({ where: { id } });
};