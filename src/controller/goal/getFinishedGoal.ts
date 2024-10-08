import { z } from "zod";

import ResponseCode from "constant/responseCode";

import getFinishedGoal_, { FinishedGoalRow } from "model/goal/getFinishedGoal";

import type { RowDataPacket } from "mysql2";
import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

/**
 * @description 지난 목표 조회 요청 query
 */
export const getFinishedGoalQuery = z.object({});

/**
 * @description 진행 중 목표 조회 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  goals: Goal[];
}

interface Goal {
  goalTitle: String;
  goalMain: Boolean;
  checklists: Checklist[];
}

interface Checklist {
  checklistTitle: string;
  checklistID: number;
  done: boolean;
}

/**
 * @description 진행 중 목표 조회 요청을 처리하는 핸들러
 */
const getFinishedGoal: RequestHandler<
  {},
  Partial<ResponseBody>,
  {},
  z.infer<typeof getFinishedGoalQuery>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 목표 불러오기
  const goals: Goal[] = [];
  {
    const table: Record<string, (FinishedGoalRow & RowDataPacket)[]> = {};

    const queryResult = await getFinishedGoal_({
      userId,
      date: new Date().toISOString().split("T")[0],
    });
    const goalChecklists = queryResult[0];

    // table 생성
    goalChecklists.forEach((goalChecklist) => {
      const goalName = goalChecklist.goalName;

      // table에 목표 이름이 없으면 새 배열 할당
      if (table[goalName] === undefined) {
        table[goalName] = [goalChecklist];
      }
      // 있으면 추가
      else {
        table[goalName].push(goalChecklist);
      }
    });

    // table을 이용해 goals 배열 생성
    Object.keys(table).forEach((goalName) => {
      goals.push({
        goalTitle: goalName,
        goalMain: table[goalName][0].isMain,
        checklists: table[goalName].map((checklist) => ({
          checklistTitle: checklist.content,
          checklistID: checklist.id,
          done: checklist.isDone,
        })),
      });
    });
  }

  return res.status(200).json({
    goals,
    message: "지난 목표 조회에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default getFinishedGoal;
