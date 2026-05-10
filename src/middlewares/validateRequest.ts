import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ZodError, ZodType } from "zod";

export const validateRequest =
  (schema: ZodType<any>, property: "body" | "query" | "params" = "body") =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = await schema.parseAsync(req[property] || {});
      req[property] = result;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const msg = err.issues.map((e) => e.message).join(", ");
        next(createHttpError(400, `Invalid input: ${msg}`));
      } else {
        next(createHttpError(400, "Validation failed"));
      }
    }
  };
