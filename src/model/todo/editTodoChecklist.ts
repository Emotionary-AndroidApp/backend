import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { TodoChecklistRow } from "db";

type ChecklistPatch = Pick<
  TodoChecklistRow,
  "categoryId" | "content" | "isDone"
>;

interface EditTodoChecklistProps {
  userId: number;
  id: number;
  checklistPatch: Partial<ChecklistPatch>;
}

export default async function editTodoChecklist({
  userId,
  id,
  checklistPatch,
}: EditTodoChecklistProps) {
  if (Object.keys(checklistPatch).length === 0)
    throw new Error("checklistPatch is empty");

  const queryResult = await db.query<ResultSetHeader>(
    `
      UPDATE todo_checklist checklist
      SET ?
      WHERE
        checklist.id = ? AND
        EXISTS (
          SELECT 1
          FROM todo_category category
          WHERE
            category.id = checklist.categoryId AND
            category.userId = ?
        )
      LIMIT 1
    `,
    [checklistPatch, id, userId]
  );

  return queryResult;
}
