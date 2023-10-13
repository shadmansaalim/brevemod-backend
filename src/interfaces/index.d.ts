/* eslint-disable @typescript-eslint/consistent-type-definitions */

// Imports
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
