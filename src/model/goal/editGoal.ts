import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { GoalRow } from "db";

type GoalPatch = Pick<GoalRow, "name" | "isMain" | "start" | "end">;

interface EditTodoCategoryProps {
  userId: number;
  id: number;
  goalPatch: Partial<GoalPatch>;
}

export default async function editTodoCategory({
  userId,
  id,
  goalPatch,
}: EditTodoCategoryProps) {
  if (Object.keys(goalPatch).length === 0)
    throw new Error("goalPatch is empty");

  const queryResult = await db.query<ResultSetHeader>(
    "UPDATE goal SET ? WHERE id = ? AND userId = ?",
    [goalPatch, id, userId]
  );

  return queryResult;
}
