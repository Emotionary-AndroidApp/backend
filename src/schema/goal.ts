import { z } from "zod";

const name = z.string().min(2).max(20);

const isMain = z.boolean();

const date = z
  .string()
  .regex(/^(?:19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {
    message: "날짜는 YYYY-MM-DD 형식이어야 합니다.",
  })
  .refine(
    (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    {
      message: "유효하지 않은 날짜입니다.",
    }
  );

const goalSchema = {
  name,
  isMain,
  start: date,
  end: date,
};

export default goalSchema;