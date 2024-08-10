import db from "model";

interface MainGoalRow extends GoalRow {
  progress: number;
}

import type { GoalRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetMainGoalProps {
  userId: string;
}

export default async function getMainGoal({ userId }: GetMainGoalProps) {
  const queryResult = await db.query<(MainGoalRow & RowDataPacket)[]>(
    `
      SELECT
        goal.id,
        goal.userId,
        goal.name,
        goal.isMain,
        goal.start,
        goal.end,
        goal.createdAt,
        SUM(checklist.isDone) / COUNT(checklist.id) AS progress
      FROM
        goal
      LEFT JOIN
        goal_checklist AS checklist
      ON
        goal.id = checklist.goalId
      WHERE
        goal.userId = ? AND goal.isMain = true
    `,
    [userId]
  );

  return queryResult;
}
