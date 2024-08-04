import MysqlErrorKeys from "mysql-error-keys";
import { randomBytes } from "crypto";
import { QueryError } from "mysql2";
import { z } from "zod";

import ResponseCode from "constant/responseCode";

import createUser from "model/user/createUser";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";

import getSaltedHash from "util/getSaltedHash";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 회원가입 요청 body
 */
export const SignupRequestBody = z.object({
  email: userSchema.email,
  password: userSchema.password,
  name: userSchema.name,
});

/**
 * @description 회원가입 응답 body
 */
interface ResponseBody extends NecessaryResponse {}

/**
 * @description 회원가입 요청을 처리하는 핸들러
 */
const signup: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof SignupRequestBody>
> = async function (req, res, next) {
  const salt = randomBytes(32).toString("base64");
  const hashedPassword = getSaltedHash(req.body.password, salt);

  try {
    const queryResult = await createUser({
      email: req.body.email,
      name: req.body.name,
      hashedPassword,
      salt,
    });

    if (queryResult[0].affectedRows === 0)
      return next(new ServerError("사용자를 생성할 수 없어요."));
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === MysqlErrorKeys.ER_DUP_ENTRY)
        return next(new DuplicationError(["이름", "이메일"]));
    }
    throw error;
  }
  return res.status(200).json({
    message: "사용자가 생성됐어요.",
    code: ResponseCode.SUCCESS,
  });
};

export default signup;
