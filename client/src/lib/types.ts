export type MoodType = 
  | "unfair"      // 억울냥 (메인)
  | "anxious"     // 불안냥
  | "lonely"      // 외롭냥
  | "lethargic"   // 무기력냥
  | "angry"       // 화남냥
  | "love"        // 사랑냥
  | "shy"         // 부끄냥
  | "shocked"     // 놀람냥
  | "bored"       // 지루냥
  | "depressed";  // 우울냥

export interface CatCharacter {
  type: MoodType;
  name: string;
  image: string;
  description: string;
  color: string; // 방 배경 등에 쓸 파스텔 톤
}

export const CAT_CHARACTERS: Record<MoodType, CatCharacter> = {
  unfair: {
    type: "unfair",
    name: "억울냥 (Unfair Cat)",
    image: "/manus-storage/unfair_cat_bb093496.png",
    description: "새파란 사과를 소중하게 꼭 쥐고 있는, 별빛 눈망울의 검은 고양이냥!",
    color: "bg-[#F0FDFA]" // 민트빛
  },
  anxious: {
    type: "anxious",
    name: "불안냥 (Anxious Cat)",
    image: "/manus-storage/anxious_cat_242b50dc.png",
    description: "종이 상자 안에 쏙 들어가서 조심스럽게 주변을 살피는 귀여운 겁쟁이 고양이냥...",
    color: "bg-[#FFF7ED]" // 오렌지빛
  },
  lonely: {
    type: "lonely",
    name: "외롭냥 (Lonely Cat)",
    image: "/manus-storage/lonely_cat_dbdd7a45.png",
    description: "조그만 하얀 곰 인형을 꼭 껴안고 외로움을 달래는 아기 고양이냥.",
    color: "bg-[#F0FDF4]" // 연두빛
  },
  lethargic: {
    type: "lethargic",
    name: "무기력냥 (Lethargic Cat)",
    image: "/manus-storage/lethargic_cat_3adb62ca.png",
    description: "귀여운 밤하늘 고깔모자를 쓰고 베개를 꼭 껴안은 채 쿨쿨 잠든 고양이냥.",
    color: "bg-[#FAF5FF]" // 연보랏빛
  },
  angry: {
    type: "angry",
    name: "화남냥 (Angry Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/angry_cat-m8qAdYjoovLNSSnR5P2dLZ.webp",
    description: "머리 위에 불꽃 스파크가 튀며 씩씩거리고 있는 카리스마 폭발 고양이냥!",
    color: "bg-[#FEF2F2]" // 연빨강
  },
  love: {
    type: "love",
    name: "사랑냥 (Love Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/love_cat-dsgEtsZE45sy9mMnCAYtf4.webp",
    description: "눈에 하트가 뿅뿅 박힌 채 온 세상에 핑크빛 사랑을 전파하는 사랑스러운 고양이냥.",
    color: "bg-[#FDF2F8]" // 연핑크
  },
  shy: {
    type: "shy",
    name: "부끄냥 (Shy Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/shy_cat-TLgWwwHwgWk8QtKSniYTvF.webp",
    description: "두 손으로 얼굴을 가린 채 수줍게 볼을 붉히고 있는 수줍음 많은 아기 고양이냥.",
    color: "bg-[#FFFBF2]" // 부드러운 아이보리
  },
  shocked: {
    type: "shocked",
    name: "놀람냥 (Shocked Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/shocked_cat-PCbH688vJKsoUdWpkFYcyC.webp",
    description: "눈과 입이 똥그랗게 커져서 느낌표를 띄우며 깜짝 놀란 엉뚱한 고양이냥!",
    color: "bg-[#F0F9FF]" // 밝은 하늘색
  },
  bored: {
    type: "bored",
    name: "지루냥 (Bored Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/bored_cat-5Wr3ovL2SF8sUmm6VV4oHa.webp",
    description: "턱을 괴고 한숨을 푹 쉬며 만사가 다 귀찮고 심심한 시크 고양이냥.",
    color: "bg-[#F8FAFC]" // 시크한 밝은 그레이
  },
  depressed: {
    type: "depressed",
    name: "우울냥 (Depressed Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/depressed_cat-WA8hcNwRfsLrtTQLSEYBtQ.webp",
    description: "머리 위에 먹구름 비가 내리며 잔뜩 풀이 죽어있는, 위로가 꼭 필요한 고양이냥...",
    color: "bg-[#EFF6FF]" // 차분한 파란빛
  }
};

// 10문항 심리테스트 문항 정의
export interface TestQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    score: Record<MoodType, number>; // 각 답변이 고양이 감정에 미치는 가중치
  }[];
}

export const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    text: "주말 아침, 눈을 떴을 때 가장 먼저 드는 생각은?",
    options: [
      { text: "와, 오늘 하루 신나게 놀아볼까! (설렘)", score: { love: 3, unfair: 1, anxious: 0, lonely: 0, lethargic: 0, angry: 0, shy: 1, shocked: 0, bored: 0, depressed: 0 } },
      { text: "아... 더 자고 싶다. 아무것도 하기 싫어 (피곤)", score: { lethargic: 3, bored: 2, depressed: 1, unfair: 0, anxious: 0, lonely: 0, angry: 0, love: 0, shy: 0, shocked: 0 } },
      { text: "오늘 해야 할 일들이 걱정되기 시작해 (불안)", score: { anxious: 3, depressed: 1, unfair: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 1, bored: 0 } }
    ]
  },
  {
    id: 2,
    text: "친구가 약속 시간보다 30분 늦는다고 연락이 왔을 때 나의 반응은?",
    options: [
      { text: "바쁜 일이 있겠지! 천천히 오라고 한다 (너그러움)", score: { love: 3, shy: 1, unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, shocked: 0, bored: 1, depressed: 0 } },
      { text: "솔직히 짜증나고 화가 난다 (분노)", score: { angry: 3, unfair: 2, anxious: 0, lonely: 0, lethargic: 0, love: 0, shy: 0, shocked: 0, bored: 0, depressed: 0 } },
      { text: "기다리는 동안 혼자 남겨진 것 같아 쓸쓸하다 (외로움)", score: { lonely: 3, depressed: 2, shy: 1, unfair: 0, anxious: 0, lethargic: 0, angry: 0, love: 0, shocked: 0, bored: 0 } }
    ]
  },
  {
    id: 3,
    text: "길을 걷다가 귀여운 길고양이를 마주쳤을 때 나는?",
    options: [
      { text: "가까이 다가가서 조심스럽게 인사를 건넨다 (다정)", score: { love: 3, shy: 2, unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, shocked: 0, bored: 0, depressed: 0 } },
      { text: "멀리서 지켜보며 수줍게 미소만 짓는다 (소심)", score: { shy: 3, anxious: 1, lonely: 1, unfair: 0, lethargic: 0, angry: 0, love: 1, shocked: 0, bored: 0, depressed: 0 } },
      { text: "우와! 깜짝이야! 소리를 지를 뻔했다 (놀람)", score: { shocked: 3, anxious: 2, unfair: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, bored: 0, depressed: 0 } }
    ]
  },
  {
    id: 4,
    text: "열심히 준비한 발표나 시험이 생각보다 잘 풀리지 않았을 때?",
    options: [
      { text: "내가 노력한 만큼 결과가 안 나와서 억울하고 속상해 (억울)", score: { unfair: 3, angry: 1, depressed: 1, anxious: 0, lonely: 0, lethargic: 0, love: 0, shy: 0, shocked: 0, bored: 0 } },
      { text: "다 포기하고 그냥 침대에 누워있고 싶어 (무기력)", score: { lethargic: 3, depressed: 2, bored: 1, unfair: 0, anxious: 0, lonely: 0, angry: 0, love: 0, shy: 0, shocked: 0 } },
      { text: "다음에는 더 잘할 수 있을지 엄청 걱정돼 (걱정)", score: { anxious: 3, shocked: 1, depressed: 1, unfair: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, bored: 0 } }
    ]
  },
  {
    id: 5,
    text: "매일 반복되는 일상 속에서 문득 느끼는 감정은?",
    options: [
      { text: "아무 일도 일어나지 않아서 너무 지루하고 따분해 (지루)", score: { bored: 3, lethargic: 2, unfair: 0, anxious: 0, lonely: 0, angry: 0, love: 0, shy: 0, shocked: 0, depressed: 1 } },
      { text: "마음 한구석이 텅 빈 것 같고 쓸쓸해 (공허)", score: { lonely: 3, depressed: 3, anxious: 0, unfair: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0 } },
      { text: "오늘도 무사히 흘러가서 평화롭고 감사해 (평온)", score: { love: 3, unfair: 1, anxious: 0, lonely: 0, lethargic: 0, angry: 0, shy: 1, shocked: 0, bored: 0, depressed: 0 } }
    ]
  },
  {
    id: 6,
    text: "새로운 사람들과 가득 찬 모임 자리에 참석했을 때 나의 모습은?",
    options: [
      { text: "어색해서 구석에서 핸드폰만 만지작거린다 (부끄럼)", score: { shy: 3, anxious: 2, lonely: 1, unfair: 0, lethargic: 0, angry: 0, love: 0, shocked: 0, bored: 0, depressed: 0 } },
      { text: "먼저 말을 걸어주는 사람에게 반갑게 리액션한다 (친근)", score: { love: 3, shy: 1, unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, shocked: 0, bored: 0, depressed: 0 } },
      { text: "갑작스러운 주목을 받으면 머릿속이 하얘진다 (당황)", score: { shocked: 3, anxious: 2, shy: 1, unfair: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, bored: 0, depressed: 0 } }
    ]
  },
  {
    id: 7,
    text: "억울하게 오해를 받거나 비난을 받았을 때 나는?",
    options: [
      { text: "너무 억울해서 눈물부터 왈칵 쏟아진다 (눈물)", score: { unfair: 3, depressed: 2, lonely: 1, anxious: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0 } },
      { text: "참을 수 없이 화가 나서 조목조목 따진다 (분노)", score: { angry: 3, unfair: 1, anxious: 0, lonely: 0, lethargic: 0, love: 0, shy: 0, shocked: 0, bored: 0, depressed: 0 } },
      { text: "해명할 힘도 없이 그냥 상황을 회피해버린다 (회피)", score: { lethargic: 3, bored: 2, depressed: 1, unfair: 0, anxious: 0, lonely: 0, angry: 0, love: 0, shy: 0, shocked: 0 } }
    ]
  },
  {
    id: 8,
    text: "갑자기 하늘에서 소나기가 쏟아지는데 우산이 없을 때?",
    options: [
      { text: "헐 대박! 완전 멘붕 상태가 된다 (당황)", score: { shocked: 3, anxious: 2, unfair: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, bored: 0, depressed: 0 } },
      { text: "에휴, 내 인생이 그렇지 뭐... 한숨을 쉰다 (우울)", score: { depressed: 3, unfair: 1, lonely: 1, anxious: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0 } },
      { text: "비 맞으며 뛰는 것도 낭만적이라며 그냥 즐긴다 (낙천)", score: { love: 3, unfair: 1, anxious: 0, lonely: 0, lethargic: 0, angry: 0, shy: 0, shocked: 0, bored: 0, depressed: 0 } }
    ]
  },
  {
    id: 9,
    text: "친한 친구가 고민을 털어놓으며 위로를 바랄 때 나는?",
    options: [
      { text: "마치 내 일처럼 같이 화내고 슬퍼해 준다 (공감)", score: { love: 3, angry: 1, lonely: 1, unfair: 0, anxious: 0, lethargic: 0, shy: 0, shocked: 0, bored: 0, depressed: 0 } },
      { text: "조심스럽게 실질적인 해결 방법을 제안한다 (조언)", score: { love: 2, bored: 1, unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, shy: 0, shocked: 0, depressed: 0 } },
      { text: "가만히 안아주거나 곁에 묵묵히 있어 준다 (침묵)", score: { shy: 3, love: 2, lonely: 1, unfair: 0, anxious: 0, lethargic: 0, angry: 0, shocked: 0, bored: 0, depressed: 0 } }
    ]
  },
  {
    id: 10,
    text: "하루를 마무리하고 침대에 누워 잠들기 직전 드는 기분은?",
    options: [
      { text: "오늘 하루도 참 열심히 살았다, 뿌듯하고 행복해 (행복)", score: { love: 3, shy: 1, unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, shocked: 0, bored: 0, depressed: 0 } },
      { text: "내일 출근이나 등교가 너무 귀찮고 지루해 (지루)", score: { bored: 3, lethargic: 2, unfair: 0, anxious: 0, lonely: 0, angry: 0, love: 0, shy: 0, shocked: 0, depressed: 0 } },
      { text: "쓸데없는 잡생각과 걱정 때문에 잠이 잘 안 와 (걱정)", score: { anxious: 3, depressed: 2, lonely: 1, unfair: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0 } }
    ]
  }
];

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
  { id: "f4", name: "미니 아늑 텐트", price: 4, category: "furniture", image: "", emoji: "⛺", description: "상자보다 훨씬 아늑하고 따뜻한 텐트냥." },
  { id: "f5", name: "우유 가득 밥그릇", price: 2, category: "furniture", image: "", emoji: "🥛", description: "고소한 우유가 가득 차 있어 기운이 솟아난다냥!" },
  // 악세서리
  { id: "a1", name: "빨간 볼터치", price: 1, category: "accessory", image: "", emoji: "🌸", description: "고양이 볼을 핑크빛으로 물들여준다냥!" },
  { id: "a2", name: "노란 리본 타이", price: 2, category: "accessory", image: "", emoji: "🎀", description: "멋쟁이 신사 고양이가 될 수 있다냥." },
  { id: "a3", name: "힙한 선글라스", price: 3, category: "accessory", image: "", emoji: "🕶️", description: "네오 브루탈리즘 감성의 힙스터 고양이냥!" },
  { id: "a4", name: "반짝 마법 왕관", price: 5, category: "accessory", image: "", emoji: "👑", description: "고귀한 왕족 고양이가 될 수 있는 영광의 왕관냥!" },
  { id: "a5", name: "동글이 안경", price: 2, category: "accessory", image: "", emoji: "👓", description: "똑똑해 보이고 상담을 더 잘할 것 같은 안경냥." },
  // 벽지
  { id: "w1", name: "청록색 땡땡이 벽지", price: 3, category: "wallpaper", image: "", emoji: "🎨", description: "민트빛 상큼함이 톡톡 터지는 벽지냥." },
  { id: "w2", name: "밤하늘 별빛 벽지", price: 4, category: "wallpaper", image: "", emoji: "🌌", description: "잠이 솔솔 올 것 같은 아늑한 벽지냥." },
  { id: "w3", name: "달콤 핑크 하트 벽지", price: 4, category: "wallpaper", image: "", emoji: "💖", description: "사랑스러운 기운이 가득 채워지는 핑크 벽지냥." }
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
  hasBestBadge?: boolean; // 상담왕 배지 여부
}
