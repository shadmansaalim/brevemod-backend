// Imports
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { JwtHelpers } from '../../helpers/jwtHelper';
import { Secret } from 'jsonwebtoken';

const authGuard =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get authorization token
      const token = req.headers.authorization;

      // Throwing error if token doesn't exists
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized.');
      }

      // Verify token
      const verifiedUser = JwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      // Throwing error if token is invalid
      if (!verifiedUser) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token.');
      }

      // Storing verified user
      req.user = verifiedUser;

      // Authorizing based on roles
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'You are not allowed to access the route.'
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default authGuard;
