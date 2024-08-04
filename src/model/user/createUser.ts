import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateUserProps {
  id: string;
  password: string;
  name: string;
  picture?: string;
}

export default async function createUser({
  id,
  password,
  name,
  picture,
}: CreateUserProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO user SET ?",
    {
      id,
      password,
      name,
      picture,
    }
  );

  return queryResult;
}
