import db from "model";

import type { TodoCategoryRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetTodoChecklistsProps {
  userId: string;
  categoryId: number;
}

export default async function getTodoChecklists({
  userId,
  categoryId,
}: GetTodoChecklistsProps) {
  const queryResult = await db.query<(TodoCategoryRow & RowDataPacket)[]>(
    "SELECT id, userId, categoryId, content, isDone, date, createdAt FROM todo_checklist WHERE ? ORDER BY categoryId",
    { userId, categoryId }
  );

  return queryResult;
}
