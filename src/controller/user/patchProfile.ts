import fs from "fs";
import path from "path";
import { QueryError } from "mysql2";
import { z } from "zod";

import ResponseCode from "constant/responseCode";

import editUser from "model/user/editUser";
import getUserById from "model/user/getUserById";

import ServerError from "error/ServerError";
import DuplicationError from "error/user/DuplicationError";

import userSchema from "schema/user";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 프로필 정보 수정 요청 body
 */
export const PatchProfileRequestBody = z.object({
  userName: userSchema.name.optional(),
});

/**
 * @description 프로필 정보 수정 응답 body
 */
interface ResponseBody extends NecessaryResponse {}

/**
 * @description 프로필 정보 수정을 처리하는 핸들러
 */
const patchProfile: RequestHandler<
  {},
  ResponseBody,
  z.infer<typeof PatchProfileRequestBody>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 유저 정보 불러오기
  const users = (await getUserById({ id: userId }))[0];
  if (users.length === 0)
    return res.status(200).json({
      message: "사용자가 존재하지 않습니다.",
      code: ResponseCode.FAILURE,
    });

  // 기존 파일 삭제
  if (users[0].picture) {
    const filePath = path.resolve(
      `files/user/${users[0].picture.split("/")[3]}`
    );
    fs.unlink(filePath, (err) => {
      if (err) console.error(err);
    });
  }

  // 파일 이름
  const pictureFileName = req.file
    ? `${Date.now()}_${req.file.originalname}`
    : undefined;

  try {
    const queryResult = await editUser({
      userId,
      userPatch: {
        name: req.body.userName,
        picture: req.file ? `/file/user/${pictureFileName}` : undefined,
      },
    });

    if (queryResult[0].affectedRows === 0)
      return next(new ServerError("프로필 정보를 수정할 수 없습니다."));
  } catch (error) {
    if (error instanceof Error) {
      if ((error as QueryError).code === "ER_DUP_ENTRY")
        return next(new DuplicationError(["닉네임"]));
    }
    throw error;
  }

  return res.status(200).json({
    message: "프로필 정보 수정에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default patchProfile;
