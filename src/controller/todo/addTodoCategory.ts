import { QueryError } from "mysql2";
import { z } from "zod";

import ResponseCode from "constant/responseCode";

import createTodoCategory from "model/todo/createTodoCategory";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";

import todoCategorySchema from "schema/todoCategory";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 투두 카테고리 등록 요청 body
 */
export const AddTodoCategoryBody = z.object({
  todoCategoryTitle: todoCategorySchema.title,
});

/**
 * @description 투두 카테고리 등록 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  todoCategoryID: number;
}

/**
 * @description 투두 카테고리 등록 요청을 처리하는 핸들러
 */
const addTodoCategory: RequestHandler<
  {},
  Partial<ResponseBody>,
  z.infer<typeof AddTodoCategoryBody>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  let todoCategoryId: number;
  try {
    const queryResult = await createTodoCategory({
      name: req.body.todoCategoryTitle,
      userId,
    });

    if (queryResult[0].affectedRows === 0)
      return next(new ServerError("투두 카테고리를 생성할 수 없습니다."));

    todoCategoryId = queryResult[0].insertId;
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === "ER_DUP_ENTRY")
        return next(new DuplicationError(["이름"]));
    }
    throw error;
  }

  return res.status(200).json({
    message: "투두 카테고리 등록에 성공하였습니다.",
    todoCategoryID: todoCategoryId,
    code: ResponseCode.SUCCESS,
  });
};

export default addTodoCategory;
