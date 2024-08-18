import { Request, Response, NextFunction } from "express";

import UserError from "error/UserError";
import ResponseCode from "constant/responseCode";

export default function userErrorHandler(
  error: UserError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof UserError) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, code: ResponseCode.FAILURE });
  } else {
    return next(error);
  }
}
