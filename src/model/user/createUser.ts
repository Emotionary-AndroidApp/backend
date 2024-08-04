import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateUserProps {
  id: string;
  hashedPassword: string;
  salt: string;
  name: string;
  picture?: string;
}

export default async function createUser({
  id,
  hashedPassword,
  salt,
  name,
  picture,
}: CreateUserProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO user SET ?",
    {
      id,
      hashedPassword,
      salt,
      name,
      picture,
    }
  );

  return queryResult;
}
