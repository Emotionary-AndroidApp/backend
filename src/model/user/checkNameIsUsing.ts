import db from "model";

import type { RowDataPacket } from "mysql2";

interface ResultRow {
  result: 1;
}
export interface CheckNameIsUsingProps {
  name: string;
}

export default async function checkNameIsUsing({
  name,
}: CheckNameIsUsingProps) {
  const queryResult = await db.query<(ResultRow & RowDataPacket)[]>(
    "SELECT 1 AS result FROM user WHERE ? LIMIT 1",
    { name }
  );

  return queryResult;
}
