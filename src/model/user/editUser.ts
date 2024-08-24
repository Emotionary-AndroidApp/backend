import db from "model";

import type { ResultSetHeader } from "mysql2";
import type { UserRow } from "db";

type UserPatch = Pick<UserRow, "password" | "name" | "picture">;

interface EditUserProps {
  userId: string;
  userPatch: Partial<UserPatch>;
}

export default async function editUser({ userId, userPatch }: EditUserProps) {
  if (Object.keys(userPatch).length === 0)
    throw new Error("userPatch is empty");

  const queryResult = await db.query<ResultSetHeader>(
    "UPDATE user SET ? WHERE id = ? LIMIT 1",
    [userPatch, userId]
  );

  return queryResult;
}
