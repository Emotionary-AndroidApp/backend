import express from "express";
import path from "path";

import requireUserToken from "middleware/token/requireUserToken";

const fileRouter = express.Router();

// 정적 파일 제공
fileRouter.use("/user", express.static(path.resolve("files/user")));
fileRouter.use(
  "/diary",
  requireUserToken,
  express.static(path.resolve("files/diary"))
);

export default fileRouter;
