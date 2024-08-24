import db from "model";

import type { GoalChecklistRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface FinishedGoalRow extends GoalChecklistRow {
  goalName: string;
  isMain: boolean;
}

export interface GetFinishedGoalProps {
  userId: string;
  date: string;
}

export default async function getFinishedGoal({
  userId,
  date,
}: GetFinishedGoalProps) {
  const queryResult = await db.query<(FinishedGoalRow & RowDataPacket)[]>(
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
          gc.goalID = g.id
      WHERE
          g.userId = ? AND
          g.end < ?;
    `,
    [userId, date]
  );

  return queryResult;
}
