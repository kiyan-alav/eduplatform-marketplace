import { Request } from "express";
import fs from "fs";
import createError from "http-errors";
import multer from "multer";
import path from "path";
import { logger } from "../configs/logger";

export const makeUploader = (
  folder: string,
  allowedMimes: string[],
  maxSizeMB: number = 5,
) => {
  const __dirname = path.resolve();
  const uploadDir = path.join(__dirname, "..", "..", "public", folder);

  logger.info(uploadDir);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, uploadDir);
    },
    filename: function (_req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

      cb(null, uniqueName);
    },
  });

  const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile?: boolean) => void,
  ) => {
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(createError(400, "File type is not allowed!"), false);
    }

    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
  });
};

export const userAvatarUpload = makeUploader(
  "users/avatars",
  ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  3,
);
export const coursesCoverUpload = makeUploader(
  "courses/covers",
  ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  5,
);
export const coursesVideoUpload = makeUploader(
  "courses/videos",
  ["video/mp4", "video/mkv", "video/webm"],
  200,
);
