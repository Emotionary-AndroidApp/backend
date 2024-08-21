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
    `
      INSERT INTO todo_checklist (categoryId, content, isDone, date)
      SELECT
        ?, ?, ?, ?
      WHERE EXISTS (
        SELECT 1
        FROM todo_category
        WHERE categoryId = ?
        AND userId = ?
      )
    `,
    [categoryId, content, isDone, date, categoryId, userId]
  );

  return queryResult;
}
