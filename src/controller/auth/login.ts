import jwt from "jsonwebtoken";
import { z } from "zod";

import ResponseCode from "constant/responseCode";

import getUserById from "model/user/getUserById";

import UserError from "error/UserError";

import getSaltedHash from "util/getSaltedHash";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 로그인 요청 body
 */
export const LoginRequestBody = z.object({
  userID: userSchema.id,
  userPassword: userSchema.password,
});

/**
 * @description 로그인 응답 body
 */
interface ResBody extends NecessaryResponse {
  token: {
    accessToken: {
      token: string;
      expiresIn: number;
    };
    refreshToken: {
      token: string;
      expiresIn: number;
    };
  };

  user: {
    userID: string;
    userName: string;
    userProfile?: string;
  };
}

/**
 * @description 로그인 요청을 처리하는 핸들러
 */
const login: RequestHandler<
  {},
  ResBody,
  z.infer<typeof LoginRequestBody>
> = async function (req, res, next) {
  // 사용자 salt 가져오기
  const salt = await getUserSalt(req.body.userID);
  if (salt === null) return next(new UserError("사용자를 찾을 수 없습니다."));

  // 사용자 가져오기
  const hashedPassword = getSaltedHash(req.body.userPassword, salt);
  const users = (
    await getUserById({
      id: req.body.userID,
      password: hashedPassword,
    })
  )[0];

  if (users.length === 0)
    return next(new UserError("사용자를 찾을 수 없습니다."));

  const user = users[0];

  // 토큰 발급
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "60d",
  });

  res.status(200).send({
    token: {
      accessToken: {
        token: accessToken,
        expiresIn: 1 / 24,
      },
      refreshToken: {
        token: refreshToken,
        expiresIn: 60,
      },
    },
    user: {
      userID: user.id,
      userName: user.name,
      userProfile: user.picture ?? undefined,
    },
    message: "로그인에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

/**
 * @description 사용자의 salt를 가져오는 함수
 */
async function getUserSalt(id: string) {
  const user = await getUserById({ id });
  if (user[0].length === 0) return null;
  return user[0][0].salt;
}

export default login;
