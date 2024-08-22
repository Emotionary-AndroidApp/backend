import { QueryError } from "mysql2";
import { z } from "zod";

import ResponseCode from "constant/responseCode";

import createTodoChecklist from "model/todo/createTodoChecklist";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";

import goalSchema from "schema/goal";
import goalChecklistSchema from "schema/goalChecklist";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";
import createGoalChecklist from "model/goal/createGoalChecklist";

/**
 * @description 목표 체크리스트 등록 요청 body
 */
export const AddGoalChecklistBody = z.object({
  goalID: goalSchema.goalId,
  goalChecklist: goalChecklistSchema.content,
});

/**
 * @description 목표 체크리스트 등록 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  todoChecklistID: number;
}

/**
 * @description 목표 체크리스트 등록 요청을 처리하는 핸들러
 */
const addGoalChecklist: RequestHandler<
  {},
  Partial<ResponseBody>,
  z.infer<typeof AddGoalChecklistBody>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  let goalChecklistId: number;
  try {
    const queryResult = await createGoalChecklist({
      userId: parseInt(userId),
      goalId: req.body.goalID,
      content: req.body.goalChecklist,
      isDone: false,
    });

    if (queryResult[0].affectedRows === 0)
      return next(new ServerError("목표 주제에 대한 권한이 없습니다."));

    goalChecklistId = queryResult[0].insertId;
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === "ER_DUP_ENTRY")
        return next(new DuplicationError(["이름"]));
    }
    throw error;
  }

  return res.status(200).json({
    message: "목표 체크리스트 등록에 성공하였습니다.",
    todoChecklistID: goalChecklistId,
    code: ResponseCode.SUCCESS,
  });
};

export default addGoalChecklist;
