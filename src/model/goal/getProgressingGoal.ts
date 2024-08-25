import db from "model";

import type { GoalChecklistRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface ProgressingGoalRow extends GoalChecklistRow {
  goalName: string;
  isMain: boolean;
}

export interface GetProgressingGoalProps {
  userId: string;
  date: string;
}

export default async function getProgressingGoal({
  userId,
  date,
}: GetProgressingGoalProps) {
  const queryResult = await db.query<(ProgressingGoalRow & RowDataPacket)[]>(
    `
      SELECT
          gc.id,
          gc.goalId,
          gc.content,
          gc.isDone,
          gc.createdAt,
          g.name AS goalName,
          g.isMain AS isMain
      FROM 
          goal_checklist gc
      JOIN 
          goal g
      ON 
          gc.goalId = g.id
      WHERE
          g.userId = ? AND
          (? BETWEEN g.start AND g.end)
    `,
    [userId, date, date]
  );

  queryResult[0].forEach((checklist) => {
    checklist.isDone = Boolean(checklist.isDone);
    checklist.isMain = Boolean(checklist.isMain);
  });

  return queryResult;
}
