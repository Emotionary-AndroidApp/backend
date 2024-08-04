import UserError from "error/UserError";

export default class MissingHeaderError extends UserError {
  constructor(missingHeader: string) {
    super(`${missingHeader} 헤더는 필수값이지만 전달되지 않았어요.`, 400);
    this.name = "MissingHeaderError";
  }
}
