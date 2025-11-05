import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map(
          (err: any) => `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        
        return res.status(400).json({
          success: false,
          error: `Validation error: ${errorMessage}`,
        });
      }
      next(error);
    }
  };
};