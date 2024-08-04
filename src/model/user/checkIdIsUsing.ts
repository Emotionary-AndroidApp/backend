import db from "model";

import type { UserRow } from "db";
import type { FieldPacket, RowDataPacket } from "mysql2";

export interface CheckIdIsUsingProps {
  id: string;
}

export default async function checkIdIsUsing({ id }: CheckIdIsUsingProps) {
  const queryResult = await db.query<(UserRow & RowDataPacket)[]>(
    "SELECT 1 AS result FROM user WHERE ? LIMIT 1",
    { id }
  );

  return queryResult;
}
