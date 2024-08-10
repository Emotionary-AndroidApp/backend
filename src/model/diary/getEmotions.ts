import db from "model";

import type { DiaryRow } from "db";
import type { RowDataPacket } from "mysql2";

interface EmotionRow {
  date: string;
  emotion: number;
}

export interface getEmotions {
  startDate: string;
  endDate: string;
  userId: string;
}

export default async function getEmotions({
  startDate,
  endDate,
  userId,
}: getEmotions) {
  const queryResult = await db.query<(EmotionRow & RowDataPacket)[]>(
    "SELECT date, emotion FROM diary WHERE ? AND ? <= date AND date <= ?",
    [{ userId }, startDate, endDate]
  );

  return queryResult;
}
