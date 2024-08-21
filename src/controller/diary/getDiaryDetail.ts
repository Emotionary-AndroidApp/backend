import { z } from "zod";

import ResponseCode from "constant/responseCode";

import getDiaryByDate from "model/diary/getDiaryByDate";
import getTodoChecklistsByDate, {
  TodoChecklistByDateRow,
} from "model/todo/getTodoChecklistsByDate";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";

import commonSchema from "schema/common";

import type { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import type { DiaryRow } from "db";

/**
 * @description 다이어리 상세 조회 요청 query
 */
export const GetDiaryDetailQuery = z.object({
  diaryDate: commonSchema.date,
});

interface Todo {
  todoCategory: string;
  todoCategoryID: number;
  checklists: Checklist[];
}

interface Checklist {
  checklistTitle: string;
  checklistID: number;
  done: boolean;
}

/**
 * @description 홈 화면 조회 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  diaryTitle: string;
  diaryEmotion: number;
  diaryDetail: string;
  diaryImage?: string;
  todos: Todo[];
}

/**
 * @description 홈 화면 조회 요청을 처리하는 핸들러
 */
const getDiaryDetail: RequestHandler<
  {},
  Partial<ResponseBody>,
  {},
  z.infer<typeof GetDiaryDetailQuery>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 일기 불러오기
  let diary: DiaryRow & RowDataPacket;
  {
    const queryResult = await getDiaryByDate({
      userId,
      date: req.query.diaryDate,
    });
    const diarys = queryResult[0];

    if (diarys.length === 0) {
      return res.status(200).json({
        message: "해당 날짜에 다이어리가 등록되어 있지 않습니다.",
        code: ResponseCode.FAILURE,
      });
    }

    diary = diarys[0];
  }

  // 투두 불러오기
  const todos: Todo[] = [];
  {
    const table: Record<string, (TodoChecklistByDateRow & RowDataPacket)[]> =
      {};

    const queryResult = await getTodoChecklistsByDate({
      userId,
      date: req.query.diaryDate,
    });
    const todoChecklists = queryResult[0];

    // table 생성
    todoChecklists.forEach((todoChecklist) => {
      const categoryName = todoChecklist.categoryName;

      // table에 카테고리 아이디가 없으면 새 배열 할당
      if (table[categoryName] === undefined) {
        table[categoryName] = [todoChecklist];
      }
      // 있으면 추가
      else {
        table[categoryName].push(todoChecklist);
      }
    });

    // table을 이용해 todos 배열 생성
    Object.keys(table).forEach((categoryName) => {
      todos.push({
        todoCategory: categoryName,
        todoCategoryID: table[categoryName][0].categoryId,
        checklists: table[categoryName].map((checklist) => ({
          checklistTitle: checklist.content,
          checklistID: checklist.id,
          done: checklist.isDone,
        })),
      });
    });
  }

  return res.status(200).json({
    diaryTitle: diary.title,
    diaryEmotion: diary.emotion,
    diaryDetail: diary.content,
    diaryImage: diary.picture,
    todos,
    message: "다이어리 상세 조회에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default getDiaryDetail;
