import db from "model";

import type { TodoChecklistRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface TodoChecklistByDateRow extends TodoChecklistRow {
  categoryName: string;
}

export interface GetTodoChecklistsByDateProps {
  userId: string;
  date: string;
}

export default async function getTodoChecklistsByDate({
  userId,
  date,
}: GetTodoChecklistsByDateProps) {
  const queryResult = await db.query<
    (TodoChecklistByDateRow & RowDataPacket)[]
  >(
    `
      SELECT 
        tc.id,
        tc.categoryId,
        tc.content,
        tc.isDone,
        tc.date,
        tc.createdAt,
        tcat.name AS categoryName
      FROM 
          todo_checklist tc
      JOIN 
          todo_category tcat
      ON 
          tc.categoryId = tcat.id
      WHERE
          tcat.userId = ? AND
          tc.date = ?;
    `,
    [userId, date]
  );

  return queryResult;
}
