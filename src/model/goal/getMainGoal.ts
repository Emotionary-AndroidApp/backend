import db from "model";

import type { TodoCategoryRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetMainGoalProps {
  userId: string;
}

export default async function getMainGoal({ userId }: GetMainGoalProps) {
  const queryResult = await db.query<(TodoCategoryRow & RowDataPacket)[]>(
    "SELECT id, userId, name, isMain, start, end, createdAt FROM goal WHERE ? LIMIT 1",
    [{ userId, isMain: true }]
  );

  return queryResult;
}
