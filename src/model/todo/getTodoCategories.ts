import db from "model";

import type { TodoCategoryRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetTodoCategoriesProps {
  userId: string;
}

export default async function getTodoCategories({
  userId,
}: GetTodoCategoriesProps) {
  const queryResult = await db.query<(TodoCategoryRow & RowDataPacket)[]>(
    "SELECT id, userId, name, createdAt FROM todo_category WHERE ?",
    { userId }
  );

  return queryResult;
}
