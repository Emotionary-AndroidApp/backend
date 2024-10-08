import db from "model";

import type { RowDataPacket } from "mysql2";

interface ResultRow {
  result: 1;
}

export interface CheckIdIsUsingProps {
  id: string;
}

export default async function checkIdIsUsing({ id }: CheckIdIsUsingProps) {
  const queryResult = await db.query<(ResultRow & RowDataPacket)[]>(
    "SELECT 1 AS result FROM user WHERE ? LIMIT 1",
    { id }
  );

  return queryResult;
}
