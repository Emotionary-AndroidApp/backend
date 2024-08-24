import db from "model";

import type { DiaryRow } from "db";
import type { FieldPacket, RowDataPacket } from "mysql2";

export interface GetDiariesByKeywordProps {
  keyword?: string;
  userId: string;
  offset?: number;
}

export default async function getDiariesByKeyword({
  keyword,
  userId,
  offset = 0,
}: GetDiariesByKeywordProps) {
  let queryResult: [(DiaryRow & RowDataPacket)[], FieldPacket[]];

  if (keyword)
    queryResult = await db.query<(DiaryRow & RowDataPacket)[]>(
      `
      SELECT
        id, userId, title, content, emotion, picture, date, createdAt
      FROM
        diary
      WHERE
        userId = ?
      AND
        (title LIKE ? OR content LIKE ?)
      ORDER BY
        createdAt DESC
      LIMIT
        10
      OFFSET
        ?
    `,
      [userId, `%${keyword}%`, `%${keyword}%`, offset]
    );
  else
    queryResult = await db.query<(DiaryRow & RowDataPacket)[]>(
      `
      SELECT
        id, userId, title, content, emotion, picture, date, createdAt
      FROM
        diary
      WHERE
        userId = ?
      ORDER BY
        createdAt DESC
      LIMIT
        10
      OFFSET
        ?
    `,
      [userId, offset]
    );

  return queryResult;
}
