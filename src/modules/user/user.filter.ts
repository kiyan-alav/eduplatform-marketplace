// user.filters.ts
import { z } from "zod";
import { PaginationSchema } from "../../utils/paginationSchema";
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
