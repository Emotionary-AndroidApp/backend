import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

import signup, { SignupRequestBody } from "controller/user/signup";

const userRouter = express.Router();

// 컨트롤러
userRouter.post("", validateRequest({ body: SignupRequestBody }), signup);

// 404 핸들 미들웨어
userRouter.use(apiNotFoundErrorHandler);

export default userRouter;
