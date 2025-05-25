import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const wrap =
  (fn: Function, ctx?: any) =>
  (req: any, res: any, next: any) =>
    fn.call(ctx ?? fn, req, res, next);