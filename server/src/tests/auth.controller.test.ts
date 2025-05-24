import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthController } from '../controllers/auth.controller';

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('login → 200 + { token }', async () => {
    req.body = { username: 'u', password: 'p' };
    await AuthController.login(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
  });

  it('me → 200 + { userId }', async () => {
    (req as any).userId = '42';
    await AuthController.me(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({ userId: '42' });
  });
});
