export type MoodType = "unfair" | "anxious" | "lonely" | "lethargic";

export interface CatCharacter {
  type: MoodType;
  name: string;
  image: string;
  description: string;
}

export const CAT_CHARACTERS: Record<MoodType, CatCharacter> = {
  unfair: {
    type: "unfair",
    name: "드림이 (Unfair Cat)",
    image: "/manus-storage/unfair_cat_bb093496.png",
    description: "새파란 사과를 소중하게 꼭 쥐고 있는, 별빛 눈망울의 검은 고양이냥!"
  },
  anxious: {
    type: "anxious",
    name: "불안이 (Anxious Cat)",
    image: "/manus-storage/anxious_cat_242b50dc.png",
    description: "종이 상자 안에 쏙 들어가서 조심스럽게 주변을 살피는 귀여운 겁쟁이 고양이냥..."
  },
  lonely: {
    type: "lonely",
    name: "외로움이 (Lonely Cat)",
    image: "/manus-storage/lonely_cat_dbdd7a45.png",
    description: "조그만 하얀 곰 인형을 꼭 껴안고 외로움을 달래는 아기 고양이냥."
  },
  lethargic: {
    type: "lethargic",
    name: "무기력이 (Lethargic Cat)",
    image: "/manus-storage/lethargic_cat_3adb62ca.png",
    description: "귀여운 밤하늘 고깔모자를 쓰고 베개를 꼭 껴안은 채 쿨쿨 잠든 고양이냥."
  }
};

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: "furniture" | "accessory" | "wallpaper";
  image: string;
  emoji: string;
  description: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // 가구
  { id: "f1", name: "폭신폭신 캣타워", price: 3, category: "furniture", image: "", emoji: "🐈‍⬛", description: "고양이가 가장 좋아하는 놀이터냥!" },
  { id: "f2", name: "포근한 러그", price: 2, category: "furniture", image: "", emoji: "🧶", description: "방바닥을 따뜻하게 채워주는 둥근 러그냥." },
  { id: "f3", name: "물고기 장난감", price: 1, category: "furniture", image: "", emoji: "🐟", description: "드림이가 환장하는 물고기 인형냥!" },
  // 악세서리
  { id: "a1", name: "빨간 볼터치", price: 1, category: "accessory", image: "", emoji: "🌸", description: "고양이 볼을 핑크빛으로 물들여준다냥!" },
  { id: "a2", name: "노란 리본 타이", price: 2, category: "accessory", image: "", emoji: "🎀", description: "멋쟁이 신사 고양이가 될 수 있다냥." },
  { id: "a3", name: "힙한 선글라스", price: 3, category: "accessory", image: "", emoji: "🕶️", description: "네오 브루탈리즘 감성의 힙스터 고양이냥!" },
  // 벽지
  { id: "w1", name: "청록색 땡땡이 벽지", price: 3, category: "wallpaper", image: "", emoji: "🎨", description: "민트빛 상큼함이 톡톡 터지는 벽지냥." },
  { id: "w2", name: "밤하늘 별빛 벽지", price: 4, category: "wallpaper", image: "", emoji: "🌌", description: "잠이 솔솔 올 것 같은 아늑한 벽지냥." }
];

export interface ScheduleEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string; // 일정 제목
  mood: string; // 감정 요약
  thanks: string; // 감사 일기 내용
}

export interface Message {
  id: string;
  sender: "user" | "cat";
  text: string;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  author: string;
  authorLevel: number;
  avatar: string;
  content: string;
  likes: number;
  likedByMe: boolean;
  comments: { id: string; author: string; text: string; date: string }[];
  date: string;
}
