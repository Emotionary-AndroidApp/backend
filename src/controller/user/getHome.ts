import { z } from "zod";

import ResponseCode from "constant/responseCode";

import getMainGoal from "model/goal/getMainGoal";
import getEmotions from "model/diary/getEmotions";

import type { RequestHandler } from "express";
import type { NecessaryResponse } from "api";
import getDiaryByDate from "model/diary/getDiaryByDate";

/**
 * @description 홈 화면 조회 요청 query
 */
export const GetHomeRequestQuery = z.object({
  year: z.string().refine((value) => /^\d{4}$/.test(value)),
  month: z.string().refine((value) => /^\d{2}$/.test(value)),
  day: z.string().refine((value) => /^\d{2}$/.test(value)),
});

/**
 * @description 홈 화면 조회 응답 body
 */
interface ResponseBody extends NecessaryResponse {
  mainGoal?: {
    goalTitle: string;
    goalStart: string;
    goalEnd: string;
    goalProgress: number;
  };
  emotions?: {
    [day: number]: number;
  };
  diaryPreview?: {
    diaryTitle: string;
    diaryEmotion: number;
    diaryID: number;
  };
}

/**
 * @description 홈 화면 조회 요청을 처리하는 핸들러
 */
const getHome: RequestHandler<
  {},
  ResponseBody,
  {},
  z.infer<typeof GetHomeRequestQuery>
> = async function (req, res, next) {
  // 아이디 불러오기
  const userId = req.userId;
  if (userId === undefined)
    return res.status(200).json({
      message: "로그인이 필요합니다.",
      code: ResponseCode.FAILURE,
    });

  // 날짜 불러오기
  let year: number, month: number, day: number;

  if (req.query.year === undefined || req.query.month === undefined) {
    const today = new Date();
    year = today.getFullYear();
    month = today.getMonth() + 1;
    day = today.getDate();
  } else {
    year = parseInt(req.query.year);
    month = parseInt(req.query.month);
  }

  if (req.query.day === undefined) {
    day = 1;
  } else {
    day = parseInt(req.query.day);
  }

  // 데이터 불러오기
  const mainGoalPromise = async () => {
    const queryResult = await getMainGoal({ userId });
    const mainGoal = queryResult[0][0];

    if (mainGoal === undefined) return undefined;
    return {
      goalTitle: mainGoal.name,
      goalStart: mainGoal.start,
      goalEnd: mainGoal.end,
      goalProgress: mainGoal.progress,
    };
  };

  const emotionsPromise = async () => {
    const queryResult = await getEmotions({
      startDate: `${year.toString().padStart(4, "0")}-${month
        .toString()
        .padStart(2, "0")}-01`,
      endDate: `${year.toString().padStart(4, "0")}-${month
        .toString()
        .padStart(2, "0")}-${new Date(year, month, 0).getDate()}`,
      userId,
    });

    const result: { [day: number]: number } = {};
    queryResult[0].forEach((emotion) => {
      result[new Date(emotion.date).getDate()] = emotion.emotion;
    });

    return result;
  };

  const diaryPreviewPromise = async () => {
    const queryResult = await getDiaryByDate({
      date: `${year.toString().padStart(4, "0")}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
      userId,
    });
    const diary = queryResult[0][0];

    if (diary === undefined) return undefined;
    return {
      diaryTitle: diary.title,
      diaryEmotion: diary.emotion,
      diaryID: diary.id,
    };
  };

  const [mainGoal, emotions, diaryPreview] = await Promise.all([
    mainGoalPromise(),
    emotionsPromise(),
    diaryPreviewPromise(),
  ]);

  return res.status(200).json({
    mainGoal,
    emotions,
    diaryPreview,
    message: "홈 화면 조회에 성공하였습니다.",
    code: ResponseCode.SUCCESS,
  });
};

export default getHome;
