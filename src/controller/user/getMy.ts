import { z } from "zod";

import ResponseCode from "constant/responseCode";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";
import getUserById from "model/user/getUserById";
import getDiaryCount from "model/diary/getDiaryCount";

/**
 * @description 마이페이지 화면 조회 요청 query
 */
export const GetMyRequestQuery = z.object({});

/**
 * @description 마이페이지 화면 조회 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  signupDate?: string;
  diaryCount?: number;
}

/**
 * @description 마이페이지 화면 조회 요청을 처리하는 핸들러
 */
const getMy: RequestHandler<
  {},
  ResponseBody,
  {},
  z.infer<typeof GetMyRequestQuery>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 데이터 불러오기
  const signupDatePromise = async () => {
    const queryResult = await getUserById({ id: userId });
    const signupDate = queryResult[0][0].createdAt;

    return signupDate;
  };

  const diaryCountPromise = async () => {
    const queryResult = await getDiaryCount({ userId });
    const diaryCount = queryResult[0][0].count;

    return diaryCount;
  };

  const [signupDate, diaryCount] = await Promise.all([
    signupDatePromise(),
    diaryCountPromise(),
  ]);

  return res.status(200).json({
    signupDate,
    diaryCount,
    message: "마이페이지 조회에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default getMy;
