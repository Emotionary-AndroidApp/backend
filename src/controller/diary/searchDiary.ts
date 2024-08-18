import { z } from "zod";

import ResponseCode from "constant/responseCode";

import getDiariesByKeyword from "model/diary/getDiariesByKeyword";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 다이어리 리스트 조회 요청 query
 */
export const SearchDiaryQuery = z.object({
  query: z.string().min(1).optional(),
  offset: z
    .string()
    .refine((value) => !isNaN(Number(value)))
    .optional(),
});

/**
 * @description 다이어리 리스트 조회 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  results: {
    diaryID: number;
    diaryTitle: string;
    diaryEmotion: number;
  }[];
  isEnd: boolean;
}

/**
 * @description 다이어리 리스트 조회 요청을 처리하는 핸들러
 */
const searchDiary: RequestHandler<
  {},
  Partial<ResponseBody>,
  {},
  z.infer<typeof SearchDiaryQuery>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 일기 불러오기
  const queryResult = await getDiariesByKeyword({
    keyword: req.query.query,
    offset: parseInt(req.query.offset ?? "0"),
    userId,
  });
  const diaries = queryResult[0];
  const searchResult = diaries.map((diary) => ({
    diaryID: diary.id,
    diaryTitle: diary.title,
    diaryEmotion: diary.emotion,
  }));

  return res.status(200).json({
    results: searchResult,
    isEnd: searchResult.length < 10,
    message: "다이어리 리스트 조회에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default searchDiary;
