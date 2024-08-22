import { z } from "zod";

const goalId = z.number().int().nonnegative();

const content = z.string().min(1).max(100);

const isDone = z.boolean();

const goalChecklistId = z.number().int().nonnegative();

const goalChecklistSchema = {
  goalId,
  content,
  isDone,
  goalChecklistId,
};

export default goalChecklistSchema;
