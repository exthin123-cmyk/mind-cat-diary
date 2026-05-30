// Mind Cat Diary - Stripe 결제 상품 정의
// 사과 패키지 충전 및 프리미엄 멤버십 구독 상품

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // USD cents
  currency: string;
  type: "one_time" | "subscription";
  apples?: number; // 지급될 사과 개수
  emoji: string;
  badge?: string; // 특별 배지 이름
}

export const PRODUCTS: Product[] = [
  // 사과 패키지 (일회성 결제)
  {
    id: "apple_small",
    name: "사과 10개 패키지 🍎",
    description: "드림이의 소품 상점에서 사용할 수 있는 사과 10개를 충전합니다.",
    price: 99, // $0.99
    currency: "usd",
    type: "one_time",
    apples: 10,
    emoji: "🍎"
  },
  {
    id: "apple_medium",
    name: "사과 30개 패키지 🍎🍎🍎",
    description: "사과 30개를 한 번에 충전! 고급 소품을 마음껏 구매하세요.",
    price: 249, // $2.49
    currency: "usd",
    type: "one_time",
    apples: 30,
    emoji: "🍎"
  },
  {
    id: "apple_large",
    name: "사과 100개 패키지 🎁",
    description: "사과 100개 대용량 패키지! 한정판 소품을 모두 해금하세요.",
    price: 699, // $6.99
    currency: "usd",
    type: "one_time",
    apples: 100,
    emoji: "🎁"
  },
  // 프리미엄 멤버십 (월간 구독)
  {
    id: "premium_monthly",
    name: "프리미엄 집사 멤버십 👑",
    description: "매달 사과 50개 지급 + 한정판 소품 해금 + 상담왕 배지 + 광고 없는 경험을 제공합니다.",
    price: 499, // $4.99/month
    currency: "usd",
    type: "subscription",
    apples: 50,
    emoji: "👑",
    badge: "프리미엄 집사"
  }
];
