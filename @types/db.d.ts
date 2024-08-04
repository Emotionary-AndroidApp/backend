declare module "db" {
  interface UserRow {
    id: string;
    password: string;
    salt: string;
    name: string;
    picture: string;
    createdAt: string;
  }

  interface DiaryRow {
    id: number;
    userId: string;
    title: string;
    content: string;
    emotion: number;
    createdAt: string;
  }

  interface DiaryPictureRow {
    diaryId: number;
    picture: string;
  }

  interface TodoChecklistRow {
    id: number;
    userId: string;
    categoryId: number;
    content: string;
    isDone: boolean;
    createdAt: string;
  }

  interface TodoCategoryRow {
    id: number;
    userId: string;
    name: string;
    createdAt: string;
  }

  interface GoalChecklistRow {
    id: number;
    userId: string;
    goalId: number;
    content: string;
    isDone: boolean;
    createdAt: string;
  }

  interface GoalRow {
    id: number;
    userId: string;
    name: string;
    isMain: boolean;
    start: string;
    end: string;
    createdAt: string;
  }
}
