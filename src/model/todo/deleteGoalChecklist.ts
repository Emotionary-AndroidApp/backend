import db from "model";

import type { ResultSetHeader } from "mysql2";

export interface DeleteGoalChecklistProps {
  userId: string;
  id: number;
}

export default async function deleteGoalChecklist({
  userId,
  id,
}: DeleteGoalChecklistProps) {
  const queryResult = await db.query<ResultSetHeader>(
    `
      DELETE FROM goal_checklist checklist
      WHERE id = ? AND
        EXISTS (
          SELECT 1
          FROM goal
          WHERE goal.id = checklist.goalId AND goal.userId = ?
        )
      LIMIT 1
    `,
    [id, userId]
  );

  return queryResult;
}
