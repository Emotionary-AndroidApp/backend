import db from "model";

import type { ResultSetHeader } from "mysql2";

interface CreateUserProps {
  email: string;
  hashedPassword: string;
  salt: string;
  name: string;
}

export default async function createUser({
  email,
  hashedPassword,
  salt,
  name,
}: CreateUserProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO user SET ?",
    {
      email,
      password: hashedPassword,
      salt,
      name,
    }
  );

  return queryResult;
}
