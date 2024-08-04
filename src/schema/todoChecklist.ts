import { z } from "zod";

const categoryId = z.number().int().nonnegative();

const content = z.string().min(1).max(100);

const isDone = z.boolean();

const todoChecklistSchema = {
  categoryId,
  content,
  isDone,
};

export default todoChecklistSchema;
