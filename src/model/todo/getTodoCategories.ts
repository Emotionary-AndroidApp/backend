import db from "model";

import type { TodoCategoryRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetTodoCategoriesProps {
  userId: string;
  offset: number;
  limit: number;
}

export default async function getTodoCategories({
  userId,
  offset,
  limit,
}: GetTodoCategoriesProps) {
  const queryResult = await db.query<(TodoCategoryRow & RowDataPacket)[]>(
    "SELECT id, userId, name, createdAt FROM todo_category WHERE ? LIMIT ? OFFSET ?",
    [{ userId }, limit, offset]
  );

  return queryResult;
}