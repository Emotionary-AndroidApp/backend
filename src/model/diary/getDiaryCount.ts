import db from "model";

interface CountRow {
  count: number;
}

import type { RowDataPacket } from "mysql2";

export interface GetDiaryCountProps {
  userId: string;
}

export default async function getDiaryCount({ userId }: GetDiaryCountProps) {
  const queryResult = await db.query<(CountRow & RowDataPacket)[]>(
    "SELECT COUNT(*) as count FROM diary WHERE ?",
    { userId }
  );

  return queryResult;
}
