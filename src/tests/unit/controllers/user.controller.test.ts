import { getAll, getById, update, remove } from '../../../../src/controllers/user.controller';
import * as userService from '../../../../src/services/user.service';
import { Request, Response } from 'express';

jest.mock('../../../services/user.service');

describe('User Controller Layer - Pure Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('getAll() should return 200 and list all database users', async () => {
    const mockUsers = [{ id: '1', username: 'alice', email: 'a@ex.com', createdAt: new Date(), updatedAt: new Date() }];
    jest.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

    await getAll(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { users: mockUsers } });
  });

  it('getById() should return 200 and return a single matched user profile', async () => {
    req.params!.id = 'user-123';
    const mockUser = { id: 'user-123', username: 'bob', email: 'b@ex.com', createdAt: new Date(), updatedAt: new Date() };
    jest.mocked(userService.getUserById).mockResolvedValue(mockUser);

    await getById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { user: mockUser } });
  });

  it('update() should return 200 and display the newly modified database user record', async () => {
    req.params!.id = 'user-123';
    req.body = { username: 'updatedbob' };
    const mockUpdatedUser = { id: 'user-123', username: 'updatedbob', email: 'b@ex.com', createdAt: new Date(), updatedAt: new Date() };
    jest.mocked(userService.updateUser).mockResolvedValue(mockUpdatedUser);

    await update(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { user: mockUpdatedUser } });
  });

  it('remove() should return 204 No Content when a user record is purged', async () => {
    req.params!.id = 'user-123';
    jest.mocked(userService.deleteUser).mockResolvedValue(undefined);

    await remove(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: null });
  });
});