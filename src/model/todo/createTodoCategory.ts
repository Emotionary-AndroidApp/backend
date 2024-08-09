import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateTodoCategoryProps {
  userId: string;
  name: string;
}

export default async function createTodoCategory({
  userId,
  name,
}: CreateTodoCategoryProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO todo_category SET ?",
    {
      userId,
      name,
    }
  );

  return queryResult;
}
