import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import ServerError from "error/ServerError";
import MissingHeaderError from "error/user/MissingHeaderError";
import UserError from "error/UserError";

export default function requireUserToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 헤더에 Authorization이 없을 경우
  const userToken = req.headers["authorization"]?.split(" ")[1];
  if (userToken === undefined) {
    return next(new MissingHeaderError("Authorization"));
  }

  // JWT_SECRET_KEY가 없을 경우
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (jwtSecretKey === undefined) {
    return next(new ServerError("Cannot load `JWT_SECRET_KEY`"));
  }

  // JWT 토큰 검증
  jwt.verify(userToken, jwtSecretKey, (error, decodedJwt) => {
    if (error || decodedJwt === undefined || typeof decodedJwt === "string")
      return next(new UserError("유효하지 않은 토큰입니다.", 401));

    req.userId = decodedJwt.id;
    return next();
  });
}
