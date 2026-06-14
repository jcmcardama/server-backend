import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getAll = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json({ status: 'success', data: { users } });
};

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id as string; 

  const user = await userService.getUserById(id);
  res.status(200).json({ status: 'success', data: { user } });
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const updatedUser = await userService.updateUser(id, req.body);
  res.status(200).json({ status: 'success', data: { user: updatedUser } });
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await userService.deleteUser(id);
  res.status(204).json({ status: 'success', data: null });
};