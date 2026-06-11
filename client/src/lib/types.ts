export type MoodType = 
  | "unfair"      // 억울냥 (기본)
  | "anxious"     // 불안냥
  | "lonely"      // 외롭냥
  | "lethargic"   // 무기력냥
  | "angry"       // 화남냥
  | "love"        // 사랑냥
  | "shy"         // 부끄냥
  | "shocked"     // 놀람냥
  | "bored"       // 지루냥
  | "depressed"   // 우울냥
  | "excited"     // 신남냥
  | "scared"      // 겁먹냥
  | "proud"       // 뿌듯냥
  | "curious"     // 궁금냥
  | "guilty"      // 미안냥
  | "relaxed";    // 편안냥

export interface CatCharacter {
  type: MoodType;
  name: string;
  image: string;
  description: string;
  color: string;
  dexNo: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  rarityLabel: string;
  emoji: string;
  unlockCondition: string;
  specialty: string;
  quote: string;
  lofiMusic: { title: string; url: string };
  themeItems: string[];
}

export const CAT_CHARACTERS: Record<MoodType, CatCharacter> = {
  unfair: {
    type: "unfair",
    name: "억울냥 (Unfair Cat)",
    image: "/manus-storage/unfair_cat_bb093496.png",
    description: "새파란 사과를 소중하게 꼽 쿥고 있는, 별빛 눈망울의 검은 고양이냥!",
    color: "bg-[#E0F2FE]",
    dexNo: 1, rarity: "common", rarityLabel: "일반", emoji: "🍎",
    unlockCondition: "감정 테스트에서 억울냥 결과를 받으면 해금된다냥!",
    specialty: "억울한 감정을 가장 깊이 공감하는 능력",
    quote: "내가 잘못한 게 아닌데... 그래도 괜찮다냥. 내가 알아주겠다냥 🐾",
    lofiMusic: { title: "따뜻한 위로 Lofi ☀️", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    themeItems: ["f3", "a1", "w1"]
  },
  anxious: {
    type: "anxious",
    name: "불안냥 (Anxious Cat)",
    image: "/manus-storage/anxious_cat_242b50dc.png",
    description: "종이 상자 안에 쏙 들어가서 조심스럽게 주변을 살피는 귀여운 겁쟁이 고양이냥...",
    color: "bg-[#FCE7F3]",
    dexNo: 2, rarity: "common", rarityLabel: "일반", emoji: "📦",
    unlockCondition: "감정 테스트에서 불안냥 결과를 받으면 해금된다냥!",
    specialty: "불안한 마음을 안정시켜주는 4-4-4 호흡법 전수",
    quote: "상자 안이 제일 안전하다냥. 하지만 밖으로 나가는 용기도 소중하다냥 💙",
    lofiMusic: { title: "평온한 숨결 Lofi 🌲", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    themeItems: ["f4", "a5", "w4"]
  },
  lonely: {
    type: "lonely",
    name: "외롭냥 (Lonely Cat)",
    image: "/manus-storage/lonely_cat_dbdd7a45.png",
    description: "조그만 하얀 곰 인형을 꼭 껴안고 외로움을 달래는 아기 고양이냥.",
    color: "bg-[#E0F2FE]",
    dexNo: 3, rarity: "common", rarityLabel: "일반", emoji: "🧸",
    unlockCondition: "감정 테스트에서 외롭냥 결과를 받으면 해금된다냥!",
    specialty: "외로운 마음을 따뜻하게 안아주는 공감 능력",
    quote: "혼자라도 괜찮다냥. 내가 항상 곁에 있어줄 거다냥 🤍",
    lofiMusic: { title: "별빛 밤하늘 Lofi 🌌", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    themeItems: ["f2", "a2", "w3"]
  },
  lethargic: {
    type: "lethargic",
    name: "무기력냥 (Lethargic Cat)",
    image: "/manus-storage/lethargic_cat_3adb62ca.png",
    description: "귀여운 밤하늘 고깔모자를 쓰고 베개를 꼭 껴안은 채 쿨쿨 잠든 고양이냥.",
    color: "bg-[#FCE7F3]",
    dexNo: 4, rarity: "common", rarityLabel: "일반", emoji: "💤",
    unlockCondition: "감정 테스트에서 무기력냥 결과를 받으면 해금된다냥!",
    specialty: "완벽한 휴식의 기술을 전수하는 수면 마스터",
    quote: "아무것도 안 하는 것도 용기다냥. 오늘은 그냥 쉬어도 된다냥 😴",
    lofiMusic: { title: "노곤노곤 자장가 Lofi 💤", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    themeItems: ["f6", "a7", "w2"]
  },
  angry: {
    type: "angry",
    name: "화남냥 (Angry Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/angry_cat-m8qAdYjoovLNSSnR5P2dLZ.webp",
    description: "머리 위에 불꽃 스파크가 튀며 씩씩거리고 있는 카리스마 폭발 고양이냥!",
    color: "bg-[#FEF2F2]",
    dexNo: 5, rarity: "uncommon", rarityLabel: "희귀", emoji: "🔥",
    unlockCondition: "감정 테스트에서 화남냥 결과를 받으면 해금된다냥!",
    specialty: "화난 감정을 건강하게 표현하는 방법 코치",
    quote: "화가 나는 건 당연하다냥. 그 에너지를 올바른 방향으로 쓰면 된다냥 🔥",
    lofiMusic: { title: "불꽃튀는 마음 Lofi 🔥", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    themeItems: ["f7", "a3", "w1"]
  },
  love: {
    type: "love",
    name: "사랑냥 (Love Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/love_cat-dsgEtsZE45sy9mMnCAYtf4.webp",
    description: "눈에 하트가 뿅뿅 박힌 채 온 세상에 핑크빛 사랑을 전파하는 사랑스러운 고양이냥.",
    color: "bg-[#FDF2F8]",
    dexNo: 6, rarity: "rare", rarityLabel: "레어", emoji: "💖",
    unlockCondition: "감정 테스트에서 사랑냥 결과를 받으면 해금된다냥!",
    specialty: "사랑과 긍정 에너지를 전파하는 힐링 마스터",
    quote: "세상 모든 것을 사랑하면 세상도 나를 사랑해준다냥 💖",
    lofiMusic: { title: "핑크빛 사랑 Lofi 💖", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    themeItems: ["a2", "a7", "w3"]
  },
  shy: {
    type: "shy",
    name: "부끄냥 (Shy Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/shy_cat-TLgWwwHwgWk8QtKSniYTvF.webp",
    description: "두 손으로 얼굴을 가린 채 수줍게 볼을 붉히고 있는 수줍음 많은 아기 고양이냥.",
    color: "bg-[#FFF7ED]",
    dexNo: 7, rarity: "uncommon", rarityLabel: "희귀", emoji: "🌸",
    unlockCondition: "감정 테스트에서 부끄냥 결과를 받으면 해금된다냥!",
    specialty: "수줍음을 귀여움으로 승화시키는 특별한 재능",
    quote: "부끄러운 건 나쁜 게 아니다냥. 그게 바로 나의 매력이다냥 🌸",
    lofiMusic: { title: "수줄수줄 파스텔 Lofi 🌸", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    themeItems: ["a1", "f2", "w3"]
  },
  shocked: {
    type: "shocked",
    name: "놀람냥 (Shocked Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/shocked_cat-PCbH688vJKsoUdWpkFYcyC.webp",
    description: "눈과 입이 똥그랗게 커져서 느낌표를 띄우며 깜짝 놀란 엉뚱한 고양이냥!",
    color: "bg-[#F0F9FF]",
    dexNo: 8, rarity: "uncommon", rarityLabel: "희귀", emoji: "❗",
    unlockCondition: "감정 테스트에서 놀람냥 결과를 받으면 해금된다냥!",
    specialty: "세상의 모든 놀라운 것들을 발견하는 탐험 능력",
    quote: "세상은 항상 놀라운 일로 가득하다냥! 그게 바로 삶의 재미다냥 ❗",
    lofiMusic: { title: "놀라운 탐험 Lofi ❗", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
    themeItems: ["f1", "a5", "w4"]
  },
  bored: {
    type: "bored",
    name: "지루냥 (Bored Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/bored_cat-5Wr3ovL2SF8sUmm6VV4oHa.webp",
    description: "턱을 괴고 한숨을 푹 쉬며 만사가 다 귀찮고 심심한 시크 고양이냥.",
    color: "bg-[#F8FAFC]",
    dexNo: 9, rarity: "common", rarityLabel: "일반", emoji: "😑",
    unlockCondition: "감정 테스트에서 지루냥 결과를 받으면 해금된다냥!",
    specialty: "지루함 속에서 새로운 취미를 찾아내는 능력",
    quote: "지루하다는 건 새로운 자극을 원한다는 신호다냥. 뭔가 새로운 걸 해보라냥 😑",
    lofiMusic: { title: "시크한 일상 Lofi 😑", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
    themeItems: ["f5", "a3", "w1"]
  },
  depressed: {
    type: "depressed",
    name: "우울냥 (Depressed Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/depressed_cat-WA8hcNwRfsLrtTQLSEYBtQ.webp",
    description: "머리 위에 먹구름 비가 내리며 잔뜩 풀이 죽어있는, 위로가 꼭 필요한 고양이냥...",
    color: "bg-[#EFF6FF]",
    dexNo: 10, rarity: "rare", rarityLabel: "레어", emoji: "🌧️",
    unlockCondition: "감정 테스트에서 우울냥 결과를 받으면 해금된다냥!",
    specialty: "비 오는 날의 따뜻한 위로와 공감 능력",
    quote: "비가 온 뒤에 땅이 굳는 것처럼, 이 슬픔도 나를 더 단단하게 만든다냥 🌧️",
    lofiMusic: { title: "비 오는 날 Lofi 🌧️", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    themeItems: ["f6", "a7", "w2"]
  },
  excited: {
    type: "excited",
    name: "신남냥 (Excited Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/love_cat-dsgEtsZE45sy9mMnCAYtf4.webp",
    description: "온몸으로 에너지를 발산하며 너무 신나서 꼬리를 붕붕 흔드는 고양이냥!",
    color: "bg-[#FFFBEB]",
    dexNo: 11, rarity: "uncommon", rarityLabel: "희귀", emoji: "⚡",
    unlockCondition: "감정 테스트에서 신남냥 결과를 받으면 해금된다냥!",
    specialty: "신나는 에너지로 주변 모두를 활기차게 만드는 능력",
    quote: "오늘 하루도 최고다냥! 이 에너지로 뭐든 다 할 수 있다냥 ⚡",
    lofiMusic: { title: "신나는 에너지 Lofi ⚡", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
    themeItems: ["f1", "a4", "w4"]
  },
  scared: {
    type: "scared",
    name: "겁먹냥 (Scared Cat)",
    image: "/manus-storage/anxious_cat_242b50dc.png",
    description: "어두운 방구석에서 꼬리를 바짝 내린 채 무서워하고 있는 겁쟁이 고양이냥.",
    color: "bg-[#F0FDF4]",
    dexNo: 12, rarity: "uncommon", rarityLabel: "희귀", emoji: "👻",
    unlockCondition: "감정 테스트에서 겁먹냥 결과를 받으면 해금된다냥!",
    specialty: "두려움을 용기로 바꾸는 마음의 연금술",
    quote: "무서운 건 당연하다냥. 그래도 한 발짝 내딛는 것이 용기다냥 👻",
    lofiMusic: { title: "용기를 내에 Lofi 👻", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
    themeItems: ["f4", "a6", "w2"]
  },
  proud: {
    type: "proud",
    name: "뿌듯냥 (Proud Cat)",
    image: "/manus-storage/unfair_cat_bb093496.png",
    description: "자신이 해낸 일을 자랑스러워하며 가슴을 쫙 펴고 당당하게 서 있는 고양이냥!",
    color: "bg-[#FFF7ED]",
    dexNo: 13, rarity: "rare", rarityLabel: "레어", emoji: "🏆",
    unlockCondition: "감정 테스트에서 뿌듯냥 결과를 받으면 해금된다냥!",
    specialty: "성취감을 극대화하고 자존감을 높여주는 응원 능력",
    quote: "오늘 해낸 일이 아무리 작아도 그건 분명 대단한 일이다냥 🏆",
    lofiMusic: { title: "성취감 가득 Lofi 🏆", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
    themeItems: ["a4", "f7", "w4"]
  },
  curious: {
    type: "curious",
    name: "궁금냥 (Curious Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/shocked_cat-PCbH688vJKsoUdWpkFYcyC.webp",
    description: "눈을 반짝이며 드림님의 모든 일상과 비밀을 다 궁금해하는 호기심 천국 고양이냥.",
    color: "bg-[#EFF6FF]",
    dexNo: 14, rarity: "uncommon", rarityLabel: "희귀", emoji: "🔍",
    unlockCondition: "감정 테스트에서 궁금냥 결과를 받으면 해금된다냥!",
    specialty: "모든 것에 호기심을 갖고 탐구하는 지식 탐험가",
    quote: "모르는 게 있다는 건 배울 게 있다는 뜻이다냥. 항상 궁금해하라냥 🔍",
    lofiMusic: { title: "호기심 가득 Lofi 🔍", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
    themeItems: ["f1", "a5", "w4"]
  },
  guilty: {
    type: "guilty",
    name: "미안냥 (Guilty Cat)",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/shy_cat-TLgWwwHwgWk8QtKSniYTvF.webp",
    description: "잘못한 일이 있어 고개를 푹 숙인 채 꼬리를 살랑이며 미안해하는 고양이냥.",
    color: "bg-[#FDF4FF]",
    dexNo: 15, rarity: "uncommon", rarityLabel: "희귀", emoji: "🙏",
    unlockCondition: "감정 테스트에서 미안냥 결과를 받으면 해금된다냥!",
    specialty: "진심 어린 사과와 화해를 이끌어내는 공감 능력",
    quote: "미안하다고 말하는 용기가 관계를 더 깊게 만든다냥 🙏",
    lofiMusic: { title: "진심 어린 사과 Lofi 🙏", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
    themeItems: ["a2", "f5", "w3"]
  },
  relaxed: {
    type: "relaxed",
    name: "편안냥 (Relaxed Cat)",
    image: "/manus-storage/lethargic_cat_3adb62ca.png",
    description: "따뜻한 벽난로 앞 러그에 누워 뒹굴거리며 완벽한 평온을 즐기는 고양이냥.",
    color: "bg-[#F0FDF4]",
    dexNo: 16, rarity: "legendary", rarityLabel: "전설", emoji: "🌿",
    unlockCondition: "감정 테스트에서 편안냥 결과를 받으면 해금된다냥!",
    specialty: "마음의 평화를 전파하는 궁극의 힐링 마스터",
    quote: "지금 이 순간, 이대로도 충분히 완벽하다냥. 그냥 있어도 된다냥 🌿",
    lofiMusic: { title: "평온한 숲속 Lofi 🌿", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    themeItems: ["f6", "f2", "w4"]
  }
};

// 감정 테스트 질문 인터페이스
export interface TestQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    score: Partial<Record<MoodType, number>>;
  }[];
}

// 감정 테스트 질문 100개
export const QUESTION_BANK: TestQuestion[] = [
  // 1-10: 일상 반응
  { id: 1, text: "주말 아침, 눈을 떴을 때 가장 먼저 드는 생각은?", options: [
    { text: "오늘 하루 신나게 놀아볼까! (설렘)", score: { love: 3, excited: 3, relaxed: 1 } },
    { text: "아... 더 자고 싶다. 아무것도 하기 싫어 (피곤)", score: { lethargic: 3, bored: 2, relaxed: 2 } },
    { text: "오늘 해야 할 일들이 걱정되기 시작해 (불안)", score: { anxious: 3, scared: 2, unfair: 1 } }
  ]},
  { id: 2, text: "친구가 약속 시간보다 30분 늦는다고 연락이 왔을 때 나의 반응은?", options: [
    { text: "바쁜 일이 있겠지! 천천히 오라고 한다 (너그러움)", score: { love: 3, relaxed: 3, shy: 1 } },
    { text: "솔직히 짜증나고 화가 난다 (분노)", score: { angry: 3, unfair: 2, guilty: 1 } },
    { text: "기다리는 동안 혼자 남겨진 것 같아 쓸쓸하다 (외로움)", score: { lonely: 3, depressed: 2, shy: 1 } }
  ]},
  { id: 3, text: "길을 걷다가 귀여운 길고양이를 마주쳤을 때 나는?", options: [
    { text: "가까이 다가가서 조심스럽게 인사를 건넨다 (다정)", score: { love: 3, curious: 3, shy: 1 } },
    { text: "멀리서 지켜보며 수줍게 미소만 짓는다 (소심)", score: { shy: 3, scared: 2, lonely: 1 } },
    { text: "우와! 깜짝이야! 소리를 지를 뻔했다 (놀람)", score: { shocked: 3, anxious: 2, scared: 2 } }
  ]},
  { id: 4, text: "열심히 준비한 발표나 시험이 생각보다 잘 풀리지 않았을 때?", options: [
    { text: "내가 노력한 만큼 결과가 안 나와서 억울하고 속상해 (억울)", score: { unfair: 3, angry: 2, depressed: 2 } },
    { text: "다 포기하고 그냥 침대에 누워있고 싶어 (무기력)", score: { lethargic: 3, depressed: 2, bored: 2 } },
    { text: "다음에는 더 잘할 수 있을지 엄청 걱정돼 (걱정)", score: { anxious: 3, scared: 2, depressed: 1 } }
  ]},
  { id: 5, text: "매일 반복되는 일상 속에서 문득 느끼는 감정은?", options: [
    { text: "아무 일도 일어나지 않아서 너무 지루하고 따분해 (지루)", score: { bored: 3, lethargic: 2, relaxed: 1 } },
    { text: "마음 한구석이 텅 빈 것 같고 쓸쓸해 (공허)", score: { lonely: 3, depressed: 3, anxious: 1 } },
    { text: "오늘도 무사히 흘러가서 평화롭고 감사해 (평온)", score: { relaxed: 3, love: 2, proud: 2 } }
  ]},
  { id: 6, text: "새로운 사람들과 가득 찬 모임 자리에 참석했을 때 나의 모습은?", options: [
    { text: "어색해서 구석에서 핸드폰만 만지작거린다 (부끄럼)", score: { shy: 3, anxious: 2, scared: 2 } },
    { text: "먼저 말을 걸어주는 사람에게 반갑게 리액션한다 (친근)", score: { love: 3, excited: 2, curious: 2 } },
    { text: "갑작스러운 주목을 받으면 머릿속이 하얘진다 (당황)", score: { shocked: 3, anxious: 2, shy: 2 } }
  ]},
  { id: 7, text: "억울하게 오해를 받거나 비난을 받았을 때 나는?", options: [
    { text: "너무 억울해서 눈물부터 왈칵 쏟아진다 (눈물)", score: { unfair: 3, depressed: 2, lonely: 2 } },
    { text: "참을 수 없이 화가 나서 조목조목 따진다 (분노)", score: { angry: 3, proud: 1, unfair: 2 } },
    { text: "해명할 힘도 없이 그냥 상황을 회피해버린다 (회피)", score: { lethargic: 3, bored: 2, relaxed: 2 } }
  ]},
  { id: 8, text: "갑자기 하늘에서 소나기가 쏟아지는데 우산이 없을 때?", options: [
    { text: "헐 대박! 완전 멘붕 상태가 된다 (당황)", score: { shocked: 3, anxious: 2, scared: 2 } },
    { text: "에휴, 내 인생이 그렇지 뭐... 한숨을 쉰다 (우울)", score: { depressed: 3, unfair: 2, lonely: 1 } },
    { text: "비 맞으며 뛰는 것도 낭만적이라며 그냥 즐긴다 (낙천)", score: { excited: 3, love: 2, relaxed: 2 } }
  ]},
  { id: 9, text: "친한 친구가 고민을 털어놓으며 위로를 바랄 때 나는?", options: [
    { text: "마치 내 일처럼 같이 화내고 슬퍼해 준다 (공감)", score: { love: 3, angry: 1, lonely: 1 } },
    { text: "조심스럽게 실질적인 해결 방법을 제안한다 (조언)", score: { proud: 3, relaxed: 2, curious: 1 } },
    { text: "가만히 안아주거나 곁에 묵묵히 있어 준다 (침묵)", score: { shy: 3, love: 2, relaxed: 2 } }
  ]},
  { id: 10, text: "하루를 마무리하고 침대에 누워 잠들기 직전 드는 기분은?", options: [
    { text: "오늘 하루도 참 열심히 살았다, 뿌듯하고 행복해 (행복)", score: { proud: 3, love: 2, relaxed: 2 } },
    { text: "내일 출근이나 등교가 너무 귀찮고 지루해 (지루)", score: { bored: 3, lethargic: 2, relaxed: 1 } },
    { text: "쓸데없는 잡생각과 걱정 때문에 잠이 잘 안 와 (걱정)", score: { anxious: 3, depressed: 2, lonely: 1 } }
  ]},
  // 11-20: 사회적 상황
  { id: 11, text: "갑자기 일주일 동안의 휴가가 주어졌을 때 나는?", options: [
    { text: "당장 짐 싸서 낯선 곳으로 여행을 떠난다! (도전)", score: { excited: 3, curious: 3, proud: 1 } },
    { text: "집 밖은 위험해! 침대 위에서 넷플릭스 정주행 (방콕)", score: { relaxed: 3, lethargic: 2, bored: 1 } },
    { text: "갑작스러운 휴가라니, 뭘 해야 할지 계획 짜느라 머리 아파 (계획)", score: { anxious: 2, shocked: 1, scared: 1 } }
  ]},
  { id: 12, text: "누군가 나에게 뜻밖의 칭찬을 건넸을 때 나의 행동은?", options: [
    { text: "부끄러워서 얼굴을 붉히며 손사래를 친다 (수줍)", score: { shy: 3, guilty: 1, love: 1 } },
    { text: "속으로 엄청 뿌듯해하며 기분 좋게 감사 인사를 한다 (뿌듯)", score: { proud: 3, excited: 2, love: 2 } },
    { text: "진심이 맞을까? 무슨 의도가 있는 건지 의심해본다 (의심)", score: { anxious: 2, curious: 2, unfair: 1 } }
  ]},
  { id: 13, text: "길에서 아는 사람을 마주쳤을 때 나는?", options: [
    { text: "모르는 척 고개를 돌리거나 길을 돌아간다 (소심)", score: { shy: 3, scared: 2, anxious: 1 } },
    { text: "먼저 다가가서 환하게 웃으며 인사를 건넨다 (활달)", score: { love: 3, excited: 3, proud: 1 } },
    { text: "어? 아는 사람인가? 긴가민가하며 쳐다본다 (호기심)", score: { curious: 3, shocked: 2, bored: 1 } }
  ]},
  { id: 14, text: "오랜만에 정말 맛있는 음식을 먹었을 때 느끼는 감정은?", options: [
    { text: "와! 인생 맛집 발견! 너무 신나고 짜릿해 (신남)", score: { excited: 3, love: 2, proud: 1 } },
    { text: "먹는 순간만큼은 세상의 모든 걱정이 사라져 (편안)", score: { relaxed: 3, love: 2, lethargic: 1 } },
    { text: "혼자 먹으니까 조금 쓸쓸하고 허전해 (외로움)", score: { lonely: 3, depressed: 2, shy: 1 } }
  ]},
  { id: 15, text: "누군가 내 방의 소중한 물건을 허락 없이 만졌을 때 나는?", options: [
    { text: "내 경계를 침범당한 것 같아 몹시 불쾌하고 화가 난다 (분노)", score: { angry: 3, unfair: 2, anxious: 1 } },
    { text: "혹시 물건이 망가졌을까 봐 전전긍긍하며 불안해한다 (불안)", score: { anxious: 3, scared: 2, shocked: 1 } },
    { text: "귀찮아서 그냥 아무 말 안 하고 넘어간다 (무던)", score: { relaxed: 3, lethargic: 2, bored: 2 } }
  ]},
  { id: 16, text: "SNS에서 내 게시물에 아무도 반응하지 않을 때 드는 감정은?", options: [
    { text: "내가 뭘 잘못한 건지 불안하고 걱정돼 (불안)", score: { anxious: 3, depressed: 2, lonely: 1 } },
    { text: "아무도 관심 없나봐... 쓸쓸하고 외로워 (외로움)", score: { lonely: 3, depressed: 2, shy: 1 } },
    { text: "상관없어. 내가 좋으면 그만이지 (무관심)", score: { relaxed: 3, bored: 2, proud: 1 } }
  ]},
  { id: 17, text: "오랫동안 기다려온 이벤트나 여행 전날 밤 나는?", options: [
    { text: "너무 설레서 잠을 못 이루고 뒤척인다 (설렘)", score: { excited: 3, love: 2, anxious: 1 } },
    { text: "혹시 무슨 일이 생기지 않을까 걱정이 앞선다 (걱정)", score: { anxious: 3, scared: 2, depressed: 1 } },
    { text: "피곤하니까 그냥 일찍 자는 게 낫겠다 (무덤덤)", score: { lethargic: 3, relaxed: 2, bored: 1 } }
  ]},
  { id: 18, text: "갑자기 예상치 못한 선물을 받았을 때 나의 반응은?", options: [
    { text: "너무 감동받아서 눈물이 날 것 같아 (감동)", score: { love: 3, shy: 2, guilty: 1 } },
    { text: "와! 이게 뭐야! 완전 신나고 기뻐 (기쁨)", score: { excited: 3, shocked: 2, love: 2 } },
    { text: "왜 줬을까? 무슨 이유가 있는 건지 궁금해 (의심)", score: { curious: 3, anxious: 2, unfair: 1 } }
  ]},
  { id: 19, text: "중요한 결정을 내려야 할 때 나의 방식은?", options: [
    { text: "일단 저지르고 나중에 생각한다 (충동적)", score: { excited: 3, shocked: 2, proud: 1 } },
    { text: "모든 경우의 수를 따져보며 신중하게 고민한다 (신중)", score: { anxious: 3, curious: 2, proud: 1 } },
    { text: "어차피 뭘 해도 비슷하겠지... 그냥 아무거나 (무기력)", score: { lethargic: 3, bored: 2, depressed: 2 } }
  ]},
  { id: 20, text: "혼자 있는 시간이 생겼을 때 나는?", options: [
    { text: "드디어 혼자다! 나만의 시간을 즐긴다 (자유)", score: { relaxed: 3, proud: 2, love: 1 } },
    { text: "심심하고 허전해서 누군가에게 연락하고 싶어 (외로움)", score: { lonely: 3, bored: 2, depressed: 1 } },
    { text: "혼자 있으면 이상한 생각들이 자꾸 떠올라 (불안)", score: { anxious: 3, depressed: 2, scared: 1 } }
  ]},
  // 21-30: 감정 반응
  { id: 21, text: "누군가 나를 무시하거나 하찮게 대할 때 드는 감정은?", options: [
    { text: "이렇게 대우받을 이유가 없는데 너무 억울해 (억울)", score: { unfair: 3, angry: 2, depressed: 1 } },
    { text: "내가 정말 부족한 사람인가봐... 자신감이 떨어져 (우울)", score: { depressed: 3, lonely: 2, lethargic: 1 } },
    { text: "저 사람이 나쁜 거야. 당당하게 맞서야겠어 (분노)", score: { angry: 3, proud: 2, unfair: 1 } }
  ]},
  { id: 22, text: "좋아하는 사람에게 먼저 연락하고 싶을 때 나는?", options: [
    { text: "용기 내서 바로 연락한다! (용감)", score: { love: 3, excited: 2, proud: 2 } },
    { text: "연락했다가 거절당할까봐 너무 무서워 (두려움)", score: { scared: 3, anxious: 2, shy: 2 } },
    { text: "상대방이 먼저 연락해주길 기다린다 (소극적)", score: { shy: 3, lonely: 2, relaxed: 1 } }
  ]},
  { id: 23, text: "내가 실수를 했을 때 나의 첫 번째 반응은?", options: [
    { text: "너무 미안하고 죄책감에 시달린다 (죄책감)", score: { guilty: 3, anxious: 2, depressed: 1 } },
    { text: "어쩔 수 없었어. 다음엔 더 잘하면 되지 (긍정)", score: { relaxed: 3, proud: 2, love: 1 } },
    { text: "이런 실수를 하다니 나 자신이 너무 싫어 (자책)", score: { depressed: 3, unfair: 2, lethargic: 1 } }
  ]},
  { id: 24, text: "오랫동안 연락이 없던 친구에게서 갑자기 연락이 왔을 때?", options: [
    { text: "반가워서 바로 답장하고 만남을 약속한다 (반가움)", score: { love: 3, excited: 2, curious: 1 } },
    { text: "왜 갑자기 연락했을까? 무슨 부탁이 있는 건지 (의심)", score: { curious: 3, anxious: 2, unfair: 1 } },
    { text: "그냥 읽고 나중에 답장하거나 무시한다 (무관심)", score: { bored: 3, lethargic: 2, relaxed: 1 } }
  ]},
  { id: 25, text: "오늘 하루 가장 많이 느낀 감정을 하나 고른다면?", options: [
    { text: "뭔가 억울하고 불공평하다는 느낌 (억울)", score: { unfair: 3, angry: 2, depressed: 1 } },
    { text: "아무 감정도 없이 그냥 멍하고 무감각해 (무기력)", score: { lethargic: 3, bored: 3, depressed: 1 } },
    { text: "작은 것들에도 감사하고 따뜻한 기분 (감사)", score: { love: 3, relaxed: 2, proud: 2 } }
  ]},
  { id: 26, text: "꿈에서 깨어났을 때 기억에 남는 꿈의 분위기는?", options: [
    { text: "쫓기거나 위험한 상황의 무서운 꿈 (공포)", score: { scared: 3, anxious: 2, depressed: 1 } },
    { text: "행복하고 따뜻한 사람들과 함께하는 꿈 (행복)", score: { love: 3, relaxed: 2, excited: 1 } },
    { text: "꿈을 거의 기억하지 못하거나 꿈이 없어 (무감각)", score: { lethargic: 3, bored: 2, relaxed: 1 } }
  ]},
  { id: 27, text: "좋아하는 음악을 들을 때 주로 느끼는 감정은?", options: [
    { text: "신나서 몸이 저절로 움직이고 기분이 업돼 (신남)", score: { excited: 3, love: 2, proud: 1 } },
    { text: "마음이 차분해지고 위로받는 느낌이야 (위로)", score: { relaxed: 3, lonely: 1, depressed: 1 } },
    { text: "감정이 북받쳐 올라 눈물이 날 것 같아 (감동)", score: { love: 3, depressed: 2, lonely: 1 } }
  ]},
  { id: 28, text: "비가 오는 날 창밖을 바라볼 때 드는 기분은?", options: [
    { text: "왠지 모르게 쓸쓸하고 우울해져 (우울)", score: { depressed: 3, lonely: 2, lethargic: 1 } },
    { text: "빗소리가 좋아서 오히려 편안하고 아늑해 (편안)", score: { relaxed: 3, love: 2, bored: 1 } },
    { text: "이런 날씨에 밖에 나가야 하다니 짜증나 (짜증)", score: { angry: 3, unfair: 2, lethargic: 1 } }
  ]},
  { id: 29, text: "누군가 나의 비밀을 다른 사람에게 말했을 때 나는?", options: [
    { text: "배신당한 것 같아서 너무 억울하고 화가 나 (배신)", score: { unfair: 3, angry: 3, depressed: 1 } },
    { text: "앞으로 아무도 믿을 수 없을 것 같아 무서워 (두려움)", score: { scared: 3, anxious: 2, lonely: 1 } },
    { text: "그 사람과의 관계가 어색해져서 슬퍼 (슬픔)", score: { depressed: 3, lonely: 2, guilty: 1 } }
  ]},
  { id: 30, text: "갑자기 아무 이유 없이 눈물이 나올 것 같을 때 나는?", options: [
    { text: "그냥 참고 아무렇지 않은 척한다 (억압)", score: { unfair: 2, lethargic: 2, shy: 2 } },
    { text: "혼자 조용히 실컷 울어버린다 (해소)", score: { depressed: 3, lonely: 2, relaxed: 1 } },
    { text: "왜 이러지? 내 감정이 이해가 안 돼 (혼란)", score: { curious: 2, anxious: 2, shocked: 2 } }
  ]},
  // 31-40: 관계와 소통
  { id: 31, text: "친구들 사이에서 나의 역할은 주로?", options: [
    { text: "분위기를 띄우고 모두를 웃게 만드는 사람 (활기)", score: { excited: 3, love: 2, proud: 1 } },
    { text: "조용히 듣고 공감해주는 사람 (경청)", score: { shy: 3, love: 2, relaxed: 1 } },
    { text: "모임 자체가 부담스러워서 자주 빠지는 사람 (회피)", score: { anxious: 3, lonely: 2, scared: 1 } }
  ]},
  { id: 32, text: "누군가와 의견이 충돌했을 때 나의 대처 방식은?", options: [
    { text: "내 의견을 끝까지 주장하고 설득하려 한다 (고집)", score: { angry: 3, proud: 2, unfair: 1 } },
    { text: "갈등이 싫어서 그냥 상대방 의견에 맞춰준다 (양보)", score: { shy: 3, guilty: 2, relaxed: 1 } },
    { text: "서로 다른 의견을 존중하며 타협점을 찾는다 (협력)", score: { love: 3, relaxed: 2, curious: 1 } }
  ]},
  { id: 33, text: "오랫동안 혼자 있었을 때 드는 감정은?", options: [
    { text: "혼자만의 시간이 충전되는 느낌이라 좋아 (충전)", score: { relaxed: 3, proud: 2, love: 1 } },
    { text: "너무 외롭고 누군가와 함께하고 싶어 (외로움)", score: { lonely: 3, depressed: 2, love: 1 } },
    { text: "혼자 있으면 이런저런 걱정이 밀려와 (불안)", score: { anxious: 3, depressed: 2, scared: 1 } }
  ]},
  { id: 34, text: "처음 만나는 사람과 대화할 때 나는?", options: [
    { text: "먼저 말을 걸고 친해지려고 노력한다 (적극적)", score: { love: 3, excited: 2, curious: 2 } },
    { text: "상대방이 먼저 말을 걸어줄 때까지 기다린다 (소극적)", score: { shy: 3, scared: 2, anxious: 1 } },
    { text: "어색하고 불편해서 빨리 자리를 피하고 싶어 (회피)", score: { anxious: 3, shy: 2, scared: 2 } }
  ]},
  { id: 35, text: "소중한 사람이 힘들어할 때 나는?", options: [
    { text: "내 일처럼 같이 걱정하고 무엇이든 도와주고 싶어 (헌신)", score: { love: 3, guilty: 1, anxious: 1 } },
    { text: "뭐라고 위로해야 할지 몰라서 어색하게 있어 (당황)", score: { shy: 3, shocked: 2, guilty: 1 } },
    { text: "나도 힘든데 다른 사람 걱정할 여유가 없어 (무기력)", score: { lethargic: 3, depressed: 2, bored: 1 } }
  ]},
  { id: 36, text: "단체 대화방에서 나의 모습은?", options: [
    { text: "적극적으로 대화에 참여하고 이모티콘도 많이 써 (활발)", score: { excited: 3, love: 2, curious: 1 } },
    { text: "주로 읽기만 하고 가끔 짧게 답장한다 (조용)", score: { shy: 3, relaxed: 2, bored: 1 } },
    { text: "알림이 쌓이면 부담스러워서 알림을 꺼버린다 (회피)", score: { anxious: 3, lethargic: 2, scared: 1 } }
  ]},
  { id: 37, text: "친구가 나보다 더 좋은 결과를 얻었을 때 나는?", options: [
    { text: "진심으로 축하해주고 함께 기뻐한다 (축하)", score: { love: 3, relaxed: 2, proud: 1 } },
    { text: "나도 더 열심히 해야겠다는 자극을 받아 (경쟁)", score: { proud: 3, excited: 2, curious: 1 } },
    { text: "나는 왜 이 모양일까... 자괴감이 들어 (자책)", score: { depressed: 3, unfair: 2, lethargic: 1 } }
  ]},
  { id: 38, text: "가족과 함께하는 시간에 주로 드는 감정은?", options: [
    { text: "따뜻하고 행복해서 이 순간이 소중하게 느껴져 (행복)", score: { love: 3, relaxed: 2, proud: 1 } },
    { text: "잔소리나 갈등이 생길까봐 긴장되고 불편해 (긴장)", score: { anxious: 3, scared: 2, unfair: 1 } },
    { text: "빨리 혼자 있고 싶다는 생각이 들어 (회피)", score: { lethargic: 3, bored: 2, shy: 1 } }
  ]},
  { id: 39, text: "누군가 나의 외모나 능력을 비교하며 비판할 때?", options: [
    { text: "그런 말을 들을 이유가 없는데 너무 억울해 (억울)", score: { unfair: 3, angry: 2, depressed: 1 } },
    { text: "그 말이 맞는 것 같아서 더 슬프고 자신감이 없어져 (자존감 하락)", score: { depressed: 3, lonely: 2, lethargic: 1 } },
    { text: "그 사람 말이 틀렸다는 걸 증명하고 싶어 (반발)", score: { proud: 3, angry: 2, excited: 1 } }
  ]},
  { id: 40, text: "약속이 갑자기 취소됐을 때 나의 반응은?", options: [
    { text: "오히려 잘됐다! 혼자만의 시간이 생겼어 (안도)", score: { relaxed: 3, lethargic: 2, bored: 1 } },
    { text: "기다렸는데 실망스럽고 서운해 (서운함)", score: { lonely: 3, depressed: 2, unfair: 1 } },
    { text: "왜 취소했을까? 나 때문인가? 걱정돼 (불안)", score: { anxious: 3, scared: 2, depressed: 1 } }
  ]},
  // 41-50: 자아와 성장
  { id: 41, text: "거울을 보며 내 모습을 바라볼 때 드는 생각은?", options: [
    { text: "오늘도 나름 괜찮은 것 같아, 만족스러워 (자존감)", score: { proud: 3, love: 2, relaxed: 1 } },
    { text: "이 부분이 마음에 안 들어, 더 나아져야 해 (자기개선)", score: { curious: 2, anxious: 2, unfair: 1 } },
    { text: "별로 보고 싶지 않아, 그냥 지나쳐 (회피)", score: { depressed: 3, lethargic: 2, shy: 1 } }
  ]},
  { id: 42, text: "새로운 도전이나 변화 앞에서 나는?", options: [
    { text: "두근두근! 새로운 경험이 기대되고 설레 (도전)", score: { excited: 3, curious: 3, proud: 1 } },
    { text: "실패할까봐 두렵고 시작하기 전부터 걱정돼 (두려움)", score: { scared: 3, anxious: 3, depressed: 1 } },
    { text: "귀찮아. 지금 이대로도 충분한데 (현상유지)", score: { lethargic: 3, relaxed: 2, bored: 2 } }
  ]},
  { id: 43, text: "내 꿈이나 목표에 대해 생각할 때 드는 감정은?", options: [
    { text: "언젠가 반드시 이룰 거야! 의욕이 넘쳐 (의욕)", score: { excited: 3, proud: 3, love: 1 } },
    { text: "과연 내가 할 수 있을까... 자신이 없어 (불안)", score: { anxious: 3, scared: 2, depressed: 1 } },
    { text: "꿈이 있어도 어차피 안 될 것 같아 (포기)", score: { depressed: 3, lethargic: 3, unfair: 1 } }
  ]},
  { id: 44, text: "과거의 실수나 후회스러운 일을 떠올릴 때 나는?", options: [
    { text: "그때 왜 그랬을까... 계속 자책하게 돼 (자책)", score: { guilty: 3, depressed: 2, anxious: 1 } },
    { text: "그 경험 덕분에 지금의 내가 있어 (성장)", score: { proud: 3, relaxed: 2, love: 1 } },
    { text: "생각하기 싫어서 다른 것에 집중하려 해 (회피)", score: { lethargic: 3, bored: 2, scared: 1 } }
  ]},
  { id: 45, text: "나 자신을 한 단어로 표현한다면?", options: [
    { text: "열정적이고 에너지 넘치는 사람 (열정)", score: { excited: 3, proud: 2, love: 1 } },
    { text: "조용하고 내성적인 사람 (내성적)", score: { shy: 3, lonely: 2, relaxed: 1 } },
    { text: "걱정 많고 예민한 사람 (예민)", score: { anxious: 3, scared: 2, depressed: 1 } }
  ]},
  { id: 46, text: "나의 감정을 다른 사람에게 표현하는 것이?", options: [
    { text: "자연스럽고 솔직하게 표현하는 편이야 (솔직)", score: { love: 3, excited: 2, proud: 1 } },
    { text: "어색하고 부끄러워서 잘 못 표현해 (억압)", score: { shy: 3, guilty: 2, anxious: 1 } },
    { text: "표현했다가 상처받을까봐 두려워 (두려움)", score: { scared: 3, anxious: 2, lonely: 1 } }
  ]},
  { id: 47, text: "나의 가장 큰 두려움은?", options: [
    { text: "사람들에게 버림받거나 혼자 남겨지는 것 (버림받음)", score: { lonely: 3, scared: 2, anxious: 2 } },
    { text: "실패하거나 목표를 이루지 못하는 것 (실패)", score: { anxious: 3, depressed: 2, unfair: 1 } },
    { text: "변화나 새로운 상황에 적응하지 못하는 것 (변화)", score: { scared: 3, anxious: 2, lethargic: 1 } }
  ]},
  { id: 48, text: "나의 가장 큰 강점은?", options: [
    { text: "어떤 상황에서도 긍정적으로 생각하는 것 (긍정)", score: { love: 3, excited: 2, relaxed: 2 } },
    { text: "다른 사람의 감정을 잘 이해하고 공감하는 것 (공감)", score: { love: 3, shy: 2, guilty: 1 } },
    { text: "목표를 향해 끝까지 포기하지 않는 것 (끈기)", score: { proud: 3, angry: 2, excited: 1 } }
  ]},
  { id: 49, text: "스트레스를 받을 때 나의 해소 방법은?", options: [
    { text: "운동이나 활동적인 것으로 에너지를 발산한다 (활동)", score: { excited: 3, angry: 2, proud: 1 } },
    { text: "혼자 조용히 있거나 잠을 잔다 (휴식)", score: { relaxed: 3, lethargic: 2, depressed: 1 } },
    { text: "친한 사람에게 털어놓고 이야기한다 (소통)", score: { love: 3, lonely: 1, curious: 1 } }
  ]},
  { id: 50, text: "10년 후의 나를 상상할 때 드는 감정은?", options: [
    { text: "더 성장하고 행복해진 모습이 기대돼 (기대)", score: { excited: 3, proud: 2, love: 1 } },
    { text: "과연 잘 살고 있을까... 걱정이 앞서 (걱정)", score: { anxious: 3, depressed: 2, scared: 1 } },
    { text: "생각해도 잘 모르겠어. 그냥 살아가겠지 (무감각)", score: { lethargic: 3, bored: 2, relaxed: 1 } }
  ]},
  // 51-60: 특별한 상황
  { id: 51, text: "혼자 밥을 먹을 때 드는 감정은?", options: [
    { text: "혼밥도 나름 자유롭고 좋아 (자유)", score: { relaxed: 3, proud: 2, bored: 1 } },
    { text: "함께 먹을 사람이 없어서 외롭고 쓸쓸해 (외로움)", score: { lonely: 3, depressed: 2, shy: 1 } },
    { text: "빨리 먹고 나가고 싶어서 불편해 (불편)", score: { anxious: 2, shy: 2, bored: 2 } }
  ]},
  { id: 52, text: "늦은 밤 잠이 오지 않을 때 나는?", options: [
    { text: "이런저런 걱정과 후회가 밀려와 (걱정)", score: { anxious: 3, depressed: 2, guilty: 1 } },
    { text: "유튜브나 SNS를 보며 시간을 보낸다 (회피)", score: { bored: 3, lethargic: 2, relaxed: 1 } },
    { text: "내일 할 일을 계획하거나 좋아하는 것을 한다 (활동)", score: { excited: 3, proud: 2, curious: 1 } }
  ]},
  { id: 53, text: "갑자기 울고 싶은 감정이 밀려올 때 나는?", options: [
    { text: "그냥 실컷 울어버린다. 울고 나면 개운해 (해소)", score: { depressed: 2, love: 2, relaxed: 2 } },
    { text: "왜 우는지 모르겠어서 더 혼란스러워 (혼란)", score: { anxious: 3, shocked: 2, curious: 1 } },
    { text: "울면 안 된다고 꾹 참는다 (억압)", score: { unfair: 2, proud: 2, lethargic: 1 } }
  ]},
  { id: 54, text: "나에게 가장 힘든 시간대는?", options: [
    { text: "아침에 일어나는 것 자체가 너무 힘들어 (무기력)", score: { lethargic: 3, depressed: 2, bored: 1 } },
    { text: "저녁 이후 혼자 있는 시간이 제일 힘들어 (외로움)", score: { lonely: 3, depressed: 2, anxious: 1 } },
    { text: "일이나 공부가 몰리는 낮 시간이 제일 힘들어 (스트레스)", score: { anxious: 3, angry: 2, unfair: 1 } }
  ]},
  { id: 55, text: "나를 가장 행복하게 만드는 것은?", options: [
    { text: "사랑하는 사람들과 함께하는 시간 (사랑)", score: { love: 3, relaxed: 2, excited: 1 } },
    { text: "목표를 달성하거나 무언가를 이뤄냈을 때 (성취)", score: { proud: 3, excited: 2, love: 1 } },
    { text: "아무 걱정 없이 혼자 쉬는 시간 (휴식)", score: { relaxed: 3, lethargic: 2, bored: 1 } }
  ]},
  { id: 56, text: "화가 났을 때 나의 표현 방식은?", options: [
    { text: "직접적으로 화를 내거나 소리를 지른다 (직접)", score: { angry: 3, shocked: 2, unfair: 1 } },
    { text: "속으로만 삭이고 겉으로는 아무렇지 않은 척한다 (억압)", score: { unfair: 3, lethargic: 2, shy: 1 } },
    { text: "그 자리를 피하거나 혼자만의 공간으로 간다 (회피)", score: { scared: 3, anxious: 2, lethargic: 1 } }
  ]},
  { id: 57, text: "나의 하루 중 가장 에너지가 넘치는 시간은?", options: [
    { text: "아침! 하루를 시작하는 것이 설레고 기대돼 (아침형)", score: { excited: 3, proud: 2, love: 1 } },
    { text: "밤! 조용하고 혼자만의 시간이 좋아 (야행성)", score: { relaxed: 3, curious: 2, lonely: 1 } },
    { text: "에너지가 넘치는 시간이 딱히 없어 (무기력)", score: { lethargic: 3, depressed: 2, bored: 2 } }
  ]},
  { id: 58, text: "나에게 가장 위로가 되는 것은?", options: [
    { text: "누군가 내 이야기를 들어주고 공감해줄 때 (공감)", score: { love: 3, lonely: 1, depressed: 1 } },
    { text: "혼자 좋아하는 것을 하며 시간을 보낼 때 (자기위로)", score: { relaxed: 3, proud: 2, bored: 1 } },
    { text: "아무것도 안 하고 그냥 누워있을 때 (휴식)", score: { lethargic: 3, depressed: 2, relaxed: 1 } }
  ]},
  { id: 59, text: "나의 감정 중 가장 자주 느끼는 것은?", options: [
    { text: "불안과 걱정 (불안)", score: { anxious: 3, scared: 2, depressed: 1 } },
    { text: "외로움과 쓸쓸함 (외로움)", score: { lonely: 3, depressed: 2, shy: 1 } },
    { text: "설렘과 기대감 (설렘)", score: { excited: 3, love: 2, curious: 1 } }
  ]},
  { id: 60, text: "나의 감정 표현 방식은?", options: [
    { text: "솔직하게 바로바로 표현하는 편 (솔직)", score: { love: 3, excited: 2, angry: 1 } },
    { text: "감정을 잘 숨기고 표현을 잘 안 하는 편 (내성적)", score: { shy: 3, lethargic: 2, relaxed: 1 } },
    { text: "상황에 따라 다르게 표현하는 편 (유연)", score: { curious: 3, relaxed: 2, proud: 1 } }
  ]},
  // 61-70: 환경과 상황
  { id: 61, text: "시험이나 중요한 발표 전날 나의 상태는?", options: [
    { text: "긴장되지만 준비한 만큼 잘 할 수 있어 (자신감)", score: { proud: 3, excited: 2, relaxed: 1 } },
    { text: "너무 긴장되고 불안해서 잠도 못 자 (불안)", score: { anxious: 3, scared: 2, depressed: 1 } },
    { text: "이미 포기했어. 어차피 안 될 것 같아 (포기)", score: { lethargic: 3, depressed: 2, bored: 2 } }
  ]},
  { id: 62, text: "나쁜 소식을 들었을 때 나의 첫 반응은?", options: [
    { text: "충격받아서 한동안 멍하게 있어 (충격)", score: { shocked: 3, depressed: 2, scared: 1 } },
    { text: "왜 나한테 이런 일이... 억울하고 화가 나 (분노)", score: { angry: 3, unfair: 2, depressed: 1 } },
    { text: "어떻게 해결할지 바로 생각하기 시작해 (실용적)", score: { curious: 3, proud: 2, relaxed: 1 } }
  ]},
  { id: 63, text: "혼잡한 지하철이나 버스 안에서 나는?", options: [
    { text: "사람이 너무 많아서 불편하고 답답해 (불편)", score: { anxious: 3, angry: 2, scared: 1 } },
    { text: "이어폰 끼고 내 세계에 빠져들어 (무관심)", score: { relaxed: 3, bored: 2, lethargic: 1 } },
    { text: "주변 사람들을 관찰하며 상상의 나래를 펼쳐 (호기심)", score: { curious: 3, excited: 2, bored: 1 } }
  ]},
  { id: 64, text: "날씨가 맑고 화창한 날 나는?", options: [
    { text: "밖에 나가서 활동하고 싶어! 에너지가 넘쳐 (활기)", score: { excited: 3, love: 2, proud: 1 } },
    { text: "그냥 집에서 쉬는 게 더 좋아 (여유)", score: { relaxed: 3, lethargic: 2, bored: 1 } },
    { text: "좋은 날씨가 오히려 더 쓸쓸하게 느껴져 (우울)", score: { depressed: 3, lonely: 2, unfair: 1 } }
  ]},
  { id: 65, text: "카페에서 혼자 앉아 있을 때 나는?", options: [
    { text: "주변을 구경하며 상상하는 것이 즐거워 (관찰)", score: { curious: 3, relaxed: 2, excited: 1 } },
    { text: "혼자 있는 내 모습이 쓸쓸하게 느껴져 (외로움)", score: { lonely: 3, depressed: 2, shy: 1 } },
    { text: "빨리 할 일을 끝내고 나가고 싶어 (집중)", score: { proud: 3, anxious: 2, bored: 1 } }
  ]},
  { id: 66, text: "갑자기 정전이 되어 어두워졌을 때 나는?", options: [
    { text: "으악! 너무 무서워! 심장이 쿵 내려앉아 (공포)", score: { scared: 3, shocked: 2, anxious: 2 } },
    { text: "어? 신기하다. 뭔가 색다른 경험이야 (호기심)", score: { curious: 3, excited: 2, shocked: 1 } },
    { text: "에이, 귀찮아. 빨리 복구됐으면 좋겠어 (짜증)", score: { angry: 3, lethargic: 2, bored: 1 } }
  ]},
  { id: 67, text: "명절이나 가족 모임이 다가올 때 드는 감정은?", options: [
    { text: "가족들을 만날 생각에 설레고 기대돼 (기대)", score: { love: 3, excited: 2, relaxed: 1 } },
    { text: "잔소리 들을 생각에 벌써부터 스트레스야 (스트레스)", score: { anxious: 3, angry: 2, unfair: 1 } },
    { text: "귀찮고 피곤해서 그냥 안 가고 싶어 (회피)", score: { lethargic: 3, bored: 2, shy: 1 } }
  ]},
  { id: 68, text: "처음 가보는 낯선 장소에서 나는?", options: [
    { text: "새로운 것들을 탐험하는 것이 신나고 즐거워 (탐험)", score: { excited: 3, curious: 3, proud: 1 } },
    { text: "길을 잃거나 문제가 생길까봐 걱정돼 (걱정)", score: { anxious: 3, scared: 2, depressed: 1 } },
    { text: "빨리 익숙한 곳으로 돌아가고 싶어 (안전)", score: { scared: 3, shy: 2, lethargic: 1 } }
  ]},
  { id: 69, text: "일이나 공부가 잘 안 풀릴 때 나는?", options: [
    { text: "잠깐 쉬고 다시 도전한다. 할 수 있어! (끈기)", score: { proud: 3, excited: 2, love: 1 } },
    { text: "나는 왜 이것도 못 하지... 자책하게 돼 (자책)", score: { depressed: 3, unfair: 2, lethargic: 1 } },
    { text: "그냥 포기하고 다른 걸 한다 (포기)", score: { lethargic: 3, bored: 2, relaxed: 1 } }
  ]},
  { id: 70, text: "주변이 너무 시끄럽고 혼잡할 때 나는?", options: [
    { text: "자극이 많아서 오히려 에너지가 넘쳐 (활기)", score: { excited: 3, love: 2, curious: 1 } },
    { text: "머리가 아프고 빨리 조용한 곳으로 가고 싶어 (예민)", score: { anxious: 3, angry: 2, scared: 1 } },
    { text: "이어폰 끼고 나만의 세계로 도망간다 (회피)", score: { shy: 3, relaxed: 2, lethargic: 1 } }
  ]},
  // 71-80: 내면 탐구
  { id: 71, text: "나 자신에게 가장 솔직한 감정은?", options: [
    { text: "나는 충분히 잘 하고 있어, 자랑스러워 (자존감)", score: { proud: 3, love: 2, relaxed: 1 } },
    { text: "나는 아직 부족한 게 많아, 더 노력해야 해 (자기개선)", score: { anxious: 2, curious: 2, proud: 1 } },
    { text: "나는 왜 이럴까... 나 자신이 싫어 (자기혐오)", score: { depressed: 3, unfair: 2, lethargic: 1 } }
  ]},
  { id: 72, text: "내가 가장 두려워하는 감정은?", options: [
    { text: "혼자 남겨지는 외로움 (외로움)", score: { lonely: 3, depressed: 2, scared: 1 } },
    { text: "통제할 수 없는 불안과 공포 (불안)", score: { anxious: 3, scared: 2, depressed: 1 } },
    { text: "아무것도 하기 싫은 무기력함 (무기력)", score: { lethargic: 3, depressed: 2, bored: 2 } }
  ]},
  { id: 73, text: "나의 감정 중 가장 숨기고 싶은 것은?", options: [
    { text: "나약하고 두려운 감정 (두려움)", score: { scared: 3, shy: 2, anxious: 1 } },
    { text: "질투나 시기심 (질투)", score: { unfair: 3, angry: 2, guilty: 1 } },
    { text: "슬픔과 우울함 (슬픔)", score: { depressed: 3, lonely: 2, shy: 1 } }
  ]},
  { id: 74, text: "나에게 행복이란?", options: [
    { text: "사랑하는 사람들과 함께하는 것 (사랑)", score: { love: 3, relaxed: 2, excited: 1 } },
    { text: "목표를 이루고 성장하는 것 (성취)", score: { proud: 3, excited: 2, curious: 1 } },
    { text: "아무 걱정 없이 평화롭게 사는 것 (평화)", score: { relaxed: 3, love: 2, lethargic: 1 } }
  ]},
  { id: 75, text: "나의 감정 온도는 지금?", options: [
    { text: "뜨겁게 타오르는 중! 에너지 넘쳐 (열정)", score: { excited: 3, angry: 2, love: 1 } },
    { text: "차갑게 식어있어. 아무 감정도 없어 (무감각)", score: { lethargic: 3, depressed: 2, bored: 2 } },
    { text: "따뜻하게 유지되고 있어. 안정적이야 (안정)", score: { relaxed: 3, love: 2, proud: 1 } }
  ]},
  { id: 76, text: "내 마음속 가장 깊은 곳에 있는 감정은?", options: [
    { text: "인정받고 싶은 마음 (인정욕구)", score: { proud: 3, unfair: 2, love: 1 } },
    { text: "안전하고 싶은 마음 (안전욕구)", score: { scared: 3, anxious: 2, relaxed: 1 } },
    { text: "사랑받고 싶은 마음 (사랑욕구)", score: { love: 3, lonely: 2, shy: 1 } }
  ]},
  { id: 77, text: "내가 가장 힘들 때 나에게 필요한 것은?", options: [
    { text: "누군가의 따뜻한 위로와 공감 (위로)", score: { love: 3, lonely: 1, depressed: 1 } },
    { text: "혼자만의 시간과 공간 (고독)", score: { relaxed: 3, shy: 2, lethargic: 1 } },
    { text: "문제를 해결할 수 있는 실질적인 도움 (해결)", score: { proud: 3, curious: 2, anxious: 1 } }
  ]},
  { id: 78, text: "나의 감정 패턴은?", options: [
    { text: "감정 기복이 심하고 변화가 많아 (기복)", score: { excited: 2, angry: 2, shocked: 2 } },
    { text: "전반적으로 우울하고 침체된 편이야 (우울)", score: { depressed: 3, lethargic: 2, lonely: 1 } },
    { text: "대체로 안정적이고 균형 잡혀있어 (안정)", score: { relaxed: 3, proud: 2, love: 1 } }
  ]},
  { id: 79, text: "나는 주로 어떤 상황에서 눈물이 나?", options: [
    { text: "억울하거나 불공평한 일을 당했을 때 (억울)", score: { unfair: 3, angry: 2, depressed: 1 } },
    { text: "감동적인 영화나 음악을 접했을 때 (감동)", score: { love: 3, relaxed: 2, excited: 1 } },
    { text: "너무 외롭고 쓸쓸할 때 (외로움)", score: { lonely: 3, depressed: 2, shy: 1 } }
  ]},
  { id: 80, text: "내가 스스로에게 가장 많이 하는 말은?", options: [
    { text: "나는 할 수 있어! 잘 하고 있어! (긍정)", score: { proud: 3, excited: 2, love: 1 } },
    { text: "왜 이렇게 못 하지? 나는 왜 이래... (자책)", score: { depressed: 3, unfair: 2, guilty: 1 } },
    { text: "그냥 됐어. 어차피 다 똑같아 (체념)", score: { lethargic: 3, bored: 2, depressed: 1 } }
  ]},
  // 81-90: 특별 상황
  { id: 81, text: "누군가 나를 오해했을 때 나는?", options: [
    { text: "적극적으로 해명하고 오해를 풀려고 노력해 (적극)", score: { proud: 3, angry: 2, love: 1 } },
    { text: "억울하지만 말하기 귀찮아서 그냥 넘겨 (체념)", score: { unfair: 3, lethargic: 2, depressed: 1 } },
    { text: "오해받은 것이 너무 속상하고 슬퍼 (슬픔)", score: { depressed: 3, lonely: 2, unfair: 1 } }
  ]},
  { id: 82, text: "나에게 거짓말을 한 사람을 알게 됐을 때?", options: [
    { text: "배신감에 너무 화가 나고 억울해 (배신)", score: { angry: 3, unfair: 3, depressed: 1 } },
    { text: "그 사람을 이해하려 하지만 상처받아 (상처)", score: { depressed: 3, love: 1, guilty: 1 } },
    { text: "앞으로 그 사람을 믿지 않기로 결심해 (냉정)", score: { proud: 2, scared: 2, relaxed: 1 } }
  ]},
  { id: 83, text: "갑자기 큰 돈이 생겼다면 나는?", options: [
    { text: "여행이나 경험에 투자하고 싶어! (경험)", score: { excited: 3, curious: 2, love: 1 } },
    { text: "미래를 위해 저축하거나 투자한다 (안전)", score: { anxious: 2, proud: 2, relaxed: 1 } },
    { text: "사랑하는 사람들에게 선물하고 싶어 (사랑)", score: { love: 3, excited: 2, guilty: 1 } }
  ]},
  { id: 84, text: "나의 취미 활동을 할 때 드는 감정은?", options: [
    { text: "완전히 몰입해서 시간 가는 줄 몰라 (몰입)", score: { excited: 3, proud: 2, curious: 1 } },
    { text: "잠깐의 위안이 되지만 금방 허전해져 (허전)", score: { lonely: 3, depressed: 2, bored: 1 } },
    { text: "취미를 즐길 여유나 의욕이 없어 (무기력)", score: { lethargic: 3, depressed: 2, bored: 2 } }
  ]},
  { id: 85, text: "나를 가장 힘들게 하는 것은?", options: [
    { text: "인간관계에서 오는 상처와 갈등 (관계)", score: { lonely: 3, unfair: 2, depressed: 1 } },
    { text: "미래에 대한 불확실성과 걱정 (미래)", score: { anxious: 3, scared: 2, depressed: 1 } },
    { text: "나 자신에 대한 불만족과 자책 (자책)", score: { depressed: 3, guilty: 2, lethargic: 1 } }
  ]},
  { id: 86, text: "나에게 가장 소중한 것은?", options: [
    { text: "사랑하는 사람들과의 관계 (관계)", score: { love: 3, relaxed: 2, excited: 1 } },
    { text: "나 자신의 성장과 발전 (성장)", score: { proud: 3, curious: 2, excited: 1 } },
    { text: "마음의 평화와 안정 (평화)", score: { relaxed: 3, love: 2, lethargic: 1 } }
  ]},
  { id: 87, text: "나는 어떤 사람으로 기억되고 싶어?", options: [
    { text: "항상 밝고 긍정적인 에너지를 주는 사람 (긍정)", score: { love: 3, excited: 2, proud: 1 } },
    { text: "묵묵히 곁에서 힘이 되어주는 사람 (지지)", score: { shy: 3, love: 2, relaxed: 1 } },
    { text: "자신의 목표를 향해 열심히 달려가는 사람 (열정)", score: { proud: 3, excited: 2, curious: 1 } }
  ]},
  { id: 88, text: "나의 감정을 색깔로 표현한다면?", options: [
    { text: "따뜻한 노란색이나 주황색 (따뜻함)", score: { love: 3, excited: 2, relaxed: 1 } },
    { text: "차가운 파란색이나 회색 (차가움)", score: { depressed: 3, lonely: 2, lethargic: 1 } },
    { text: "강렬한 빨간색이나 검은색 (강렬함)", score: { angry: 3, unfair: 2, excited: 1 } }
  ]},
  { id: 89, text: "나의 감정을 날씨로 표현한다면?", options: [
    { text: "맑고 화창한 봄날 (긍정)", score: { love: 3, excited: 2, relaxed: 1 } },
    { text: "흐리고 비 오는 날 (우울)", score: { depressed: 3, lonely: 2, lethargic: 1 } },
    { text: "천둥 번개가 치는 폭풍우 (격렬)", score: { angry: 3, anxious: 2, shocked: 1 } }
  ]},
  { id: 90, text: "지금 이 순간 나의 마음은?", options: [
    { text: "설레고 기대되는 마음 (설렘)", score: { excited: 3, love: 2, curious: 1 } },
    { text: "무겁고 지쳐있는 마음 (피로)", score: { lethargic: 3, depressed: 2, bored: 1 } },
    { text: "평온하고 안정된 마음 (평온)", score: { relaxed: 3, proud: 2, love: 1 } }
  ]},
  // 91-100: 마무리 질문
  { id: 91, text: "나에게 가장 필요한 것은?", options: [
    { text: "누군가의 따뜻한 위로와 공감 (위로)", score: { love: 3, lonely: 1, depressed: 1 } },
    { text: "나 자신을 믿는 자신감 (자신감)", score: { proud: 3, anxious: 1, scared: 1 } },
    { text: "충분한 휴식과 재충전 (휴식)", score: { relaxed: 3, lethargic: 2, depressed: 1 } }
  ]},
  { id: 92, text: "나의 하루를 한 마디로 표현한다면?", options: [
    { text: "오늘도 최선을 다한 하루 (성실)", score: { proud: 3, excited: 2, love: 1 } },
    { text: "그냥 흘러가버린 하루 (무기력)", score: { lethargic: 3, bored: 2, depressed: 1 } },
    { text: "감사하고 소중한 하루 (감사)", score: { love: 3, relaxed: 2, proud: 1 } }
  ]},
  { id: 93, text: "나의 감정 일기를 쓴다면 오늘의 제목은?", options: [
    { text: "오늘도 열심히 살아낸 나에게 박수를 (뿌듯)", score: { proud: 3, love: 2, excited: 1 } },
    { text: "왜 이렇게 힘들고 외로운 걸까 (외로움)", score: { lonely: 3, depressed: 2, lethargic: 1 } },
    { text: "내일은 더 나아질 거야, 괜찮아 (희망)", score: { love: 3, relaxed: 2, proud: 1 } }
  ]},
  { id: 94, text: "나의 감정 중 가장 자주 억누르는 것은?", options: [
    { text: "화와 분노 (분노)", score: { angry: 3, unfair: 2, lethargic: 1 } },
    { text: "슬픔과 눈물 (슬픔)", score: { depressed: 3, lonely: 2, shy: 1 } },
    { text: "두려움과 불안 (두려움)", score: { scared: 3, anxious: 2, depressed: 1 } }
  ]},
  { id: 95, text: "나에게 감정이란?", options: [
    { text: "나를 살아있게 만드는 에너지 (에너지)", score: { excited: 3, love: 2, proud: 1 } },
    { text: "때로는 짐이 되는 무거운 것 (부담)", score: { depressed: 3, lethargic: 2, anxious: 1 } },
    { text: "나를 이해하게 해주는 신호 (신호)", score: { curious: 3, relaxed: 2, proud: 1 } }
  ]},
  { id: 96, text: "지금 가장 하고 싶은 것은?", options: [
    { text: "신나는 모험이나 새로운 경험 (모험)", score: { excited: 3, curious: 2, proud: 1 } },
    { text: "아무 생각 없이 쉬는 것 (휴식)", score: { relaxed: 3, lethargic: 2, bored: 1 } },
    { text: "소중한 사람과 함께하는 것 (연결)", score: { love: 3, lonely: 1, excited: 1 } }
  ]},
  { id: 97, text: "나의 감정 건강 상태는?", options: [
    { text: "전반적으로 건강하고 균형 잡혀있어 (건강)", score: { relaxed: 3, proud: 2, love: 1 } },
    { text: "조금 지치고 힘든 상태야 (피로)", score: { lethargic: 3, depressed: 2, anxious: 1 } },
    { text: "많이 힘들고 도움이 필요한 것 같아 (도움필요)", score: { depressed: 3, lonely: 2, scared: 1 } }
  ]},
  { id: 98, text: "나에게 오늘 하루 선물을 준다면?", options: [
    { text: "신나는 새로운 경험이나 여행 (경험)", score: { excited: 3, curious: 2, love: 1 } },
    { text: "아무것도 안 해도 되는 완전한 휴식 (휴식)", score: { relaxed: 3, lethargic: 2, love: 1 } },
    { text: "소중한 사람과의 따뜻한 시간 (사랑)", score: { love: 3, relaxed: 2, excited: 1 } }
  ]},
  { id: 99, text: "나의 감정 여행은 지금 어디쯤?", options: [
    { text: "힘차게 출발하는 시작점 (시작)", score: { excited: 3, curious: 2, proud: 1 } },
    { text: "지쳐서 쉬어가는 중간 지점 (휴식)", score: { lethargic: 3, depressed: 2, relaxed: 1 } },
    { text: "천천히 나아가는 여정 중 (여정)", score: { relaxed: 3, love: 2, proud: 1 } }
  ]},
  { id: 100, text: "마지막으로, 지금 이 순간 나에게 가장 필요한 말은?", options: [
    { text: "잘 하고 있어, 충분히 대단해 (격려)", score: { proud: 3, love: 2, relaxed: 1 } },
    { text: "괜찮아, 힘들면 쉬어도 돼 (위로)", score: { depressed: 2, lethargic: 2, love: 2 } },
    { text: "넌 혼자가 아니야, 내가 있어 (연결)", score: { lonely: 3, love: 2, scared: 1 } }
  ]}
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
  { id: "f1", name: "폭신폭신 캣타워", price: 3, category: "furniture", image: "", emoji: "🐈‍⬛", description: "고양이가 가장 좋아하는 놀이터냥!" },
  { id: "f2", name: "포근한 러그", price: 2, category: "furniture", image: "", emoji: "🧶", description: "방바닥을 따뜻하게 채워주는 둥근 러그냥." },
  { id: "f3", name: "물고기 장난감", price: 1, category: "furniture", image: "", emoji: "🐟", description: "드림이가 환장하는 물고기 인형냥!" },
  { id: "f4", name: "미니 아늑 텐트", price: 4, category: "furniture", image: "", emoji: "⛺", description: "상자보다 훨씬 아늑하고 따뜻한 텐트냥." },
  { id: "f5", name: "우유 가득 밥그릇", price: 2, category: "furniture", image: "", emoji: "🥛", description: "고소한 우유가 가득 차 있어 기운이 솟아난다냥!" },
  { id: "f6", name: "폭신 구름 소파", price: 5, category: "furniture", image: "", emoji: "🛋️", description: "구름 위에 누워있는 듯한 폭신함을 주는 소파냥." },
  { id: "f7", name: "원목 원형 밥상", price: 3, category: "furniture", image: "", emoji: "🪵", description: "따뜻한 나무 향이 솔솔 나는 예쁜 원목 밥상냥." },
  { id: "a1", name: "빨간 볼터치", price: 1, category: "accessory", image: "", emoji: "🌸", description: "고양이 볼을 핑크빛으로 물들여준다냥!" },
  { id: "a2", name: "노란 리본 타이", price: 2, category: "accessory", image: "", emoji: "🎀", description: "멋쟁이 신사 고양이가 될 수 있다냥." },
  { id: "a3", name: "힙한 선글라스", price: 3, category: "accessory", image: "", emoji: "🕶️", description: "네오 브루탈리즘 감성의 힙스터 고양이냥!" },
  { id: "a4", name: "반짝 마법 왕관", price: 5, category: "accessory", image: "", emoji: "👑", description: "고귀한 왕족 고양이가 될 수 있는 영광의 왕관냥!" },
  { id: "a5", name: "동글이 안경", price: 2, category: "accessory", image: "", emoji: "👓", description: "똑똑해 보이고 상담을 더 잘할 것 같은 안경냥." },
  { id: "a6", name: "꼬마 마법사 모자", price: 4, category: "accessory", image: "", emoji: "🧙", description: "신비로운 우주 마법을 부릴 수 있는 모자냥." },
  { id: "a7", name: "핑크빛 천사 날개", price: 5, category: "accessory", image: "", emoji: "👼", description: "등 뒤에 달아주면 천사처럼 귀여움이 폭발한다냥!" },
  { id: "w1", name: "청록색 땡땡이 벽지", price: 3, category: "wallpaper", image: "", emoji: "🎨", description: "민트빛 상큼함이 톡톡 터지는 벽지냥." },
  { id: "w2", name: "밤하늘 별빛 벽지", price: 4, category: "wallpaper", image: "", emoji: "🌌", description: "잠이 솔솔 올 것 같은 아늑한 벽지냥." },
  { id: "w3", name: "달콤 핑크 하트 벽지", price: 4, category: "wallpaper", image: "", emoji: "💖", description: "사랑스러운 기운이 가득 채워지는 핑크 벽지냥." },
  { id: "w4", name: "하늘하늘 구름 벽지", price: 4, category: "wallpaper", image: "", emoji: "☁️", description: "파란 하늘에 하얀 구름이 둥실둥실 떠다니는 벽지냥." }
];

export interface ScheduleEvent {
  id: string;
  date: string;
  title: string;
  mood: string;
  thanks: string;
  customSolution?: string;
  customMusicRecommendation?: string;
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
  avatar: string;
  content: string;
  likes: number;
  likedByMe: boolean;
  comments: { id: string; author: string; text: string; date: string }[];
  date: string;
  hasBestBadge?: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  nickname: string;
  catMood: MoodType;
  joinDate: string;
}
