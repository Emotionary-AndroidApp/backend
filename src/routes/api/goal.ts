import express from "express";

import getProgressingGoal, {
  getProgressingGoalQuery,
} from "controller/goal/getProgressingGoal";

import validateRequest from "middleware/validate/validateRequest";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";
import requireUserToken from "middleware/token/requireUserToken";

const goalRouter = express.Router();

// 컨트롤러
goalRouter.get(
  "/progress",
  requireUserToken,
  validateRequest({ query: getProgressingGoalQuery }),
  getProgressingGoal
);

// 404 핸들 미들웨어
goalRouter.use(apiNotFoundErrorHandler);

export default goalRouter;
