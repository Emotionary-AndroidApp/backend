import fs from "fs";
import path from "path";
import { QueryError } from "mysql2";
import { z } from "zod";

import ResponseCode from "constant/responseCode";

import editDiary from "model/diary/editDiary";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";

import diarySchema from "schema/diary";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 다이어리 수정 요청 body
 */
export const PatchDiaryRequestBody = z.object({
  diaryDate: diarySchema.date,
  diaryEmotion: diarySchema.emotion.optional(),
  diaryTitle: diarySchema.title.optional(),
  diaryDetail: diarySchema.detail.optional(),
});

/**
 * @description 다이어리 수정 응답 body
 */
interface ResponseBody extends NecessaryResponse {}

/**
 * @description 다이어리 수정을 처리하는 핸들러
 */
const patchDiary: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof PatchDiaryRequestBody>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  const queryResult = await editDiary({
    userId,
    date: req.body.diaryDate,
    diaryPatch: {
      title: req.body.diaryTitle,
      content: req.body.diaryDetail,
      emotion: req.body.diaryEmotion,
    },
  });

  if (queryResult[0].affectedRows === 0)
    return res.status(200).json({
      message: "해당 날짜에 다이어리가 등록되어 있지 않습니다.",
      code: ResponseCode.FAILURE,
    });

  return res.status(200).json({
    message: "다이어리 등록에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default patchDiary;
