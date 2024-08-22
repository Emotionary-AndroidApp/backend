import db from "model";

import type { TodoCategoryRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetGoalsProps {
  userId: string;
}

export default async function getGoals({ userId }: GetGoalsProps) {
  const queryResult = await db.query<(TodoCategoryRow & RowDataPacket)[]>(
    "SELECT id, userId, name, isMain, start, end, createdAt FROM goal WHERE ?",
    [{ userId }]
  );

  return queryResult;
}
