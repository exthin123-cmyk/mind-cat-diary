import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { 
  MessageSquare, Calendar as CalendarIcon, Settings, Mail, Send, Plus,
  ChevronLeft, ChevronRight, Heart, Trash2, X, Music, ShoppingBag, Users,
  Shield, MessageCircle, TrendingUp, ExternalLink, CreditCard, LogIn,
  UserPlus, BarChart2, BookOpen, Share2, Copy, Check
} from "lucide-react";
import { toast } from "sonner";
import { MoodType, CAT_CHARACTERS, ScheduleEvent, FeedPost, QUESTION_BANK } from "../lib/types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import Dex from "./Dex";
import AdminEditor from "./AdminEditor";

const LOFI_PLAYLIST: Record<string, { title: string; url: string }> = {
  "기쁨 😊": { title: "포근한 햇살 Lofi ☀️", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  "슬픔 😢": { title: "차분한 빗소리 Lofi 🌧️", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  "피곤 😴": { title: "노곤노곤 자장가 Lofi 💤", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  "불안 😰": { title: "평온한 숲속의 숨결 Lofi 🌲", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  "외로움 🥺": { title: "별빛 가득한 밤하늘 Lofi 🌌", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  "default": { title: "드림이의 아늑한 방 Lofi 🎵", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
};

const MOOD_COLORS: Record<string, string> = {
  "기쁨": "#60A5FA", "슬픔": "#93C5FD", "피곤": "#F9A8D4", "불안": "#FCA5A5", "외로움": "#C4B5FD"
};

function generateDiarySolution(title: string, mood: string, thanks: string) {
  const text = `${title} ${mood} ${thanks}`.toLowerCase();
  const solutions = [
    { condition: () => text.includes("일") || text.includes("직장") || text.includes("업무"), tip: "업무 스트레스는 잠깐의 환기로 해소할 수 있어요냥.", steps: ["5분간 자리에서 일어나 창문을 열고 바깥 공기를 마셔보기냥.", "오늘 완료한 업무 목록을 적어보며 성취감을 느껴보기냥."], music: "불안 😰" },
    { condition: () => text.includes("힘들") || text.includes("지쳐") || text.includes("피곤"), tip: "지금 당신에게 가장 필요한 건 완전한 휴식이에요냥.", steps: ["스마트폰을 내려놓고 15분간 눈을 감고 누워있기냥.", "좋아하는 따뜻한 음료를 마시며 아무 생각 없이 쉬어보기냥."], music: "피곤 😴" },
    { condition: () => text.includes("슬") || text.includes("울") || text.includes("눈물"), tip: "슬픔을 느끼는 건 당신이 살아있다는 증거예요냥.", steps: ["슬픈 감정을 억누르지 말고 충분히 울어도 괜찮다냥.", "슬픔이 지나간 후 좋아하는 음악을 틀어보기냥."], music: "슬픔 😢" },
    { condition: () => text.includes("행복") || text.includes("좋은") || text.includes("기쁜"), tip: "이 행복한 감정을 더 오래 간직해 보세요냥!", steps: ["오늘 기뻤던 순간을 한 줄 더 자세히 기록해보기냥.", "이 행복을 소중한 사람과 나눠보기냥."], music: "기쁨 😊" },
    { condition: () => text.includes("외로") || text.includes("혼자") || text.includes("쓸쓸"), tip: "외로움은 더 깊은 연결을 원하는 마음의 신호예요냥.", steps: ["커뮤니티 '마음 숲'에 오늘 기분을 나눠보기냥.", "좋아하는 반려동물 영상이나 편안한 음악을 틀어두기냥."], music: "외로움 🥺" }
  ];
  const matched = solutions.find(s => s.condition());
  if (matched) return { tip: matched.tip, steps: matched.steps, music: matched.music };
  const defaults = [
    { tip: "오늘 하루도 정말 수고 많았다냥.", steps: ["오늘 잘한 일 한 가지를 스스로 칭찬해 주기냥.", "내일의 나를 위해 일찍 잠자리에 들기냥."], music: "default" },
    { tip: "작은 감사가 마음을 풍요롭게 만들어요냥.", steps: ["오늘 감사했던 일 세 가지를 더 떠올려보기냥.", "내일 아침 일어나면 가장 먼저 물 한 잔 마시기냥."], music: "기쁨 😊" }
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  // --- localStorage 키 ---
  const STORAGE_KEYS = {
    adminSettings: 'mindcat_admin_settings',
    generalUsers: 'mindcat_general_users',
    currentUser: 'mindcat_current_user',
    userDiaries: 'mindcat_user_diaries',
    userFeedPosts: 'mindcat_user_feed_posts'
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
  const [todayTestDone, setTodayTestDone] = useState(false);
  const [lastTestDate, setLastTestDate] = useState("");
  const [showCardResult, setShowCardResult] = useState(false);
  const [isTestPayConfirmOpen, setIsTestPayConfirmOpen] = useState(false);
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
  const [isPremium, setIsPremium] = useState(false);

  // --- 온보딩 튜토리얼 ---
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const ONBOARDING_STEPS = [
    {
      emoji: "🐾",
      title: "Mind Cat Diary에 오신 걸 환영한다냥!",
      desc: "감정냥이와 함께 매일 마음을 기록하고, 힐링하고, 성장하는 나만의 감정 다이어리 앱이다냥. 먼저 감정 테스트로 나만의 감정냥이를 만나보라냥!",
      highlight: null
    },
    {
      emoji: "💬",
      title: "대화 — 냥이와 속마음 털어놓기",
      desc: "AI 감정냥이가 드림님의 이야기를 진심으로 들어주고 공감해준다냥. 기쁜 일, 슬픈 일, 억울한 일 뭐든 다 말해달라냥!",
      highlight: "대화"
    },
    {
      emoji: "📅",
      title: "달력 — 감정 일기 & 일정 기록",
      desc: "매일 감정과 감사한 일을 일기로 기록하면 AI가 맞춤 솔루션과 힐링 Lofi 음악을 추천해준다냥. 일기를 쓸수록 사과도 쌓인다냥!",
      highlight: "달력"
    },
    {
      emoji: "🌳",
      title: "커뮤니티 — 마음 숲 피드",
      desc: "다른 사람들과 감정을 나누고 공감받으면서 혼자가 아니라는 걸 느껴보다냥! 따뜻한 댓글로 서로를 응원하는 커뮤니티다냥.",
      highlight: "마음 숲"
    },
    {
      emoji: "📊",
      title: "리포트 — 월간 감정 분석",
      desc: "한 달간의 감정 변화를 차트로 분석하고 AI 요약을 받아볼 수 있다냥! 내 감정 패턴을 이해하고 성장하는 기회다냥.",
      highlight: "리포트"
    },
    {
      emoji: "🎁",
      title: "도감 — 감정냥이 수집",
      desc: "감정 테스트를 통해 다양한 감정냥이를 만나고 수집해보다냥! 각 냥이마다 특별한 이야기가 있다냥.",
      highlight: "도감"
    }
  ];

  // --- 상태 관리 ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMusicMood, setCurrentMusicMood] = useState<string>("default");
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [bubbleText, setBubbleText] = useState("안녕하다냥! 오늘 기분은 어떻냥?");
  const [dailyCatMessage, setDailyCatMessage] = useState("오늘도 함께 있어줘서 고마워냥!");

  // --- 관리자 상태 ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLoginUsername, setAdminLoginUsername] = useState("");
  const [adminLoginPassword, setAdminLoginPassword] = useState("");
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const [adminNewPasswordConfirm, setAdminNewPasswordConfirm] = useState("");
  const [adminSettings, setAdminSettings] = useState({
    pageNames: {
      home: "홈",
      chat: "대화",
      diary: "일기",
      calendar: "달력",
      community: "마음 숲",
      report: "리포트",
      dex: "도감"
    },
    gameLinks: {
      mindBlock: "https://example.com/mindblock",
      musicListen: "https://example.com/music"
    },
    ads: {
      bannerText: "상담이 필요하신가요?",
      bannerLink: "https://example.com/counseling"
    },
    adminPassword: "123456"
  });

  // --- 일기 & 달력 ---
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split("T")[0]);
  const [diaries, setDiaries] = useState<Record<string, { mood: string; title: string; daily: string; thanks: string; solution?: { tip: string; steps: string[]; music: string } }>>({});
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [diaryMood, setDiaryMood] = useState("😊 기쁨");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryDaily, setDiaryDaily] = useState("");
  const [diaryThanks, setDiaryThanks] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- 커뮤니티 ---
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    { id: "1", author: "드림님", avatar: "😊", content: "오늘 날씨가 정말 좋았어냥! ☀️", date: new Date(Date.now() - 3600000).toISOString(), likes: 5, likedByMe: false, comments: [] },
    { id: "2", author: "냥냥이", avatar: "😢", content: "월요일이 또 왔다... 😢", date: new Date(Date.now() - 7200000).toISOString(), likes: 3, likedByMe: false, comments: [] }
  ]);
  const [isWritingPost, setIsWritingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});

  // --- 채팅 ---
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: "user" | "cat"; text: string }[]>([
    { id: "1", sender: "cat", text: "안녕하다냥! 오늘 기분은 어떻냥? 무슨 이야기든 들어줄게냥 🐾" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // --- 도감 ---
  const [selectedDexCat, setSelectedDexCat] = useState<MoodType | null>(null);

  // --- 편지함 ---
  const [letters, setLetters] = useState<{ id: string; date: string; content: string; isRead: boolean }[]>([]);

  // --- 함수 ---
  // 5개 랜덤 질문 추출 함수
  const pickRandomQuestions = () => {
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  };

  // --- useEffect: localStorage 초기화 ---
  useEffect(() => {
    // 감정 테스트 질문 추출 (5개)
    setActiveQuestions(pickRandomQuestions());

    // 오늘 테스트 여부 확인
    const savedLastTestDate = localStorage.getItem('mindcat_last_test_date');
    if (savedLastTestDate === new Date().toISOString().split('T')[0]) {
      setTodayTestDone(true);
      setLastTestDate(savedLastTestDate);
    }
    // 관리자 설정 로드
    const savedAdminSettings = localStorage.getItem(STORAGE_KEYS.adminSettings);
    if (savedAdminSettings) {
      try {
        setAdminSettings(JSON.parse(savedAdminSettings));
      } catch (e) {
        console.error('Failed to load admin settings:', e);
      }
    }

    // 일반 사용자 데이터 로드
    const savedCurrentUser = localStorage.getItem(STORAGE_KEYS.currentUser);
    if (savedCurrentUser) {
      try {
        const userData = JSON.parse(savedCurrentUser);
        setUserName(userData.nickname);
        setCatName(userData.catName);
        setCatMood(userData.catMood);
        setCollectedCats(userData.collectedCats || []);
        setAuthView('app');
      } catch (e) {
        console.error('Failed to load user data:', e);
      }
    }

    // 일기 데이터 로드
    const savedDiaries = localStorage.getItem(STORAGE_KEYS.userDiaries);
    if (savedDiaries) {
      try {
        setDiaries(JSON.parse(savedDiaries));
      } catch (e) {
        console.error('Failed to load diaries:', e);
      }
    }

    // 피드 데이터 로드
    const savedFeedPosts = localStorage.getItem(STORAGE_KEYS.userFeedPosts);
    if (savedFeedPosts) {
      try {
        setFeedPosts(JSON.parse(savedFeedPosts));
      } catch (e) {
        console.error('Failed to load feed posts:', e);
      }
    }

    // 편지함 로드 및 오늘 편지 생성
    const LETTERS_KEY = 'mindcat_cat_letters';
    let existingLetters: { id: string; date: string; content: string; isRead: boolean }[] = [];
    const savedLetters = localStorage.getItem(LETTERS_KEY);
    if (savedLetters) {
      try { existingLetters = JSON.parse(savedLetters); } catch (e) {}
    }
    const today = new Date().toISOString().split('T')[0];
    const hasTodayLetter = existingLetters.some(l => l.date === today);
    if (!hasTodayLetter) {
      const catLetters = [
        `오늘도 하루 수고 많았다냥! 내가 항상 곁에 있다냥 🐾`,
        `힘든 일이 있어도 괜찮다냥. 내일은 더 좋은 날이 될 거다냥 🌸`,
        `오늘 기분이 어떻냥? 일기를 써보면 마음이 가벼워질 거다냥 📖`,
        `드림님은 충분히 잘 하고 있다냥. 스스로를 칭찬해주라냥 🏆`,
        `오늘 감사한 일 하나를 떠올려보라냥. 작은 것이라도 마음이 풍요로워진다냥 ✨`,
        `오늘은 냠씨가 좋든 나쁘든, 드림님의 하루가 평화로웠으면 좋겠다냥 🌿`,
        `혼자라고 느끼지 말라냥. 나는 항상 여기서 드림님을 응원하고 있다냥 💕`,
        `오늘 잘 먹고 잘 자는 것도 중요하다냥. 몸이 건강해야 마음도 건강하다냥 😺`
      ];
      const newLetter = {
        id: Date.now().toString(),
        date: today,
        content: catLetters[Math.floor(Math.random() * catLetters.length)],
        isRead: false
      };
      existingLetters = [newLetter, ...existingLetters].slice(0, 30);
      localStorage.setItem(LETTERS_KEY, JSON.stringify(existingLetters));
    }
    setLetters(existingLetters);
  }, []);
  const handleAnswerSelect = (score: Partial<Record<MoodType, number>>) => {
    const newScores = { ...testScores };
    Object.keys(score).forEach(key => {
      const scoreValue = score[key as MoodType];
      if (scoreValue !== undefined) {
        newScores[key as MoodType] += scoreValue;
      }
    });
    setTestScores(newScores);

    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const maxMood = Object.entries(newScores).reduce((a, b) => a[1] > b[1] ? a : b)[0] as MoodType;
      setCatMood(maxMood);
      const isNewCat = !collectedCats.includes(maxMood);
      if (isNewCat) {
        const newCollected = [...collectedCats, maxMood];
        setCollectedCats(newCollected);
        // localStorage 업데이트
        const savedUser = localStorage.getItem(STORAGE_KEYS.currentUser);
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            userData.catMood = maxMood;
            userData.collectedCats = newCollected;
            localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(userData));
          } catch (e) {}
        }
      }
      setIsTestCompleted(true);
      setTestCount(testCount + 1);
      setCurrentQuestionIndex(0);
      setTestScores({
        unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0, depressed: 0,
        excited: 0, scared: 0, proud: 0, curious: 0, guilty: 0, relaxed: 0
      });
      setActiveQuestions(pickRandomQuestions());
      setOnboardingStep(0);
      setIsOnboardingOpen(false);
      // 매일 1번 제한 저장
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('mindcat_last_test_date', today);
      setTodayTestDone(true);
      setLastTestDate(today);
      // 카드 결과 표시
      setShowCardResult(true);
      if (isNewCat) {
        toast.success(`새로운 카드! ${CAT_CHARACTERS[maxMood].name}를 획득했다냥! 🎉`);
      } else {
        toast.success(`${CAT_CHARACTERS[maxMood].name}를 만났다냥! (이미 보유 중) 🐾`);
      }
    }
  };

  const playMeow = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==");
    audio.play().catch(() => {});
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const catMusic = CAT_CHARACTERS[catMood].lofiMusic;
      setCurrentMusicMood(catMood);
      toast.success(`${catMusic.title} 재생 중...🎵`);
    }
  };

  const handleShare = async () => {
    const siteUrl = window.location.origin;
    const cat = CAT_CHARACTERS[catMood];
    const text = `🐾 나의 감정냥이 카드\n\n${cat.emoji} ${cat.name}\n"${cat.quote}"\n\n나도 감정냥 받기 👉 ${siteUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `나의 감정냥이: ${cat.name}`, text, url: siteUrl });
      } else {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast.success("카드 공유 링크가 복사됐다냥! 🐾");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const generateCalendarDays = () => {
    const year = calendarYear;
    const month = calendarMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = selectedDateStr === dateStr;
      const diary = diaries[dateStr];
      const moodEmoji = diary ? diary.mood.split(" ")[0] : null;
      days.push(
        <button key={day} onClick={() => setSelectedDateStr(dateStr)} className={`h-11 w-full flex flex-col items-center justify-center rounded-lg transition-all relative ${isSelected ? "bg-blue-500 text-white font-bold" : "bg-white text-black hover:bg-gray-50"}`}>
          <span className="text-[10px]">{day}</span>
          {moodEmoji && <span className="text-[10px] leading-none">{moodEmoji}</span>}
        </button>
      );
    }
    return days;
  };

  const getRoomBg = () => {
    return "bg-[#FAF8F5] border border-gray-100";
  };

  // === 랜딩 페이지 ===
  if (authView === "landing") {
    return (
      <div className="flex-1 flex flex-col bg-white h-full overflow-y-auto">
        <div className="px-6 pt-10 pb-6 text-center space-y-3">
          <div className="text-5xl mb-2">🐾</div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">MIND CAT DIARY</h1>
          <p className="text-sm text-gray-500 font-bold leading-relaxed">감정냥이와 함께하는<br />나만의 마음 힐링 다이어리</p>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-4 gap-3">
            {(["unfair", "anxious", "lonely", "lethargic"] as MoodType[]).map(mood => (
              <div key={mood} className="flex flex-col items-center gap-1">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <img src={CAT_CHARACTERS[mood].image} alt={CAT_CHARACTERS[mood].name} className="w-12 h-12 object-contain" />
                </div>
                <span className="text-[9px] font-bold text-gray-500 text-center">{CAT_CHARACTERS[mood].name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 space-y-3">
          {[
            { icon: "🧠", title: "감정 테스트로 나만의 냥이 매칭", desc: "10문항으로 내 감정 유형에 딱 맞는 고양이가 배정된다냥!" },
            { icon: "📖", title: "일기 쓰면 AI 맞춤 솔루션 제공", desc: "GPT AI가 일기를 분석해 실질적인 해결책과 Lofi 음악을 추천한다냥!" },
            { icon: "💬", title: "GPT AI 냥이와 대화하기", desc: "언제든지 감정냥이에게 속마음을 털어놓으면 AI가 공감해준다냥!" },
            { icon: "📊", title: "월간 감정 분석 리포트", desc: "한 달간의 감정 변화를 차트로 분석하고 AI 요약을 받아볼 수 있다냥!" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div><h3 className="text-xs font-black text-gray-800">{item.title}</h3><p className="text-[10px] text-gray-500 font-bold mt-0.5">{item.desc}</p></div>
            </div>
          ))}
        </div>
        <div className="px-6 py-6 space-y-3">
          <button onClick={() => setAuthView("signup")} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" /> 시작하기 🐾
          </button>
          <button onClick={() => setAuthView("admin-login")} className="w-full py-2.5 text-gray-400 hover:text-gray-600 font-bold text-xs transition-colors flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> 관리자 로그인
          </button>
        </div>
      </div>
    );
  }

  // === 관리자 로그인 화면 ===
  if (authView === "admin-login") {
    
    return (
      <div className="flex-1 flex flex-col bg-white h-full overflow-y-auto">
        <div className="px-6 pt-10 pb-6 text-center space-y-3">
          <div className="text-5xl mb-2">🛡️</div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">ADMIN LOGIN</h1>
          <p className="text-sm text-gray-500 font-bold">Mind Cat Diary 관리자 로그인</p>
        </div>
        <div className="px-6 py-8 flex-1 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600">관리자 사용자명</label>
              <input type="text" value={adminLoginUsername} onChange={(e) => setAdminLoginUsername(e.target.value)} placeholder="사용자명 입력" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600">비밀번호</label>
              <input type="password" value={adminLoginPassword} onChange={(e) => setAdminLoginPassword(e.target.value)} placeholder="비밀번호 입력" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
            </div>
          </div>
          <button onClick={() => {
            if (adminLoginUsername === "admin" && adminLoginPassword === adminSettings.adminPassword) {
              setIsAdminLoggedIn(true);
              setAuthView("app");
              setActiveTab("admin");
              toast.success("관리자 로그인 성공! 🛡️");
            } else {
              toast.error("사용자명 또는 비밀번호가 틀렸다냥!");
            }
          }} className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white font-bold text-sm rounded-2xl transition-colors shadow-md">로그인
          </button>
        </div>
        <div className="px-6 py-6">
          <button onClick={() => setAuthView("landing")} className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-2xl border border-gray-200 transition-colors">돌아가기</button>
        </div>
      </div>
    );
  }

  // === 일반 로그인/가입 화면 ===
  if (authView === "signup") {
    return (
      <div className="flex-1 flex flex-col bg-white h-full overflow-y-auto p-6">
        <button onClick={() => setAuthView("landing")} className="flex items-center gap-1 text-gray-400 text-xs font-bold mb-6"><ChevronLeft className="w-4 h-4" /> 돌아가기</button>
        
        {!isLoginMode ? (
          <>
            <div className="text-center space-y-2 mb-8"><div className="text-4xl">🐾</div><h2 className="text-xl font-black text-gray-800">나만의 감정냥이 만들기</h2><p className="text-xs text-gray-500 font-bold">닉네임과 고양이 이름을 설정하고 감정 테스트를 시작하세요냥!</p></div>
            <div className="space-y-5 flex-1">
              <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">나의 닉네임</label><input type="text" value={signupNickname} onChange={(e) => setSignupNickname(e.target.value)} placeholder="예: 드림님, 집사, 냥냥이..." className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">나의 감정냥이 이름</label><input type="text" value={signupCatName} onChange={(e) => setSignupCatName(e.target.value)} placeholder="예: 드림이, 뭉치, 나비..." className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">사용자명 (로그인 시 사용)</label><input type="text" value={generalUsername} onChange={(e) => setGeneralUsername(e.target.value)} placeholder="로그인에 사용할 사용자명" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">비밀번호</label><input type="password" value={generalPassword} onChange={(e) => setGeneralPassword(e.target.value)} placeholder="비밀번호 설정" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">비밀번호 재입력</label><input type="password" value={generalPasswordConfirm} onChange={(e) => setGeneralPasswordConfirm(e.target.value)} placeholder="비밀번호 다시 입력" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
                <h3 className="text-xs font-black text-blue-700">📋 시작 혜택</h3>
                <ul className="text-[11px] text-blue-600 font-bold space-y-1">
                  <li>✅ 감정 테스트로 나만의 감정냥이 매칭</li>
                  <li>✅ AI 냥이와 대화하기 이용</li>
                  <li>✅ 일기 작성 시 AI 맞춤 솔루션 & Lofi 음악 추천</li>
                </ul>
              </div>
            </div>
            <button onClick={() => {
              if (!signupNickname.trim()) { toast.error("닉네임을 입력해달라냥!"); return; }
              if (!generalUsername.trim()) { toast.error("사용자명을 입력해달라냥!"); return; }
              if (!generalPassword.trim()) { toast.error("비밀번호를 입력해달라냥!"); return; }
              if (generalPassword !== generalPasswordConfirm) { toast.error("비밀번호가 일치하지 않다냥!"); return; }
              
              // 사용자 계정 저장
              const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.generalUsers) || '{}');
              if (users[generalUsername]) { toast.error("이미 존재하는 사용자명이다냥!"); return; }
              users[generalUsername] = { password: generalPassword, nickname: signupNickname, catName: signupCatName, catMood: 'unfair', collectedCats: ['unfair'] };
              localStorage.setItem(STORAGE_KEYS.generalUsers, JSON.stringify(users));
              
              // 현재 사용자 저장
              localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify({ username: generalUsername, nickname: signupNickname, catName: signupCatName, catMood: 'unfair', collectedCats: ['unfair'] }));
              
              setUserName(signupNickname); setCatName(signupCatName); setAuthView("app"); setIsTestCompleted(false);
              toast.success(`환영한다냥, ${signupNickname}님! 🐾`);
            }} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl transition-colors shadow-md mt-6">가입하기냥 🐾</button>
            <button onClick={() => setIsLoginMode(true)} className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-2xl border border-gray-200 transition-colors mt-3">이미 가입한 계정으로 로그인</button>
          </>
        ) : (
          <>
            <div className="text-center space-y-2 mb-8"><div className="text-4xl">🐾</div><h2 className="text-xl font-black text-gray-800">로그인</h2><p className="text-xs text-gray-500 font-bold">기존 계정으로 로그인하세요냥</p></div>
            <div className="space-y-5 flex-1">
              <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">사용자명</label><input type="text" value={generalUsername} onChange={(e) => setGeneralUsername(e.target.value)} placeholder="사용자명 입력" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">비밀번호</label><input type="password" value={generalPassword} onChange={(e) => setGeneralPassword(e.target.value)} placeholder="비밀번호 입력" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <button onClick={() => {
              if (!generalUsername.trim() || !generalPassword.trim()) { toast.error("사용자명과 비밀번호를 입력해달라냥!"); return; }
              
              // 사용자 인증
              const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.generalUsers) || '{}');
              const user = users[generalUsername];
              if (!user || user.password !== generalPassword) { toast.error("사용자명 또는 비밀번호가 틀렸다냥!"); return; }
              
              // 현재 사용자 저장
              localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify({ username: generalUsername, ...user }));
              
              setUserName(user.nickname);
              setCatName(user.catName);
              setCatMood(user.catMood);
              setCollectedCats(user.collectedCats);
              setAuthView("app");
              setIsTestCompleted(false);
              toast.success(`로그인 성공! 데이터는 로컬에 저장된다냥! 🐾`);
            }} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl transition-colors shadow-md mt-6">로그인
            </button>
            <button onClick={() => setIsLoginMode(false)} className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-2xl border border-gray-200 transition-colors mt-3">새 계정 만들기</button>
          </>
        )}
      </div>
    );
  }

  // === 관리자 로그인 시 감정 테스트 건너뜀 ===
  if (isAdminLoggedIn && (!isTestCompleted || activeQuestions.length === 0)) {
    // 관리자는 감정 테스트 없이 바로 관리자 탭으로
    if (activeTab !== "admin") setActiveTab("admin");
  }

  // === 감정 테스트 화면 ===
  if (!isAdminLoggedIn && (!isTestCompleted || activeQuestions.length === 0)) {
    const q = activeQuestions[currentQuestionIndex] || QUESTION_BANK[0];
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-white h-full overflow-y-auto">
        <div className="text-center space-y-2 mt-6">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">감정 테스트 ({currentQuestionIndex + 1}/5)</div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-snug">나와 어울리는 감정냥이는 누구일까?</h2>
          <p className="text-xs text-gray-500 font-medium">검사할 때마다 새로운 질문지로 매번 다른 결과를 받아볼 수 있다냥!</p>
        </div>
        <div className="my-8 p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center space-y-6 shadow-sm">
          <div className="text-base font-bold text-gray-800 leading-relaxed">{q.text}</div>
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswerSelect(opt.score)} className="w-full py-4 px-5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-xs md:text-sm font-bold text-gray-700 text-left transition-all active:scale-[0.98] shadow-sm">{opt.text}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}></div></div>
          <div className="text-center text-[10px] text-gray-400 font-bold">5개의 문항을 완료하면 나만의 감정냥이를 만납니다냥!</div>
        </div>
      </div>
    );
  }

  // === 메인 앱 ===
  return (
    <div className="min-h-screen bg-white md:bg-gray-100 md:flex md:items-center md:justify-center md:p-4">
    <div className="w-full h-screen md:max-w-[430px] md:h-[860px] flex flex-col relative bg-white font-sans overflow-hidden md:rounded-3xl md:shadow-2xl">
      {/* TOP BAR */}
      <header className="px-5 py-3.5 flex items-center justify-between border-b border-gray-100 bg-white z-10">
        {isAdminLoggedIn ? (
          // 관리자 전용 헤더
          <>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <div>
                <h1 className="text-sm font-black tracking-tight text-gray-800">MIND CAT DIARY</h1>
                <p className="text-[9px] text-blue-600 font-bold">관리자 모드</p>
              </div>
            </div>
            <button onClick={() => {
              setIsAdminLoggedIn(false);
              setActiveTab("room");
              setAuthView("landing");
              toast.success("관리자 로그아웃!");
            }} className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors border border-red-200 text-xs font-bold text-red-600">로그아웃</button>
          </>
        ) : (
          // 일반 사용자 헤더
          <>
            <button onClick={() => setIsMailOpen(true)} className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
              <Mail className="w-4 h-4 text-gray-600" />
              {letters.filter(l => !l.isRead).length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">{letters.filter(l => !l.isRead).length}</span>}
            </button>
            <h1 className="text-lg font-black tracking-tight text-gray-800">MIND CAT DIARY</h1>
            <div className="flex gap-2">
              <button onClick={toggleMusic} className={`p-2 rounded-xl transition-all border ${isPlaying ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-gray-100 text-gray-600"}`}>
                <Music className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`} />
              </button>
              <button onClick={() => {
                localStorage.removeItem(STORAGE_KEYS.currentUser);
                setAuthView("landing");
                setUserName("드림님");
                setCatName("드림이");
                setCatMood("unfair");
                setCollectedCats(["unfair"]);
                setIsTestCompleted(false);
                setIsAdminLoggedIn(false);
                if (isAuthenticated) logout();
                toast.success("로그아웃 됐다냥!");
              }} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-xs font-bold text-gray-600">로그아웃</button>
            </div>
          </>
        )}
      </header>

      {/* TOP STATUS BAR - 관리자 로그인 시 숨김 */}
      {!isAdminLoggedIn && (
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isAuthenticated && <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">로그인됨</span>}
            {isPremium && <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">프리미엄</span>}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-white relative">
        
        {/* 고양이 방 탭 */}
        {activeTab === "room" && (
          <div className="p-5 space-y-5 h-full flex flex-col justify-between min-h-[460px]">
            {/* 게임 섹션 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-blue-300 rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-blue-100 text-center cursor-pointer hover:shadow-lg transition-all" onClick={() => adminSettings.gameLinks.mindBlock && window.open(adminSettings.gameLinks.mindBlock, '_blank')}>
                <div className="text-4xl mb-2">🧠</div>
                <h3 className="font-bold text-xs text-gray-800 mb-1">마인드 블럭</h3>
                <p className="text-[8px] text-gray-600 font-bold">동동동 마을 단련다냥</p>
              </div>
              <div className="border-2 border-purple-300 rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-purple-100 text-center cursor-pointer hover:shadow-lg transition-all" onClick={() => adminSettings.gameLinks.musicListen && window.open(adminSettings.gameLinks.musicListen, '_blank')}>
                <div className="text-4xl mb-2">🎵</div>
                <h3 className="font-bold text-xs text-gray-800 mb-1">나만의 감성 음악</h3>
                <p className="text-[8px] text-gray-600 font-bold">로파이로 마음 다루다냥</p>
              </div>
            </div>
            
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[320px]">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3.5 text-center font-bold text-xs text-blue-600 leading-relaxed relative shadow-sm" style={{opacity: '0'}}>
                  📢 {catName}의 오늘 안부: {dailyCatMessage}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-50/50 border-r border-b border-blue-100 rotate-45"></div>
                </div>
              </div>
            </div>

            <div className={`flex-1 min-h-[280px] max-h-[340px] rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner ${getRoomBg()}`} style={{marginBottom: '26px', marginTop: '-39px', paddingRight: '26px'}}>
              <div className="absolute inset-0 pointer-events-none">
              </div>

              <div className="relative z-10 flex flex-col items-center cursor-pointer group" onClick={() => { playMeow(); setBubbleText(`나를 터치해줘서 고맙다냥! [${CAT_CHARACTERS[catMood].name}]인 나는 언제나 드림님 편이다냥! 💕`); }}>
                <div className="bg-gray-800 text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap border border-gray-700 shadow-sm mb-2 z-20">
                  {catName} ({CAT_CHARACTERS[catMood].name.split(" ")[0]})
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/5 rounded-full blur-sm"></div>
                <img src={CAT_CHARACTERS[catMood].image} alt={CAT_CHARACTERS[catMood].name} className="w-48 h-48 object-contain relative z-10 transition-transform group-hover:-translate-y-1.5 duration-300" />
              </div>
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              <button onClick={() => { setActiveTab("chat"); setBubbleText("무슨 재밋는 이야기를 들려줄 거냥? 🐾"); }} className="flex items-center gap-1 px-4 py-3 bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-600 transition-colors"><MessageSquare className="w-4 h-4" /> 대화하기</button>
              <button onClick={() => handleShare()} className="flex items-center gap-1 px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors">
                {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />} 공유
              </button>
              {!todayTestDone ? (
                <button onClick={() => { setIsTestCompleted(false); setActiveQuestions(pickRandomQuestions()); }} className="flex items-center gap-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors">🎴 오늘의 감정 테스트</button>
              ) : (
                <button disabled className="flex items-center gap-1 px-4 py-3 bg-gray-200 text-gray-400 font-bold text-xs rounded-xl shadow-sm cursor-not-allowed">✅ 오늘 테스트 완료</button>
              )}
            </div>

            {/* 카드 결과 모달 */}
            {showCardResult && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-xs bg-white rounded-3xl p-6 text-center space-y-4 animate-in fade-in zoom-in">
                  <p className="text-xs font-bold text-gray-400">오늘의 감정 카드</p>
                  <div className="text-5xl">{CAT_CHARACTERS[catMood].emoji}</div>
                  <img src={CAT_CHARACTERS[catMood].image} alt="" className="w-32 h-32 mx-auto object-contain" />
                  <h3 className="text-lg font-black text-gray-800">{CAT_CHARACTERS[catMood].name}</h3>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">{CAT_CHARACTERS[catMood].description}</p>
                  <p className="text-xs text-blue-500 font-bold italic">"{CAT_CHARACTERS[catMood].quote}"</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowCardResult(false)} className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors">확인</button>
                    <button onClick={() => { setShowCardResult(false); handleShare(); }} className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl transition-colors">공유하기</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 대화 탭 */}
        {activeTab === "chat" && (
          <div className="p-5 space-y-4 h-full flex flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "cat" && <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-2 shrink-0"><img src={CAT_CHARACTERS[catMood].image} alt="" className="w-5 h-5 object-contain" /></div>}
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-bold leading-relaxed ${msg.sender === "user" ? "bg-blue-500 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>{msg.text}</div>
                </div>
              ))}
              {isChatLoading && <div className="flex justify-start"><div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-2"><img src={CAT_CHARACTERS[catMood].image} alt="" className="w-5 h-5 object-contain" /></div><div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm"><div className="flex gap-1"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div></div></div></div>}
            </div>
            <div className="flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && chatInput.trim()) { const userMsg = { id: Date.now().toString(), sender: "user" as const, text: chatInput }; setChatMessages(prev => [...prev, userMsg]); setChatInput(""); setIsChatLoading(true); setTimeout(() => { const responses = [`${userName}님의 이야기를 들으니 마음이 따뜻해진다냥 🐾`, `그런 감정을 느끼는 건 당연하다냥. 드림님은 혼자가 아니다냥 💕`, `${CAT_CHARACTERS[catMood].quote}`, `힘든 시간도 반드시 지나갈 거다냥. 내가 항상 곁에 있을게냥 🌸`]; setChatMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: "cat", text: responses[Math.floor(Math.random() * responses.length)] }]); setIsChatLoading(false); }, 1200); } }} placeholder="냥이에게 말해주기..." className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => { if (!chatInput.trim()) return; const userMsg = { id: Date.now().toString(), sender: "user" as const, text: chatInput }; setChatMessages(prev => [...prev, userMsg]); setChatInput(""); setIsChatLoading(true); setTimeout(() => { const responses = [`${userName}님의 이야기를 들으니 마음이 따뜻해진다냥 🐾`, `그런 감정을 느끼는 건 당연하다냥. 드림님은 혼자가 아니다냥 💕`, `${CAT_CHARACTERS[catMood].quote}`, `힘든 시간도 반드시 지나갈 거다냥. 내가 항상 곁에 있을게냥 🌸`]; setChatMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: "cat", text: responses[Math.floor(Math.random() * responses.length)] }]); setIsChatLoading(false); }, 1200); }} className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* 달력 탭 */}
        {activeTab === "calendar" && (
          <div className="p-5 space-y-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
              <button onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); } else { setCalendarMonth(calendarMonth - 1); } }} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
              <h2 className="text-lg font-black text-gray-800">{calendarYear}년 {calendarMonth + 1}월</h2>
              <button onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); } else { setCalendarMonth(calendarMonth + 1); } }} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {["일", "월", "화", "수", "목", "금", "토"].map(day => (
                <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1">{day}</div>
              ))}
              {generateCalendarDays()}
            </div>

            {/* 선택된 날짜 일기 */}
            {diaries[selectedDateStr] ? (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{diaries[selectedDateStr].mood.split(" ")[0]}</span>
                    <div><p className="text-xs font-black text-gray-800">{selectedDateStr}</p><p className="text-[10px] text-gray-500">{diaries[selectedDateStr].mood}</p></div>
                  </div>
                  <button onClick={() => { const nd = { ...diaries }; delete nd[selectedDateStr]; setDiaries(nd); localStorage.setItem(STORAGE_KEYS.userDiaries, JSON.stringify(nd)); toast.success("일기가 삭제됐다냥!"); }} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 mb-1">오늘의 감성</p><p className="text-xs font-bold text-gray-700">{diaries[selectedDateStr].title}</p></div>
                {diaries[selectedDateStr].daily && <div className="p-3 bg-white rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 mb-1">오늘의 일상</p><p className="text-xs font-bold text-gray-700">{diaries[selectedDateStr].daily}</p></div>}
                {diaries[selectedDateStr].thanks && <div className="p-3 bg-white rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 mb-1">오늘의 감사</p><p className="text-xs font-bold text-gray-700">{diaries[selectedDateStr].thanks}</p></div>}
                {diaries[selectedDateStr].solution && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-500 mb-1">🐾 AI 냥이의 분석</p>
                    <p className="text-xs font-bold text-gray-700 mb-2">{diaries[selectedDateStr].solution!.tip}</p>
                    {diaries[selectedDateStr].solution!.steps.map((step, i) => <p key={i} className="text-[10px] text-gray-600 font-bold">• {step}</p>)}
                    <p className="text-[10px] text-blue-500 font-bold mt-1.5">🎵 추천 음악: {diaries[selectedDateStr].solution!.music}</p>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setIsDiaryOpen(true)} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-bold text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> {selectedDateStr} 일기 쓰기</button>
            )}

            {/* 일기 작성 모달 */}
            {isDiaryOpen && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between"><h3 className="font-black text-gray-800 text-sm">{selectedDateStr} 일기</h3><button onClick={() => setIsDiaryOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button></div>
                  <div><label className="text-[10px] font-bold text-gray-500 mb-1.5 block">오늘의 감정</label><div className="grid grid-cols-4 gap-1.5">{["😊 기쁨", "😢 슬픔", "😴 피곤", "😰 불안", "🥺 외로움", "😡 화남", "🥰 사랑", "😌 편안"].map(m => (<button key={m} onClick={() => setDiaryMood(m)} className={`py-2 rounded-xl text-xs font-bold transition-all ${diaryMood === m ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>{m.split(" ")[0]}</button>))}</div></div>
                  <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">오늘의 감성 <span className="text-red-400">*</span></label><textarea value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} placeholder="오늘 어떤 감정을 느꼈나요?" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
                  <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">오늘의 일상</label><textarea value={diaryDaily} onChange={(e) => setDiaryDaily(e.target.value)} placeholder="오늘 있었던 일을 기록해보세요" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
                  <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">오늘의 감사</label><textarea value={diaryThanks} onChange={(e) => setDiaryThanks(e.target.value)} placeholder="오늘 감사했던 일을 적어보세요" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
                  <button onClick={async () => { if (!diaryTitle.trim()) { toast.error("감성을 입력해달라냥!"); return; } setIsAnalyzing(true); await new Promise(r => setTimeout(r, 1500)); const solution = generateDiarySolution(diaryTitle, diaryMood, diaryThanks); const newDiaries = { ...diaries, [selectedDateStr]: { mood: diaryMood, title: diaryTitle, daily: diaryDaily, thanks: diaryThanks, solution } }; setDiaries(newDiaries); localStorage.setItem(STORAGE_KEYS.userDiaries, JSON.stringify(newDiaries)); setIsAnalyzing(false); setIsDiaryOpen(false); setDiaryTitle(""); setDiaryDaily(""); setDiaryThanks(""); setDiaryMood("😊 기쁨"); toast.success("일기가 저장됐다냥! AI가 분석해줬다냥 🐾"); }} disabled={isAnalyzing} className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl transition-colors disabled:opacity-50">{isAnalyzing ? "AI가 분석 중이다냥... 🐾" : "저장하기"}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 커뮤니티 탭 */}
        {activeTab === "community" && (
          <div className="p-5 space-y-4 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-black text-gray-800">마음 숲</h2>
              <button onClick={() => setIsWritingPost(true)} className="ml-auto p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"><Plus className="w-4 h-4" /></button>
            </div>

            {/* 글 작성 */}
            {isWritingPost && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="오늘 마음 속 이야기를 나눠보세요냥..." rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => { if (!newPostContent.trim()) return; const newPost: FeedPost = { id: Date.now().toString(), author: userName, avatar: CAT_CHARACTERS[catMood].emoji, content: newPostContent, date: new Date().toISOString(), likes: 0, likedByMe: false, comments: [] }; const updated = [newPost, ...feedPosts]; setFeedPosts(updated); localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated)); setNewPostContent(""); setIsWritingPost(false); toast.success("마음 숲에 글을 남겼다냥 🌳"); }} className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl">게시하기</button>
                  <button onClick={() => { setIsWritingPost(false); setNewPostContent(""); }} className="flex-1 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl">취소</button>
                </div>
              </div>
            )}

            {feedPosts.map(post => (
              <div key={post.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold">{post.avatar}</div>
                    <div><p className="text-xs font-bold text-gray-800">{post.author}</p><p className="text-[10px] text-gray-500">{new Date(post.date).toLocaleDateString("ko-KR")}</p></div>
                  </div>
                  {post.author === userName && <button onClick={() => { const updated = feedPosts.filter(p => p.id !== post.id); setFeedPosts(updated); localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated)); toast.success("글이 삭제됐다냥!"); }} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3 h-3 text-red-400" /></button>}
                </div>
                <p className="text-sm text-gray-700 font-bold">{post.content}</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => { const updated = feedPosts.map(p => p.id === post.id ? { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe } : p); setFeedPosts(updated); }} className={`flex items-center gap-1 text-xs font-bold transition-colors ${post.likedByMe ? "text-pink-500" : "text-gray-400 hover:text-pink-400"}`}><Heart className={`w-3 h-3 ${post.likedByMe ? "fill-current" : ""}`} /> {post.likes}</button>
                  <span className="text-xs text-gray-300 font-bold flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments.length}</span>
                </div>
                {/* 댓글 */}
                {post.comments.length > 0 && (
                  <div className="pt-2 border-t border-gray-100 space-y-1.5">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600 shrink-0">{c.author[0]}</div>
                        <div className="flex-1"><span className="text-[10px] font-black text-gray-700 mr-1">{c.author}</span><span className="text-[10px] text-gray-600">{c.text}</span></div>
                        {c.author === userName && <button onClick={() => { const updated = feedPosts.map(p => p.id === post.id ? { ...p, comments: p.comments.filter(cm => cm.id !== c.id) } : p); setFeedPosts(updated); localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated)); }} className="p-0.5 rounded hover:bg-red-50"><Trash2 className="w-2.5 h-2.5 text-red-400" /></button>}
                      </div>
                    ))}
                  </div>
                )}
                {/* 댓글 입력 */}
                <div className="flex gap-2 pt-1">
                  <input type="text" value={newCommentText[post.id] || ""} onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter" && (newCommentText[post.id] || "").trim()) { const updated = feedPosts.map(p => p.id === post.id ? { ...p, comments: [...p.comments, { id: Date.now().toString(), author: userName, text: newCommentText[post.id], date: new Date().toISOString() }] } : p); setFeedPosts(updated); localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated)); setNewCommentText({ ...newCommentText, [post.id]: "" }); } }} placeholder="댓글 달기..." className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-200 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <button onClick={() => { if (!(newCommentText[post.id] || "").trim()) return; const updated = feedPosts.map(p => p.id === post.id ? { ...p, comments: [...p.comments, { id: Date.now().toString(), author: userName, text: newCommentText[post.id], date: new Date().toISOString() }] } : p); setFeedPosts(updated); localStorage.setItem(STORAGE_KEYS.userFeedPosts, JSON.stringify(updated)); setNewCommentText({ ...newCommentText, [post.id]: "" }); }} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"><Send className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 리포트 탭 */}
        {activeTab === "report" && (
          <div className="p-5 space-y-5 h-full overflow-y-auto">
            <h2 className="text-lg font-black text-gray-800">월간 감정 분석</h2>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={[
                    { name: "기쁨", value: 30, fill: "#60A5FA" },
                    { name: "슬픔", value: 20, fill: "#93C5FD" },
                    { name: "피곤", value: 25, fill: "#F9A8D4" },
                    { name: "불안", value: 15, fill: "#FCA5A5" },
                    { name: "외로움", value: 10, fill: "#C4B5FD" }
                  ]} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {[].map((entry, index) => <Cell key={`cell-${index}`} fill="#8884d8" />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* 상담 광고 섹션 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 text-center space-y-3">
              <h3 className="font-bold text-sm text-gray-800">💬 {adminSettings.ads.bannerText}</h3>
              <button onClick={() => window.open(adminSettings.ads.bannerLink, '_blank')} className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl transition-colors">상담 예약하기</button>
            </div>
          </div>
        )}

        {/* 도감 탭 */}
        {activeTab === "dex" && (
          <div className="p-5 space-y-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-800">감정냥이 도감</h2>
              <span className="text-xs font-bold text-gray-400">{collectedCats.length}/{Object.keys(CAT_CHARACTERS).length}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(CAT_CHARACTERS) as MoodType[]).map(mood => {
                const cat = CAT_CHARACTERS[mood];
                const isUnlocked = collectedCats.includes(mood);
                return (
                  <button key={mood} onClick={() => isUnlocked && setSelectedDexCat(mood)} className={`p-3 rounded-2xl border-2 text-left transition-all ${isUnlocked ? "bg-blue-50 border-blue-300 hover:shadow-md active:scale-[0.98]" : "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <img src={cat.image} alt={cat.name} className={`w-12 h-12 object-contain ${!isUnlocked ? "grayscale" : ""}`} />
                      <div>
                        <p className="text-[10px] font-black text-gray-800">{cat.name.split(" ")[0]}</p>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${cat.rarity === "legendary" ? "bg-amber-100 text-amber-600" : cat.rarity === "rare" ? "bg-pink-100 text-pink-600" : cat.rarity === "uncommon" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>{cat.rarityLabel}</span>
                      </div>
                    </div>
                    {isUnlocked ? <p className="text-[9px] text-gray-500 font-bold line-clamp-2">{cat.description}</p> : <p className="text-[9px] text-gray-400 font-bold">🔒 미수집</p>}
                  </button>
                );
              })}
            </div>

            {/* 도감 상세 모달 */}
            {selectedDexCat && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between"><h3 className="font-black text-gray-800 text-sm">{CAT_CHARACTERS[selectedDexCat].name}</h3><button onClick={() => setSelectedDexCat(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button></div>
                  <div className="flex items-center gap-4">
                    <img src={CAT_CHARACTERS[selectedDexCat].image} alt="" className="w-24 h-24 object-contain" />
                    <div className="flex-1 space-y-1.5">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${CAT_CHARACTERS[selectedDexCat].rarity === "legendary" ? "bg-amber-100 text-amber-600" : CAT_CHARACTERS[selectedDexCat].rarity === "rare" ? "bg-pink-100 text-pink-600" : CAT_CHARACTERS[selectedDexCat].rarity === "uncommon" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>{CAT_CHARACTERS[selectedDexCat].rarityLabel}</span>
                      <p className="text-xs text-gray-600 font-bold leading-relaxed">{CAT_CHARACTERS[selectedDexCat].description}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-1"><p className="text-[10px] font-bold text-gray-400">특기</p><p className="text-xs text-gray-700 font-bold">{CAT_CHARACTERS[selectedDexCat].specialty}</p></div>
                  <div className="bg-blue-50 rounded-xl p-3"><p className="text-xs text-blue-600 font-bold italic">"{CAT_CHARACTERS[selectedDexCat].quote}"</p></div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                    <p className="text-[10px] font-bold text-gray-500 mb-2">🎵 어울리는 로파이 음악</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-700">{CAT_CHARACTERS[selectedDexCat].lofiMusic.title}</p>
                      <button onClick={() => { const audio = new Audio(CAT_CHARACTERS[selectedDexCat!].lofiMusic.url); audio.play().catch(() => toast.error("음악 재생에 실패했다냥")); toast.success("음악 재생 중! 🎵"); }} className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-[10px] rounded-lg transition-colors">▶ 재생</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 관리자 탭 */}
        {activeTab === "admin" && isAdminLoggedIn && (
          <div className="flex-1 overflow-hidden h-full">
            <AdminEditor />
          </div>
        )}
      </main>

      {/* 편지함 모달 */}
      {isMailOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex flex-col">
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="font-black text-gray-800 text-sm">📮 {catName}의 편지함</h2>
              <button onClick={() => setIsMailOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-2">
              {letters.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-2">📭</p>
                  <p className="text-sm font-bold text-gray-500">아직 편지가 없다냥!</p>
                  <p className="text-xs text-gray-400 font-bold mt-1">매일 감정냥이가 편지를 보내줄 거다냥 🐾</p>
                </div>
              ) : letters.map(letter => (
                <div key={letter.id} className={`p-4 rounded-2xl border text-left transition-all ${letter.isRead ? "bg-white border-gray-100" : "bg-blue-50 border-blue-200"}`}>
                  <div className="flex items-center gap-3">
                    <img src={CAT_CHARACTERS[catMood].image} alt="" className="w-10 h-10 object-contain shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-gray-800">{catName}의 편지</p>
                        {!letter.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold">{letter.date}</p>
                      <p className="text-xs text-gray-600 font-bold mt-1 leading-relaxed">{letter.content}</p>
                    </div>
                  </div>
                  {!letter.isRead && (
                    <button onClick={() => { const updated = letters.map(l => l.id === letter.id ? { ...l, isRead: true } : l); setLetters(updated); localStorage.setItem('mindcat_cat_letters', JSON.stringify(updated)); }} className="mt-2 ml-13 text-[10px] font-bold text-blue-500 hover:text-blue-600">읽음 표시</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="px-3 py-2.5 bg-white border-t border-gray-100 flex gap-1 justify-between shrink-0">
        {isAdminLoggedIn ? (
          // 관리자 로그인 시: 관리자 탭만 표시
          <button onClick={() => setActiveTab("admin")} className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] transition-all ${activeTab === "admin" ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>🛡️ 관리자</button>
        ) : (
          // 일반 로그인 시: 기존 탭 모두 표시
          [
            { tab: "room", label: "🏠 홈" },
            { tab: "chat", label: "💬 대화" },
            { tab: "calendar", label: "📅 달력" },
            { tab: "community", label: "🌳 마음숲" },
            { tab: "report", label: "📊 리포트" },
            { tab: "dex", label: "📖 도감" },
          ].map(({ tab, label }) => (
            <button key={tab} onClick={() => setActiveTab(tab as typeof activeTab)} className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] transition-all ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>{label}</button>
          ))
        )}
      </nav>
    </div>
    </div>
  );
}
