import db from "model";

import type { ResultSetHeader } from "mysql2";

export interface DeleteTodoCategoryProps {
  userId: string;
  id: number;
}

export default async function deleteTodoCategory({
  userId,
  id,
}: DeleteTodoCategoryProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM todo_category WHERE ? AND ? LIMIT 1",
    [{ userId }, { id }]
  );

  return queryResult;
}
