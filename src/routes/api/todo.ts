import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";
import requireUserToken from "middleware/token/requireUserToken";

import getTodo, { getTodoQuery } from "controller/todo/getTodo";
import getTodoCategories, {
  GetTodoCategoriesQuery,
} from "controller/todo/getTodoCategories";
import addTodoCategory, {
  AddTodoCategoryBody,
} from "controller/todo/addTodoCategory";

const todoRouter = express.Router();

// 컨트롤러
todoRouter.get(
  "/",
  requireUserToken,
  validateRequest({ query: getTodoQuery }),
  getTodo
);
todoRouter.get(
  "/category",
  requireUserToken,
  validateRequest({ query: GetTodoCategoriesQuery }),
  getTodoCategories
);
todoRouter.post(
  "/category",
  requireUserToken,
  express.json(),
  validateRequest({ body: AddTodoCategoryBody }),
  addTodoCategory
);

// 404 핸들 미들웨어
todoRouter.use(apiNotFoundErrorHandler);

export default todoRouter;
