import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { PRODUCTS } from "./products";

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
      return {
        success: true,
      } as const;
    }),
  }),

  // Stripe 결제 라우터
  payment: router({
    // 상품 목록 조회
    getProducts: publicProcedure.query(() => {
      return PRODUCTS;
    }),

    // 결제 세션 생성
    createCheckout: protectedProcedure
      .input(z.object({
        productId: z.string(),
        origin: z.string()
      }))
      .mutation(async ({ ctx, input }) => {
        const product = PRODUCTS.find(p => p.id === input.productId);
        if (!product) {
          throw new Error("상품을 찾을 수 없습니다냥.");
        }

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
          // 구독 상품: Stripe에서 Price 생성 후 사용
          const price = await stripe.prices.create({
            currency: product.currency,
            unit_amount: product.price,
            recurring: { interval: "month" },
            product_data: {
              name: product.name,
              metadata: { product_id: product.id }
            }
          });

          sessionConfig.mode = "subscription";
          sessionConfig.line_items = [{ price: price.id, quantity: 1 }];
        } else {
          // 일회성 결제
          sessionConfig.mode = "payment";
          sessionConfig.line_items = [{
            price_data: {
              currency: product.currency,
              unit_amount: product.price,
              product_data: {
                name: product.name,
                description: product.description
              }
            },
            quantity: 1
          }];
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);
        return { url: session.url };
      })
  })
});

export type AppRouter = typeof appRouter;
