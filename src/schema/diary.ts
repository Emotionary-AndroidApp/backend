import { z } from "zod";

const title = z.string().min(2).max(20);

const content = z.string().min(1).max(1000);

const emotion = z.number().int().min(0).max(5);

const picture = z.string().url();

const diarySchema = {
  title,
  content,
  emotion,
  picture,
};

export default diarySchema;
