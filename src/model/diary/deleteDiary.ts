import db from "model";

import type { ResultSetHeader } from "mysql2";

interface DeleteDiaryProps {
  userId: string;
  id: number;
}

export default async function deleteDiary({ userId, id }: DeleteDiaryProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "DELETE FROM diary WHERE id = ? AND userId = ?",
    [id, userId]
  );

  return queryResult;
}
