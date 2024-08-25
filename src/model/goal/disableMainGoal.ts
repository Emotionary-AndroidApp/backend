import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DisableMainGoalProps {
  userId: string;
}

export default async function disableMainGoal({
  userId,
}: DisableMainGoalProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "UPDATE goal SET isMain = 0 WHERE userId = ?",
    [userId]
  );

  return queryResult;
}
