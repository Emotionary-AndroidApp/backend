import { z } from "zod";

const id = z
  .string()
  .min(2)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "아이디는 영어, 숫자, 밑줄(_)만 쓸 수 있습니다.",
  });

const name = z
  .string()
  .min(2)
  .max(20)
  .regex(/^[가-힣a-zA-Z]+$/, {
    message: "이름은 한글, 영어만 쓸 수 있습니다.",
  });

const password = z
  .string()
  .min(8)
  .max(20)
  .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]+$/, {
    message: "비밀번호는 영어, 숫자를 조합하여야 해요.",
  });

const picture = z.string().url();

const userSchema = {
  id,
  name,
  password,
  picture,
};

export default userSchema;
