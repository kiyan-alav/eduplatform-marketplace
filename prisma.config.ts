import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { ENV } from "./src/configs/env";

export default defineConfig({
  schema: "./prisma/",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // url: env("DATABASE_URL"),
    url: ENV.DATABASE_URL,
  },
});
