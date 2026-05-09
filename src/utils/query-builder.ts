import { PaginateOptions, QueryFilter } from "mongoose";

export interface FilterConfig<T> {
  searchable?: (keyof T)[];
  regex?: (keyof T)[];
  exact?: (keyof T)[];
  enumList?: (keyof T)[];
}

export interface CustomQueryOptions {
  page?: number | string;
  limit?: number | string;
  sort?: string;
  search?: string;
  [key: string]: unknown;
}

export interface BuiltFilters<T> {
  mongoFilter: QueryFilter<T>;
  options: PaginateOptions;
}

export function buildQueryFilters<T>(
  filter: CustomQueryOptions,
  config: FilterConfig<T> = {},
): BuiltFilters<T> {
  const mongoFilter: QueryFilter<T> = {} as QueryFilter<T>;
  const options: BuiltFilters<T>["options"] = {};

  options.page = Number(filter.page) || 1;
  options.limit = Number(filter.limit) || 10;

  options.sort = filter.sort || "-createdAt";

  if (filter.search && config.searchable?.length) {
    (mongoFilter as any)["$or"] = config.searchable.map((key) => ({
      [key]: { $regex: filter.search!, $options: "i" },
    }));
  }

  if (config.regex?.length) {
    for (const key of config.regex) {
      const value = filter[key as string];
      if (typeof value === "string" && value.length > 0) {
        (mongoFilter as any)[key as string] = {
          $regex: value,
          $options: "i",
        };
      }
    }
  }

  if (config.exact?.length) {
    for (const key of config.exact) {
      const value = filter[key as string];
      if (value !== undefined && value !== null && value !== "") {
        (mongoFilter as any)[key as string] = value;
      }
    }
  }

  if (config.enumList?.length) {
    for (const key of config.enumList) {
      const value = filter[key as string];
      if (typeof value === "string" && value.includes(",")) {
        (mongoFilter as any)[key as string] = {
          $in: value.split(",").map((v) => v.trim()),
        };
      }
    }
  }

  return { mongoFilter, options };
}
