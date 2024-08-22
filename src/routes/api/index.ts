import express from "express";

import authRouter from "./auth";
import diaryRouter from "./diary";
import userRouter from "./user";
import todoRouter from "./todo";
import goalRouter from "./goal";

import errorHandler from "middleware/error/errorHandler";
import userErrorHandler from "middleware/error/userErrorHandler";
import serverErrorHandler from "middleware/error/serverErrorHandler";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";
import zodErrorHandler from "middleware/error/zodErrorHandler";
import trimBodyString from "middleware/common/trimBodyString";

const apiRouter = express.Router();

// 라우터
apiRouter.use("/user", trimBodyString, userRouter);
apiRouter.use("/auth", trimBodyString, authRouter);
apiRouter.use("/diary", trimBodyString, diaryRouter);
apiRouter.use("/todo", trimBodyString, todoRouter);
apiRouter.use("/goal", trimBodyString, goalRouter);

// 404 핸들 미들웨어
apiRouter.use(apiNotFoundErrorHandler);

// 에러 핸들 미들웨어
apiRouter.use(
  zodErrorHandler,
  userErrorHandler,
  serverErrorHandler,
  errorHandler
);

export default apiRouter;
