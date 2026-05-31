import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { 
  MessageSquare, Calendar as CalendarIcon, Settings, Mail, Send, Plus,
  ChevronLeft, ChevronRight, Heart, Trash2, X, Music, ShoppingBag, Users,
  Shield, MessageCircle, TrendingUp, ExternalLink, CreditCard, LogIn,
  UserPlus, BarChart2, BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { MoodType, CAT_CHARACTERS, SHOP_ITEMS, ShopItem, ScheduleEvent, FeedPost, QUESTION_BANK } from "../lib/types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import Dex from "./Dex";

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

  // --- 앱 뷰 상태 ---
  const [authView, setAuthView] = useState<"landing" | "signup" | "app">("landing");
  const [signupNickname, setSignupNickname] = useState("");
  const [signupCatName, setSignupCatName] = useState("드림이");

  // --- 심리테스트 ---
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<typeof QUESTION_BANK>([]);
  const [testCount, setTestCount] = useState(0); // 심리테스트 진행 횟수
  const [isTestPayConfirmOpen, setIsTestPayConfirmOpen] = useState(false); // 사과 차감 확인 모달
  const [testScores, setTestScores] = useState<Record<MoodType, number>>({
    unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0, depressed: 0,
    excited: 0, scared: 0, proud: 0, curious: 0, guilty: 0, relaxed: 0
  });

  // --- 기본 상태 ---
  const [activeTab, setActiveTab] = useState<"room" | "chat" | "calendar" | "community" | "report" | "dex" | "admin">("room");
  // 수집된 냥이 목록 (심리테스트 결과로 해금)
  const [collectedCats, setCollectedCats] = useState<MoodType[]>(["unfair"]);  // 기본 억울냥은 항상 수집됨
  const [catMood, setCatMood] = useState<MoodType>("unfair");
  const [userName, setUserName] = useState("드림님");
  const [catName, setCatName] = useState("드림이");
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(20);
  const maxExp = 100;
  const [apples, setApples] = useState(5);
  const [isPremium, setIsPremium] = useState(false);
  const [isLevelUpGlowing, setIsLevelUpGlowing] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  // --- 꾸미기 ---
  const [myItems, setMyItems] = useState<string[]>(["f3"]);
  const [equippedItems, setEquippedItems] = useState<string[]>(["f3"]);
  const [currentWallpaper, setCurrentWallpaper] = useState<string>("default");
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  // --- 음악 ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<{ title: string; url: string }>(LOFI_PLAYLIST.default);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- 달력 ---
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 15));
  const [selectedDateStr, setSelectedDateStr] = useState("2026-02-18");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputMood, setInputMood] = useState("기쁨 😊");
  const [inputThanks, setInputThanks] = useState("");
  const [localEvents, setLocalEvents] = useState<ScheduleEvent[]>([
    { id: "e1", date: "2026-02-18", title: "광고주와 미팅", mood: "불안 - 미팅이 잘 될까 불안하다", thanks: "도와주는 동료들이 있어 감사하다" }
  ]);

  // --- AI 냥이와 대화하기 ---
  const [chatInput, setChatInput] = useState("");
  const [bubbleText, setBubbleText] = useState("드림아 좋은 아침! 오늘 기분은 어때냥?");
  const [messages, setMessages] = useState<{ id: string; sender: "user" | "cat"; text: string; timestamp: string }[]>([
    { id: "m1", sender: "cat", text: "안녕 드림님! 오늘 하루는 어땠어냥? 무슨 일이든 나한테 다 털어놓으라냥! 🐾", timestamp: "10:00" }
  ]);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- 커뮤니티 ---
  const [isCommunityWriteOpen, setIsCommunityWriteOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    { id: "p1", author: "냥이집사3호", authorLevel: 5, avatar: "/manus-storage/unfair_cat_bb093496.png", content: "오늘 드림이랑 대화하다가 레벨업했어냥! 사과 3개 받아서 바로 선글라스 사줬는데 너무 힙하고 귀엽지 않냐냥? 😎🍎", likes: 12, likedByMe: false, comments: [{ id: "c1", author: "초보집사", text: "우와 부럽다냥! 선글라스 너무 잘 어울린다냥!", date: "10분 전" }], date: "30분 전", hasBestBadge: true },
    { id: "p2", author: "행복한하루", authorLevel: 3, avatar: "/manus-storage/lonely_cat_dbdd7a45.png", content: "달력에 감사일기 매일 쓰니까 마음이 한결 편안해지는 것 같다냥. 🌸✨", likes: 8, likedByMe: true, comments: [{ id: "c3", author: "냥이집사3호", text: "맞아요냥! 마음의 숲을 가꾸는 느낌이다냥.", date: "15분 전" }], date: "1시간 전", hasBestBadge: false }
  ]);

  // --- 관리자 ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adText, setAdText] = useState("🍎 맛있는 유기농 청송 사과 1+1 한정 특가 세일!");
  const [adLink, setAdLink] = useState("https://example.com");
  const [dailyCatMessage, setDailyCatMessage] = useState("오늘 하루도 무사히 마쳐서 너무 다행이다냥. 맛있는 저녁 먹기냥! 🐾");

  // --- 감정 리포트 ---
  const [reportYear, setReportYear] = useState(2026);
  const [reportMonth, setReportMonth] = useState(2);

  // --- tRPC 훅 ---
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const createDiaryMutation = trpc.diary.create.useMutation();
  const createCheckout = trpc.payment.createCheckout.useMutation();
  const updateProfileMutation = trpc.profile.update.useMutation();
  const profileQuery = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });
  const reportQuery = trpc.report.monthly.useQuery({ year: reportYear, month: reportMonth }, { enabled: activeTab === "report" && isAuthenticated });

  // 초기화
  useEffect(() => {
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, 10));
  }, []);

  useEffect(() => {
    const msgs = [
      "오늘도 수고 많았다냥! 따뜻한 차 한잔하면서 피로를 날려버리자냥. 🍵",
      "드림님, 혹시 오늘 억울하거나 힘든 일이 있었다면 나한테 다 말해달라냥! 🐾",
      "드림님의 마음은 항상 내가 곁에서 따뜻하게 지켜주고 있다냥. 💖",
      "하아암... 오늘 밤엔 포근하게 꿀잠 자고 좋은 꿈 꾸기냥! 😴💤",
      "사소한 일에도 기뻐할 줄 아는 드림님은 정말 소중하고 예쁜 존재다냥. ✨"
    ];
    setDailyCatMessage(msgs[Math.floor(Math.random() * msgs.length)]);
  }, [activeTab]);

  // OAuth 로그인 후 프로필 동기화
  useEffect(() => {
    if (isAuthenticated && profileQuery.data) {
      const p = profileQuery.data;
      if (p.nickname) setUserName(p.nickname);
      if (p.catName) setCatName(p.catName);
      if (p.catMood) setCatMood(p.catMood as MoodType);
      if (p.level) setLevel(p.level);
      if (p.exp !== undefined) setExp(p.exp);
      if (p.apples !== undefined) setApples(p.apples);
      if (p.isPremium) setIsPremium(!!p.isPremium);
      if (authView === "landing") { setAuthView("app"); setIsTestCompleted(true); }
    }
  }, [isAuthenticated, profileQuery.data]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 결제 성공 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      const productId = params.get("product") || "";
      let newApples = apples;
      if (productId === "apple_small") { newApples += 10; toast.success("사과 10개가 충전되었다냥! 🍎"); }
      else if (productId === "apple_medium") { newApples += 30; toast.success("사과 30개가 충전되었다냥! 🍎🍎🍎"); }
      else if (productId === "apple_large") { newApples += 100; toast.success("사과 100개가 충전되었다냥! 🎁"); }
      else if (productId === "premium_monthly") { setIsPremium(true); newApples += 50; toast.success("프리미엄 집사 멤버십이 활성화되었다냥! 👑"); }
      setApples(newApples);
      if (isAuthenticated) updateProfileMutation.mutate({ apples: newApples, isPremium: productId === "premium_monthly" ? 1 : undefined });
      window.history.replaceState({}, "", "/");
    }
  }, []);

  // 음악 재생
  useEffect(() => {
    audioRef.current = new Audio(currentMusic.url);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, [currentMusic]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); toast.info("음악을 일시정지했다냥 🎵"); }
    else { audioRef.current.play().then(() => { setIsPlaying(true); toast.success(`🎶 현재 재생중: ${currentMusic.title}`); }).catch(() => toast.error("음악 재생에 실패했다냥!")); }
  };

  // 경험치 획득
  const gainExp = (amount: number, actionType: string) => {
    setExp(prev => {
      const nextExp = prev + amount;
      if (nextExp >= maxExp) {
        setIsLevelUpGlowing(true);
        setTimeout(() => setIsLevelUpGlowing(false), 3000);
        setLevel(l => {
          const nextLvl = l + 1;
          setApples(a => {
            const newApples = a + 3;
            if (isAuthenticated) updateProfileMutation.mutate({ level: nextLvl, exp: nextExp - maxExp, apples: newApples });
            return newApples;
          });
          setIsLevelUpModalOpen(true);
          return nextLvl;
        });
        return nextExp - maxExp;
      }
      toast.info(`🐾 ${actionType} 완료! EXP +${amount} 획득했다냥.`);
      if (isAuthenticated) updateProfileMutation.mutate({ exp: nextExp });
      return nextExp;
    });
  };

  // 심리테스트
  const handleAnswerSelect = (score: Partial<Record<MoodType, number>>) => {
    setTestScores(prev => {
      const updated = { ...prev };
      (Object.keys(score) as MoodType[]).forEach(key => { updated[key] = (updated[key] || 0) + (score[key] || 0); });
      return updated;
    });
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < activeQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      let maxScore = -1;
      let selectedCat: MoodType = "unfair";
      (Object.keys(testScores) as MoodType[]).forEach(key => { if (testScores[key] > maxScore) { maxScore = testScores[key]; selectedCat = key; } });
      setCatMood(selectedCat);
      setIsTestCompleted(true);
      // 심리테스트 결과 냥이를 도감에 추가
      setCollectedCats(prev => prev.includes(selectedCat) ? prev : [...prev, selectedCat]);
      setMessages([{ id: "m1", sender: "cat", text: `안녕 드림님! 나는 심리테스트로 매칭된 드림님의 평생 단짝 [${CAT_CHARACTERS[selectedCat].name}]이다냥! 오늘 하루는 어땠어냥? 🐾`, timestamp: "10:00" }]);
      setBubbleText(`안녕 드림님! 나는 [${CAT_CHARACTERS[selectedCat].name}]이다냥!`);
      if (isAuthenticated) updateProfileMutation.mutate({ catMood: selectedCat });
      toast.success(`🎉 심리테스트 완료! [${CAT_CHARACTERS[selectedCat].name}]가 매칭되었다냥!`);
      // 레벨 조건에 따른 추가 냥이 해금
      if (level >= 3 && !collectedCats.includes("shocked")) setCollectedCats(prev => [...prev, "shocked"]);
      if (level >= 5 && !collectedCats.includes("excited")) setCollectedCats(prev => [...prev, "excited"]);
      if (level >= 7 && !collectedCats.includes("proud")) setCollectedCats(prev => [...prev, "proud"]);
    }
  };

  // AI 냥이와 대화하기 (GPT 연동)
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userText, timestamp: timeStr }]);
    setChatInput("");
    gainExp(15, "냥이와 대화하기");

    if (isAuthenticated) {
      // 실제 AI 대화 (GPT)
      try {
        const result = await sendMessageMutation.mutateAsync({
          message: userText,
          catName,
          catMood,
          history: chatHistory.slice(-10)
        });
        const catReply = result.reply;
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "cat", text: catReply, timestamp: timeStr }]);
        setBubbleText(catReply);
        setChatHistory(prev => [...prev, { role: "user", content: userText }, { role: "assistant", content: catReply }]);
      } catch {
        const fallback = `그렇구냥! [${CAT_CHARACTERS[catMood].name}]이는 드림님의 모든 이야기를 다 기억하고 싶다냥. 편하게 더 얘기해달라냥! 🐾`;
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "cat", text: fallback, timestamp: timeStr }]);
        setBubbleText(fallback);
      }
    } else {
      // 비로그인 시 로컬 규칙 기반 대화
      setTimeout(() => {
        const lower = userText.toLowerCase();
        let catReply = `그렇구냥! [${CAT_CHARACTERS[catMood].name}]이는 드림님의 모든 이야기를 다 기억하고 싶다냥. 🐾`;
        if (lower.includes("안녕")) catReply = `안녕 드림님! [${CAT_CHARACTERS[catMood].name}]이 반갑게 손을 흔든다냥! ☀️`;
        else if (lower.includes("슬퍼") || lower.includes("힘들")) catReply = `많이 힘들었겠다냥... 토닥토닥. 내가 곁에서 따뜻하게 안아줄 테니 걱정 말라냥 🐾❤️`;
        else if (lower.includes("행복") || lower.includes("기뻐")) catReply = `우와냥! 드림님이 행복하다니 나도 꼬리가 살랑살랑 춤을 춘다냥! 🍎⚡`;
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "cat", text: catReply, timestamp: timeStr }]);
        setBubbleText(catReply);
      }, 1000);
    }
  };

  // 일기 추가 (AI 솔루션 + Lofi 추천)
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) { toast.error("일기 제목을 입력해 달라냥!"); return; }

    let solution = "";
    let musicRecommendation = LOFI_PLAYLIST.default.title;

    if (isAuthenticated) {
      try {
        const result = await createDiaryMutation.mutateAsync({ date: selectedDateStr, title: inputTitle, mood: inputMood, thanks: inputThanks });
        solution = result?.solution || "";
        musicRecommendation = result?.musicRecommendation || LOFI_PLAYLIST.default.title;
      } catch {
        const fallback = generateDiarySolution(inputTitle, inputMood, inputThanks);
        solution = fallback.tip;
        musicRecommendation = LOFI_PLAYLIST[fallback.music]?.title || LOFI_PLAYLIST.default.title;
      }
    } else {
      const fallback = generateDiarySolution(inputTitle, inputMood, inputThanks);
      solution = fallback.tip;
      musicRecommendation = LOFI_PLAYLIST[fallback.music]?.title || LOFI_PLAYLIST.default.title;
      gainExp(30, "마음 일기 작성");
    }

    setLocalEvents(prev => [...prev, {
      id: Date.now().toString(),
      date: selectedDateStr,
      title: inputTitle,
      mood: inputMood,
      thanks: inputThanks,
      customSolution: solution,
      customMusicRecommendation: musicRecommendation
    }]);
    setIsAddEventOpen(false);
    setInputTitle("");
    setInputThanks("");

    // 감정에 맞는 음악 재생
    const moodKey = Object.keys(LOFI_PLAYLIST).find(k => musicRecommendation.includes(k.split(" ")[0]));
    const musicToPlay = moodKey ? LOFI_PLAYLIST[moodKey] : LOFI_PLAYLIST.default;
    setCurrentMusic(musicToPlay);
    toast.success(`🎵 일기에 어울리는 [${musicToPlay.title}]을 재생한다냥!`);
  };

  // 상점 아이템 구매
  const handleBuyItem = (item: ShopItem) => {
    if (myItems.includes(item.id)) {
      if (equippedItems.includes(item.id)) {
        setEquippedItems(prev => prev.filter(id => id !== item.id));
        if (item.category === "wallpaper") setCurrentWallpaper("default");
        toast.info(`${item.name} 장착을 해제했다냥.`);
      } else {
        if (item.category === "wallpaper") { setEquippedItems(prev => [...prev.filter(id => SHOP_ITEMS.find(si => si.id === id)?.category !== "wallpaper"), item.id]); setCurrentWallpaper(item.id); }
        else setEquippedItems(prev => [...prev, item.id]);
        toast.success(`${item.name}을(를) 방에 장착했다냥! 🛋️`);
      }
    } else {
      if (apples < item.price) { toast.error("사과가 부족하다냥! 상점에서 사과를 충전하거나 레벨업 보상을 받아오라냥 🍎"); return; }
      setApples(prev => { const newVal = prev - item.price; if (isAuthenticated) updateProfileMutation.mutate({ apples: newVal }); return newVal; });
      setMyItems(prev => [...prev, item.id]);
      setEquippedItems(prev => [...prev, item.id]);
      if (item.category === "wallpaper") setCurrentWallpaper(item.id);
      toast.success(`${item.name}을(를) 구매해 방에 장착했다냥! 🎉`);
    }
  };

  // Stripe 결제
  const handleStripeCheckout = async (productId: string) => {
    if (!isAuthenticated) { toast.error("결제를 진행하려면 로그인이 필요하다냥!"); window.location.href = getLoginUrl(); return; }
    try {
      toast.info("결제 페이지로 이동한다냥... 🍎");
      const result = await createCheckout.mutateAsync({ productId, origin: window.location.origin });
      if (result.url) window.open(result.url, "_blank");
    } catch { toast.error("결제 세션 생성에 실패했다냥. 잠시 후 다시 시도해달라냥!"); }
  };

  // 커뮤니티
  const handleLikePost = (postId: string) => setFeedPosts(prev => prev.map(post => post.id === postId ? { ...post, likes: post.likedByMe ? post.likes - 1 : post.likes + 1, likedByMe: !post.likedByMe } : post));

  // 코멘트 삭제 함수
  const handleDeleteComment = (postId: string, commentId: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      return { ...post, comments: post.comments.filter(c => c.id !== commentId) };
    }));
    toast.success("댓글을 삭제했다냥.");
  };

  // 피드 게시물 삭제 함수
  const handleDeletePost = (postId: string) => {
    setFeedPosts(prev => prev.filter(post => post.id !== postId));
    toast.success("게시물을 삭제했다냥.");
  };
  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setFeedPosts(prev => prev.map(post => post.id === postId ? { ...post, comments: [...post.comments, { id: Date.now().toString(), author: userName, text: `${text}냥!`, date: "방금 전" }] } : post));
    gainExp(10, "커뮤니티 소통");
  };
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    setFeedPosts([{ id: Date.now().toString(), author: userName, authorLevel: level, avatar: CAT_CHARACTERS[catMood].image, content: `${newPostText}냥!`, likes: 0, likedByMe: false, comments: [], date: "방금 전", hasBestBadge: level >= 3 }, ...feedPosts]);
    setNewPostText(""); setIsCommunityWriteOpen(false);
    gainExp(25, "커뮤니티 피드 작성");
    toast.success("마음 숲 피드에 글을 등록했다냥! 🌳📸");
  };

  // 달력 렌더링
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear(), month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(<div key={`e-${i}`} className="h-10"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = selectedDateStr === dateStr;
      const hasEvent = localEvents.some(e => e.date === dateStr);
      days.push(
        <button key={day} onClick={() => setSelectedDateStr(dateStr)} className={`h-10 w-full flex flex-col items-center justify-center rounded-lg transition-all relative ${isSelected ? "bg-blue-500 text-white font-bold" : "bg-white text-black hover:bg-gray-50"}`}>
          <span className="text-xs">{day}</span>
          {hasEvent && <span className="absolute bottom-1 w-1.5 h-1.5 bg-pink-500 rounded-full"></span>}
        </button>
      );
    }
    return days;
  };

  const getRoomBg = () => {
    if (currentWallpaper === "w1") return "bg-[#ECFDF5] border-2 border-emerald-100";
    if (currentWallpaper === "w2") return "bg-[#0F172A] text-white border-2 border-slate-800";
    if (currentWallpaper === "w3") return "bg-[#FFF1F2] border-2 border-pink-100";
    if (currentWallpaper === "w4") return "bg-[#F0F9FF] border-2 border-blue-100";
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
            { icon: "🧠", title: "심리테스트로 나만의 냥이 매칭", desc: "10문항으로 내 감정 유형에 딱 맞는 고양이가 배정된다냥!" },
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
          <button onClick={() => window.location.href = getLoginUrl()} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> Manus 계정으로 로그인 (데이터 영구 저장)
          </button>
          <button onClick={() => setAuthView("signup")} className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-2xl border border-gray-200 transition-colors flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" /> 로그인 없이 무료로 시작하기냥 🐾
          </button>
        </div>
      </div>
    );
  }

  // === 회원가입 화면 ===
  if (authView === "signup") {
    return (
      <div className="flex-1 flex flex-col bg-white h-full overflow-y-auto p-6">
        <button onClick={() => setAuthView("landing")} className="flex items-center gap-1 text-gray-400 text-xs font-bold mb-6"><ChevronLeft className="w-4 h-4" /> 돌아가기</button>
        <div className="text-center space-y-2 mb-8"><div className="text-4xl">🐾</div><h2 className="text-xl font-black text-gray-800">나만의 감정냥이 만들기</h2><p className="text-xs text-gray-500 font-bold">닉네임과 고양이 이름을 설정하고 심리테스트를 시작하세요냥!</p></div>
        <div className="space-y-5 flex-1">
          <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">나의 닉네임</label><input type="text" value={signupNickname} onChange={(e) => setSignupNickname(e.target.value)} placeholder="예: 드림님, 집사, 냥냥이..." className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="space-y-1.5"><label className="text-xs font-black text-gray-600">나의 감정냥이 이름</label><input type="text" value={signupCatName} onChange={(e) => setSignupCatName(e.target.value)} placeholder="예: 드림이, 뭉치, 나비..." className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
            <h3 className="text-xs font-black text-blue-700">📋 시작 혜택</h3>
            <ul className="text-[11px] text-blue-600 font-bold space-y-1">
              <li>✅ 심리테스트로 나만의 감정냥이 매칭</li>
              <li>✅ AI 냥이와 대화하기 이용</li>
              <li>✅ 일기 작성 시 AI 맞춤 솔루션 & Lofi 음악 추천</li>
              <li>✅ 사과 5개 시작 선물 🍎</li>
            </ul>
          </div>
        </div>
        <button onClick={() => {
          if (!signupNickname.trim()) { toast.error("닉네임을 입력해달라냥!"); return; }
          setUserName(signupNickname); setCatName(signupCatName); setApples(5); setAuthView("app"); setIsTestCompleted(false);
          toast.success(`환영한다냥, ${signupNickname}님! 사과 🍎 5개를 선물로 드린다냥!`);
        }} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl transition-colors shadow-md mt-6">가입하고 심리테스트 시작하기냥 🐾</button>
      </div>
    );
  }

  // === 심리테스트 화면 ===
  if (!isTestCompleted || activeQuestions.length === 0) {
    const q = activeQuestions[currentQuestionIndex] || QUESTION_BANK[0];
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-white h-full overflow-y-auto">
        <div className="text-center space-y-2 mt-6">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">마인드캣 심리테스트 ({currentQuestionIndex + 1}/10)</div>
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
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}></div></div>
          <div className="text-center text-[10px] text-gray-400 font-bold">10개의 문항을 완료하면 맞춤 고양이 방이 열립니다냥.</div>
        </div>
      </div>
    );
  }

  // === 메인 앱 ===
  return (
    <div className="flex-1 flex flex-col relative h-full bg-white font-sans overflow-hidden">
      {isLevelUpGlowing && (
        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none z-50 animate-pulse flex items-center justify-center">
          <div className="text-3xl animate-bounce">✨💖✨</div>
        </div>
      )}

      {/* TOP BAR */}
      <header className="px-5 py-3.5 flex items-center justify-between border-b border-gray-100 bg-white z-10">
        <button onClick={() => setIsMailOpen(true)} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"><Mail className="w-4 h-4 text-gray-600" /></button>
        <h1 className="text-lg font-black tracking-tight text-gray-800">MIND CAT DIARY</h1>
        <div className="flex gap-2">
          <button onClick={toggleMusic} className={`p-2 rounded-xl transition-all border ${isPlaying ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-gray-100 text-gray-600"}`}>
            <Music className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`} />
          </button>
          {isAuthenticated ? (
            <button onClick={() => logout()} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-xs font-bold text-gray-600">로그아웃</button>
          ) : (
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"><Settings className="w-4 h-4 text-gray-600" /></button>
          )}
        </div>
      </header>

      {/* LEVEL & EXP BAR */}
      <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-gray-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full">Lv.{level}</div>
          <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(exp / maxExp) * 100}%` }}></div></div>
          <span className="text-[10px] font-bold text-gray-400">{exp}/{maxExp}</span>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">🔐 로그인됨</span>}
          {isPremium && <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">👑 프리미엄</span>}
          <button onClick={() => setIsStoreOpen(true)} className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50">
            <span className="text-xs">🍎</span><span className="font-bold text-xs text-gray-700">{apples}개</span><Plus className="w-3 h-3 text-blue-500" />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-white pb-32 relative">
        
        {/* 고양이 방 탭 */}
        {activeTab === "room" && (
          <div className="p-5 space-y-5 h-full flex flex-col justify-between min-h-[460px]">
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[320px]">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3.5 text-center font-bold text-xs text-blue-600 leading-relaxed relative shadow-sm">
                  📢 {catName}의 오늘 안부: {dailyCatMessage}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-50/50 border-r border-b border-blue-100 rotate-45"></div>
                </div>
              </div>
            </div>

            <div className={`flex-1 min-h-[280px] max-h-[340px] rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner ${getRoomBg()}`}>
              <div className="absolute inset-0 pointer-events-none">
                {equippedItems.map(itemId => {
                  const item = SHOP_ITEMS.find(si => si.id === itemId);
                  if (!item) return null;
                  if (item.category === "furniture") {
                    if (item.id === "f1") return <div key={item.id} className="absolute left-6 bottom-10 text-5xl">🐈‍⬛🗼</div>;
                    if (item.id === "f2") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-2 text-6xl opacity-80">🧶</div>;
                    if (item.id === "f3") return <div key={item.id} className="absolute right-8 bottom-8 text-4xl">🐟</div>;
                    if (item.id === "f4") return <div key={item.id} className="absolute left-6 bottom-4 text-5xl">⛺</div>;
                    if (item.id === "f5") return <div key={item.id} className="absolute right-6 bottom-4 text-4xl">🥛</div>;
                    if (item.id === "f6") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-12 text-5xl z-20">🛋️</div>;
                    if (item.id === "f7") return <div key={item.id} className="absolute right-12 bottom-12 text-4xl">🪵</div>;
                  }
                  if (item.category === "accessory") {
                    if (item.id === "a1") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 top-8 text-3xl z-30 animate-pulse">🌸</div>;
                    if (item.id === "a2") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 top-6 text-3xl z-30">🎀</div>;
                    if (item.id === "a3") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 top-4 text-3xl z-30">🕶️</div>;
                    if (item.id === "a4") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 top-2 text-3xl z-30 animate-bounce">👑</div>;
                    if (item.id === "a5") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 top-4 text-3xl z-30">👓</div>;
                    if (item.id === "a6") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 top-3 text-3xl z-30">🧙</div>;
                    if (item.id === "a7") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 top-6 text-3xl z-0 animate-pulse">👼</div>;
                  }
                  return null;
                })}
              </div>

              <div className="relative z-10 flex flex-col items-center cursor-pointer group" onClick={() => { setBubbleText(`나를 터치해줘서 고맙다냥! [${CAT_CHARACTERS[catMood].name}]인 나는 언제나 드림님 편이다냥! 💕`); gainExp(5, "고양이 교감"); }}>
                <div className="bg-gray-800 text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap border border-gray-700 shadow-sm mb-2 z-20">
                  {catName} ({CAT_CHARACTERS[catMood].name.split(" ")[0]})
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/5 rounded-full blur-sm"></div>
                <img src={CAT_CHARACTERS[catMood].image} alt={CAT_CHARACTERS[catMood].name} className="w-48 h-48 object-contain relative z-10 transition-transform group-hover:-translate-y-1.5 duration-300" />
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsShopOpen(true)} className="flex items-center gap-1.5 px-5 py-3 bg-gray-800 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-gray-700 transition-colors"><ShoppingBag className="w-4 h-4" /> 소품 상점</button>
              <button onClick={() => { setActiveTab("chat"); setBubbleText("무슨 재밌는 얘기를 들려줄 거냐냥? 🐾"); }} className="flex items-center gap-1.5 px-5 py-3 bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-600 transition-colors"><MessageSquare className="w-4 h-4" /> 냥이와 대화하기</button>
            </div>
          </div>
        )}

        {/* 냥이와 대화하기 탭 */}
        {activeTab === "chat" && (
          <div className="absolute inset-0 bottom-20 bg-white flex flex-col z-20">
            <div className="px-5 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white overflow-hidden flex items-center justify-center border border-blue-200">
                  <img src={CAT_CHARACTERS[catMood].image} alt="Profile" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1">
                    {catName} <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.2 rounded">냥이와 대화하기</span>
                    {isAuthenticated && <span className="text-[8px] bg-green-500 text-white px-1.5 py-0.2 rounded">GPT AI</span>}
                  </h3>
                  <p className="text-[10px] text-blue-500 font-bold">현재 매칭: {CAT_CHARACTERS[catMood].name}</p>
                </div>
              </div>
              <button onClick={() => setActiveTab("room")} className="text-xs text-gray-500 hover:text-gray-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-gray-150">방으로 가기</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "cat" && (
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-150 overflow-hidden flex items-center justify-center mr-2 mt-1 shrink-0 shadow-sm">
                      <img src={CAT_CHARACTERS[catMood].image} alt="Cat" className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  <div className={`max-w-[75%] p-3.5 rounded-2xl font-bold text-xs leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-gray-800 text-white rounded-tr-none" : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"}`}>
                    {msg.text}
                    <div className={`text-[8px] mt-1 ${msg.sender === "user" ? "text-gray-400 text-right" : "text-gray-400"}`}>{msg.timestamp}</div>
                  </div>
                </div>
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-150 overflow-hidden flex items-center justify-center mr-2 mt-1 shrink-0">
                    <img src={CAT_CHARACTERS[catMood].image} alt="Cat" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="bg-white text-gray-400 border border-gray-100 rounded-2xl rounded-tl-none p-3.5 text-xs font-bold shadow-sm">
                    <span className="animate-pulse">냥이가 생각 중이다냥... 🐾</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendChat} className="p-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={`${catName}이에게 속마음을 들려달라냥...`} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <button type="submit" disabled={sendMessageMutation.isPending} className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors shadow-sm shrink-0 disabled:opacity-50"><Send className="w-4 h-4" /></button>
            </form>
          </div>
        )}

        {/* 달력 탭 */}
        {activeTab === "calendar" && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 rounded-lg bg-gray-50 border border-gray-100"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
              <h2 className="text-base font-bold text-gray-800">{currentDate.getFullYear()}년 {String(currentDate.getMonth() + 1).padStart(2, "0")}월</h2>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 rounded-lg bg-gray-50 border border-gray-100"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold border-b border-gray-100 pb-1 text-gray-400">
              <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">{renderCalendarDays()}</div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-gray-500">📅 {selectedDateStr} 기록</h3>
                <button onClick={() => setIsAddEventOpen(true)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"><Plus className="w-3 h-3" /> 일기 쓰기</button>
              </div>
              {localEvents.filter(e => e.date === selectedDateStr).length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50 p-4"><p className="text-xs font-bold text-gray-400">이날은 등록된 마음 일기가 없다냥.</p></div>
              ) : (
                localEvents.filter(e => e.date === selectedDateStr).map(event => {
                  const solution = generateDiarySolution(event.title, event.mood, event.thanks || "");
                  const aiSolution = event.customSolution || solution.tip;
                  const musicRec = event.customMusicRecommendation || LOFI_PLAYLIST[solution.music]?.title || LOFI_PLAYLIST.default.title;
                  return (
                    <div key={event.id} className="border border-gray-100 rounded-2xl p-5 bg-white space-y-4 shadow-sm relative">
                      <button onClick={() => { setLocalEvents(prev => prev.filter(e => e.id !== event.id)); toast.success("일기를 삭제했다냥."); }} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      <div className="space-y-1"><span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">오늘의 일기</span><h4 className="text-sm font-bold text-gray-800">{event.title}</h4></div>
                      <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-3">
                        <div><span className="text-[9px] text-gray-400 font-bold">마음 날씨</span><p className="text-xs font-bold text-gray-700">{event.mood}</p></div>
                        <div><span className="text-[9px] text-gray-400 font-bold">감사한 일</span><p className="text-xs font-bold text-gray-700">{event.thanks}</p></div>
                      </div>
                      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-50/80 space-y-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">{isAuthenticated ? "🤖 AI 처방전" : "드림이의 처방전 🩺"}</span>
                          <span className="text-[9px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded font-bold">🎵 {musicRec}</span>
                        </div>
                        <p className="text-[11px] text-blue-600 font-bold leading-relaxed">{aiSolution}</p>
                        {!event.customSolution && (
                          <ul className="text-[11px] text-gray-600 font-bold space-y-1.5 list-disc pl-4 leading-relaxed">
                            {solution.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 커뮤니티 탭 */}
        {activeTab === "community" && (
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div><h2 className="text-base font-bold text-gray-800">마음 숲 피드</h2><p className="text-xs text-gray-500">서로 위로를 나누는 따뜻한 커뮤니티냥 🌳</p></div>
              <button onClick={() => setIsCommunityWriteOpen(true)} className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"><Plus className="w-4 h-4" /> 글쓰기</button>
            </div>
            <div className="space-y-4">
              {feedPosts.map(post => (
                <div key={post.id} className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                  <div className="p-4 flex items-center gap-2.5 bg-gray-50/50 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-100 shrink-0"><img src={post.avatar} alt="Avatar" className="w-6 h-6 object-contain" /></div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-700">{post.author}</span>
                        <span className="text-[8px] bg-gray-800 text-white px-1.5 py-0.2 rounded font-bold">Lv.{post.authorLevel}</span>
                        {post.hasBestBadge && <span className="text-[8px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">👑 상담왕</span>}
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold">{post.date}</span>
                    </div>
                  </div>
                  <div className="p-4 border-b border-gray-50"><p className="text-xs font-bold text-gray-700 leading-relaxed">{post.content}</p></div>
                  <div className="px-4 py-2.5 bg-gray-50/20 flex items-center gap-4 border-b border-gray-50">
                    <button onClick={() => handleLikePost(post.id)} className={`flex items-center gap-1 text-xs font-bold transition-colors ${post.likedByMe ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}><Heart className={`w-3.5 h-3.5 ${post.likedByMe ? "fill-current" : ""}`} /><span>{post.likes}</span></button>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-500"><MessageCircle className="w-3.5 h-3.5" /><span>{post.comments.length}</span></div>
                  </div>
                  {post.comments.length > 0 && (
                    <div className="p-4 bg-gray-50/30 space-y-2.5 border-b border-gray-50">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start justify-between gap-2 group">
                          <div className="flex items-start gap-1.5 flex-1 min-w-0">
                            <span className="text-gray-800 font-black text-xs shrink-0">{comment.author}:</span>
                            <span className="text-gray-600 text-xs font-bold leading-relaxed break-words">{comment.text}</span>
                          </div>
                          {/* 내가 쒴 댓글이면 삭제 버튼 표시 */}
                          {comment.author === userName && (
                            <button
                              onClick={() => handleDeleteComment(post.id, comment.id)}
                              className="shrink-0 p-1 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                              title="댓글 삭제"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="p-3 bg-white flex gap-2">
                    <input type="text" placeholder="댓글을 달아달라냥..." onKeyDown={(e) => { if (e.key === 'Enter') { handleAddComment(post.id, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; } }} className="flex-1 px-3 py-2 rounded-lg border border-gray-150 bg-white font-bold text-xs focus:outline-none" />
                    <button onClick={(e) => { const input = (e.currentTarget.previousSibling as HTMLInputElement); handleAddComment(post.id, input.value); input.value = ""; }} className="px-3 bg-gray-800 text-white text-xs font-bold rounded-lg">등록</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 월간 감정 분석 리포트 탭 */}
        {activeTab === "report" && (
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div><h2 className="text-base font-bold text-gray-800">월간 감정 리포트</h2><p className="text-xs text-gray-500">AI가 분석한 나의 감정 변화 추이냥 📊</p></div>
              <div className="flex items-center gap-1">
                <button onClick={() => { if (reportMonth === 1) { setReportMonth(12); setReportYear(y => y - 1); } else setReportMonth(m => m - 1); }} className="p-1 rounded-lg bg-gray-50 border border-gray-100"><ChevronLeft className="w-3 h-3 text-gray-600" /></button>
                <span className="text-xs font-bold text-gray-600 px-1">{reportYear}.{String(reportMonth).padStart(2, "0")}</span>
                <button onClick={() => { if (reportMonth === 12) { setReportMonth(1); setReportYear(y => y + 1); } else setReportMonth(m => m + 1); }} className="p-1 rounded-lg bg-gray-50 border border-gray-100"><ChevronRight className="w-3 h-3 text-gray-600" /></button>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50 p-6 space-y-3">
                <p className="text-sm font-bold text-gray-600">월간 감정 리포트는 로그인 후 이용 가능하다냥!</p>
                <button onClick={() => window.location.href = getLoginUrl()} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm">Manus 로그인으로 데이터 저장하기냥</button>
              </div>
            ) : reportQuery.isLoading ? (
              <div className="text-center py-10"><p className="text-xs text-gray-400 font-bold animate-pulse">AI가 이번 달 감정을 분석 중이다냥... 🐾</p></div>
            ) : reportQuery.data && reportQuery.data.totalDiaries > 0 ? (
              <div className="space-y-5">
                {/* 요약 카드 */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">🤖 AI 월간 요약</span>
                    <span className="text-[9px] text-gray-400 font-bold">총 {reportQuery.data.totalDiaries}개 일기 분석</span>
                  </div>
                  <p className="text-xs font-bold text-blue-700 leading-relaxed">{reportQuery.data.aiSummary || `이번 달 가장 많이 느낀 감정은 [${reportQuery.data.topMood}]이다냥! 꾸준히 마음을 기록하는 드림님이 정말 대단하다냥 🐾`}</p>
                </div>

                {/* 파이 차트 */}
                <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-gray-700">감정 분포도</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={Object.entries(reportQuery.data.moodCounts).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {Object.entries(reportQuery.data.moodCounts).map(([name], index) => (
                          <Cell key={`cell-${index}`} fill={MOOD_COLORS[name] || "#93C5FD"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* 바 차트 */}
                <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-gray-700">감정별 일기 수</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={Object.entries(reportQuery.data.moodCounts).map(([name, value]) => ({ name, value }))}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50 p-6">
                <p className="text-xs font-bold text-gray-400">이번 달에 작성된 일기가 없다냥.</p>
                <p className="text-[10px] text-gray-300 mt-1">달력 탭에서 일기를 작성하면 여기서 분석 결과를 볼 수 있다냥!</p>
              </div>
            )}
          </div>
        )}

        {/* 도감 탭 */}
        {activeTab === "dex" && (
          <div className="absolute inset-0 bottom-20 z-20 overflow-hidden">
            <Dex
              collectedCats={collectedCats}
              currentCatMood={catMood}
              level={level}
              testCount={testCount}
              apples={apples}
              onSetCat={(mood) => {
                setCatMood(mood);
                setBubbleText(`[${CAT_CHARACTERS[mood].name}]로 변경했다냥! 반갑다냥! 💕`);
                setActiveTab("room");
                toast.success(`[${CAT_CHARACTERS[mood].name}]를 방에 배치했다냥! 🐾`);
              }}
              onRetakeTest={() => {
                // 3회 이상이면 사과 10개 차감 확인 모달 표시
                if (testCount >= 2) {
                  setIsTestPayConfirmOpen(true);
                } else {
                  // 무료 재도전 (0~2회)
                  setTestCount(prev => prev + 1);
                  setIsTestCompleted(false);
                  setCurrentQuestionIndex(0);
                  setTestScores({ unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0, depressed: 0, excited: 0, scared: 0, proud: 0, curious: 0, guilty: 0, relaxed: 0 });
                  const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
                  setActiveQuestions(shuffled.slice(0, 10));
                  toast.success(`심리테스트 재도전 시작! (${testCount + 1}회차) 이번엔 어떤 냥이가 나올까냥? 🐾`);
                }
              }}
            />
          </div>
        )}

        {/* 관리자 탭 */}
        {activeTab === "admin" && (
          <div className="p-5 space-y-5">
            <div><h2 className="text-base font-bold text-gray-800">관리자 대시보드</h2><p className="text-xs text-gray-500">서비스 운영 현황 및 광고 링크 실시간 수정 패널냥 🛡️</p></div>
            {!isAdminLoggedIn ? (
              <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                <h3 className="font-bold text-xs text-gray-700">관리자 비밀번호를 입력해달라냥 (기본: 1234)</h3>
                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="비밀번호 입력" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none" />
                <button onClick={() => { if (adminPassword === "1234" || adminPassword === "admin") { setIsAdminLoggedIn(true); toast.success("관리자 권한으로 로그인했다냥! 🛡️"); } else toast.error("비밀번호가 틀렸다냥!"); }} className="w-full py-2.5 bg-gray-800 text-white font-bold text-xs rounded-xl">로그인</button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 text-center"><span className="text-[9px] text-gray-400 font-bold">누적 가입자</span><p className="text-base font-black text-gray-800 mt-1">1,248명</p></div>
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 text-center"><span className="text-[9px] text-gray-400 font-bold">오늘 작성 일기</span><p className="text-base font-black text-gray-800 mt-1">342개</p></div>
                </div>
                <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                  <h3 className="font-bold text-xs text-gray-800 border-b border-gray-50 pb-2">👥 회원 목록</h3>
                  <div className="space-y-2">
                    {[{ name: "드림님", level: 3, cat: "억울냥", joinDate: "2026-05-01", premium: true }, { name: "냥이집사3호", level: 5, cat: "사랑냥", joinDate: "2026-04-15", premium: false }, { name: "행복한하루", level: 2, cat: "외롭냥", joinDate: "2026-05-20", premium: false }].map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div>
                          <div className="flex items-center gap-1.5"><span className="text-xs font-bold text-gray-700">{member.name}</span>{member.premium && <span className="text-[8px] bg-amber-500 text-white px-1 py-0.2 rounded font-bold">👑</span>}</div>
                          <span className="text-[9px] text-gray-400 font-bold">Lv.{member.level} · {member.cat} · 가입: {member.joinDate}</span>
                        </div>
                        <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">활성</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                  <h3 className="font-bold text-xs text-gray-800 border-b border-gray-50 pb-2">📢 광고 배너 실시간 관리</h3>
                  <div className="space-y-3">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400">광고 배너 문구</label><input type="text" value={adText} onChange={(e) => setAdText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-bold text-xs" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400">광고 아웃링크 URL</label><input type="text" value={adLink} onChange={(e) => setAdLink(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-bold text-xs" /></div>
                    <button onClick={() => toast.success("광고 배너 설정이 실시간 반영되었다냥! 🍎")} className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg">광고 배너 업데이트</button>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                  <h3 className="font-bold text-xs text-gray-800 border-b border-gray-50 pb-2 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-blue-500" /> 테스트 전용 제어기</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setApples(prev => prev + 5); toast.success("사과 +5개 지급 완료냥 🍎"); }} className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-lg">🍎 사과 +5개</button>
                    <button onClick={() => gainExp(40, "관리자 치트")} className="py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold text-xs rounded-lg">✨ 경험치 +40</button>
                    <button onClick={() => { setLocalEvents([]); toast.success("모든 일정이 초기화되었다냥."); }} className="py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg">🧹 일정 초기화</button>
                    <button onClick={() => { setIsAdminLoggedIn(false); setAdminPassword(""); toast.info("로그아웃했다냥."); }} className="py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg">🚪 로그아웃</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 하단 광고 배너 */}
      <div className="absolute bottom-20 left-0 right-0 h-12 bg-gray-50 border-t border-b border-gray-100 px-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2"><span className="text-[8px] bg-gray-300 text-gray-600 px-1 rounded font-bold">AD</span><span className="text-[10px] font-bold text-gray-500 truncate max-w-[220px]">{adText}</span></div>
        <a href={adLink} target="_blank" rel="noreferrer" className="text-[9px] text-blue-500 font-bold flex items-center gap-0.5 hover:underline shrink-0">바로가기 <ExternalLink className="w-2.5 h-2.5" /></a>
      </div>

      {/* 하단 네비게이션 (7탭 - 도감 추가) */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around px-1 z-10 shadow-lg">
        <button onClick={() => setActiveTab("chat")} className={`flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-all ${activeTab === "chat" ? "text-blue-500 scale-105" : "text-gray-400"}`}><MessageSquare className="w-4 h-4" /></button>
        <button onClick={() => setActiveTab("calendar")} className={`flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-all ${activeTab === "calendar" ? "text-blue-500 scale-105" : "text-gray-400"}`}><CalendarIcon className="w-4 h-4" /></button>
        <button onClick={() => setActiveTab("room")} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl -translate-y-4 transition-all shadow-md ${activeTab === "room" ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-400"}`}><img src={CAT_CHARACTERS[catMood].image} alt="Cat Icon" className="w-9 h-9 object-contain" /></button>
        <button onClick={() => setActiveTab("community")} className={`flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-all ${activeTab === "community" ? "text-blue-500 scale-105" : "text-gray-400"}`}><Users className="w-4 h-4" /></button>
        <button
          onClick={() => setActiveTab("dex")}
          className={`flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-all relative ${activeTab === "dex" ? "text-blue-500 scale-105" : "text-gray-400"}`}
        >
          <BookOpen className="w-4 h-4" />
          {/* 수집 개수 배지 */}
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {collectedCats.length}
          </span>
        </button>
        <button onClick={() => setActiveTab("report")} className={`flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-all ${activeTab === "report" ? "text-blue-500 scale-105" : "text-gray-400"}`}><BarChart2 className="w-4 h-4" /></button>
        <button onClick={() => setActiveTab("admin")} className={`flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-all ${activeTab === "admin" ? "text-blue-500 scale-105" : "text-gray-400"}`}><Shield className="w-4 h-4" /></button>
      </nav>

      {/* MODAL: Stripe 결제 상점 */}
      {isStoreOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div><h3 className="text-sm font-bold text-gray-800">사과 충전 & 프리미엄 상점</h3><p className="text-[10px] text-gray-400 font-bold">카드 번호 4242 4242 4242 4242로 테스트 결제 가능</p></div>
              <button onClick={() => setIsStoreOpen(false)} className="p-1 rounded-lg hover:bg-gray-50"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              {[
                { id: "apple_small", name: "사과 10개 패키지", price: "$0.99", desc: "소품 상점 기본 아이템 구매에 딱 좋다냥!", emoji: "🍎", apples: 10 },
                { id: "apple_medium", name: "사과 30개 패키지", price: "$2.49", desc: "고급 소품을 마음껏 구매할 수 있다냥!", emoji: "🍎🍎🍎", apples: 30 },
                { id: "apple_large", name: "사과 100개 패키지", price: "$6.99", desc: "한정판 소품을 모두 해금하자냥!", emoji: "🎁", apples: 100 },
                { id: "premium_monthly", name: "프리미엄 집사 멤버십", price: "$4.99/월", desc: "매달 사과 50개 + 한정판 소품 + 상담왕 배지!", emoji: "👑", apples: 50 }
              ].map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0">{product.emoji}</span>
                    <div><h4 className="font-bold text-xs text-gray-700">{product.name}</h4><p className="text-[9px] text-gray-400 font-bold">{product.desc}</p><p className="text-[10px] text-blue-600 font-black mt-0.5">🍎 +{product.apples}개</p></div>
                  </div>
                  <button onClick={() => handleStripeCheckout(product.id)} disabled={createCheckout.isPending} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all disabled:opacity-50 shrink-0">{createCheckout.isPending ? "..." : product.price}</button>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 text-center font-bold">테스트 카드: 4242 4242 4242 4242 | 유효기간: 미래 임의 날짜 | CVV: 임의 3자리</p>
          </div>
        </div>
      )}

      {/* MODAL: 소품 상점 */}
      {isShopOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-1.5"><h3 className="text-sm font-bold text-gray-800">꾸미기 소품 상점</h3><span className="text-[10px] bg-gray-50 border border-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">🍎 {apples}개</span></div>
              <button onClick={() => setIsShopOpen(false)} className="p-1 rounded-lg hover:bg-gray-50"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {SHOP_ITEMS.map((item) => {
                const isBought = myItems.includes(item.id), isEquipped = equippedItems.includes(item.id);
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3"><span className="text-2xl shrink-0">{item.emoji}</span><div><h4 className="font-bold text-xs text-gray-700">{item.name}</h4><p className="text-[9px] text-gray-400 font-bold">{item.description}</p></div></div>
                    <button onClick={() => handleBuyItem(item)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isEquipped ? "bg-gray-800 text-white" : isBought ? "bg-gray-200 text-gray-700" : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"}`}>{isEquipped ? "장착 해제" : isBought ? "방에 배치" : `🍎 ${item.price}`}</button>
                  </div>
                );
              })}
            </div>
            <button onClick={() => { setIsShopOpen(false); setIsStoreOpen(true); }} className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-lg flex items-center justify-center gap-1"><CreditCard className="w-3.5 h-3.5" /> 사과가 부족하면? 충전하러 가기냥 →</button>
          </div>
        </div>
      )}

      {/* MODAL: 우편함 */}
      {isMailOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 space-y-4 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-gray-800">우편함</h3><button onClick={() => setIsMailOpen(false)} className="p-1 rounded-lg hover:bg-gray-50"><X className="w-4 h-4 text-gray-400" /></button></div>
            <div className="rounded-2xl p-4 bg-blue-50/50 border border-blue-50">
              <div className="flex items-center gap-1.5 mb-1.5"><span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-bold">새 소식</span><span className="text-[10px] font-bold text-gray-400">2026-05-30</span></div>
              <h4 className="font-bold text-xs text-gray-700 mb-1">{catName}이가 보내는 첫 편지 💌</h4>
              <p className="text-[11px] font-bold text-gray-600 leading-relaxed">"드림님! 나와 함께 심리테스트를 마치고 매일 감정을 나누어 줘서 고맙다냥. 기쁠 때나 슬플 때나 난 언제나 당신 편이다냥! 🐾❤️"</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 설정 */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 space-y-4 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-gray-800">설정</h3><button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-lg hover:bg-gray-50"><X className="w-4 h-4" /></button></div>
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400">고양이 이름</label><input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-xs" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400">사용자 닉네임</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-xs" /></div>
              <button onClick={() => { setIsSettingsOpen(false); if (isAuthenticated) updateProfileMutation.mutate({ nickname: userName, catName }); toast.success("설정이 저장되었습니다냥! 🐾"); }} className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl">설정 완료</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 일기 작성 */}
      {isAddEventOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 space-y-4 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2"><h3 className="text-xs font-bold text-gray-700">마음 일기 작성 {isAuthenticated && <span className="text-[8px] bg-green-500 text-white px-1 rounded ml-1">AI 솔루션 자동 생성</span>}</h3><button onClick={() => setIsAddEventOpen(false)} className="p-1 rounded-lg hover:bg-gray-50"><X className="w-4 h-4 text-gray-400" /></button></div>
            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400">날짜</label><input type="text" value={selectedDateStr} disabled className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 font-bold text-xs text-gray-500" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400">일기 제목</label><input type="text" value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} placeholder="예: 오늘 중요한 발표를 끝냈다!" className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400">오늘의 핵심 감정</label><select value={inputMood} onChange={(e) => setInputMood(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none"><option>기쁨 😊</option><option>슬픔 😢</option><option>피곤 😴</option><option>불안 😰</option><option>외로움 🥺</option></select></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400">오늘 하루 감사했던 일</label><textarea value={inputThanks} onChange={(e) => setInputThanks(e.target.value)} placeholder="아무리 작은 일이라도 감사함을 느껴보라냥..." rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none resize-none" /></div>
              <button type="submit" disabled={createDiaryMutation.isPending} className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm disabled:opacity-50">{createDiaryMutation.isPending ? "AI가 솔루션을 생성 중이다냥... 🤖" : "일기 쓰고 AI 맞춤 해결책 & 음악 받기냥 🐾"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 커뮤니티 글쓰기 */}
      {isCommunityWriteOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 space-y-4 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2"><h3 className="text-xs font-bold text-gray-700">새 피드 작성</h3><button onClick={() => setIsCommunityWriteOpen(false)} className="p-1 rounded-lg hover:bg-gray-50"><X className="w-4 h-4 text-gray-400" /></button></div>
            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <textarea value={newPostText} onChange={(e) => setNewPostText(e.target.value)} placeholder="마음 숲의 다른 집사들과 나누고 싶은 감정을 적어달라냥..." rows={4} className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none resize-none" />
              <button type="submit" className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm">피드 올리기냥 📸🐾</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 레벨업 축하 */}
      {isLevelUpModalOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsLevelUpModalOpen(false)} className="w-full max-w-[320px] bg-white rounded-3xl p-6 text-center space-y-4 border border-gray-100 shadow-2xl cursor-pointer animate-in zoom-in-95 duration-200">
            <div className="text-4xl">🎉🍎👑</div>
            <h3 className="text-lg font-black text-gray-800">LEVEL UP!</h3>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">드림님 축하한다냥! 드림이와 마음을 나눠 레벨이 올랐다냥!</p>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100 text-xs font-bold">보상: 사과 🍎 3개 획득!</div>
            <div className="text-[10px] text-gray-400 font-bold animate-pulse">[ 화면을 탭하면 방으로 돌아갑니다냥 ]</div>
          </div>
        </div>
      )}

      {/* MODAL: 심리테스트 재도전 사과 10개 차감 확인 모달 */}
      {isTestPayConfirmOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[320px] bg-white rounded-3xl p-6 text-center space-y-4 border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-4xl">🍎🔒</div>
            <h3 className="text-base font-black text-gray-800">심리테스트 재도전</h3>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">심리테스트는 무료로 2회까지 진행할 수 있다냥.<br />
              3회부터는 매번 사과 <span className="text-blue-500 font-black">🍎 10개</span>를 사용해야 재도전할 수 있다냥.</p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 space-y-1">
              <div className="text-xs font-bold text-amber-700">현재 보유 사과: 🍎 {apples}개</div>
              <div className="text-xs font-bold text-amber-600">차감 예정: 🍎 10개 사용</div>
              <div className={`text-xs font-bold ${apples >= 10 ? "text-green-600" : "text-red-500"}`}>
                {apples >= 10 ? `재도전 후 남은 사과: 🍎 ${apples - 10}개` : "⚠️ 사과가 부족하다냥! 상점에서 충전해달라냥."}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsTestPayConfirmOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (apples < 10) {
                    toast.error("사과가 부족하다냥! 상점에서 사과를 충전해달라냥 🍎");
                    setIsTestPayConfirmOpen(false);
                    setIsStoreOpen(true);
                    return;
                  }
                  // 사과 10개 차감
                  setApples(prev => prev - 10);
                  setTestCount(prev => prev + 1);
                  setIsTestPayConfirmOpen(false);
                  setIsTestCompleted(false);
                  setCurrentQuestionIndex(0);
                  setTestScores({ unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0, depressed: 0, excited: 0, scared: 0, proud: 0, curious: 0, guilty: 0, relaxed: 0 });
                  const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
                  setActiveQuestions(shuffled.slice(0, 10));
                  toast.success(`사과 🍎 10개를 사용해 심리테스트 재도전 시작! (${testCount + 1}회차) 이번엔 어떤 냥이가 나올까냥? 🐾`);
                }}
                disabled={apples < 10}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🍎 10개 사용하고 재도전!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
