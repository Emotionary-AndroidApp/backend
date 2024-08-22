import { z } from "zod";

import ResponseCode from "constant/responseCode";

import getGoals_ from "model/goal/getGoals";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 목표 주제 조회 요청 query
 */
export const GetGoalsQuery = z.object({});

/**
 * @description 목표 주제 조회 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  goals: {
    goalTitle: string;
    goalID: number;
  }[];
}

/**
 * @description 목표 주제 조회 요청을 처리하는 핸들러
 */
const getGoals: RequestHandler<
  {},
  Partial<ResponseBody>,
  {},
  z.infer<typeof GetGoalsQuery>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 목표 주제 불러오기
  const queryResult = await getGoals_({
    userId,
  });
  const goals = queryResult[0].map((goal) => ({
    goalTitle: goal.name,
    goalID: goal.id,
  }));

  return res.status(200).json({
    goals,
    message: "목표 주제 조회에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default getGoals;
