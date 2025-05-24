import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth';

describe('authMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('401, если заголовок отсутствует', () => {
    authMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No auth header' });
  });

  it('401 при некорректном формате Bearer', () => {
    req.headers = { authorization: 'Bad token' };
    authMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });

  it('401 при неверном токене', () => {
    req.headers = { authorization: 'Bearer invalid' };
    authMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('должен вызвать next и поставить req.userId для валидного токена', () => {
    const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET!);
    req.headers = { authorization: `Bearer ${token}` };
    authMiddleware(req as Request, res as Response, next);
    expect((req as any).userId).toBe('123');
    expect(next).toHaveBeenCalled();
  });
});
