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

// 사용자 프로필 테이블 (Mind Cat Diary 전용)
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  nickname: varchar("nickname", { length: 100 }).default("드림님"),
  catName: varchar("catName", { length: 100 }).default("드림이"),
  catMood: varchar("catMood", { length: 50 }).default("unfair"),
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

// 관리자 설정 테이블
export const adminSettings = mysqlTable("admin_settings", {
  id: int("id").autoincrement().primaryKey(),
  adminPassword: varchar("adminPassword", { length: 255 }).notNull(),
  adBannerText: text("adBannerText"),
  adBannerLink: varchar("adBannerLink", { length: 500 }),
  mindBlockLink: varchar("mindBlockLink", { length: 500 }),
  musicGameLink: varchar("musicGameLink", { length: 500 }),
  pageNameChat: varchar("pageNameChat", { length: 100 }).default("대화"),
  pageNameCalendar: varchar("pageNameCalendar", { length: 100 }).default("달력"),
  pageNameCommunity: varchar("pageNameCommunity", { length: 100 }).default("커뮤니티"),
  pageNameDex: varchar("pageNameDex", { length: 100 }).default("도감"),
  pageNameReport: varchar("pageNameReport", { length: 100 }).default("리포트"),
  pageNameGame: varchar("pageNameGame", { length: 100 }).default("게임"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminSettings = typeof adminSettings.$inferSelect;
export type InsertAdminSettings = typeof adminSettings.$inferInsert;

// 커뮤니티 피드 테이블
export const feedPosts = mysqlTable("feed_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  likes: int("likes").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FeedPost = typeof feedPosts.$inferSelect;
export type InsertFeedPost = typeof feedPosts.$inferInsert;

// 피드 댓글 테이블
export const feedComments = mysqlTable("feed_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FeedComment = typeof feedComments.$inferSelect;
export type InsertFeedComment = typeof feedComments.$inferInsert;

// 수집된 고양이 테이블 (도감)
export const collectedCats = mysqlTable("collected_cats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  catMood: varchar("catMood", { length: 50 }).notNull(),
  collectedAt: timestamp("collectedAt").defaultNow().notNull(),
});

export type CollectedCat = typeof collectedCats.$inferSelect;
export type InsertCollectedCat = typeof collectedCats.$inferInsert;
