import db from "model";

import type { ResultSetHeader } from "mysql2";

interface AddDiaryPictureProps {
  diaryId: number;
  picture: string;
}

export default async function createDiary({
  diaryId,
  picture,
}: AddDiaryPictureProps) {
  const queryResult = await db.query<ResultSetHeader>(
    "INSERT INTO diary_picture SET ?",
    {
      diaryId,
      picture,
    }
  );

  return queryResult;
}
