import { z } from "zod";

const goalId = z.number().int().nonnegative();

const content = z.string().min(1).max(100);

const isDone = z.boolean();

const goalChecklistSchema = {
  categoryId: goalId,
  content,
  isDone,
};

export default goalChecklistSchema;
