import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";
import requireUserToken from "middleware/token/requireUserToken";

const goalRouter = express.Router();

// 컨트롤러

// 404 핸들 미들웨어
goalRouter.use(apiNotFoundErrorHandler);

export default goalRouter;
