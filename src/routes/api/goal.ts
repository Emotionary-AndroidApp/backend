import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";
import requireUserToken from "middleware/token/requireUserToken";

import getProgressingGoal, {
  getProgressingGoalQuery,
} from "controller/goal/getProgressingGoal";
import getFinishedGoal, {
  getFinishedGoalQuery,
} from "controller/goal/getFinishedGoal";
import getGoals, { GetGoalsQuery } from "controller/goal/getGoals";
import addGoal, { AddGoalBody } from "controller/goal/addGoal";
import removeGoal, { RemoveGoalBody } from "controller/goal/removeGoal";
import addGoalChecklist, {
  AddGoalChecklistBody,
} from "controller/goal/addGoalChecklist";
import removeGoalChecklist, {
  RemoveGoalChecklistBody,
} from "controller/goal/removeGoalChecklist";

const goalRouter = express.Router();

// 컨트롤러
goalRouter.get(
  "/progress",
  requireUserToken,
  validateRequest({ query: getProgressingGoalQuery }),
  getProgressingGoal
);
goalRouter.get(
  "/finished",
  requireUserToken,
  validateRequest({ query: getFinishedGoalQuery }),
  getFinishedGoal
);
goalRouter.get(
  "/",
  requireUserToken,
  validateRequest({ query: GetGoalsQuery }),
  getGoals
);
goalRouter.post(
  "/",
  requireUserToken,
  express.json(),
  validateRequest({ body: AddGoalBody }),
  addGoal
);
goalRouter.delete(
  "/",
  requireUserToken,
  express.json(),
  validateRequest({ body: RemoveGoalBody }),
  removeGoal
);
goalRouter.post(
  "/checklist",
  requireUserToken,
  express.json(),
  validateRequest({ body: AddGoalChecklistBody }),
  addGoalChecklist
);
goalRouter.delete(
  "/checklist",
  requireUserToken,
  express.json(),
  validateRequest({ body: RemoveGoalChecklistBody }),
  removeGoalChecklist
);

// 404 핸들 미들웨어
goalRouter.use(apiNotFoundErrorHandler);

export default goalRouter;
