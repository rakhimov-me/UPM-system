import { RequestHandler, Request, Response, NextFunction } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const wrap = (fn: AsyncHandler): RequestHandler => {
  return (req, res, next): void => {
    fn(req, res, next).catch(next);
  };
};
