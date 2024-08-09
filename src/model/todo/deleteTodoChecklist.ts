import db from "model";

import type { ResultSetHeader } from "mysql2";

export interface DeleteTodoChecklistProps {
  userId: string;
  id: number;
}

export default async function deleteTodoChecklist({
  userId,
  id,
}: DeleteTodoChecklistProps) {
  const queryResult = await db.query<ResultSetHeader>(
    `
      DELETE FROM todo_checklist checklist
      WHERE
        id = ? AND
        EXISTS (
          SELECT 1
          FROM todo_category category
          WHERE category.id = checklist.categoryId AND category.userId = ?
        )
      LIMIT 1
    `,
    [id, userId]
  );

  return queryResult;
}
