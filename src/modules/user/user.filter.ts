// user.filters.ts
import { z } from "zod";
import { UserRole } from "../../generated/prisma/enums";
import { BaseListQuerySchema } from "../../utils/baseFilterSchema";

export const UserListQuerySchema = BaseListQuerySchema.extend({
  email: z.string().optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  role: z.enum(UserRole).optional(),
});

export const InstructorRequestQuerySchema = BaseListQuerySchema.extend({
  email: z.string().optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
});
