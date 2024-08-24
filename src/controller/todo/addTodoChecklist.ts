import { QueryError } from "mysql2";
import { z } from "zod";

import ResponseCode from "constant/responseCode";

import createTodoChecklist from "model/todo/createTodoChecklist";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";

import todoCategorySchema from "schema/todoCategory";
import todoChecklistSchema from "schema/todoChecklist";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 투두 체크리스트 등록 요청 body
 */
export const AddTodoChecklistBody = z.object({
  todoCategoryID: todoCategorySchema.todoCategoryId,
  todoChecklist: todoChecklistSchema.content,
});

/**
 * @description 투두 체크리스트 등록 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  todoChecklistID: number;
}

/**
 * @description 투두 체크리스트 등록 요청을 처리하는 핸들러
 */
const addTodoChecklist: RequestHandler<
  {},
  Partial<ResponseBody>,
  z.infer<typeof AddTodoChecklistBody>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  let todoChecklistId: number;
  try {
    const queryResult = await createTodoChecklist({
      userId,
      categoryId: req.body.todoCategoryID,
      content: req.body.todoChecklist,
      isDone: false,
      date: new Date().toISOString().split("T")[0],
    });

    if (queryResult[0].affectedRows === 0)
      return next(new ServerError("투두 카테고리에 대한 권한이 없습니다."));

    todoChecklistId = queryResult[0].insertId;
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === "ER_DUP_ENTRY")
        return next(new DuplicationError(["이름"]));
    }
    throw error;
  }

  return res.status(200).json({
    message: "투두 카테고리 등록에 성공하였습니다.",
    todoChecklistID: todoChecklistId,
    code: ResponseCode.SUCCESS,
  });
};

export default addTodoChecklist;
