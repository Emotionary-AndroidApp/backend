import db from "model";

import type { ResultSetHeader } from "mysql2";

export interface DeleteGoalProps {
  userId: string;
  id: number;
}

export default async function deleteGoal({
  userId,
  id,
}: DeleteGoalProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM goal WHERE ? AND ? LIMIT 1",
    [{ userId }, { id }]
  );

  return queryResult;
}
