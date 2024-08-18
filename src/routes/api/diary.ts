import express from "express";
import multer from "multer";

import validateRequest from "middleware/validate/validateRequest";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";
import requireUserToken from "middleware/token/requireUserToken";

import writeDiary, { WriteDiaryRequestBody } from "controller/diary/writeDiary";
import patchDiary, { PatchDiaryRequestBody } from "controller/diary/patchDiary";

const diaryRouter = express.Router();

// multer 객체 생성
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1,
  },

  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(null, false);
  },
});

// 컨트롤러
diaryRouter.post(
  "/",
  upload.single("diaryImage"),
  requireUserToken,
  validateRequest({ body: WriteDiaryRequestBody }),
  writeDiary
);
diaryRouter.patch(
  "/",
  requireUserToken,
  validateRequest({ body: PatchDiaryRequestBody }),
  patchDiary
);

// 404 핸들 미들웨어
diaryRouter.use(apiNotFoundErrorHandler);

export default diaryRouter;
