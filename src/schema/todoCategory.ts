import { z } from "zod";

const name = z.string().min(2).max(20);

const todoCategorySchema = {
  name,
};

export default todoCategorySchema;
