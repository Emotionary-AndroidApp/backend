import db from "model";

import type { DiaryRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetDiaryByDateProps {
  date: string;
  userId: string;
}

export default async function getDiaryByDate({
  date,
  userId,
}: GetDiaryByDateProps) {
  const queryResult = await db.query<(DiaryRow & RowDataPacket)[]>(
    "SELECT id, userId, title, content, emotion, picture, date, createdAt FROM diary WHERE ? AND ?",
    [{ date }, { userId }]
  );

  return queryResult;
}
