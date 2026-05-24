// user.filters.ts
import { z } from "zod";
import { FilterConfig } from "../../utils/query-builder";
import { IUserFilter } from "./user.types";

export const userFilterConfig: FilterConfig<IUserFilter> = {
  searchable: ["email", "phone", "fullName"],
  regex: ["email", "phone", "fullName"],
  exact: [],
  enumList: ["roles" as keyof IUserFilter],
};

export const instructorRequestsFilterConfig: FilterConfig<IUserFilter> = {
  searchable: ["email", "phone", "fullName"],
  regex: ["email", "phone", "fullName"],
  exact: [],
  enumList: [],
};

const PaginationSchema = z.object({
  page: z.coerce
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional()
    .default(1),
  limit: z.coerce
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional()
    .default(10),
  sort: z.string().optional().default("-createdAt"),
});

export const UserListQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  roles: z
    .string()
    .optional()
    .transform((val) => val?.split(",")),
});

export const InstructorRequestQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
});
