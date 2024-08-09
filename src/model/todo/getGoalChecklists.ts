import db from "model";

import type { GoalChecklistRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetGoalChecklistsProps {
  userId: string;
  goalId: number;
}

export default async function getGoalChecklists({
  userId,
  goalId,
}: GetGoalChecklistsProps) {
  const queryResult = await db.query<(GoalChecklistRow & RowDataPacket)[]>(
    "SELECT id, goalId, content, isDone, createdAt FROM todo_checklist WHERE ? ORDER BY goalId",
    { userId, goalId }
  );

  return queryResult;
}
