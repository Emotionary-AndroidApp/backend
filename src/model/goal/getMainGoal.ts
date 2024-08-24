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
          COALESCE(SUM(checklist.isDone), 0) / NULLIF(COUNT(checklist.id), 0) AS progress
      FROM
          goal
      LEFT JOIN
          goal_checklist AS checklist
      ON
          goal.id = checklist.goalId
      WHERE
          goal.userId = ? AND goal.isMain = true
      GROUP BY
          goal.id, goal.userId, goal.name, goal.isMain, goal.start, goal.end, goal.createdAt
    `,
    [userId]
  );

  return queryResult;
}
