// Imports
import { JwtPayload, Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Function to creat jwt token
const createToken = (
  payload: {
    id: Types.ObjectId;
    role: string;
  },
  secret: Secret,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

// Function to verify jwt token
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const JwtHelpers = { createToken, verifyToken };
