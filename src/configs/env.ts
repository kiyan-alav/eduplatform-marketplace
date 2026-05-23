import { z } from "zod";
import { logger } from "./logger";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1),
  ACCESS_SECRET_KEY: z.string().min(10),
  REFRESH_SECRET_KEY: z.string().min(10),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  BCRYPT_SALT: z.coerce.number().default(12),
  ACCESS_EXPIRES: z.string().default("8h"),
  REFRESH_EXPIRES: z.string().default("7d"),
  LOG_LEVEL: z.enum(["debug", "info"]).default("info"),
  BASE_URL: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error("Invalid environment variables");
  const tree = z.treeifyError(parsedEnv.error);
  logger.error(tree);
  process.exit(1);
}

export const ENV = parsedEnv.data;
