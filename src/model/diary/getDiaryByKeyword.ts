import db from "model";

import type { DiaryRow } from "db";
import type { RowDataPacket } from "mysql2";

export interface GetDiaryByKeywordProps {
  keyword: string;
  userId: string;
}

export default async function getDiaryByKeyword({
  keyword,
  userId,
}: GetDiaryByKeywordProps) {
  const queryResult = await db.query<(DiaryRow & RowDataPacket)[]>(
    `
      SELECT
        id, userId, title, content, emotion, picture, date, createdAt
      FROM
        diary
      WHERE
        userId = ?
      AND
        (title LIKE ? OR content LIKE ?)`,
    [userId, `%${keyword}%`, `%${keyword}%`]
  );

  return queryResult;
}
