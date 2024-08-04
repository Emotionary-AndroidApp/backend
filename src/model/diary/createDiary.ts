import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateDiaryProps {
  userId: string;
  title: string;
  content: string;
  emotion: number;
}

export default async function createDiary({
  userId,
  title,
  content,
  emotion,
}: CreateDiaryProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO diary SET ?",
    {
      userId,
      title,
      content,
      emotion,
    }
  );

  return queryResult;
}