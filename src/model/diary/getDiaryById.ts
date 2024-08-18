import db from "model";

import type { DiaryRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetDiaryByIdProps {
  id: number;
  userId: string;
}

export default async function getDiaryById({ id, userId }: GetDiaryByIdProps) {
  const queryResult = await db.query<(DiaryRow & RowDataPacket)[]>(
    "SELECT id, userId, title, content, emotion, picture, date, createdAt FROM diary WHERE ? AND ?",
    [{ id }, { userId }]
  );

  return queryResult;
}
