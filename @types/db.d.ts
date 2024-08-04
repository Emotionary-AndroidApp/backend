declare module "db" {
  interface UserRow {
    id: string;
    password: string;
    salt: string;
    name: string;
    picture: string;
    createdAt: string;
  }
  /**
   * CREATE TABLE `user` (
   *   `id` CHAR(36) NOT NULL,
   *   `password` CHAR(64) NOT NULL,
   *   `salt` CHAR(64) NOT NULL,
   *   `name` VARCHAR(20) NOT NULL,
   *   `picture` VARCHAR(100) NOT NULL,
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`)
   * );
   */

  interface DiaryRow {
    id: number;
    userId: string;
    title: string;
    content: string;
    emotion: number;
    createdAt: string;
  }
  /**
   * CREATE TABLE `diary` (
   *   `id` INT NOT NULL AUTO_INCREMENT,
   *   `userId` CHAR(36) NOT NULL,
   *   `title` VARCHAR(100) NOT NULL,
   *   `content` TEXT NOT NULL,
   *   `emotion` INT NOT NULL,
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`),
   *   FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
   * );
   */

  interface DiaryPictureRow {
    diaryId: number;
    picture: string;
  }
  /**
   * CREATE TABLE `diary_picture` (
   *   `diaryId` INT NOT NULL,
   *   `picture` VARCHAR(100) NOT NULL,
   *   PRIMARY KEY (`diaryId`, `picture`),
   *   FOREIGN KEY (`diaryId`) REFERENCES `diary` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
   * );
   */

  interface TodoChecklistRow {
    id: number;
    userId: string;
    categoryId: number;
    content: string;
    isDone: boolean;
    createdAt: string;
  }
  /**
   * CREATE TABLE `todo_checklist` (
   *   `id` INT NOT NULL AUTO_INCREMENT,
   *   `userId` CHAR(36) NOT NULL,
   *   `categoryId` INT NOT NULL,
   *   `content` VARCHAR(100) NOT NULL,
   *   `isDone` BOOLEAN NOT NULL DEFAULT FALSE,
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`),
   *   FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
   *   FOREIGN KEY (`categoryId`) REFERENCES `todo_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
   * );
   */

  interface TodoCategoryRow {
    id: number;
    userId: string;
    name: string;
    createdAt: string;
  }
  /**
   * CREATE TABLE `todo_category` (
   *   `id` INT NOT NULL AUTO_INCREMENT,
   *   `userId` CHAR(36) NOT NULL,
   *   `name` VARCHAR(20) NOT NULL,
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`),
   *   FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
   * );
   */

  interface GoalChecklistRow {
    id: number;
    userId: string;
    goalId: number;
    content: string;
    isDone: boolean;
    createdAt: string;
  }
  /**
   * CREATE TABLE `goal_checklist` (
   *   `id` INT NOT NULL AUTO_INCREMENT,
   *   `userId` CHAR(36) NOT NULL,
   *   `goalId` INT NOT NULL,
   *   `content` VARCHAR(100) NOT NULL,
   *   `isDone` BOOLEAN NOT NULL DEFAULT FALSE,
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`),
   *   FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
   *   FOREIGN KEY (`goalId`) REFERENCES `goal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
   * );
   */

  interface GoalRow {
    id: number;
    userId: string;
    name: string;
    isMain: boolean;
    start: string;
    end: string;
    createdAt: string;
  }
  /**
   * CREATE TABLE `goal` (
   *   `id` INT NOT NULL AUTO_INCREMENT,
   *   `userId` CHAR(36) NOT NULL,
   *   `name` VARCHAR(20) NOT NULL,
   *   `isMain` BOOLEAN NOT NULL DEFAULT FALSE,
   *   `start` DATE NOT NULL,
   *   `end` DATE NOT NULL,
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`),
   *   FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
   * );
   */
}
