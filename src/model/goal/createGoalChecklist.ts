import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateGoalChecklistProps {
  userId: string;
  goalId: number;
  content: string;
  isDone: boolean;
}

export default async function createGoalChecklist({
  userId,
  goalId,
  content,
  isDone,
}: CreateGoalChecklistProps) {
  const queryResult = await db.query<ResultSetHeader>(
    `
      INSERT INTO goal_checklist (goalId, content, isDone)
      SELECT
        ?, ?, ?
      WHERE EXISTS (
        SELECT 1
        FROM goal
        WHERE id = ?
        AND userId = ?
      )
    `,
    [goalId, content, isDone, goalId, userId]
  );

  return queryResult;
}
