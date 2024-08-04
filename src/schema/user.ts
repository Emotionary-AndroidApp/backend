import { z } from "zod";

const id = z.number().nonnegative().max(4294967295);

const email = z.string().email().max(50);

const name = z
  .string()
  .min(2)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "이름은 영어, 숫자, 밑줄(_)만 쓸 수 있어요.",
  });

const password = z
  .string()
  .min(8)
  .max(20)
  .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]+$/, {
    message: "비밀번호는 영어, 숫자를 조합하여야 해요.",
  });

const userSchema = {
  id,
  email,
  name,
  password
};

export default userSchema;
