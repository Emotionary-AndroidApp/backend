import { z } from "zod";

import ResponseCode from "constant/responseCode";

import deleteGoalChecklist from "model/goal/deleteGoalChecklist";

import goalChecklistSchema from "schema/goalChecklist";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 목표 체크리스트 삭제 요청 body
 */
export const RemoveGoalChecklistBody = z.object({
  goalChecklistID: goalChecklistSchema.goalId,
});

/**
 * @description 목표 체크리스트 삭제 응답 body
 */
interface ResponseBody extends NecessaryResponse {}

/**
 * @description 목표 체크리스트 등록 요청을 처리하는 핸들러
 */
const removeGoalChecklist: RequestHandler<
  {},
  Partial<ResponseBody>,
  z.infer<typeof RemoveGoalChecklistBody>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  const queryResult = await deleteGoalChecklist({
    id: req.body.goalChecklistID,
    userId,
  });

  if (queryResult[0].affectedRows === 0)
    return res.status(200).json({
      message: "해당하는 목표 체크리스트가 존재하지 않습니다.",
      code: ResponseCode.FAILURE,
    });

  return res.status(200).json({
    message: "목표 체크리스트 삭제에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default removeGoalChecklist;
