import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../middleware/error-handler';

describe('errorHandler', () => {
  it('должен вернуть 500 + { error: message }', () => {
    const err = new Error('Test failure');
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next: NextFunction = jest.fn();

    errorHandler(err, {} as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Test failure' });
  });
});
