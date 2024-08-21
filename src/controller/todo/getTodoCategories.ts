import { z } from "zod";

import ResponseCode from "constant/responseCode";

import getTodoCategories_ from "model/todo/getTodoCategories";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 투두 카테고리 조회 요청 query
 */
export const GetTodoCategoriesQuery = z.object({});

/**
 * @description 투두 카테고리 조회 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  todoCategories: {
    todoCategory: string;
    todoCategoryID: string;
  }[];
}

/**
 * @description 투두 카테고리 조회 요청을 처리하는 핸들러
 */
const getTodoCategories: RequestHandler<
  {},
  Partial<ResponseBody>,
  {},
  z.infer<typeof GetTodoCategoriesQuery>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 투두 카테고리 불러오기
  const queryResult = await getTodoCategories_({
    userId,
  });
  const todoCategories = queryResult[0];
  const searchResult = todoCategories.map((todoCategory) => ({
    todoCategory: todoCategory.name,
    todoCategoryID: todoCategory.id.toString(),
  }));

  return res.status(200).json({
    todoCategories: searchResult,
    message: "투두 카테고리 조회에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default getTodoCategories;
