import { z } from "zod";

const title = z.string().min(2).max(20);

const todoCategorySchema = {
  title,
};

export default todoCategorySchema;
