import db from "model";

import type { UserRow } from "db";
import type { FieldPacket, RowDataPacket } from "mysql2";

export interface GetUserByIdProps {
  id: string;
  password?: string;
}

export default async function getUserById({ id, password }: GetUserByIdProps) {
  let queryResult: [(UserRow & RowDataPacket)[], FieldPacket[]];

  if (password === undefined) {
    queryResult = await db.query<(UserRow & RowDataPacket)[]>(
      "SELECT id, password, salt, name, picture, createdAt FROM user WHERE ?",
      { id }
    );
  } else {
    queryResult = await db.query<(UserRow & RowDataPacket)[]>(
      "SELECT id, password, salt, name, picture, createdAt FROM user WHERE ? AND ?",
      [{ id }, { password }]
    );
  }

  return queryResult;
}
