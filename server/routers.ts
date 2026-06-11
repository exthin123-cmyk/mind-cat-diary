import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import Stripe from "stripe";
import { PRODUCTS } from "./products";
import { getDb } from "./db";
import { userProfiles, diaries, chatMessages, adminSettings as adminSettingsTable } from "../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia"
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // =====================================================
  // 사용자 프로필 라우터 (DB 영구 저장)
  // =====================================================
  profile: router({
    // 내 프로필 조회 (없으면 생성)
    get: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      if (existing.length > 0) return existing[0];
      // 없으면 기본 프로필 생성
      await db.insert(userProfiles).values({ userId: ctx.user.id, isPremium: 0 });
      const created = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      return created[0] || null;
    }),

    // 프로필 업데이트
    update: protectedProcedure
      .input(z.object({
        nickname: z.string().optional(),
        catName: z.string().optional(),
        catMood: z.string().optional(),
        isPremium: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;
        const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
        if (existing.length === 0) {
          await db.insert(userProfiles).values({ userId: ctx.user.id, ...input, isPremium: input.isPremium ?? 0 });
        } else {
          await db.update(userProfiles).set(input).where(eq(userProfiles.userId, ctx.user.id));
        }
        return { success: true };
      }),
  }),

  // =====================================================
  // 일기 라우터 (DB 영구 저장)
  // =====================================================
  diary: router({
    // 특정 날짜 일기 조회
    getByDate: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(diaries).where(and(eq(diaries.userId, ctx.user.id), eq(diaries.date, input.date))).orderBy(desc(diaries.createdAt));
      }),

    // 월별 일기 조회 (리포트용)
    getByMonth: protectedProcedure
      .input(z.object({ year: z.number(), month: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        const startDate = `${input.year}-${String(input.month).padStart(2, "0")}-01`;
        const endDate = `${input.year}-${String(input.month).padStart(2, "0")}-31`;
        return db.select().from(diaries).where(and(eq(diaries.userId, ctx.user.id), gte(diaries.date, startDate), lte(diaries.date, endDate))).orderBy(diaries.date);
      }),

    // 일기 저장 (AI 솔루션 자동 생성)
    create: protectedProcedure
      .input(z.object({
        date: z.string(),
        title: z.string(),
        mood: z.string(),
        thanks: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;

        // AI 솔루션 생성
        let solution = "";
        let musicRecommendation = "드림이의 아늑한 방 Lofi 🎵";
        try {
          const aiResponse = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `당신은 '드림이'라는 이름의 귀여운 검은 고양이 AI 상담사입니다. 사용자의 일기를 읽고 따뜻하고 공감적인 솔루션과 행동 가이드를 제공합니다. 모든 문장 끝에 '~냥'을 붙여서 말합니다. 한국어로 답변하며, 솔루션은 2-3가지 구체적인 행동 방안을 포함합니다. 200자 이내로 간결하게 작성합니다.`
              },
              {
                role: "user",
                content: `오늘의 일기:\n제목: ${input.title}\n감정: ${input.mood}\n감사한 일: ${input.thanks || "없음"}\n\n이 일기에 어울리는 따뜻한 솔루션과 행동 가이드를 제공해줘냥.`
              }
            ]
          });
          const rawSol = aiResponse.choices?.[0]?.message?.content;
solution = typeof rawSol === "string" ? rawSol : "";

          // 감정에 따른 음악 추천
          const moodLower = input.mood.toLowerCase();
          if (moodLower.includes("기쁨") || moodLower.includes("행복")) musicRecommendation = "포근한 햇살 Lofi ☀️";
          else if (moodLower.includes("슬픔") || moodLower.includes("슬퍼")) musicRecommendation = "차분한 빗소리 Lofi 🌧️";
          else if (moodLower.includes("피곤") || moodLower.includes("졸려")) musicRecommendation = "노곤노곤 자장가 Lofi 💤";
          else if (moodLower.includes("불안") || moodLower.includes("걱정")) musicRecommendation = "평온한 숲속의 숨결 Lofi 🌲";
          else if (moodLower.includes("외로움") || moodLower.includes("쓸쓸")) musicRecommendation = "별빛 가득한 밤하늘 Lofi 🌌";
        } catch (e) {
          solution = "오늘도 수고 많았다냥. 따뜻한 차 한 잔 마시며 쉬어가라냥 🐾";
        }

        await db.insert(diaries).values({
          userId: ctx.user.id,
          date: input.date,
          title: input.title,
          mood: input.mood,
          thanks: input.thanks || "",
          solution,
          musicRecommendation,
        });



        return { success: true, solution, musicRecommendation };
      }),

    // 일기 삭제
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;
        await db.delete(diaries).where(and(eq(diaries.id, input.id), eq(diaries.userId, ctx.user.id)));
        return { success: true };
      }),
  }),

  // =====================================================
  // AI 냥이 대화 라우터 (GPT invokeLLM 연동)
  // =====================================================
  chat: router({
    // AI 냥이에게 메시지 전송 (GPT 응답)
    sendMessage: protectedProcedure
      .input(z.object({
        message: z.string(),
        catName: z.string().default("드림이"),
        catMood: z.string().default("unfair"),
        history: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string()
        })).optional().default([])
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();

        const catPersonality: Record<string, string> = {
          unfair: "억울하고 서운한 감정을 잘 공감하며, 억울한 일을 당한 사람에게 특히 따뜻하게 위로해준다냥.",
          anxious: "불안하고 걱정이 많은 사람의 마음을 잘 이해하며, 안정감을 주는 말을 건넨다냥.",
          lonely: "외롭고 쓸쓸한 감정을 깊이 공감하며, 곁에 있어주는 따뜻한 존재가 된다냥.",
          lethargic: "무기력하고 지친 사람에게 작은 행동부터 시작할 수 있도록 부드럽게 격려한다냥.",
          angry: "화가 난 감정을 인정하고 공감하면서도, 감정을 건강하게 표현하는 방법을 제안한다냥.",
          love: "사랑스럽고 긍정적인 에너지로 모든 것을 밝게 바라보며 응원한다냥.",
          shy: "수줍고 내성적인 사람의 마음을 이해하며, 천천히 다가가는 따뜻한 존재가 된다냥.",
          depressed: "우울하고 힘든 감정을 깊이 공감하며, 전문적인 도움도 권유하는 따뜻한 상담사가 된다냥.",
          excited: "신나고 활기찬 에너지로 함께 기뻐하며 긍정적인 감정을 증폭시킨다냥.",
          relaxed: "평온하고 여유로운 마음으로 모든 것을 편안하게 바라보도록 도와준다냥.",
        };

        const personality = catPersonality[input.catMood] || catPersonality.unfair;

        const systemPrompt = `당신은 '${input.catName}'이라는 이름의 귀여운 검은 고양이 AI 감정 상담사입니다.

성격: ${personality}

규칙:
1. 모든 문장 끝에 반드시 '~냥'을 붙입니다. (예: "그렇구냥", "힘내라냥", "고맙다냥")
2. 따뜻하고 공감적인 말투를 사용합니다.
3. 사용자의 감정을 먼저 인정하고 공감한 후 조언을 제공합니다.
4. 한국어로만 답변합니다.
5. 답변은 2-4문장으로 간결하게 합니다.
6. 가끔 🐾, ❤️, ✨ 같은 이모지를 자연스럽게 사용합니다.`;

        try {
          const messages = [
            { role: "system" as const, content: systemPrompt },
            ...input.history.map(h => ({ role: h.role, content: h.content })),
            { role: "user" as const, content: input.message }
          ];

          const response = await invokeLLM({ messages });
          const rawContent = response.choices?.[0]?.message?.content;
const catReply = typeof rawContent === "string" ? rawContent : "그렇구냥! 더 이야기해달라냥 🐾";

          // DB에 채팅 히스토리 저장
          if (db) {
            await db.insert(chatMessages).values({ userId: ctx.user.id, sender: "user" as const, text: input.message });
            await db.insert(chatMessages).values({ userId: ctx.user.id, sender: "cat" as const, text: catReply });


          }

          return { reply: catReply, leveledUp: false };
        } catch (e) {
          return { reply: "지금 잠깐 말문이 막혔다냥... 조금 있다가 다시 이야기해달라냥 🐾", leveledUp: false };
        }
      }),

    // 채팅 히스토리 조회 (최근 20개)
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(chatMessages).where(eq(chatMessages.userId, ctx.user.id)).orderBy(desc(chatMessages.createdAt)).limit(20);
    }),
  }),

  // =====================================================
  // 감정 분석 리포트 라우터
  // =====================================================
  report: router({
    // 월간 감정 분석 리포트
    monthly: protectedProcedure
      .input(z.object({ year: z.number(), month: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { moodCounts: {}, totalDiaries: 0, topMood: "기쁨 😊", aiSummary: "" };

        const startDate = `${input.year}-${String(input.month).padStart(2, "0")}-01`;
        const endDate = `${input.year}-${String(input.month).padStart(2, "0")}-31`;

        const monthDiaries = await db.select().from(diaries).where(
          and(eq(diaries.userId, ctx.user.id), gte(diaries.date, startDate), lte(diaries.date, endDate))
        );

        // 감정 분포 계산
        const moodCounts: Record<string, number> = {};
        monthDiaries.forEach(d => {
          const mood = d.mood.split(" ")[0]; // "기쁨 😊" -> "기쁨"
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });

        const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "기쁨";

        // AI 월간 요약 생성
        let aiSummary = "";
        if (monthDiaries.length > 0) {
          try {
            const diaryTitles = monthDiaries.slice(0, 5).map(d => `${d.date}: ${d.title} (${d.mood})`).join("\n");
            const summaryResponse = await invokeLLM({
              messages: [
                { role: "system", content: "당신은 감정 분석 전문 고양이 상담사입니다. 사용자의 월간 일기를 분석하여 따뜻하고 통찰력 있는 월간 감정 리포트를 작성합니다. 모든 문장 끝에 '~냥'을 붙입니다. 150자 이내로 작성합니다." },
                { role: "user", content: `이번 달 일기 목록:\n${diaryTitles}\n\n이번 달 감정 분포: ${JSON.stringify(moodCounts)}\n\n이번 달의 감정 변화를 분석하고 따뜻한 월간 리포트를 작성해달라냥.` }
              ]
            });
            const rawSummary = summaryResponse.choices?.[0]?.message?.content;
aiSummary = typeof rawSummary === "string" ? rawSummary : "";
          } catch (e) {
            aiSummary = `이번 달 총 ${monthDiaries.length}개의 일기를 작성했다냥. 꾸준히 마음을 기록하는 드림님이 정말 대단하다냥! 🐾`;
          }
        }

        return { moodCounts, totalDiaries: monthDiaries.length, topMood, aiSummary };
      }),
  }),

  // =====================================================
  // Stripe 결제 라우터
  // =====================================================
  payment: router({
    getProducts: publicProcedure.query(() => PRODUCTS),

    createCheckout: protectedProcedure
      .input(z.object({ productId: z.string(), origin: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const product = PRODUCTS.find(p => p.id === input.productId);
        if (!product) throw new Error("상품을 찾을 수 없습니다냥.");

        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
          payment_method_types: ["card"],
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            product_id: product.id,
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            apples: (product.apples || 0).toString()
          },
          success_url: `${input.origin}/?payment=success&product=${product.id}`,
          cancel_url: `${input.origin}/?payment=cancelled`,
          allow_promotion_codes: true
        };

        if (product.type === "subscription") {
          const price = await stripe.prices.create({
            currency: product.currency,
            unit_amount: product.price,
            recurring: { interval: "month" },
            product_data: { name: product.name, metadata: { product_id: product.id } }
          });
          sessionConfig.mode = "subscription";
          sessionConfig.line_items = [{ price: price.id, quantity: 1 }];
        } else {
          sessionConfig.mode = "payment";
          sessionConfig.line_items = [{
            price_data: {
              currency: product.currency,
              unit_amount: product.price,
              product_data: { name: product.name, description: product.description }
            },
            quantity: 1
          }];
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);
        return { url: session.url };
      })
  }),

  // =====================================================
  // 관리자 설정 라우터 (DB 영구 저장 - 모든 기기 반영)
  // =====================================================
  adminConfig: router({
    // 관리자 설정 조회 (공개 - 일반 사용자도 읽기 가능)
    get: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(adminSettingsTable).limit(1);
      if (rows.length > 0) return rows[0];
      await db.insert(adminSettingsTable).values({
        adminPassword: "123456",
        adBannerText: "상담이 필요하신가요?",
        adBannerLink: "",
        mindBlockLink: "",
        musicGameLink: "",
      });
      const created = await db.select().from(adminSettingsTable).limit(1);
      return created[0] || null;
    }),

    // 관리자 설정 저장
    save: publicProcedure
      .input(z.object({
        adminPassword: z.string().optional(),
        adBannerText: z.string().optional(),
        adBannerLink: z.string().optional(),
        adBannerImage: z.string().optional(),
        adButtonText: z.string().optional(),
        mindBlockLink: z.string().optional(),
        musicGameLink: z.string().optional(),
        pageNameChat: z.string().optional(),
        pageNameCalendar: z.string().optional(),
        pageNameCommunity: z.string().optional(),
        pageNameDex: z.string().optional(),
        pageNameReport: z.string().optional(),
        pageNameGame: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        const rows = await db.select().from(adminSettingsTable).limit(1);
        if (rows.length === 0) {
          await db.insert(adminSettingsTable).values({ adminPassword: "123456", ...input });
        } else {
          await db.update(adminSettingsTable).set(input);
        }
        return { success: true };
      }),
  })
});

export type AppRouter = typeof appRouter;
