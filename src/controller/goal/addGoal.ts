import { QueryError } from "mysql2";
import { z } from "zod";

import ResponseCode from "constant/responseCode";

import createGoal from "model/goal/createGoal";
import disableMainGoal from "model/goal/disableMainGoal";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";

import commonSchema from "schema/common";
import goalSchema from "schema/goal";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 목표 주제 등록 요청 body
 */
export const AddGoalBody = z.object({
  goalTitle: goalSchema.title,
  goalMain: z.boolean(),
  goalStart: commonSchema.date,
  goalEnd: commonSchema.date,
});

/**
 * @description 목표 주제 등록 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  goalID: number;
}

/**
 * @description 목표 주제 등록 요청을 처리하는 핸들러
 */
const addGoal: RequestHandler<
  {},
  Partial<ResponseBody>,
  z.infer<typeof AddGoalBody>
> = async function (req, res, next) {
  // goalStart와 goalEnd가 오늘을 포함하는지 확인
  const currentTime = new Date().getTime();
  if (
    new Date(req.body.goalStart).getTime() > currentTime ||
    new Date(req.body.goalEnd).getTime() < currentTime
  )
    return res.status(200).json({
      message: "목표 기간에 오늘이 포함되어 있지 않습니다.",
      code: ResponseCode.FAILURE,
    });

  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 대표 목표이면 기존의 대표 목표를 비활성화
  if (req.body.goalMain) await disableMainGoal({ userId });

  // 목표 주제 생성
  let goalId: number;
  try {
    const queryResult = await createGoal({
      name: req.body.goalTitle,
      isMain: req.body.goalMain,
      start: req.body.goalStart,
      end: req.body.goalEnd,
      userId,
    });

    if (queryResult[0].affectedRows === 0)
      return next(new ServerError("목표 주제를 생성할 수 없습니다."));

    goalId = queryResult[0].insertId;
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === "ER_DUP_ENTRY")
        return next(new DuplicationError(["이름"]));
    }
    throw error;
  }

  return res.status(200).json({
    message: "목표 주제 등록에 성공하였습니다.",
    goalID: goalId,
    code: ResponseCode.SUCCESS,
  });
};

export default addGoal;
