import { z } from "zod";

const title = z.string().min(2).max(20);

const todoCategoryId = z.number().int().nonnegative();

const todoCategorySchema = { todoCategoryId, title };

export default todoCategorySchema;
