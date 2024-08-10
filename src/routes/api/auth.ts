import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import apiNotFoundErrorHandler from "middleware/error/apiNotFoundErrorHandler";

import login, { LoginRequestBody } from "controller/auth/login";
import refreshToken, {
  RefreshTokenRequestBody,
} from "controller/auth/refreshToken";

const authRouter = express.Router();

// 컨트롤러
authRouter.post(
  "/login",
  express.json(),
  validateRequest({ body: LoginRequestBody }),
  login
);
authRouter.post(
  "/refresh",
  express.json(),
  validateRequest({ body: RefreshTokenRequestBody }),
  refreshToken
);

// 404 핸들 미들웨어
authRouter.use(apiNotFoundErrorHandler);

export default authRouter;
