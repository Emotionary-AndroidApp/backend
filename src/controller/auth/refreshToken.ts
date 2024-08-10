import jwt from "jsonwebtoken";
import { z } from "zod";

import getUserById from "model/user/getUserById";

import tokenSchema from "schema/token";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";
import UserError from "error/UserError";
import ResponseCode from "constant/responseCode";

/**
 * @description 토큰 갱신 요청 body
 */
export const RefreshTokenRequestBody = z.object({
  refreshToken: tokenSchema.token,
});

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
}

const refreshToken: RequestHandler<
  {},
  ResBody,
  z.infer<typeof RefreshTokenRequestBody>
> = async function (req, res, next) {
  // 리프레시 토큰 검증
  jwt.verify(
    req.body.refreshToken,
    process.env.JWT_SECRET_KEY!,
    async (error, decodedJwt) => {
      if (error || decodedJwt === undefined || typeof decodedJwt === "string")
        return next(new UserError("토큰이 유효하지 않습니다."));

      const id = decodedJwt.id as string;

      // 사용자 조회
      const queryResult = await getUserById({ id });
      const users = queryResult[0];

      if (users.length === 0) {
        return next(new UserError("사용자를 찾을 수 없습니다."));
      }

      // 새로운 토큰 발급
      const newAccessToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: "1h",
      });
      const newRefreshToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: "60d",
      });

      res.status(200).send({
        token: {
          accessToken: {
            token: newAccessToken,
            expiresIn: 1 / 24,
          },
          refreshToken: {
            token: newRefreshToken,
            expiresIn: 60,
          },
        },
        code: ResponseCode.SUCCESS,
        message: "토큰 갱신에 성공하였습니다.",
      });
    }
  );
};

export default refreshToken;
