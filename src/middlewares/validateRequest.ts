import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ZodError, ZodType } from "zod";

export const validateRequest =
  (schema: ZodType<any>, property: "body" | "query" | "params" = "body") =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = await schema.parseAsync(req[property] || {});
      Object.assign(req[property], result);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string[]> = {};

        for (const issue of err.issues) {
          const field = issue.path.join(".") || "root";

          if (!errors[field]) {
            errors[field] = [];
          }

          errors[field].push(issue.message);
        }

        return next(
          createHttpError(400, "Validation failed", {
            errors,
          }),
        );
      }
      console.error("Unexpected Validation Error:", err); 
      return next(createHttpError(400, (err as Error).message || "Validation failed 2"));
    }
  };
