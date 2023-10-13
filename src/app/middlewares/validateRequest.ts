// Imports
import { AnyZodObject, ZodEffects } from 'zod';
import { NextFunction, Request, Response } from 'express';

// Checks ZOD Validation of Request before sending to controller
const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
