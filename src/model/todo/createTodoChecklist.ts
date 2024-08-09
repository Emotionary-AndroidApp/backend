import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateTodoChecklistProps {
  userId: string;
  categoryId: number;
  content: string;
  isDone: boolean;
  date: string;
}

export default async function createTodoChecklist({
  userId,
  categoryId,
  content,
  isDone,
  date,
}: CreateTodoChecklistProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO todo_checklist SET ?",
    {
      userId,
      categoryId,
      content,
      isDone,
      date,
    }
  );

  return queryResult;
}
