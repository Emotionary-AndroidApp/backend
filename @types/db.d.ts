declare module "db" {
  interface UserRow {
    id: string;
    password: string;
    salt: string;
    name: string;
    picture: string | null;
    createdAt: string;
  }
  /**
   * CREATE TABLE `user` (
   *   `id` CHAR(36) NOT NULL,
   *   `password` CHAR(128) NOT NULL,
   *   `salt` CHAR(64) NOT NULL,
   *   `name` VARCHAR(20) NOT NULL,
   *   `picture` VARCHAR(100),
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`),
   *   UNIQUE (`name`)
   * );
   */

  interface DiaryRow {
    id: number;
    userId: string;
    title: string;
    content: string;
    emotion: number;
    picture: string;
    date: string;
    createdAt: string;
  }
  /**
   * CREATE TABLE `diary` (
   *   `id` INT NOT NULL AUTO_INCREMENT,
   *   `userId` CHAR(36) NOT NULL,
   *   `title` VARCHAR(100) NOT NULL,
   *   `content` TEXT NOT NULL,
   *   `emotion` INT NOT NULL,
   *   `picture` VARCHAR(100),
   *   `date` DATE NOT NULL,
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`),
   *   UNIQUE (`userId`, `date`),
   *   FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
   * );
   */

  interface TodoChecklistRow {
    id: number;
    categoryId: number;
    content: string;
    isDone: boolean;
    date: string;
    createdAt: string;
  }
  /**
   * CREATE TABLE `todo_checklist` (
   *   `id` INT NOT NULL AUTO_INCREMENT,
   *   `categoryId` INT NOT NULL,
   *   `content` VARCHAR(100) NOT NULL,
   *   `isDone` BOOLEAN NOT NULL DEFAULT FALSE,
   *   `date` DATE NOT NULL,
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`),
   *   UNIQUE (`categoryId`, `content`),
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
   *   UNIQUE (`userId`, `name`),
   *   FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
   * );
   */

  interface GoalChecklistRow {
    id: number;
    goalId: number;
    content: string;
    isDone: boolean;
    createdAt: string;
  }
  /**
   * CREATE TABLE `goal_checklist` (
   *   `id` INT NOT NULL AUTO_INCREMENT,
   *   `goalId` INT NOT NULL,
   *   `content` VARCHAR(100) NOT NULL,
   *   `isDone` BOOLEAN NOT NULL DEFAULT FALSE,
   *   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   *   PRIMARY KEY (`id`),
   *   UNIQUE (`goalId`, `content`),
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
   *   UNIQUE (`userId`, `name`),
   *   FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
   * );
   */
}
