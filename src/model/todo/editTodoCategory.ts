import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { TodoCategoryRow } from "db";

type CategoryPatch = Pick<TodoCategoryRow, "name">;

interface EditTodoCategoryProps {
  id: number;
  categoryPatch: Partial<CategoryPatch>;
}

export default async function editTodoCategory({
  id,
  categoryPatch,
}: EditTodoCategoryProps) {
  if (Object.keys(categoryPatch).length === 0)
    throw new Error("categoryPatch is empty");

  const queryResult = await db.query<ResultSetHeader>(
    "UPDATE todo_category SET ? WHERE id = ?",
    [categoryPatch, id]
  );

  return queryResult;
}
