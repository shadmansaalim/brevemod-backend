// Imports
import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';

// Higher order function to wrap up the given function from controller and implement try catch block to handle errors
const catchAsync = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Calling the controller function
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default catchAsync;
