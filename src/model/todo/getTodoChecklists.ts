import db from "model";

import type { TodoCategoryRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetTodoChecklistsProps {
  userId: string;
  categoryId: number;
  offset: number;
  limit: number;
}

export default async function getTodoChecklists({
  userId,
  categoryId,
  offset,
  limit,
}: GetTodoChecklistsProps) {
  const queryResult = await db.query<(TodoCategoryRow & RowDataPacket)[]>(
    "SELECT id, userId, categoryId, content, isDone, createdAt FROM todo_checklist WHERE ? LIMIT ? OFFSET ?",
    [{ userId, categoryId }, limit, offset]
  );

  return queryResult;
}
