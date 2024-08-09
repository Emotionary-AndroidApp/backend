import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { GoalChecklistRow } from "db";

type ChecklistPatch = Pick<
  GoalChecklistRow,
  "goalId" | "content" | "isDone"
>;

interface EditGoalChecklistProps {
  userId: number;
  id: number;
  checklistPatch: Partial<ChecklistPatch>;
}

export default async function editGoalChecklist({
  userId,
  id,
  checklistPatch,
}: EditGoalChecklistProps) {
  if (Object.keys(checklistPatch).length === 0)
    throw new Error("checklistPatch is empty");

  const queryResult = await db.query<ResultSetHeader>(
    `
      UPDATE goal_checklist checklist
      SET ?
      WHERE
        checklist.id = ? AND
        EXISTS (
          SELECT 1
          FROM goal
          WHERE
            goal.id = checklist.goalId AND
            goal.userId = ?
        )
      LIMIT 1
    `,
    [checklistPatch, id, userId]
  );

  return queryResult;
}
