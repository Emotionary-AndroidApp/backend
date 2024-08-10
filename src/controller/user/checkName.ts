import { z } from "zod";

import ResponseCode from "constant/responseCode";

import userSchema from "schema/user";

import checkNameIsUsing from "model/user/checkNameIsUsing";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 닉네임 사용 여부 확인 요청 query
 */
export const CheckNameRequestQuery = z.object({
  userName: userSchema.name,
});

/**
 * @description 닉네임 사용 여부 확인 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  result: boolean;
}

/**
 * @description 닉네임 사용 여부 확인 요청을 처리하는 핸들러
 */
const checkName: RequestHandler<
  {},
  ResponseBody,
  {},
  z.infer<typeof CheckNameRequestQuery>
> = async function (req, res, next) {
  const queryResult = await checkNameIsUsing({ name: req.query.userName });
  const users = queryResult[0];

  if (users.length > 0) {
    return res.status(200).json({
      message: "닉네임이 사용되고 있습니다.",
      code: ResponseCode.SUCCESS,
      result: true,
    });
  } else {
    return res.status(200).json({
      message: "닉네임이 사용되고 있지 않습니다.",
      code: ResponseCode.SUCCESS,
      result: false,
    });
  }
};

export default checkName;
