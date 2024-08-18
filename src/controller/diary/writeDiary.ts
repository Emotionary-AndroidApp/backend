import fs from "fs";
import path from "path";
import { QueryError } from "mysql2";
import { z } from "zod";

import ResponseCode from "constant/responseCode";

import createDiary from "model/diary/createDiary";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";

import diarySchema from "schema/diary";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 다이어리 등록 요청 body
 */
export const WriteDiaryRequestBody = z.object({
  diaryDate: diarySchema.date,
  diaryEmotion: diarySchema.emotion,
  diaryTitle: diarySchema.title,
  diaryDetail: diarySchema.detail,
});

/**
 * @description 다이어리 등록 응답 body
 */
interface ResponseBody extends NecessaryResponse {}

/**
 * @description 회원가입 요청을 처리하는 핸들러
 */
const writeDiary: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof WriteDiaryRequestBody>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 파일 이름
  const pictureFileName = req.file
    ? `${Date.now()}_${req.file.originalname}`
    : undefined;

  try {
    const queryResult = await createDiary({
      userId,
      title: req.body.diaryTitle,
      content: req.body.diaryDetail,
      emotion: req.body.diaryEmotion,
      date: req.body.diaryDate,
      picture: req.file ? `/file/diary/${pictureFileName}` : undefined,
    });

    if (queryResult[0].affectedRows === 0)
      return next(new ServerError("일기를 생성할 수 없습니다."));
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === "ER_DUP_ENTRY")
        return next(new DuplicationError(["날짜"]));
    }
    throw error;
  }

  // 일기 등록 성공 시 프로필 사진 파일 저장
  if (req.file && pictureFileName) {
    fs.writeFileSync(
      path.resolve("files/diary", pictureFileName),
      req.file.buffer
    );
  }

  return res.status(200).json({
    message: "다이어리 등록에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default writeDiary;
