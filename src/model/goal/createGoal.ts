import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateGoalProps {
  userId: string;
  name: string;
  isMain: boolean;
  start: string;
  end: string;
}

export default async function createTodoCategory({
  userId,
  name,
  isMain,
  start,
  end,
}: CreateGoalProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO goal SET ?",
    {
      userId,
      name,
      isMain,
      start,
      end,
    }
  );

  return queryResult;
}
