import fs from "fs";
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
import path from "path";

/**
 * @description 회원가입 요청 body
 */
export const SignupRequestBody = z.object({
  userID: userSchema.id,
  userPassword: userSchema.password,
  userName: userSchema.name,
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
  // 비밀번호 해싱
  const salt = randomBytes(32).toString("base64");
  const hashedPassword = getSaltedHash(req.body.userPassword, salt);

  // 파일 이름
  const pictureFileName = req.file
    ? `${Date.now()}_${req.file.originalname}`
    : undefined;

  try {
    const queryResult = await createUser({
      id: req.body.userID,
      name: req.body.userName,
      picture: req.file ? `/file/user/${pictureFileName}` : undefined,
      hashedPassword,
      salt,
    });

    if (queryResult[0].affectedRows === 0)
      return next(new ServerError("사용자를 생성할 수 없습니다."));
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === "ER_DUP_ENTRY")
        return next(new DuplicationError(["아이디", "닉네임"]));
    }
    throw error;
  }

  // 회원가입 성공 시 프로필 사진 파일 저장
  if (req.file && pictureFileName) {
    fs.writeFileSync(
      path.resolve("files/user", pictureFileName),
      req.file.buffer
    );
  }

  return res.status(200).json({
    message: "회원가입에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default signup;
