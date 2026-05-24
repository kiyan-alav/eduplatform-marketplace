// user.filters.ts
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
