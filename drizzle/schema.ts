import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Mind Cat Diary 전용 필드 (users 테이블에 추가 컬럼)
// 이 필드들은 users 테이블에 직접 추가하는 대신 별도 profile 테이블로 관리합니다.

// 사용자 프로필 테이블 (Mind Cat Diary 전용)
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  nickname: varchar("nickname", { length: 100 }).default("드림님"),
  catName: varchar("catName", { length: 100 }).default("드림이"),
  catMood: varchar("catMood", { length: 50 }).default("unfair"),
  level: int("level").default(1).notNull(),
  exp: int("exp").default(0).notNull(),
  apples: int("apples").default(5).notNull(),
  isPremium: int("isPremium").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

// 일기 테이블
export const diaries = mysqlTable("diaries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  title: text("title").notNull(),
  mood: varchar("mood", { length: 50 }).notNull(),
  thanks: text("thanks"),
  solution: text("solution"), // AI 생성 솔루션
  musicRecommendation: varchar("musicRecommendation", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Diary = typeof diaries.$inferSelect;
export type InsertDiary = typeof diaries.$inferInsert;

// 채팅 히스토리 테이블
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sender: mysqlEnum("sender", ["user", "cat"]).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;