import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { DiaryRow } from "db";

type DiaryPatch = Pick<DiaryRow, "title" | "content" | "emotion">;

interface EditDiaryProps {
  userId: string;
  date: string;
  diaryPatch: Partial<DiaryPatch>;
}

export default async function editDiary({
  userId,
  date,
  diaryPatch,
}: EditDiaryProps) {
  if (Object.keys(diaryPatch).length === 0)
    throw new Error("diaryPatch is empty");

  const queryResult = await db.query<ResultSetHeader>(
    "UPDATE diary SET ? WHERE date = ? AND userId = ?",
    [diaryPatch, date, userId]
  );

  return queryResult;
}
