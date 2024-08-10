import { z } from "zod";

import ResponseCode from "constant/responseCode";

import userSchema from "schema/user";

import checkIdIsUsing from "model/user/checkIdIsUsing";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 아이디 사용 여부 확인 요청 query
 */
export const CheckIdRequestQuery = z.object({
  userID: userSchema.id,
});

/**
 * @description 아이디 사용 여부 확인 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  result: boolean;
}

/**
 * @description 아이디 사용 여부 확인 요청을 처리하는 핸들러
 */
const checkId: RequestHandler<
  {},
  ResponseBody,
  {},
  z.infer<typeof CheckIdRequestQuery>
> = async function (req, res, next) {
  const queryResult = await checkIdIsUsing({ id: req.query.userID });
  const users = queryResult[0];

  if (users.length > 0) {
    return res.status(200).json({
      message: "아이디가 사용되고 있습니다.",
      code: ResponseCode.SUCCESS,
      result: true,
    });
  } else {
    return res.status(200).json({
      message: "아이디가 사용되고 있지 않습니다.",
      code: ResponseCode.SUCCESS,
      result: false,
    });
  }
};

export default checkId;
