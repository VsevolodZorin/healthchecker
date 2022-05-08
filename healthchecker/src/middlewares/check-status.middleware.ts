import { NextFunction, Request, Response } from 'express';

export const checkStatusMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    request.setTimeout(700, () => {
      console.log('timeout');
    });
    next();
  } catch (error) {
    response.status(400).send('checkStatusMiddleware catch');
  }
};
