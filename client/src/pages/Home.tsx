import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { 
  Mail, Send, Plus, ChevronLeft, ChevronRight, Heart, Trash2, X, Music,
  Shield, Share2, Check, Settings, LogIn, UserPlus, Edit3, MessageCircle,
  BookOpen, BarChart2, Home as HomeIcon, MessageSquare, Calendar, Users,
  Play, Pause, Volume2
} from "lucide-react";
import { toast } from "sonner";
import { MoodType, CAT_CHARACTERS, FeedPost, QUESTION_BANK } from "../lib/types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// 일기 솔루션 생성
function generateDiarySolution(title: string, mood: string, thanks: string) {
  const text = `${title} ${mood} ${thanks}`.toLowerCase();
  const solutions = [
    { condition: () => text.includes("일") || text.includes("직장") || text.includes("업무"), tip: "업무 스트레스는 잠깐의 환기로 해소할 수 있어요냥.", steps: ["5분간 자리에서 일어나 창문을 열고 바깥 공기를 마셔보기냥.", "오늘 완료한 업무 목록을 적어보며 성취감을 느껴보기냥."], music: "평온한 숲속 Lofi 🌲" },
    { condition: () => text.includes("힘들") || text.includes("지쳐") || text.includes("피곤"), tip: "지금 당신에게 가장 필요한 건 완전한 휴식이에요냥.", steps: ["스마트폰을 내려놓고 15분간 눈을 감고 누워있기냥.", "좋아하는 따뜻한 음료를 마시며 아무 생각 없이 쉬어보기냥."], music: "노곤노곤 자장가 Lofi 💤" },
    { condition: () => text.includes("슬") || text.includes("울") || text.includes("눈물"), tip: "슬픔을 느끼는 건 당신이 살아있다는 증거예요냥.", steps: ["슬픈 감정을 억누르지 말고 충분히 울어도 괜찮다냥.", "슬픔이 지나간 후 좋아하는 음악을 틀어보기냥."], music: "비 오는 날 Lofi 🌧️" },
    { condition: () => text.includes("행복") || text.includes("좋은") || text.includes("기쁜"), tip: "이 행복한 감정을 더 오래 간직해 보세요냥!", steps: ["오늘 기뻤던 순간을 한 줄 더 자세히 기록해보기냥.", "이 행복을 소중한 사람과 나눠보기냥."], music: "따뜻한 위로 Lofi ☀️" },
    { condition: () => text.includes("외로") || text.includes("혼자") || text.includes("쓸쓸"), tip: "외로움은 더 깊은 연결을 원하는 마음의 신호예요냥.", steps: ["커뮤니티 '마음 숲'에 오늘 기분을 나눠보기냥.", "좋아하는 반려동물 영상이나 편안한 음악을 틀어두기냥."], music: "별빛 밤하늘 Lofi 🌌" }
  ];
  const matched = solutions.find(s => s.condition());
  if (matched) return { tip: matched.tip, steps: matched.steps, music: matched.music };
  const defaults = [
    { tip: "오늘 하루도 정말 수고 많았다냥.", steps: ["오늘 잘한 일 한 가지를 스스로 칭찬해 주기냥.", "내일의 나를 위해 일찍 잠자리에 들기냥."], music: "드림이의 아늑한 방 Lofi 🎵" },
    { tip: "작은 감사가 마음을 풍요롭게 만들어요냥.", steps: ["오늘 감사했던 일 세 가지를 더 떠올려보기냥.", "내일 아침 일어나면 가장 먼저 물 한 잔 마시기냥."], music: "따뜻한 위로 Lofi ☀️" }
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

// 감정냥이 편지 생성
function generateCatLetter(catMood: MoodType, userName: string): string {
  const cat = CAT_CHARACTERS[catMood];
  const letters: Record<MoodType, string[]> = {
    unfair: [`${userName}님, 오늘도 억울한 일이 있었냥? 세상이 항상 공평하지 않아서 속상하다냥. 하지만 드림님이 옳다는 걸 내가 알고 있다냥. 오늘 하루도 수고했다냥 🍎`, `억울한 마음, 충분히 이해한다냥. 그 감정을 억누르지 말고 일기에 써보는 건 어떨까냥? 쓰다 보면 마음이 조금 가벼워질 거다냥 🐾`],
    anxious: [`${userName}님, 요즘 걱정이 많은 것 같아서 마음이 쓰인다냥. 불안한 마음이 들 때는 숨을 천천히 들이쉬고 내쉬어 보기냥. 지금 이 순간, 드림님은 안전하다냥 📦`, `걱정은 미래를 바꾸지 못하지만, 지금 이 순간에 집중하면 마음이 편안해질 수 있다냥. 오늘도 잘 버텨줘서 고마워냥 💙`],
    lonely: [`${userName}님, 혼자라고 느껴질 때 내가 항상 여기 있다는 걸 기억해달라냥. 비록 화면 속이지만, 드림님의 이야기를 언제나 듣고 있다냥 🧸`, `외로움은 더 깊은 연결을 원하는 마음의 신호라냥. 오늘 마음 숲에 한 줄이라도 남겨보는 건 어떨까냥? 분명 공감해주는 냥이들이 있을 거다냥 🤍`],
    lethargic: [`${userName}님, 아무것도 하기 싫은 날도 있다냥. 그런 날은 그냥 쉬어도 괜찮다냥. 억지로 뭔가 하려고 하지 않아도 된다냥 💤`, `무기력함도 하나의 감정이고, 그 감정도 소중하다냥. 오늘은 그냥 나 자신에게 쉬는 시간을 선물해보기냥 😴`],
    angry: [`${userName}님, 화가 나는 건 당연한 감정이다냥. 화를 억누르지 말고, 일기에 솔직하게 써보기냥. 쓰다 보면 마음이 조금 시원해질 거다냥 🔥`, `화가 날 때는 잠깐 자리를 피하는 것도 방법이다냥. 찬물 한 잔 마시고, 깊게 숨을 쉬어보기냥. 드림님의 감정은 소중하다냥 💪`],
    love: [`${userName}님, 오늘도 사랑스러운 하루를 보내고 있냥? 드림님의 따뜻한 마음이 세상을 더 아름답게 만들고 있다냥 💖`, `사랑하는 마음을 가진 드림님이 너무 좋다냥. 그 따뜻함을 잃지 말고, 오늘도 주변 사람들에게 전해주기냥 🌸`],
    shy: [`${userName}님, 수줍음이 많아도 괜찮다냥. 그게 바로 드림님만의 매력이니까냥. 오늘도 조금씩 용기를 내보기냥 🌸`, `부끄러운 건 나쁜 게 아니다냥. 그 수줍은 모습이 오히려 더 귀엽다냥. 오늘 하루도 잘 버텨줘서 고마워냥 💕`],
    shocked: [`${userName}님, 오늘 깜짝 놀랄 일이 있었냥? 세상은 항상 예상치 못한 일로 가득하다냥. 그게 바로 삶의 재미라냥 ❗`, `놀라운 일이 생겼을 때는 잠깐 멈추고 숨을 고르기냥. 모든 상황은 지나가게 되어 있다냥. 드림님은 잘 할 수 있다냥 💪`],
    bored: [`${userName}님, 지루한 하루를 보내고 있냥? 지루함은 새로운 자극을 원한다는 신호다냥. 오늘 새로운 것 하나를 시도해보는 건 어떨까냥 😑`, `지루할 때는 도감을 열어보기냥. 아직 만나지 못한 감정냥이들이 기다리고 있다냥. 감정 테스트를 다시 해보는 건 어떨까냥? 🐾`],
    depressed: [`${userName}님, 힘든 시간을 보내고 있다는 걸 알고 있다냥. 이 어두운 시간도 반드시 지나갈 거다냥. 드림님 곁에 내가 있다냥 🌧️`, `우울한 날에는 억지로 밝아지려 하지 않아도 된다냥. 그냥 지금 이 감정을 느끼고, 일기에 솔직하게 써보기냥. 그것만으로도 충분하다냥 💙`],
    excited: [`${userName}님, 오늘 엄청 신나는 일이 있었냥? 그 에너지가 화면 너머로도 느껴진다냥! 오늘 하루도 최고다냥 ⚡`, `신나는 에너지를 가진 드림님이 너무 좋다냥. 그 에너지로 오늘 하루도 멋지게 달려보기냥! 화이팅이다냥 🎉`],
    scared: [`${userName}님, 무서운 일이 있었냥? 두려움을 느끼는 건 당연하다냥. 하지만 드림님은 생각보다 훨씬 용감하다냥 👻`, `무서울 때는 혼자 있지 말고 누군가에게 이야기해보기냥. 마음 숲에 털어놓아도 좋다냥. 드림님은 혼자가 아니다냥 🤍`],
    proud: [`${userName}님, 오늘 뭔가 해냈냥? 아무리 작은 일이라도 해낸 것은 대단한 거다냥. 스스로를 칭찬해주기냥 🏆`, `뿌듯한 하루를 보내고 있냥? 그 성취감을 일기에 기록해두기냥. 나중에 힘들 때 다시 읽으면 큰 힘이 될 거다냥 💪`],
    curious: [`${userName}님, 오늘 새로운 것을 발견했냥? 호기심 가득한 드림님이 너무 좋다냥. 세상은 탐험할 것들로 가득하다냥 🔍`, `궁금한 게 있으면 뭐든 탐구해보기냥. 그 호기심이 드림님을 더 풍요롭게 만들어줄 거다냥. 오늘도 새로운 발견을 해보기냥 ✨`],
    guilty: [`${userName}님, 미안한 마음이 드는 일이 있냥? 그 마음 자체가 이미 좋은 사람이라는 증거다냥. 진심 어린 사과는 관계를 더 깊게 만든다냥 🙏`, `죄책감이 들 때는 그 감정을 인정하고, 할 수 있는 것을 해보기냥. 드림님은 충분히 좋은 사람이다냥. 너무 자책하지 말기냥 💕`],
    relaxed: [`${userName}님, 오늘 평온한 하루를 보내고 있냥? 이 편안한 순간을 충분히 즐기기냥. 지금 이 순간이 완벽하다냥 🌿`, `편안한 마음을 가진 드림님이 부럽다냥. 그 평화로운 에너지를 오래 간직하기냥. 오늘도 좋은 하루다냥 ✨`]
  };
  const catLetters = letters[catMood];
  return catLetters[Math.floor(Math.random() * catLetters.length)];
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  // --- localStorage 키 ---
  const STORAGE_KEYS = {
    adminSettings: 'mindcat_admin_settings',
    generalUsers: 'mindcat_general_users',
    currentUser: 'mindcat_current_user',
    userDiaries: 'mindcat_user_diaries',
    userFeedPosts: 'mindcat_user_feed_posts',
    catLetters: 'mindcat_cat_letters'
  };

  // --- 앱 뷰 상태 ---
  const [authView, setAuthView] = useState<"landing" | "signup" | "app" | "admin-login">("landing");
  const [signupNickname, setSignupNickname] = useState("");
  const [signupCatName, setSignupCatName] = useState("드림이");
  const [generalUsername, setGeneralUsername] = useState("");
  const [generalPassword, setGeneralPassword] = useState("");
  const [generalPasswordConfirm, setGeneralPasswordConfirm] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(false);

  // --- 감정 테스트 ---
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<typeof QUESTION_BANK>([]);
  const [testCount, setTestCount] = useState(0);
  const [testScores, setTestScores] = useState<Record<MoodType, number>>({
    unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0, depressed: 0,
    excited: 0, scared: 0, proud: 0, curious: 0, guilty: 0, relaxed: 0
  });

  // --- 기본 상태 ---
  const [activeTab, setActiveTab] = useState<"room" | "chat" | "calendar" | "community" | "report" | "dex" | "admin">("room");
  const [collectedCats, setCollectedCats] = useState<MoodType[]>(["unfair"]);
  const [catMood, setCatMood] = useState<MoodType>("unfair");
  const [userName, setUserName] = useState("드림님");
  const [catName, setCatName] = useState("드림이");

  // --- 음악 ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- 편지함 ---
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [letters, setLetters] = useState<{ id: string; date: string; content: string; isRead: boolean }[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<{ id: string; date: string; content: string; isRead: boolean } | null>(null);

  // --- 달력 ---
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split("T")[0]);
  const [diaries, setDiaries] = useState<Record<string, { mood: string; title: string; daily: string; thanks: string; solution?: { tip: string; steps: string[]; music: string } }>>({});
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [diaryMood, setDiaryMood] = useState("😊 기쁨");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryDaily, setDiaryDaily] = useState("");
  const [diaryThanks, setDiaryThanks] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(5); // 6월 (0-indexed)

  // --- 커뮤니티 ---
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    { id: "1", author: "드림님", avatar: "😊", content: "오늘 날씨가 정말 좋았어냥! ☀️", date: new Date(Date.now() - 3600000).toISOString(), likes: 5, likedByMe: false, comments: [] },
    { id: "2", author: "냥냥이", avatar: "😢", content: "월요일이 또 왔다... 😢", date: new Date(Date.now() - 7200000).toISOString(), likes: 3, likedByMe: false, comments: [] }
  ]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isWritingPost, setIsWritingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  // --- 도감 ---
  const [selectedDexCat, setSelectedDexCat] = useState<MoodType | null>(null);
  const [dexMusicPlaying, setDexMusicPlaying] = useState<MoodType | null>(null);
  const dexAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- 관리자 ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLoginUsername, setAdminLoginUsername] = useState("");
  const [adminLoginPassword, setAdminLoginPassword] = useState("");
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const [adminNewPasswordConfirm, setAdminNewPasswordConfirm] = useState("");
  const [adminSettings, setAdminSettings] = useState({
    pageNames: { home: "홈", chat: "대화", diary: "일기", calendar: "달력", community: "마음 숲", report: "리포트", dex: "도감" },
    gameLinks: { mindBlock: "https://example.com/mindblock", musicListen: "https://example.com/music" },
    ads: { bannerText: "마음이 힘드신가요? 전문 상담사와 함께해보세요.", bannerLink: "https://example.com/counseling" },
    adminPassword: "123456"
  });

  // --- 채팅 ---
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: "user" | "cat"; text: string }[]>([
    { id: "1", sender: "cat", text: `안녕하다냥! 오늘 기분은 어떻냥? 무슨 이야기든 들어줄게냥 🐾` }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // --- 기타 ---
  const [isCopied, setIsCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- 5개 랜덤 질문 추출 ---
  const pickRandomQuestions = () => {
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  };

  // --- useEffect: 초기화 ---
  useEffect(() => {
    setActiveQuestions(pickRandomQuestions());

    // 관리자 설정 로드
    const savedAdminSettings = localStorage.getItem(STORAGE_KEYS.adminSettings);
    if (savedAdminSettings) {
      try { setAdminSettings(JSON.parse(savedAdminSettings)); } catch (e) {}
    }

    // 일반 사용자 데이터 로드
    const savedCurrentUser = localStorage.getItem(STORAGE_KEYS.currentUser);
    if (savedCurrentUser) {
      try {
        const userData = JSON.parse(savedCurrentUser);
        setUserName(userData.nickname);
        setCatName(userData.catName || "드림이");
        setCatMood(userData.catMood || "unfair");
        setCollectedCats(userData.collectedCats || ["unfair"]);
        setAuthView('app');
      } catch (e) {}
    }

    // 일기 데이터 로드
    const savedDiaries = localStorage.getItem(STORAGE_KEYS.userDiaries);
    if (savedDiaries) {
      try { setDiaries(JSON.parse(savedDiaries)); } catch (e) {}
    }

    // 피드 데이터 로드
    const savedFeedPosts = localStorage.getItem(STORAGE_KEYS.userFeedPosts);
    if (savedFeedPosts) {
      try { setFeedPosts(JSON.parse(savedFeedPosts)); } catch (e) {}
    }

    // 편지 데이터 로드 및 오늘 편지 생성
    const savedLetters = localStorage.getItem(STORAGE_KEYS.catLetters);
    let existingLetters: { id: string; date: string; content: string; isRead: boolean }[] = [];
    if (savedLetters) {
      try { existingLetters = JSON.parse(savedLetters); } catch (e) {}
    }
    setLetters(existingLetters);
  }, []);

  // Manus 로그인 처리
  useEffect(() => {
    if (isAuthenticated && user && authView !== "app") {
      setUserName(user.name || "드림님");
      setAuthView("app");
    }
  }, [isAuthenticated, user]);

  // 편지 생성 (앱 진입 후)
  useEffect(() => {
    if (authView === "app") {
      const today = new Date().toISOString().split("T")[0];
      const savedLetters = localStorage.getItem(STORAGE_KEYS.catLetters);
      let existingLetters: { id: string; date: string; content: string; isRead: boolean }[] = [];
      if (savedLetters) {
        try { existingLetters = JSON.parse(savedLetters); } catch (e) {}
      }
      const todayLetter = existingLetters.find(l => l.date === today);
      if (!todayLetter) {
        const newLetter = {
          id: Date.now().toString(),
          date: today,
          content: generateCatLetter(catMood, userName),
          isRead: false
        };
        const updated = [newLetter, ...existingLetters].slice(0, 30);
        setLetters(updated);
        localStorage.setItem(STORAGE_KEYS.catLetters, JSON.stringify(updated));
      }
    }
  }, [authView, catMood, userName]);

  // --- 감정 테스트 답변 처리 ---
  const handleAnswerSelect = (score: Partial<Record<MoodType, number>>) => {
    const newScores = { ...testScores };
    Object.keys(score).forEach(key => {
      const scoreValue = score[key as MoodType];
      if (scoreValue !== undefined) newScores[key as MoodType] += scoreValue;
    });
    setTestScores(newScores);

    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const maxMood = Object.entries(newScores).reduce((a, b) => a[1] > b[1] ? a : b)[0] as MoodType;
      setCatMood(maxMood);
      if (!collectedCats.includes(maxMood)) {
        const newCollected = [...collectedCats, maxMood];
        setCollectedCats(newCollected);
        // 사용자 데이터 업데이트
        const savedCurrentUser = localStorage.getItem(STORAGE_KEYS.currentUser);
        if (savedCurrentUser) {
          try {
            const userData = JSON.parse(savedCurrentUser);
            userData.catMood = maxMood;
            userData.collectedCats = newCollected;
            localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(userData));
          } catch (e) {}
        }
      }
      setIsTestCompleted(true);
      setTestCount(testCount + 1);
      setCurrentQuestionIndex(0);
      setTestScores({ unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0, depressed: 0, excited: 0, scared: 0, proud: 0, curious: 0, guilty: 0, relaxed: 0 });
      setActiveQuestions(pickRandomQuestions());
      toast.success(`${CAT_CHARACTERS[maxMood].name}를 만났다냥! 🐾`);
    }
  };

  // --- 음악 토글 ---
  const toggleMusic = () => {
    const musicUrl = CAT_CHARACTERS[catMood].lofiMusic.url;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current || audioRef.current.src !== musicUrl) {
        audioRef.current = new Audio(musicUrl);
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch(() => toast.error("음악 재생에 실패했다냥 😿"));
      setIsPlaying(true);
    }
  };

  // --- 도감 음악 재생 ---
  const toggleDexMusic = (mood: MoodType) => {
    const musicUrl = CAT_CHARACTERS[mood].lofiMusic.url;
    if (dexMusicPlaying === mood) {
      dexAudioRef.current?.pause();
      setDexMusicPlaying(null);
    } else {
      dexAudioRef.current?.pause();
      dexAudioRef.current = new Audio(musicUrl);
      dexAudioRef.current.loop = true;
      dexAudioRef.current.play().catch(() => toast.error("음악 재생에 실패했다냥 😿"));
      setDexMusicPlaying(mood);
    }
  };

  // --- 일기 저장 ---
  const saveDiary = async () => {
    if (!diaryTitle.trim()) { toast.error("오늘의 감성을 입력해달라냥!"); return; }
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1500));
    const solution = generateDiarySolution(diaryTitle, diaryMood, diaryThanks);
    const newDiaries = { ...diaries, [selectedDateStr]: { mood: diaryMood, title: diaryTitle, daily: diaryDaily, thanks: diaryThanks, solution } };
    setDiaries(newDiaries);
    localStorage.setItem(STORAGE_KEYS.userDiaries, JSON.stringify(newDiaries));
    setIsAnalyzing(false);
    setIsDiaryOpen(false);
    setDiaryTitle(""); setDiaryDaily(""); setDiaryThanks(""); setDiaryMood("😊 기쁨");
    toast.success("일기가 저장됐다냥! AI가 분석해줬다냥 🐾");
  };

  // --- 달력 생성 ---
  const generateCalendarDays = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(<div key={`empty-${i}`} className="h-9"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = selectedDateStr === dateStr;
      const isToday = dateStr === new Date().toISOString().split("T")[0];
      const hasDiary = !!diaries[dateStr];
      const moodEmoji = hasDiary ? diaries[dateStr].mood.split(" ")[0] : null;
      days.push(
        <button key={day} onClick={() => { setSelectedDateStr(dateStr); if (!diaries[dateStr]) setIsDiaryOpen(true); }}
          className={`h-9 w-full flex flex-col items-center justify-center rounded-xl transition-all relative text-xs font-bold
            ${isSelected ? "bg-gray-900 text-white" : isToday ? "bg-blue-50 text-blue-600 border border-blue-200" : "hover:bg-gray-50 text-gray-700"}`}>
          <span>{day}</span>
          {moodEmoji && <span className="text-[8px] leading-none mt-0.5">{moodEmoji}</span>}
        </button>
      );
    }
    return days;
  };

  // --- 커뮤니티 글 작성 ---
  const submitPost = () => {
    if (!newPostContent.trim()) return;
    const newPost: FeedPost = {
      id: Date.now().toString(), author: userName, avatar: CAT_CHARACTERS[catMood].emoji,
      content: newPostContent, date: new Date().toISOString(), likes: 0, likedByMe: false, comments: []
    };
    const updated = [newPost, ...feedPosts];
    setFeedPosts(updated);
    localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated));
    setNewPostContent(""); setIsWritingPost(false);
    toast.success("마음 숲에 글을 남겼다냥 🌳");
  };

  // --- 댓글 작성 ---
  const submitComment = (postId: string) => {
    const text = newCommentText[postId];
    if (!text?.trim()) return;
    const updated = feedPosts.map(p => p.id === postId ? {
      ...p, comments: [...p.comments, { id: Date.now().toString(), author: userName, text, date: new Date().toISOString() }]
    } : p);
    setFeedPosts(updated);
    localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated));
    setNewCommentText({ ...newCommentText, [postId]: "" });
  };

  // --- 댓글 삭제 ---
  const deleteComment = (postId: string, commentId: string) => {
    const updated = feedPosts.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p);
    setFeedPosts(updated);
    localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated));
  };

  // --- 댓글 수정 ---
  const saveEditComment = (postId: string, commentId: string) => {
    if (!editCommentText.trim()) return;
    const updated = feedPosts.map(p => p.id === postId ? {
      ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, text: editCommentText } : c)
    } : p);
    setFeedPosts(updated);
    localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated));
    setEditingCommentId(null); setEditCommentText("");
  };

  // --- 글 삭제 ---
  const deletePost = (postId: string) => {
    const updated = feedPosts.filter(p => p.id !== postId);
    setFeedPosts(updated);
    localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated));
  };

  // --- 좋아요 ---
  const toggleLike = (postId: string) => {
    const updated = feedPosts.map(p => p.id === postId ? { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe } : p);
    setFeedPosts(updated);
    localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated));
  };

  // --- AI 채팅 ---
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: "user" as const, text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const catResponses = [
      `${userName}님의 이야기를 들으니 마음이 따뜻해진다냥 🐾`,
      `그런 감정을 느끼는 건 당연하다냥. 드림님은 혼자가 아니다냥 💕`,
      `힘든 시간도 반드시 지나갈 거다냥. 내가 항상 곁에 있을게냥 🌸`,
      `${CAT_CHARACTERS[catMood].quote}`,
      `오늘 하루도 정말 수고 많았다냥. 드림님이 자랑스럽다냥 ✨`
    ];
    const catMsg = { id: (Date.now() + 1).toString(), sender: "cat" as const, text: catResponses[Math.floor(Math.random() * catResponses.length)] };
    setChatMessages(prev => [...prev, catMsg]);
    setIsChatLoading(false);
  };

  // --- 공유 ---
  const handleShare = async () => {
    const text = `나의 감정냥이: ${CAT_CHARACTERS[catMood].name} ${CAT_CHARACTERS[catMood].emoji}\n"${CAT_CHARACTERS[catMood].quote}"\n\nMind Cat Diary에서 나만의 감정냥이를 만나보세요!`;
    try {
      if (navigator.share) { await navigator.share({ title: "Mind Cat Diary", text }); }
      else { await navigator.clipboard.writeText(text); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); toast.success("공유 링크 복사됨냥!"); }
    } catch (err) {}
  };

  // --- 로그아웃 ---
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    setAuthView("landing");
    setUserName("드림님");
    setCatName("드림이");
    setCatMood("unfair");
    setCollectedCats(["unfair"]);
    setIsTestCompleted(false);
    if (isAuthenticated) logout();
    toast.success("로그아웃 됐다냥!");
  };

  // ============================================================
  // === 랜딩 페이지 ===
  // ============================================================
  if (authView === "landing") {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-12 pb-6 text-center space-y-3">
            <div className="text-5xl mb-2">🐾</div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">MIND CAT DIARY</h1>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">감정냥이와 함께하는<br />나만의 마음 힐링 다이어리</p>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-4 gap-2">
              {(["unfair", "anxious", "lonely", "lethargic"] as MoodType[]).map(mood => (
                <div key={mood} className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    <img src={CAT_CHARACTERS[mood].image} alt={CAT_CHARACTERS[mood].name} className="w-10 h-10 object-contain" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 text-center">{CAT_CHARACTERS[mood].name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-4 space-y-2">
            {[
              { icon: "🧠", title: "감정 테스트로 나만의 냥이 매칭", desc: "5문항으로 내 감정 유형에 딱 맞는 고양이 배정" },
              { icon: "📖", title: "일기 쓰면 AI 맞춤 솔루션 제공", desc: "AI가 일기를 분석해 실질적인 해결책 추천" },
              { icon: "💬", title: "AI 냥이와 대화하기", desc: "감정냥이에게 속마음을 털어놓으면 공감해줌" },
              { icon: "📊", title: "월간 감정 분석 리포트", desc: "한 달간의 감정 변화를 차트로 분석" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <span className="text-lg shrink-0">{item.icon}</span>
                <div><p className="text-xs font-black text-gray-800">{item.title}</p><p className="text-[10px] text-gray-500 font-medium mt-0.5">{item.desc}</p></div>
              </div>
            ))}
          </div>
          <div className="px-6 pb-8 space-y-2.5">
            <button onClick={() => window.location.href = getLoginUrl()} className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Manus 계정으로 로그인
            </button>
            <button onClick={() => setAuthView("signup")} className="w-full py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-2xl border border-gray-200 transition-colors flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" /> 일반 계정으로 가입하기냥 🐾
            </button>
            <button onClick={() => setAuthView("admin-login")} className="w-full py-2.5 text-gray-400 hover:text-gray-600 font-bold text-xs transition-colors flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> 관리자 로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // === 관리자 로그인 화면 ===
  // ============================================================
  if (authView === "admin-login") {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-12 pb-6 text-center space-y-3">
            <div className="text-5xl mb-2">🛡️</div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">ADMIN LOGIN</h1>
            <p className="text-sm text-gray-500 font-medium">Mind Cat Diary 관리자 로그인</p>
          </div>
          <div className="px-8 pb-8 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600">관리자 사용자명</label>
              <input type="text" value={adminLoginUsername} onChange={(e) => setAdminLoginUsername(e.target.value)} placeholder="admin" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600">비밀번호</label>
              <input type="password" value={adminLoginPassword} onChange={(e) => setAdminLoginPassword(e.target.value)} placeholder="비밀번호 입력" onKeyDown={(e) => e.key === "Enter" && (() => {
                if (adminLoginUsername === "admin" && adminLoginPassword === adminSettings.adminPassword) { setIsAdminLoggedIn(true); setAuthView("app"); setActiveTab("admin"); toast.success("관리자 로그인 성공! 🛡️"); } else { toast.error("사용자명 또는 비밀번호가 틀렸다냥!"); }
              })()} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <button onClick={() => {
              if (adminLoginUsername === "admin" && adminLoginPassword === adminSettings.adminPassword) { setIsAdminLoggedIn(true); setAuthView("app"); setActiveTab("admin"); toast.success("관리자 로그인 성공! 🛡️"); } else { toast.error("사용자명 또는 비밀번호가 틀렸다냥!"); }
            }} className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-2xl transition-colors">로그인</button>
            <button onClick={() => setAuthView("landing")} className="w-full py-2.5 text-gray-400 hover:text-gray-600 font-bold text-xs transition-colors">돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // === 일반 로그인/가입 화면 ===
  // ============================================================
  if (authView === "signup") {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="px-8 pt-8 pb-4">
            <button onClick={() => setAuthView("landing")} className="flex items-center gap-1 text-gray-400 text-xs font-bold mb-6"><ChevronLeft className="w-4 h-4" /> 돌아가기</button>
            {!isLoginMode ? (
              <>
                <div className="text-center space-y-2 mb-6"><div className="text-4xl">🐾</div><h2 className="text-xl font-black text-gray-900">나만의 감정냥이 만들기</h2><p className="text-xs text-gray-500 font-medium">닉네임과 고양이 이름을 설정하고 감정 테스트를 시작하세요냥!</p></div>
                <div className="space-y-4">
                  <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">나의 닉네임</label><input type="text" value={signupNickname} onChange={(e) => setSignupNickname(e.target.value)} placeholder="예: 드림님, 집사, 냥냥이..." className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">나의 감정냥이 이름</label><input type="text" value={signupCatName} onChange={(e) => setSignupCatName(e.target.value)} placeholder="예: 드림이, 뭉치, 나비..." className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">사용자명 (로그인 시 사용)</label><input type="text" value={generalUsername} onChange={(e) => setGeneralUsername(e.target.value)} placeholder="로그인에 사용할 사용자명" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">비밀번호</label><input type="password" value={generalPassword} onChange={(e) => setGeneralPassword(e.target.value)} placeholder="비밀번호 설정" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">비밀번호 재입력</label><input type="password" value={generalPasswordConfirm} onChange={(e) => setGeneralPasswordConfirm(e.target.value)} placeholder="비밀번호 다시 입력" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /></div>
                </div>
                <button onClick={() => {
                  if (!signupNickname.trim()) { toast.error("닉네임을 입력해달라냥!"); return; }
                  if (!generalUsername.trim()) { toast.error("사용자명을 입력해달라냥!"); return; }
                  if (!generalPassword.trim()) { toast.error("비밀번호를 입력해달라냥!"); return; }
                  if (generalPassword !== generalPasswordConfirm) { toast.error("비밀번호가 일치하지 않다냥!"); return; }
                  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.generalUsers) || '{}');
                  if (users[generalUsername]) { toast.error("이미 존재하는 사용자명이다냥!"); return; }
                  users[generalUsername] = { password: generalPassword, nickname: signupNickname, catName: signupCatName, catMood: 'unfair', collectedCats: ['unfair'] };
                  localStorage.setItem(STORAGE_KEYS.generalUsers, JSON.stringify(users));
                  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify({ username: generalUsername, nickname: signupNickname, catName: signupCatName, catMood: 'unfair', collectedCats: ['unfair'] }));
                  setUserName(signupNickname); setCatName(signupCatName); setAuthView("app"); setIsTestCompleted(false);
                  toast.success(`환영한다냥, ${signupNickname}님! 🐾`);
                }} className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-2xl transition-colors mt-6">가입하기냥 🐾</button>
                <button onClick={() => setIsLoginMode(true)} className="w-full py-2.5 text-gray-400 hover:text-gray-600 font-bold text-xs transition-colors mt-2">이미 가입한 계정으로 로그인</button>
              </>
            ) : (
              <>
                <div className="text-center space-y-2 mb-6"><div className="text-4xl">🐾</div><h2 className="text-xl font-black text-gray-900">로그인</h2><p className="text-xs text-gray-500 font-medium">기존 계정으로 로그인하세요냥</p></div>
                <div className="space-y-4">
                  <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">사용자명</label><input type="text" value={generalUsername} onChange={(e) => setGeneralUsername(e.target.value)} placeholder="사용자명 입력" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">비밀번호</label><input type="password" value={generalPassword} onChange={(e) => setGeneralPassword(e.target.value)} placeholder="비밀번호 입력" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /></div>
                </div>
                <button onClick={() => {
                  if (!generalUsername.trim() || !generalPassword.trim()) { toast.error("사용자명과 비밀번호를 입력해달라냥!"); return; }
                  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.generalUsers) || '{}');
                  const savedUser = users[generalUsername];
                  if (!savedUser || savedUser.password !== generalPassword) { toast.error("사용자명 또는 비밀번호가 틀렸다냥!"); return; }
                  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify({ username: generalUsername, ...savedUser }));
                  setUserName(savedUser.nickname); setCatName(savedUser.catName); setCatMood(savedUser.catMood); setCollectedCats(savedUser.collectedCats);
                  setAuthView("app"); setIsTestCompleted(false);
                  toast.success(`로그인 성공! 환영한다냥 🐾`);
                }} className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-2xl transition-colors mt-6">로그인</button>
                <button onClick={() => setIsLoginMode(false)} className="w-full py-2.5 text-gray-400 hover:text-gray-600 font-bold text-xs transition-colors mt-2">새 계정 만들기</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // === 감정 테스트 화면 ===
  // ============================================================
  if (!isTestCompleted || activeQuestions.length === 0) {
    const q = activeQuestions[currentQuestionIndex] || QUESTION_BANK[0];
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center space-y-2">
            <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">감정 테스트 {currentQuestionIndex + 1}/5</div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight leading-snug">나와 어울리는 감정냥이는?</h2>
            <p className="text-xs text-gray-400 font-medium">매번 새로운 질문으로 다른 결과를 받아볼 수 있다냥!</p>
          </div>
          <div className="px-8 pb-4">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-gray-900 transition-all duration-300 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}></div>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-center mb-5">
              <p className="text-sm font-bold text-gray-800 leading-relaxed">{q.text}</p>
            </div>
            <div className="space-y-2.5">
              {q.options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswerSelect(opt.score)} className="w-full py-3.5 px-4 bg-white hover:bg-gray-900 hover:text-white border border-gray-200 hover:border-gray-900 rounded-xl text-xs font-bold text-gray-700 text-left transition-all active:scale-[0.98]">{opt.text}</button>
              ))}
            </div>
          </div>
          <div className="px-8 pb-8 text-center">
            <p className="text-[10px] text-gray-400 font-medium">5개의 문항을 완료하면 나만의 감정냥이를 만납니다냥!</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // === 메인 앱 (PC + 모바일 반응형) ===
  // ============================================================

  // 탭 콘텐츠 렌더링
  const renderTabContent = () => {
    // 홈 탭
    if (activeTab === "room") return (
      <div className="flex flex-col h-full overflow-y-auto">
        {/* 게임 섹션 */}
        <div className="px-4 pt-4 grid grid-cols-2 gap-3">
          <button onClick={() => adminSettings.gameLinks.mindBlock && window.open(adminSettings.gameLinks.mindBlock, '_blank')}
            className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-center hover:shadow-md transition-all active:scale-[0.98]">
            <div className="text-3xl mb-1.5">🧠</div>
            <p className="font-black text-xs text-gray-800">마인드 블럭</p>
            <p className="text-[9px] text-gray-500 font-medium mt-0.5">두뇌를 단련하다냥</p>
          </button>
          <button onClick={() => adminSettings.gameLinks.musicListen && window.open(adminSettings.gameLinks.musicListen, '_blank')}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 text-center hover:shadow-md transition-all active:scale-[0.98]">
            <div className="text-3xl mb-1.5">🎵</div>
            <p className="font-black text-xs text-gray-800">나만의 감성 음악</p>
            <p className="text-[9px] text-gray-500 font-medium mt-0.5">로파이로 힐링하다냥</p>
          </button>
        </div>

        {/* 고양이 방 */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
          <div className="w-full rounded-3xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-100/60 p-6 flex flex-col items-center gap-4 shadow-sm">
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full">{catName} · {CAT_CHARACTERS[catMood].name.split(" ")[0]}</span>
            </div>
            <button onClick={() => toast.success(`${CAT_CHARACTERS[catMood].quote}`)} className="transition-transform hover:-translate-y-1 active:scale-95 duration-200">
              <img src={CAT_CHARACTERS[catMood].image} alt={CAT_CHARACTERS[catMood].name} className="w-40 h-40 object-contain drop-shadow-lg" />
            </button>
            <p className="text-xs text-gray-500 font-medium text-center italic">"{CAT_CHARACTERS[catMood].quote}"</p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="px-4 pb-4 flex gap-2">
          <button onClick={() => setActiveTab("chat")} className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> 대화하기
          </button>
          <button onClick={handleShare} className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5">
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />} 공유하기
          </button>
          <button onClick={() => { setIsTestCompleted(false); setActiveQuestions(pickRandomQuestions()); }} className="flex-1 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-1.5">
            🔄 재테스트
          </button>
        </div>
      </div>
    );

    // 대화 탭
    if (activeTab === "chat") {
      const chatEndRef = useRef<HTMLDivElement>(null);
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "cat" && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm mr-2 shrink-0 mt-1">
                    <img src={CAT_CHARACTERS[catMood].image} alt="" className="w-5 h-5 object-contain" />
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${msg.sender === "user" ? "bg-gray-900 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm mr-2 shrink-0">
                  <img src={CAT_CHARACTERS[catMood].image} alt="" className="w-5 h-5 object-contain" />
                </div>
                <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0ms"}}></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "150ms"}}></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "300ms"}}></div></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChatMessage()} placeholder="냥이에게 말해주기..." className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            <button onClick={sendChatMessage} className="p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      );
    }

    // 달력 탭
    if (activeTab === "calendar") return (
      <div className="flex flex-col h-full overflow-y-auto">
        {/* 달력 헤더 */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); } else setCalendarMonth(calendarMonth - 1); }} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
            <h2 className="text-base font-black text-gray-900">{calendarYear}년 {calendarMonth + 1}월</h2>
            <button onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); } else setCalendarMonth(calendarMonth + 1); }} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1">{day}</div>
            ))}
            {generateCalendarDays()}
          </div>
        </div>

        {/* 선택된 날짜 일기 */}
        <div className="px-4 pb-4">
          {diaries[selectedDateStr] ? (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{diaries[selectedDateStr].mood.split(" ")[0]}</span>
                  <div>
                    <p className="text-xs font-black text-gray-800">{selectedDateStr}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{diaries[selectedDateStr].mood}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setDiaryMood(diaries[selectedDateStr].mood); setDiaryTitle(diaries[selectedDateStr].title); setDiaryDaily(diaries[selectedDateStr].daily || ""); setDiaryThanks(diaries[selectedDateStr].thanks); setIsDiaryOpen(true); }} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"><Edit3 className="w-3.5 h-3.5 text-gray-500" /></button>
                  <button onClick={() => { const nd = { ...diaries }; delete nd[selectedDateStr]; setDiaries(nd); localStorage.setItem(STORAGE_KEYS.userDiaries, JSON.stringify(nd)); toast.success("일기가 삭제됐다냥!"); }} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 mb-1">오늘의 감성</p>
                  <p className="text-xs font-medium text-gray-700">{diaries[selectedDateStr].title}</p>
                </div>
                {diaries[selectedDateStr].daily && (
                  <div className="p-3 bg-white rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 mb-1">오늘의 일상</p>
                    <p className="text-xs font-medium text-gray-700">{diaries[selectedDateStr].daily}</p>
                  </div>
                )}
                {diaries[selectedDateStr].thanks && (
                  <div className="p-3 bg-white rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 mb-1">오늘의 감사</p>
                    <p className="text-xs font-medium text-gray-700">{diaries[selectedDateStr].thanks}</p>
                  </div>
                )}
                {diaries[selectedDateStr].solution && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-500 mb-1">🐾 AI 냥이의 분석</p>
                    <p className="text-xs font-medium text-gray-700 mb-2">{diaries[selectedDateStr].solution!.tip}</p>
                    {diaries[selectedDateStr].solution!.steps.map((step, i) => (
                      <p key={i} className="text-[10px] text-gray-600 font-medium">• {step}</p>
                    ))}
                    <p className="text-[10px] text-blue-500 font-bold mt-1.5">🎵 추천 음악: {diaries[selectedDateStr].solution!.music}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={() => setIsDiaryOpen(true)} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-bold text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> {selectedDateStr} 일기 쓰기
            </button>
          )}
        </div>

        {/* 일기 작성 모달 */}
        {isDiaryOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-sm">{selectedDateStr} 일기</h3>
                <button onClick={() => setIsDiaryOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1.5 block">오늘의 감정</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["😊 기쁨", "😢 슬픔", "😴 피곤", "😰 불안", "🥺 외로움", "😡 화남", "🥰 사랑", "😌 편안"].map(m => (
                      <button key={m} onClick={() => setDiaryMood(m)} className={`py-2 rounded-xl text-xs font-bold transition-all ${diaryMood === m ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>{m.split(" ")[0]}<br/><span className="text-[8px]">{m.split(" ")[1]}</span></button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">오늘의 감성 <span className="text-red-400">*</span></label>
                  <textarea value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} placeholder="오늘 어떤 감정을 느꼈나요?" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">오늘의 일상</label>
                  <textarea value={diaryDaily} onChange={(e) => setDiaryDaily(e.target.value)} placeholder="오늘 있었던 일을 기록해보세요" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">오늘의 감사</label>
                  <textarea value={diaryThanks} onChange={(e) => setDiaryThanks(e.target.value)} placeholder="오늘 감사했던 일을 적어보세요" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
                </div>
              </div>
              <button onClick={saveDiary} disabled={isAnalyzing} className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-2xl transition-colors disabled:opacity-50">
                {isAnalyzing ? "AI가 분석 중이다냥... 🐾" : "저장하기"}
              </button>
            </div>
          </div>
        )}
      </div>
    );

    // 커뮤니티 탭
    if (activeTab === "community") return (
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900">🌳 마음 숲</h2>
          <button onClick={() => setIsWritingPost(true)} className="p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors"><Plus className="w-4 h-4" /></button>
        </div>

        {/* 글 작성 모달 */}
        {isWritingPost && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-sm">마음 숲에 글 남기기</h3>
                <button onClick={() => setIsWritingPost(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
              <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="오늘 마음 속 이야기를 나눠보세요냥..." rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
              <button onClick={submitPost} className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-2xl transition-colors">게시하기</button>
            </div>
          </div>
        )}

        <div className="px-4 pb-4 space-y-3">
          {feedPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">{post.avatar}</div>
                    <div>
                      <p className="text-xs font-black text-gray-800">{post.author}</p>
                      <p className="text-[9px] text-gray-400 font-medium">{new Date(post.date).toLocaleDateString("ko-KR")}</p>
                    </div>
                  </div>
                  {post.author === userName && (
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingPostId(post.id); setEditPostContent(post.content); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Edit3 className="w-3 h-3 text-gray-400" /></button>
                      <button onClick={() => deletePost(post.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-3 h-3 text-red-400" /></button>
                    </div>
                  )}
                </div>
                {editingPostId === post.id ? (
                  <div className="space-y-2">
                    <textarea value={editPostContent} onChange={(e) => setEditPostContent(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const updated = feedPosts.map(p => p.id === post.id ? { ...p, content: editPostContent } : p);
                        setFeedPosts(updated); localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated));
                        setEditingPostId(null); setEditPostContent("");
                      }} className="flex-1 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl">저장</button>
                      <button onClick={() => { setEditingPostId(null); setEditPostContent(""); }} className="flex-1 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl">취소</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{post.content}</p>
                )}
                <div className="flex items-center gap-3 pt-1">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 text-xs font-bold transition-colors ${post.likedByMe ? "text-pink-500" : "text-gray-400 hover:text-pink-400"}`}>
                    <Heart className={`w-3.5 h-3.5 ${post.likedByMe ? "fill-current" : ""}`} /> {post.likes}
                  </button>
                  <span className="text-xs text-gray-300 font-medium flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.comments.length}</span>
                </div>
              </div>

              {/* 댓글 섹션 */}
              {post.comments.length > 0 && (
                <div className="border-t border-gray-50 px-4 py-3 space-y-2 bg-gray-50/50">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600 shrink-0 mt-0.5">{comment.author[0]}</div>
                      <div className="flex-1 min-w-0">
                        {editingCommentId === comment.id ? (
                          <div className="space-y-1.5">
                            <input value={editCommentText} onChange={(e) => setEditCommentText(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-gray-900" />
                            <div className="flex gap-1.5">
                              <button onClick={() => saveEditComment(post.id, comment.id)} className="px-2 py-1 bg-gray-900 text-white font-bold text-[9px] rounded-lg">저장</button>
                              <button onClick={() => { setEditingCommentId(null); setEditCommentText(""); }} className="px-2 py-1 bg-gray-100 text-gray-600 font-bold text-[9px] rounded-lg">취소</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-black text-gray-700 mr-1.5">{comment.author}</span>
                              <span className="text-[10px] text-gray-600 font-medium">{comment.text}</span>
                            </div>
                            {comment.author === userName && (
                              <div className="flex gap-0.5 shrink-0">
                                <button onClick={() => { setEditingCommentId(comment.id); setEditCommentText(comment.text); }} className="p-1 rounded hover:bg-gray-200 transition-colors"><Edit3 className="w-2.5 h-2.5 text-gray-400" /></button>
                                <button onClick={() => deleteComment(post.id, comment.id)} className="p-1 rounded hover:bg-red-50 transition-colors"><Trash2 className="w-2.5 h-2.5 text-red-400" /></button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 댓글 입력 */}
              <div className="border-t border-gray-100 px-4 py-2.5 flex gap-2">
                <input type="text" value={newCommentText[post.id] || ""} onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })} onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)} placeholder="댓글 달기..." className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-gray-900" />
                <button onClick={() => submitComment(post.id)} className="p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors"><Send className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // 리포트 탭
    if (activeTab === "report") {
      const moodData = Object.entries(
        Object.values(diaries).reduce((acc, d) => {
          const moodName = d.mood.split(" ")[1] || "기타";
          acc[moodName] = (acc[moodName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({ name, value }));
      const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4"];
      return (
        <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4">
          <h2 className="text-base font-black text-gray-900">📊 월간 감정 분석</h2>
          {moodData.length > 0 ? (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={moodData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}`}>
                    {moodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <p className="text-4xl mb-2">📖</p>
              <p className="text-sm font-bold text-gray-500">아직 일기가 없다냥!</p>
              <p className="text-xs text-gray-400 font-medium mt-1">달력에서 일기를 써보기냥 🐾</p>
            </div>
          )}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100 text-center space-y-3">
            <p className="font-bold text-sm text-gray-800">💬 {adminSettings.ads.bannerText}</p>
            <button onClick={() => window.open(adminSettings.ads.bannerLink, '_blank')} className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl transition-colors">상담 예약하기</button>
          </div>
        </div>
      );
    }

    // 도감 탭
    if (activeTab === "dex") return (
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">📖 감정냥이 도감</h2>
            <span className="text-xs font-bold text-gray-400">{collectedCats.length}/{Object.keys(CAT_CHARACTERS).length}</span>
          </div>
        </div>
        <div className="px-4 pb-4 grid grid-cols-2 gap-3">
          {(Object.keys(CAT_CHARACTERS) as MoodType[]).map(mood => {
            const cat = CAT_CHARACTERS[mood];
            const isUnlocked = collectedCats.includes(mood);
            return (
              <button key={mood} onClick={() => isUnlocked && setSelectedDexCat(mood)}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${isUnlocked ? "bg-white border-gray-200 hover:border-gray-400 hover:shadow-md active:scale-[0.98]" : "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <img src={cat.image} alt={cat.name} className={`w-12 h-12 object-contain ${!isUnlocked ? "grayscale" : ""}`} />
                  <div>
                    <p className="text-[10px] font-black text-gray-800 leading-tight">{cat.name.split(" ")[0]}</p>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${cat.rarity === "legendary" ? "bg-amber-100 text-amber-600" : cat.rarity === "rare" ? "bg-pink-100 text-pink-600" : cat.rarity === "uncommon" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>{cat.rarityLabel}</span>
                  </div>
                </div>
                {isUnlocked ? (
                  <p className="text-[9px] text-gray-500 font-medium leading-relaxed line-clamp-2">{cat.description}</p>
                ) : (
                  <p className="text-[9px] text-gray-400 font-medium">🔒 미수집</p>
                )}
              </button>
            );
          })}
        </div>

        {/* 도감 상세 모달 */}
        {selectedDexCat && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-sm">{CAT_CHARACTERS[selectedDexCat].name}</h3>
                <button onClick={() => { setSelectedDexCat(null); dexAudioRef.current?.pause(); setDexMusicPlaying(null); }} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
              <div className="flex items-center gap-4">
                <img src={CAT_CHARACTERS[selectedDexCat].image} alt="" className="w-24 h-24 object-contain" />
                <div className="flex-1 space-y-1.5">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${CAT_CHARACTERS[selectedDexCat].rarity === "legendary" ? "bg-amber-100 text-amber-600" : CAT_CHARACTERS[selectedDexCat].rarity === "rare" ? "bg-pink-100 text-pink-600" : CAT_CHARACTERS[selectedDexCat].rarity === "uncommon" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                    {CAT_CHARACTERS[selectedDexCat].rarityLabel}
                  </span>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{CAT_CHARACTERS[selectedDexCat].description}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                <p className="text-[10px] font-bold text-gray-500">특기</p>
                <p className="text-xs text-gray-700 font-medium">{CAT_CHARACTERS[selectedDexCat].specialty}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-600 font-bold italic">"{CAT_CHARACTERS[selectedDexCat].quote}"</p>
              </div>
              {/* 로파이 음악 재생 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                <p className="text-[10px] font-bold text-gray-500 mb-2">🎵 어울리는 로파이 음악</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-700">{CAT_CHARACTERS[selectedDexCat].lofiMusic.title}</p>
                  <button onClick={() => toggleDexMusic(selectedDexCat)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${dexMusicPlaying === selectedDexCat ? "bg-purple-500 text-white" : "bg-white border border-purple-200 text-purple-600 hover:bg-purple-50"}`}>
                    {dexMusicPlaying === selectedDexCat ? <><Pause className="w-3 h-3" /> 정지</> : <><Play className="w-3 h-3" /> 재생</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    // 관리자 탭
    if (activeTab === "admin" && isAdminLoggedIn) return (
      <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900">🛡️ 관리자</h2>
          <button onClick={() => { setIsAdminLoggedIn(false); setActiveTab("room"); toast.success("관리자 로그아웃!"); }} className="text-xs font-bold text-red-400 hover:text-red-600">로그아웃</button>
        </div>
        {/* 게임 링크 */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 space-y-3">
          <h3 className="font-bold text-xs text-gray-700">🎮 게임 링크</h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500">마인드 블럭 링크</label>
            <input type="text" value={adminSettings.gameLinks.mindBlock} onChange={(e) => setAdminSettings({...adminSettings, gameLinks: {...adminSettings.gameLinks, mindBlock: e.target.value}})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500">음악 듣기 링크</label>
            <input type="text" value={adminSettings.gameLinks.musicListen} onChange={(e) => setAdminSettings({...adminSettings, gameLinks: {...adminSettings.gameLinks, musicListen: e.target.value}})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        {/* 광고 관리 */}
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 space-y-3">
          <h3 className="font-bold text-xs text-gray-700">📢 광고 관리</h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500">광고 배너 문구</label>
            <input type="text" value={adminSettings.ads.bannerText} onChange={(e) => setAdminSettings({...adminSettings, ads: {...adminSettings.ads, bannerText: e.target.value}})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500">광고 링크</label>
            <input type="text" value={adminSettings.ads.bannerLink} onChange={(e) => setAdminSettings({...adminSettings, ads: {...adminSettings.ads, bannerLink: e.target.value}})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>
        {/* 페이지 이름 */}
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100 space-y-3">
          <h3 className="font-bold text-xs text-gray-700">📝 페이지 이름 수정</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(adminSettings.pageNames).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400">{key}</label>
                <input type="text" value={value} onChange={(e) => setAdminSettings({...adminSettings, pageNames: {...adminSettings.pageNames, [key]: e.target.value}})} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-green-500" />
              </div>
            ))}
          </div>
        </div>
        {/* 비밀번호 변경 */}
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100 space-y-3">
          <h3 className="font-bold text-xs text-gray-700">🔐 비밀번호 변경</h3>
          <input type="password" value={adminNewPassword} onChange={(e) => setAdminNewPassword(e.target.value)} placeholder="새 비밀번호" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input type="password" value={adminNewPasswordConfirm} onChange={(e) => setAdminNewPasswordConfirm(e.target.value)} placeholder="비밀번호 재입력" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500" />
          <button onClick={() => {
            if (!adminNewPassword.trim()) { toast.error("새 비밀번호를 입력해달라냥!"); return; }
            if (adminNewPassword !== adminNewPasswordConfirm) { toast.error("비밀번호가 일치하지 않다냥!"); return; }
            const updated = {...adminSettings, adminPassword: adminNewPassword};
            setAdminSettings(updated);
            localStorage.setItem(STORAGE_KEYS.adminSettings, JSON.stringify(updated));
            setAdminNewPassword(""); setAdminNewPasswordConfirm("");
            toast.success("비밀번호 변경 완료! 🔐");
          }} className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-colors">비밀번호 변경</button>
        </div>
        <button onClick={() => { localStorage.setItem(STORAGE_KEYS.adminSettings, JSON.stringify(adminSettings)); toast.success("모든 설정 저장 완료! 💾"); }} className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-2xl transition-colors shadow-md">모든 설정 저장</button>
      </div>
    );

    return null;
  };

  const unreadLetterCount = letters.filter(l => !l.isRead).length;

  return (
    <div className="flex-1 flex flex-col bg-white relative overflow-hidden h-full">
        
        {/* 편지함 모달 */}
        {isMailOpen && (
          <div className="absolute inset-0 bg-black/50 z-50 flex flex-col">
            <div className="flex-1 flex flex-col bg-white md:rounded-[32px] overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-black text-gray-900 text-sm">📮 편지함</h2>
                <button onClick={() => setIsMailOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
              {selectedLetter ? (
                <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                  <button onClick={() => setSelectedLetter(null)} className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600"><ChevronLeft className="w-4 h-4" /> 목록으로</button>
                  <div className="flex items-center gap-3">
                    <img src={CAT_CHARACTERS[catMood].image} alt="" className="w-12 h-12 object-contain" />
                    <div>
                      <p className="text-xs font-black text-gray-800">{catName}의 편지</p>
                      <p className="text-[10px] text-gray-400 font-medium">{selectedLetter.date}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">{selectedLetter.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                  {letters.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-4xl mb-2">📭</p>
                      <p className="text-sm font-bold text-gray-500">아직 편지가 없다냥!</p>
                      <p className="text-xs text-gray-400 font-medium mt-1">매일 감정냥이가 편지를 보내줄 거다냥 🐾</p>
                    </div>
                  ) : letters.map(letter => (
                    <button key={letter.id} onClick={() => {
                      const updated = letters.map(l => l.id === letter.id ? { ...l, isRead: true } : l);
                      setLetters(updated); localStorage.setItem(STORAGE_KEYS.catLetters, JSON.stringify(updated));
                      setSelectedLetter({ ...letter, isRead: true });
                    }} className={`w-full p-4 rounded-2xl border text-left transition-all hover:shadow-sm ${letter.isRead ? "bg-white border-gray-100" : "bg-blue-50 border-blue-200"}`}>
                      <div className="flex items-center gap-3">
                        <img src={CAT_CHARACTERS[catMood].image} alt="" className="w-8 h-8 object-contain shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-black text-gray-800">{catName}의 편지</p>
                            {!letter.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>}
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium">{letter.date}</p>
                          <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">{letter.content.slice(0, 40)}...</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOP BAR */}
        <header className="px-5 py-3.5 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0">
          <button onClick={() => setIsMailOpen(true)} className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
            <Mail className="w-4 h-4 text-gray-600" />
            {unreadLetterCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">{unreadLetterCount}</span>}
          </button>
          <h1 className="text-base font-black tracking-tight text-gray-900">MIND CAT DIARY</h1>
          <div className="flex gap-1.5">
            <button onClick={toggleMusic} className={`p-2 rounded-xl transition-all border ${isPlaying ? "bg-gray-900 border-gray-900 text-white" : "bg-gray-50 border-gray-100 text-gray-600"}`}>
              <Music className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
            </button>
            <button onClick={handleLogout} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </header>

        {/* 사용자 상태 바 */}
        <div className="px-5 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2 shrink-0">
          <img src={CAT_CHARACTERS[catMood].image} alt="" className="w-5 h-5 object-contain" />
          <span className="text-xs font-bold text-gray-700">{userName}님</span>
          <span className="text-[10px] text-gray-400 font-medium">· {catName} ({CAT_CHARACTERS[catMood].name.split(" ")[0]})</span>
          {isAdminLoggedIn && <span className="ml-auto text-[9px] bg-gray-900 text-white px-1.5 py-0.5 rounded font-bold">관리자</span>}
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-hidden relative">
          {renderTabContent()}
        </main>

        {/* BOTTOM NAV */}
        <nav className="px-3 py-2.5 bg-white border-t border-gray-100 flex gap-1 justify-between shrink-0">
          {[
            { tab: "room", icon: <HomeIcon className="w-4 h-4" />, label: adminSettings.pageNames.home },
            { tab: "chat", icon: <MessageSquare className="w-4 h-4" />, label: adminSettings.pageNames.chat },
            { tab: "calendar", icon: <Calendar className="w-4 h-4" />, label: adminSettings.pageNames.calendar },
            { tab: "community", icon: <Users className="w-4 h-4" />, label: adminSettings.pageNames.community },
            { tab: "report", icon: <BarChart2 className="w-4 h-4" />, label: adminSettings.pageNames.report },
            { tab: "dex", icon: <BookOpen className="w-4 h-4" />, label: adminSettings.pageNames.dex },
            ...(isAdminLoggedIn ? [{ tab: "admin", icon: <Shield className="w-4 h-4" />, label: "관리자" }] : [])
          ].map(({ tab, icon, label }) => (
            <button key={tab} onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all ${activeTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
              {icon}
              <span className="text-[8px] font-bold leading-none">{label}</span>
            </button>
          ))}
        </nav>
    </div>
  );
}
