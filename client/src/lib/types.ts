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
  // 도감 전용 필드
  dexNo: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  rarityLabel: string;
  emoji: string;
  unlockCondition: string;
  specialty: string;
  quote: string;
  // 캐릭터 전용 Lofi 음악
  lofiMusic: { title: string; url: string };
  // 캐릭터 맞춤 추천 소품 ID 목록
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
    unlockCondition: "심리테스트에서 억울냥 결과를 받으면 해금된다냥!",
    specialty: "억울한 감정을 가장 깊이 공감하는 능력",
    quote: "내가 잘못한 게 아닌데... 그래도 괴찮다냥. 내가 알아주겠다냥 🐾",
    lofiMusic: { title: "따뜻한 위로 Lofi ☀️", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    themeItems: ["f3", "a1", "w1"]
  },
  anxious: {
    type: "anxious",
    name: "불안냥 (Anxious Cat)",
    image: "/manus-storage/anxious_cat_242b50dc.png",
    description: "종이 상자 안에 쏙 들어가서 조심스럽게 주변을 살피는 귀여운 겁쟁이 고양이냥...",
    color: "bg-[#FCE7F3]",
    dexNo: 2,
    rarity: "common",
    rarityLabel: "일반",
    emoji: "📦",
    unlockCondition: "심리테스트에서 불안냥 결과를 받으면 해금된다냥!",
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
    dexNo: 3,
    rarity: "common",
    rarityLabel: "일반",
    emoji: "🧸",
    unlockCondition: "심리테스트에서 외롭냥 결과를 받으면 해금된다냥!",
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
    dexNo: 4,
    rarity: "common",
    rarityLabel: "일반",
    emoji: "💤",
    unlockCondition: "심리테스트에서 무기력냥 결과를 받으면 해금된다냥!",
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
    dexNo: 5,
    rarity: "uncommon",
    rarityLabel: "희귀",
    emoji: "🔥",
    unlockCondition: "심리테스트에서 화남냥 결과를 받거나, 일기에 분노 감정을 3번 이상 기록하면 해금된다냥!",
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
    dexNo: 6,
    rarity: "rare",
    rarityLabel: "레어",
    emoji: "💖",
    unlockCondition: "심리테스트에서 사랑냥 결과를 받거나, 커뮤니티에서 하트를 10개 이상 받으면 해금된다냥!",
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
    dexNo: 7,
    rarity: "uncommon",
    rarityLabel: "희귀",
    emoji: "🌸",
    unlockCondition: "심리테스트에서 부끄냥 결과를 받거나, 커뮤니티에 첫 글을 작성하면 해금된다냥!",
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
    dexNo: 8,
    rarity: "uncommon",
    rarityLabel: "희귀",
    emoji: "❗",
    unlockCondition: "심리테스트에서 놀람냥 결과를 받거나, 레벨 3 이상이 되면 해금된다냥!",
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
    dexNo: 9,
    rarity: "common",
    rarityLabel: "일반",
    emoji: "😑",
    unlockCondition: "심리테스트에서 지루냥 결과를 받거나, 일기를 5일 연속으로 작성하면 해금된다냥!",
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
    dexNo: 10,
    rarity: "rare",
    rarityLabel: "레어",
    emoji: "🌧️",
    unlockCondition: "심리테스트에서 우울냥 결과를 받거나, 냥이와 대화를 10번 이상 하면 해금된다냥!",
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
    dexNo: 11,
    rarity: "uncommon",
    rarityLabel: "희귀",
    emoji: "⚡",
    unlockCondition: "심리테스트에서 신남냥 결과를 받거나, 레벨 5 이상이 되면 해금된다냥!",
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
    dexNo: 12,
    rarity: "uncommon",
    rarityLabel: "희귀",
    emoji: "👻",
    unlockCondition: "심리테스트에서 겁먹냥 결과를 받거나, 심리테스트를 3번 이상 완료하면 해금된다냥!",
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
    dexNo: 13,
    rarity: "rare",
    rarityLabel: "레어",
    emoji: "🏆",
    unlockCondition: "심리테스트에서 뿌듯냥 결과를 받거나, 레벨 7 이상이 되면 해금된다냥!",
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
    dexNo: 14,
    rarity: "uncommon",
    rarityLabel: "희귀",
    emoji: "🔍",
    unlockCondition: "심리테스트에서 궁금냥 결과를 받거나, 커뮤니티에 댓글을 5개 이상 달면 해금된다냥!",
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
    dexNo: 15,
    rarity: "uncommon",
    rarityLabel: "희귀",
    emoji: "🙏",
    unlockCondition: "심리테스트에서 미안냥 결과를 받거나, 일기에 감사 내용을 10번 이상 기록하면 해금된다냥!",
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
    dexNo: 16,
    rarity: "legendary",
    rarityLabel: "전설",
    emoji: "🌿",
    unlockCondition: "심리테스트에서 편안냥 결과를 받거나, 모든 냥이를 1마리 이상 수집하면 해금된다냥!",
    specialty: "마음의 평화를 전파하는 궁극의 힐링 마스터",
    quote: "지금 이 순간, 이대로도 충분히 완벽하다냥. 그냥 있어도 된다냥 🌿",
    lofiMusic: { title: "평온한 숲속 Lofi 🌿", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    themeItems: ["f6", "f2", "w4"]
  }
};

// 무작위 심리테스트를 위한 15개 질문 은행 (Question Bank)
export interface TestQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    score: Partial<Record<MoodType, number>>;
  }[];
}

export const QUESTION_BANK: TestQuestion[] = [
  {
    id: 1,
    text: "주말 아침, 눈을 떴을 때 가장 먼저 드는 생각은?",
    options: [
      { text: "오늘 하루 신나게 놀아볼까! (설렘)", score: { love: 3, excited: 3, relaxed: 1 } },
      { text: "아... 더 자고 싶다. 아무것도 하기 싫어 (피곤)", score: { lethargic: 3, bored: 2, relaxed: 2 } },
      { text: "오늘 해야 할 일들이 걱정되기 시작해 (불안)", score: { anxious: 3, scared: 2, unfair: 1 } }
    ]
  },
  {
    id: 2,
    text: "친구가 약속 시간보다 30분 늦는다고 연락이 왔을 때 나의 반응은?",
    options: [
      { text: "바쁜 일이 있겠지! 천천히 오라고 한다 (너그러움)", score: { love: 3, relaxed: 3, shy: 1 } },
      { text: "솔직히 짜증나고 화가 난다 (분노)", score: { angry: 3, unfair: 2, guilty: 1 } },
      { text: "기다리는 동안 혼자 남겨진 것 같아 쓸쓸하다 (외로움)", score: { lonely: 3, depressed: 2, shy: 1 } }
    ]
  },
  {
    id: 3,
    text: "길을 걷다가 귀여운 길고양이를 마주쳤을 때 나는?",
    options: [
      { text: "가까이 다가가서 조심스럽게 인사를 건넨다 (다정)", score: { love: 3, curious: 3, shy: 1 } },
      { text: "멀리서 지켜보며 수줍게 미소만 짓는다 (소심)", score: { shy: 3, scared: 2, lonely: 1 } },
      { text: "우와! 깜짝이야! 소리를 지를 뻔했다 (놀람)", score: { shocked: 3, anxious: 2, scared: 2 } }
    ]
  },
  {
    id: 4,
    text: "열심히 준비한 발표나 시험이 생각보다 잘 풀리지 않았을 때?",
    options: [
      { text: "내가 노력한 만큼 결과가 안 나와서 억울하고 속상해 (억울)", score: { unfair: 3, angry: 2, depressed: 2 } },
      { text: "다 포기하고 그냥 침대에 누워있고 싶어 (무기력)", score: { lethargic: 3, depressed: 2, bored: 2 } },
      { text: "다음에는 더 잘할 수 있을지 엄청 걱정돼 (걱정)", score: { anxious: 3, scared: 2, depressed: 1 } }
    ]
  },
  {
    id: 5,
    text: "매일 반복되는 일상 속에서 문득 느끼는 감정은?",
    options: [
      { text: "아무 일도 일어나지 않아서 너무 지루하고 따분해 (지루)", score: { bored: 3, lethargic: 2, relaxed: 1 } },
      { text: "마음 한구석이 텅 빈 것 같고 쓸쓸해 (공허)", score: { lonely: 3, depressed: 3, anxious: 1 } },
      { text: "오늘도 무사히 흘러가서 평화롭고 감사해 (평온)", score: { relaxed: 3, love: 2, proud: 2 } }
    ]
  },
  {
    id: 6,
    text: "새로운 사람들과 가득 찬 모임 자리에 참석했을 때 나의 모습은?",
    options: [
      { text: "어색해서 구석에서 핸드폰만 만지작거린다 (부끄럼)", score: { shy: 3, anxious: 2, scared: 2 } },
      { text: "먼저 말을 걸어주는 사람에게 반갑게 리액션한다 (친근)", score: { love: 3, excited: 2, curious: 2 } },
      { text: "갑작스러운 주목을 받으면 머릿속이 하얘진다 (당황)", score: { shocked: 3, anxious: 2, shy: 2 } }
    ]
  },
  {
    id: 7,
    text: "억울하게 오해를 받거나 비난을 받았을 때 나는?",
    options: [
      { text: "너무 억울해서 눈물부터 왈칵 쏟아진다 (눈물)", score: { unfair: 3, depressed: 2, lonely: 2 } },
      { text: "참을 수 없이 화가 나서 조목조목 따진다 (분노)", score: { angry: 3, proud: 1, unfair: 2 } },
      { text: "해명할 힘도 없이 그냥 상황을 회피해버린다 (회피)", score: { lethargic: 3, bored: 2, relaxed: 2 } }
    ]
  },
  {
    id: 8,
    text: "갑자기 하늘에서 소나기가 쏟아지는데 우산이 없을 때?",
    options: [
      { text: "헐 대박! 완전 멘붕 상태가 된다 (당황)", score: { shocked: 3, anxious: 2, scared: 2 } },
      { text: "에휴, 내 인생이 그렇지 뭐... 한숨을 쉰다 (우울)", score: { depressed: 3, unfair: 2, lonely: 1 } },
      { text: "비 맞으며 뛰는 것도 낭만적이라며 그냥 즐긴다 (낙천)", score: { excited: 3, love: 2, relaxed: 2 } }
    ]
  },
  {
    id: 9,
    text: "친한 친구가 고민을 털어놓으며 위로를 바랄 때 나는?",
    options: [
      { text: "마치 내 일처럼 같이 화내고 슬퍼해 준다 (공감)", score: { love: 3, angry: 1, lonely: 1 } },
      { text: "조심스럽게 실질적인 해결 방법을 제안한다 (조언)", score: { proud: 3, relaxed: 2, curious: 1 } },
      { text: "가만히 안아주거나 곁에 묵묵히 있어 준다 (침묵)", score: { shy: 3, love: 2, relaxed: 2 } }
    ]
  },
  {
    id: 10,
    text: "하루를 마무리하고 침대에 누워 잠들기 직전 드는 기분은?",
    options: [
      { text: "오늘 하루도 참 열심히 살았다, 뿌듯하고 행복해 (행복)", score: { proud: 3, love: 2, relaxed: 2 } },
      { text: "내일 출근이나 등교가 너무 귀찮고 지루해 (지루)", score: { bored: 3, lethargic: 2, relaxed: 1 } },
      { text: "쓸데없는 잡생각과 걱정 때문에 잠이 잘 안 와 (걱정)", score: { anxious: 3, depressed: 2, lonely: 1 } }
    ]
  },
  {
    id: 11,
    text: "갑자기 일주일 동안의 휴가가 주어졌을 때 나는?",
    options: [
      { text: "당장 짐 싸서 낯선 곳으로 여행을 떠난다! (도전)", score: { excited: 3, curious: 3, proud: 1 } },
      { text: "집 밖은 위험해! 침대 위에서 넷플릭스 정주행 (방콕)", score: { relaxed: 3, lethargic: 2, bored: 1 } },
      { text: "갑작스러운 휴가라니, 뭘 해야 할지 계획 짜느라 머리 아파 (계획)", score: { anxious: 2, shocked: 1, scared: 1 } }
    ]
  },
  {
    id: 12,
    text: "누군가 나에게 뜻밖의 칭찬을 건넸을 때 나의 행동은?",
    options: [
      { text: "부끄러워서 얼굴을 붉히며 손사래를 친다 (수줍)", score: { shy: 3, guilty: 1, love: 1 } },
      { text: "속으로 엄청 뿌듯해하며 기분 좋게 감사 인사를 한다 (뿌듯)", score: { proud: 3, excited: 2, love: 2 } },
      { text: "진심이 맞을까? 무슨 의도가 있는 건지 의심해본다 (의심)", score: { anxious: 2, curious: 2, unfair: 1 } }
    ]
  },
  {
    id: 13,
    text: "길에서 아는 사람을 마주쳤을 때 나는?",
    options: [
      { text: "모르는 척 고개를 돌리거나 길을 돌아간다 (소심)", score: { shy: 3, scared: 2, anxious: 1 } },
      { text: "먼저 다가가서 환하게 웃으며 인사를 건넨다 (활달)", score: { love: 3, excited: 3, proud: 1 } },
      { text: "어? 아는 사람인가? 긴가민가하며 쳐다본다 (호기심)", score: { curious: 3, shocked: 2, bored: 1 } }
    ]
  },
  {
    id: 14,
    text: "오랜만에 정말 맛있는 음식을 먹었을 때 느끼는 감정은?",
    options: [
      { text: "와! 인생 맛집 발견! 너무 신나고 짜릿해 (신남)", score: { excited: 3, love: 2, proud: 1 } },
      { text: "먹는 순간만큼은 세상의 모든 걱정이 사라져 (편안)", score: { relaxed: 3, love: 2, lethargic: 1 } },
      { text: "혼자 먹으니까 조금 쓸쓸하고 허전해 (외로움)", score: { lonely: 3, depressed: 2, shy: 1 } }
    ]
  },
  {
    id: 15,
    text: "누군가 내 방의 소중한 물건을 허락 없이 만졌을 때 나는?",
    options: [
      { text: "내 경계를 침범당한 것 같아 몹시 불쾌하고 화가 난다 (분노)", score: { angry: 3, unfair: 2, anxious: 1 } },
      { text: "혹시 물건이 망가졌을까 봐 전전긍긍하며 불안해한다 (불안)", score: { anxious: 3, scared: 2, shocked: 1 } },
      { text: "귀찮아서 그냥 아무 말 안 하고 넘어간다 (무던)", score: { relaxed: 3, lethargic: 2, bored: 2 } }
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
  { id: "f6", name: "폭신 구름 소파", price: 5, category: "furniture", image: "", emoji: "🛋️", description: "구름 위에 누워있는 듯한 폭신함을 주는 소파냥." },
  { id: "f7", name: "원목 원형 밥상", price: 3, category: "furniture", image: "", emoji: "🪵", description: "따뜻한 나무 향이 솔솔 나는 예쁜 원목 밥상냥." },
  // 악세서리
  { id: "a1", name: "빨간 볼터치", price: 1, category: "accessory", image: "", emoji: "🌸", description: "고양이 볼을 핑크빛으로 물들여준다냥!" },
  { id: "a2", name: "노란 리본 타이", price: 2, category: "accessory", image: "", emoji: "🎀", description: "멋쟁이 신사 고양이가 될 수 있다냥." },
  { id: "a3", name: "힙한 선글라스", price: 3, category: "accessory", image: "", emoji: "🕶️", description: "네오 브루탈리즘 감성의 힙스터 고양이냥!" },
  { id: "a4", name: "반짝 마법 왕관", price: 5, category: "accessory", image: "", emoji: "👑", description: "고귀한 왕족 고양이가 될 수 있는 영광의 왕관냥!" },
  { id: "a5", name: "동글이 안경", price: 2, category: "accessory", image: "", emoji: "👓", description: "똑똑해 보이고 상담을 더 잘할 것 같은 안경냥." },
  { id: "a6", name: "꼬마 마법사 모자", price: 4, category: "accessory", image: "", emoji: "🧙", description: "신비로운 우주 마법을 부릴 수 있는 모자냥." },
  { id: "a7", name: "핑크빛 천사 날개", price: 5, category: "accessory", image: "", emoji: "👼", description: "등 뒤에 달아주면 천사처럼 귀여움이 폭발한다냥!" },
  // 벽지
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
  level: number;
  apples: number;
  catMood: MoodType;
  joinDate: string;
}
