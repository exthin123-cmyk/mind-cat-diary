import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Smile, 
  Settings, 
  Mail, 
  Send, 
  Plus, 
  BookOpen, 
  ChevronLeft,
  ChevronRight, 
  Heart, 
  Sparkles, 
  Trash2,
  Check,
  Award,
  X,
  Music,
  Play,
  Pause,
  ShoppingBag,
  Users,
  Shield,
  MessageCircle,
  TrendingUp,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { MoodType, CAT_CHARACTERS, SHOP_ITEMS, ShopItem, ScheduleEvent, Message, FeedPost, TEST_QUESTIONS } from "../lib/types";

// 감정별 매칭될 수 있는 로파이 음악 플레이리스트 (Royalty-free)
const LOFI_PLAYLIST: Record<string, { title: string; url: string }> = {
  "기쁨 😊": { title: "포근한 햇살 Lofi ☀️", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  "슬픔 😢": { title: "차분한 빗소리 Lofi 🌧️", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  "피곤 😴": { title: "노곤노곤 자장가 Lofi 💤", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  "불안 😰": { title: "평온한 숲속의 숨결 Lofi 🌲", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  "외로움 🥺": { title: "별빛 가득한 밤하늘 Lofi 🌌", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  "default": { title: "드림이의 아늑한 방 Lofi 🎵", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
};

export default function Home() {
  // --- 1. 심리 테스트 상태 ---
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testScores, setTestScores] = useState<Record<MoodType, number>>({
    unfair: 0, anxious: 0, lonely: 0, lethargic: 0, angry: 0, love: 0, shy: 0, shocked: 0, bored: 0, depressed: 0
  });

  // --- 2. 기본 상태 관리 ---
  const [activeTab, setActiveTab] = useState<"room" | "chat" | "calendar" | "community" | "admin">("room");
  const [catMood, setCatMood] = useState<MoodType>("unfair"); // 심리테스트 결과 매칭된 고양이 감정
  const [userName, setUserName] = useState("드림님");
  const [catName, setCatName] = useState("드림이");
  const [adoptDays, setAdoptDays] = useState(10);

  // --- 3. 레벨 및 사과(화폐) 시스템 ---
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(20);
  const maxExp = 100;
  const [apples, setApples] = useState(5); // 상점에서 쓰는 화폐
  const [isLevelUpGlowing, setIsLevelUpGlowing] = useState(false); // 레벨업 반짝임 효과 상태
  const [isLevelUpModalOpen, setIsLevelUpUpModalOpen] = useState(false); // 레벨업 축하 모달

  // --- 4. 고양이 방 꾸미기 시스템 ---
  const [myItems, setMyItems] = useState<string[]>(["f3"]); // 구매한 아이템 ID 목록
  const [equippedItems, setEquippedItems] = useState<string[]>(["f3"]); // 방에 배치한 아이템 ID 목록
  const [currentWallpaper, setCurrentWallpaper] = useState<string>("default"); // 현재 벽지 상태
  const [isShopOpen, setIsShopOpen] = useState(false);

  // --- 5. 음악 재생 시스템 ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<{ title: string; url: string }>(LOFI_PLAYLIST.default);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- 6. 달력 및 일정/감사일기 시스템 ---
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 15)); // 2026년 2월 기준
  const [selectedDateStr, setSelectedDateStr] = useState("2026-02-18");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  
  // 일정 입력 폼
  const [inputTitle, setInputTitle] = useState("");
  const [inputMood, setInputMood] = useState("기쁨 😊");
  const [inputThanks, setInputThanks] = useState("");

  const [events, setEvents] = useState<ScheduleEvent[]>([
    { id: "e1", date: "2026-02-18", title: "광고주와 미팅", mood: "불안 - 미팅이 잘 될까 불안하다", thanks: "도와주는 동료들이 있어 감사하다" },
    { id: "e2", date: "2026-02-19", title: "프로젝트 마감일", mood: "짜릿 - 마침내 완성해서 신난다", thanks: "끝까지 포기하지 않은 내 자신에게 감사하다" },
    { id: "e3", date: "2026-02-20", title: "팀 전체 회식", mood: "행복 - 맛있는 소고기 먹는 날", thanks: "좋은 사람들과 즐거운 시간을 보낼 수 있음에 감사하다" }
  ]);

  // --- 7. 대화(채팅) 및 1:1 심리상담 시스템 ---
  const [chatInput, setChatInput] = useState("");
  const [bubbleText, setBubbleText] = useState("드림아 좋은 아침! 오늘 기분은 어때냥?");
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", sender: "cat", text: "안녕 드림님! 오늘 하루는 어땠어냥? 무슨 일이든 나한테 다 털어놓으라냥! 🐾", timestamp: "10:00" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- 8. 인스타그램 스타일 커뮤니티 시스템 ---
  const [isCommunityWriteOpen, setIsCommunityWriteOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: "p1",
      author: "냥이집사3호",
      authorLevel: 5,
      avatar: "/manus-storage/unfair_cat_bb093496.png",
      content: "오늘 드림이랑 대화하다가 레벨업했어냥! 사과 3개 받아서 바로 선글라스 사줬는데 너무 힙하고 귀엽지 않냐냥? 😎🍎",
      likes: 12,
      likedByMe: false,
      comments: [
        { id: "c1", author: "초보집사", text: "우와 부럽다냥! 선글라스 너무 잘 어울린다냥!", date: "10분 전" },
        { id: "c2", author: "드림맘", text: "저도 얼른 사과 모아서 사줘야겠어요냥!", date: "5분 전" }
      ],
      date: "30분 전",
      hasBestBadge: true // 상담왕 배지
    },
    {
      id: "p2",
      author: "행복한하루",
      authorLevel: 3,
      avatar: "/manus-storage/lonely_cat_dbdd7a45.png",
      content: "달력에 감사일기 매일 쓰니까 마음이 한결 편안해지는 것 같다냥. 사소한 일상에도 감사함을 느끼는 게 중요한 것 같다냥... 🌸✨",
      likes: 8,
      likedByMe: true,
      comments: [
        { id: "c3", author: "냥이집사3호", text: "맞아요냥! 마음의 숲을 가꾸는 느낌이다냥.", date: "15분 전" }
      ],
      date: "1시간 전",
      hasBestBadge: false
    }
  ]);

  // --- 9. 관리자 관리 페이지 상태 ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- 10. 경험치 획득 및 레벨업 로직 ---
  const gainExp = (amount: number, actionType: string) => {
    setExp(prev => {
      const nextExp = prev + amount;
      if (nextExp >= maxExp) {
        setIsLevelUpGlowing(true); // 빛나는 이펙트 활성화
        setTimeout(() => {
          setIsLevelUpGlowing(false);
        }, 3000);
        
        setLevel(l => {
          const nextLvl = l + 1;
          setApples(a => a + 3); // 레벨업 보상: 사과 3개
          setIsLevelUpUpModalOpen(true); // 레벨업 축하 모달 오픈
          return nextLvl;
        });
        return nextExp - maxExp;
      }
      toast.info(`🐾 ${actionType} 완료! EXP +${amount} 획득했다냥.`);
      return nextExp;
    });
  };

  // --- 11. 음악 재생 연동 ---
  useEffect(() => {
    audioRef.current = new Audio(currentMusic.url);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;

    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentMusic]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      toast.info("음악을 일시정지했다냥 🎵");
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        toast.success(`🎶 현재 재생중: ${currentMusic.title}`);
      }).catch(() => {
        toast.error("음악 재생에 실패했다냥. 브라우저 설정을 확인해달라냥!");
      });
    }
  };

  // --- 12. 심리테스트 선택 및 고양이 매칭 ---
  const handleAnswerSelect = (score: Record<MoodType, number>) => {
    // 점수 누적
    setTestScores(prev => {
      const updated = { ...prev };
      (Object.keys(score) as MoodType[]).forEach(key => {
        updated[key] = (updated[key] || 0) + (score[key] || 0);
      });
      return updated;
    });

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < TEST_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      // 10문항 끝났을 때 최고 점수의 고양이 찾기
      let maxScore = -1;
      let selectedCat: MoodType = "unfair";

      (Object.keys(testScores) as MoodType[]).forEach(key => {
        if (testScores[key] > maxScore) {
          maxScore = testScores[key];
          selectedCat = key;
        }
      });

      setCatMood(selectedCat);
      setIsTestCompleted(true);
      
      // 고양이 매칭 후 초기 메시지 셋팅
      setMessages([
        { 
          id: "m1", 
          sender: "cat", 
          text: `안녕 드림님! 나는 심리테스트로 매칭된 드림님의 평생 단짝 [${CAT_CHARACTERS[selectedCat].name}]이다냥! 오늘 하루는 어땠어냥? 무슨 일이든 다 나한테 털어놓으라냥! 🐾`, 
          timestamp: "10:00" 
        }
      ]);
      setBubbleText(`안녕 드림님! 나는 [${CAT_CHARACTERS[selectedCat].name}]이다냥!`);
      toast.success(`🎉 심리테스트 완료! 당신에게 딱 맞는 동반자 [${CAT_CHARACTERS[selectedCat].name}]가 매칭되었다냥!`);
    }
  };

  // --- 13. 냥체 대화 시뮬레이션 및 1:1 상담 피드백 ---
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userText, timestamp: timeStr }]);
    setChatInput("");
    gainExp(15, "드림이와 1:1 심리상담");

    // 고양이 자동 냥체 답변 (심리테스트 결과 매칭된 고양이 성격에 맞춰 대답 흐름을 개선)
    setTimeout(() => {
      let catReply = "";
      const lower = userText.toLowerCase();
      const currentCatName = CAT_CHARACTERS[catMood].name;

      if (lower.includes("안녕") || lower.includes("하이")) {
        catReply = `안녕 드림님! [${currentCatName}]이 반갑게 손을 흔든다냥! 오늘 기분 좋은 하루 보냈냐냥? ☀️`;
      } else if (lower.includes("슬퍼") || lower.includes("우울") || lower.includes("힘들어")) {
        catReply = `많이 힘들었겠다냥... 토닥토닥. [${currentCatName}]인 내가 드림님 곁에서 따뜻하게 안아줄 테니 걱정 말라냥. 슬픈 감정도 다 소중한 과정이다냥 🐾❤️`;
      } else if (lower.includes("행복") || lower.includes("기뻐") || lower.includes("신나")) {
        catReply = `우와냥! 드림님이 행복하다니 [${currentCatName}]인 나도 꼬리가 절로 살랑살랑 춤을 춘다냥! 이 행복을 사과 🍎처럼 소중하게 간직하자냥!`;
      } else if (lower.includes("졸려") || lower.includes("피곤") || lower.includes("잘래")) {
        catReply = `오늘 정말 수고 많았다냥. [${currentCatName}]이도 이제 잘 준비 완료다냥. 포근한 베개 꼭 베고 예쁜 꿈 꾸며 꿀잠 자라냥 😴💤`;
      } else if (lower.includes("불안") || lower.includes("걱정")) {
        catReply = `걱정하지 말라냥. 불안할 땐 나랑 같이 숨을 크게 들이마시고 내쉬어보자냥. 내가 항상 곁에서 지켜주겠다냥 🐾`;
      } else {
        catReply = `그렇구냥! [${currentCatName}]이는 드림님의 모든 이야기를 다 기억하고 이해하고 싶다냥. 편하게 더 얘기해달라냥! 🐾`;
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "cat", text: catReply, timestamp: timeStr }]);
      setBubbleText(catReply);
    }, 1000);
  };

  // --- 14. 달력 일정 추가 & 해결책 코멘트 자동 달기 ---
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) {
      toast.error("일정 제목을 입력해 달라냥!");
      return;
    }

    const newEvent: ScheduleEvent = {
      id: Date.now().toString(),
      date: selectedDateStr,
      title: inputTitle,
      mood: inputMood,
      thanks: inputThanks
    };

    setEvents(prev => [...prev, newEvent]);
    setIsAddEventOpen(false);
    setInputTitle("");
    setInputThanks("");
    gainExp(30, "감사일기 및 일정 등록");

    // 감정에 맞는 해결 방법 코멘트 자동 연동 및 어울리는 Lofi 음악 자동 변경
    if (LOFI_PLAYLIST[inputMood]) {
      setCurrentMusic(LOFI_PLAYLIST[inputMood]);
      toast.success(`🎵 감정에 딱 어울리는 [${LOFI_PLAYLIST[inputMood].title}]을 재생한다냥!`);
    } else {
      setCurrentMusic(LOFI_PLAYLIST.default);
    }
  };

  // --- 15. 상점 아이템 구매 및 방 배치 ---
  const handleBuyItem = (item: ShopItem) => {
    if (myItems.includes(item.id)) {
      if (equippedItems.includes(item.id)) {
        setEquippedItems(prev => prev.filter(id => id !== item.id));
        if (item.category === "wallpaper") setCurrentWallpaper("default");
        toast.info(`${item.name} 장착을 해제했다냥.`);
      } else {
        if (item.category === "wallpaper") {
          setEquippedItems(prev => [...prev.filter(id => {
            const shopItem = SHOP_ITEMS.find(si => si.id === id);
            return shopItem?.category !== "wallpaper";
          }), item.id]);
          setCurrentWallpaper(item.id);
        } else {
          setEquippedItems(prev => [...prev, item.id]);
        }
        toast.success(`${item.name}을(를) 방에 장착했다냥! 🛋️`);
      }
    } else {
      if (apples < item.price) {
        toast.error("사과가 부족하다냥! 대화나 일기를 써서 레벨업 보상을 받아오라냥 🍎");
        return;
      }
      setApples(prev => prev - item.price);
      setMyItems(prev => [...prev, item.id]);
      setEquippedItems(prev => [...prev, item.id]);
      if (item.category === "wallpaper") setCurrentWallpaper(item.id);
      toast.success(`${item.name}을(를) 사과 ${item.price}개로 구매해 방에 장착했다냥! 🎉`);
    }
  };

  // --- 16. 커뮤니티 피드백 및 댓글 작성 ---
  const handleLikePost = (postId: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
          likedByMe: !post.likedByMe
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            { id: Date.now().toString(), author: userName, text: `${text}냥!`, date: "방금 전" }
          ]
        };
      }
      return post;
    }));
    gainExp(10, "커뮤니티 소통");
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: FeedPost = {
      id: Date.now().toString(),
      author: userName,
      authorLevel: level,
      avatar: CAT_CHARACTERS[catMood].image,
      content: `${newPostText}냥!`,
      likes: 0,
      likedByMe: false,
      comments: [],
      date: "방금 전",
      hasBestBadge: level >= 3 // 레벨 3 이상이면 상담왕 자격 획득
    };

    setFeedPosts([newPost, ...feedPosts]);
    setNewPostText("");
    setIsCommunityWriteOpen(false);
    gainExp(25, "커뮤니티 피드 작성");
    toast.success("마음 숲 피드에 글을 등록했다냥! 🌳📸");
  };

  // --- 17. 달력 렌더링 헬퍼 ---
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = selectedDateStr === dateStr;
      const dayEvents = events.filter(e => e.date === dateStr);
      const hasEvent = dayEvents.length > 0;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDateStr(dateStr)}
          className={`h-10 w-full flex flex-col items-center justify-center rounded-lg border transition-all relative ${
            isSelected 
              ? "bg-[#3B82F6] text-white border-[#3B82F6] font-bold" 
              : "bg-white text-black border-transparent hover:bg-gray-50"
          }`}
        >
          <span className="text-xs">{day}</span>
          {hasEvent && (
            <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#FF6B6B] rounded-full"></span>
          )}
        </button>
      );
    }
    return days;
  };

  // --- 18. 고양이 방 배경 색상 가져오기 ---
  const getRoomBackgroundClass = () => {
    if (currentWallpaper === "w1") return "bg-[#ECFDF5] border-2 border-emerald-100"; 
    if (currentWallpaper === "w2") return "bg-[#0F172A] text-white border-2 border-slate-800"; 
    if (currentWallpaper === "w3") return "bg-[#FFF1F2] border-2 border-pink-100"; 
    return "bg-[#FAF8F5] border border-gray-100"; 
  };

  // --- 19. 감정별 맞춤형 실질적 해결책 추천 엔진 ---
  const getActionSolution = (mood: string) => {
    if (mood.includes("기쁨")) {
      return {
        tip: "기쁜 감정을 더 오래 지속하고 공유해 보세요!",
        steps: ["오늘 기뻤던 순간을 일기에 한 줄 더 자세히 기록하기냥.", "소중한 사람에게 안부 인사를 건네며 긍정 에너지를 나눠보기냥."]
      };
    }
    if (mood.includes("슬픔")) {
      return {
        tip: "슬픈 마음을 억누르지 말고, 안전하게 환기시켜 주세요.",
        steps: ["슬픈 감정을 글로 쓰며 눈물이 나면 마음껏 울어보기냥.", "따뜻한 차 한 잔을 마시며 몸의 온도를 1도 올려주기냥."]
      };
    }
    if (mood.includes("피곤")) {
      return {
        tip: "지금 몸과 마음에 완전한 휴식이 가장 필요해요.",
        steps: ["스마트폰을 멀리 두고 10분간 가만히 눈을 감고 누워있기냥.", "가벼운 스트레칭으로 어깨와 목의 긴장을 풀어주기냥."]
      };
    }
    if (mood.includes("불안")) {
      return {
        tip: "불안할 때는 호흡과 현재 내 몸의 감각에 집중해 보세요.",
        steps: ["4초간 숨을 들이마시고, 4초간 멈춘 뒤, 4초간 내쉬기냥 (4-4-4 호흡법).", "내가 현재 통제할 수 있는 작은 일(방 정리, 이불 개기) 하나를 먼저 끝내보기냥."]
      };
    }
    if (mood.includes("외로움")) {
      return {
        tip: "외로움은 내가 사랑받고 싶다는 소중한 마음의 신호예요.",
        steps: ["커뮤니티 '마음 숲'에 오늘 기분을 나누고 다른 집사들의 따뜻한 댓글을 읽어보기냥.", "좋아하는 반려동물 영상이나 편안한 Lofi 음악을 크게 틀어두기냥."]
      };
    }
    return {
      tip: "나의 마음 상태를 있는 그대로 관찰하고 다독여 주세요.",
      steps: ["오늘 하루 동안 수고한 나 자신에게 수고했다는 한마디 건네기냥.", "충분한 수면과 영양 섭취를 통해 기초 에너지를 충전하기냥."]
    };
  };

  // --- 심리테스트 미완료 시 테스트 화면 노출 ---
  if (!isTestCompleted) {
    const q = TEST_QUESTIONS[currentQuestionIndex];
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-white font-sans h-full overflow-y-auto">
        <div className="text-center space-y-2 mt-6">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
            마인드캣 심리테스트 ({q.id}/10)
          </div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-snug">
            나와 어울리는 감정냥이는 누구일까?
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            질문에 솔직하게 답변하면 어울리는 고양이와 꾸미기 소품이 매칭된다냥!
          </p>
        </div>

        {/* 질문 카드 */}
        <div className="my-8 p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center space-y-6 shadow-sm">
          <div className="text-base font-bold text-gray-800 leading-relaxed">
            {q.text}
          </div>
          
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(opt.score)}
                className="w-full py-4 px-5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-xs md:text-sm font-bold text-gray-700 text-left transition-all active:scale-[0.98] shadow-sm"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* 진행 바 */}
        <div className="space-y-2 mb-6">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(q.id / 10) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-[10px] text-gray-400 font-bold">
            10개의 문항을 완료하면 맞춤 고양이 방이 열립니다냥.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative h-full bg-white font-sans overflow-hidden">
      
      {/* 레벨업 시 반짝이는 애니메이션 효과 */}
      {isLevelUpGlowing && (
        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none z-50 animate-pulse flex items-center justify-center">
          <div className="text-3xl animate-bounce">✨💖✨</div>
        </div>
      )}

      {/* --- TOP BAR --- */}
      <header className="px-5 py-3.5 flex items-center justify-between border-b border-gray-100 bg-white z-10">
        <button 
          onClick={() => setIsMailOpen(true)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
        >
          <Mail className="w-4 h-4 text-gray-600" />
        </button>
        
        <h1 className="text-lg font-black tracking-tight text-gray-800 flex items-center gap-1.5">
          MIND CAT DIARY
        </h1>
        
        <div className="flex gap-2">
          {/* 음악 플레이어 토글 버튼 */}
          <button 
            onClick={toggleMusic}
            className={`p-2 rounded-xl transition-all border ${
              isPlaying ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Music className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`} />
          </button>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </header>

      {/* --- LEVEL & EXP & CURRENCY BAR --- */}
      <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-gray-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            Lv.{level}
          </div>
          <div className="w-28 md:w-36 h-2 bg-gray-200 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${(exp / maxExp) * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-bold text-gray-400">
            {exp}/{maxExp} EXP
          </span>
        </div>
        
        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
          <span className="text-xs">🍎</span>
          <span className="font-bold text-xs text-gray-700">{apples}개</span>
        </div>
      </div>

      {/* --- MAIN SCROLL AREA --- */}
      <main className="flex-1 overflow-y-auto bg-white pb-32 relative">
        
        {/* =======================================================
            1. 고양이 방 탭 (Room)
           ======================================================= */}
        {activeTab === "room" && (
          <div className="p-5 space-y-5 h-full flex flex-col justify-between min-h-[460px]">
            
            {/* 고양이 말풍선 */}
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[320px]">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 text-center font-bold text-xs md:text-sm text-gray-700 leading-relaxed relative shadow-sm">
                  {bubbleText}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-50 border-r border-b border-gray-100 rotate-45"></div>
                </div>
              </div>
            </div>

            {/* 고양이 아늑한 방 (꾸미기 가구 배치되는 공간) */}
            <div className={`flex-1 min-h-[280px] max-h-[340px] rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner ${getRoomBackgroundClass()}`}>
              
              {/* 장착된 가구/악세서리 렌더링 */}
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
                  }
                  if (item.category === "accessory") {
                    if (item.id === "a1") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-24 text-3xl z-30 animate-pulse">🌸</div>;
                    if (item.id === "a2") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-20 text-3xl z-30">🎀</div>;
                    if (item.id === "a3") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-28 text-3xl z-30">🕶️</div>;
                    if (item.id === "a4") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-36 text-3xl z-30 animate-bounce">👑</div>;
                    if (item.id === "a5") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-28 text-3xl z-30">👓</div>;
                  }
                  return null;
                })}
              </div>

              {/* 고양이 캐릭터 본체 (심리테스트 결과로 매칭된 고유 고양이 고정) */}
              <div className="relative z-10 flex flex-col items-center cursor-pointer group mt-4" onClick={() => {
                setBubbleText(`나를 터치해줘서 고맙다냥! [${CAT_CHARACTERS[catMood].name}]인 나는 언제나 드림님 편이다냥! 💕`);
                gainExp(5, "고양이 교감");
              }}>
                {/* 발판 그림자 */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/5 rounded-full blur-sm"></div>
                
                <img 
                  src={CAT_CHARACTERS[catMood].image} 
                  alt={CAT_CHARACTERS[catMood].name} 
                  className="w-48 h-48 object-contain relative z-10 transition-transform group-hover:-translate-y-1.5 duration-300"
                />
                
                {/* 고양이 이름 상시 노출 */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap border border-gray-700 shadow-sm">
                  {catName} ({CAT_CHARACTERS[catMood].name.split(" ")[0]})
                </div>
              </div>

            </div>

            {/* 하단: 상점 바로가기 및 퀵메뉴 */}
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsShopOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 bg-gray-800 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-gray-700 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> 소품 상점 (사과 상점)
              </button>
              
              <button 
                onClick={() => {
                  setActiveTab("chat");
                  setBubbleText("무슨 재밌는 얘기를 들려줄 거냐냥? 🐾");
                }}
                className="flex items-center gap-1.5 px-5 py-3 bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> 1:1 심리상담하기냥
              </button>
            </div>

          </div>
        )}

        {/* =======================================================
            2. AI 1:1 상담 탭 (독립된 풀스크린 메신저 레이아웃)
           ======================================================= */}
        {activeTab === "chat" && (
          <div className="absolute inset-0 bottom-20 bg-white flex flex-col z-20">
            {/* 메신저 헤더 고정 */}
            <div className="px-5 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white overflow-hidden flex items-center justify-center border border-blue-200">
                  <img src={CAT_CHARACTERS[catMood].image} alt="Profile" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1">
                    {catName} <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.2 rounded">AI 상담사</span>
                  </h3>
                  <p className="text-[10px] text-blue-500 font-bold">
                    현재 매칭: {CAT_CHARACTERS[catMood].name}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveTab("room")}
                className="text-xs text-gray-500 hover:text-gray-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-gray-150"
              >
                방으로 가기
              </button>
            </div>

            {/* 메시지 리스트 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "cat" && (
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-150 overflow-hidden flex items-center justify-center mr-2 mt-1 shrink-0 shadow-sm">
                      <img src={CAT_CHARACTERS[catMood].image} alt="Cat" className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] p-3.5 rounded-2xl font-bold text-xs md:text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-gray-800 text-white rounded-tr-none" 
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                  }`}>
                    {msg.text}
                    <div className={`text-[8px] mt-1 ${msg.sender === "user" ? "text-gray-400 text-right" : "text-gray-400"}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* 메신저 입력창 하단 고정 */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`${catName}이에게 속마음을 들려달라냥...`}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* =======================================================
            3. 일정 및 감사일기 달력 탭 (Calendar)
           ======================================================= */}
        {activeTab === "calendar" && (
          <div className="p-5 space-y-4">
            
            {/* 달력 헤더 */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="p-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              
              <h2 className="text-base font-bold text-gray-800">
                {currentDate.getFullYear()}년 {String(currentDate.getMonth() + 1).padStart(2, "0")}월
              </h2>
              
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* 달력 요일 라벨 */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold border-b border-gray-100 pb-1 text-gray-400">
              <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>

            {/* 달력 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {renderCalendarDays()}
            </div>

            {/* 선택한 날짜의 일정 목록 */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-gray-500">
                  📅 {selectedDateStr} 기록
                </h3>
                <button 
                  onClick={() => setIsAddEventOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-3 h-3" /> 일기 및 일정 쓰기
                </button>
              </div>

              {events.filter(e => e.date === selectedDateStr).length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-bold text-gray-400">이날은 등록된 마음 일기가 없다냥.</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">우측 버튼을 눌러 새 마음과 일정을 기록해보라냥!</p>
                </div>
              ) : (
                events.filter(e => e.date === selectedDateStr).map(event => {
                  const solution = getActionSolution(event.mood);
                  return (
                    <div key={event.id} className="border border-gray-100 rounded-2xl p-5 bg-white space-y-4 shadow-sm relative">
                      <button 
                        onClick={() => {
                          setEvents(prev => prev.filter(e => e.id !== event.id));
                          toast.success("일기를 삭제했다냥.");
                        }}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="space-y-1">
                        <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">오늘의 일기</span>
                        <h4 className="text-sm font-bold text-gray-800">{event.title}</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-gray-400 font-bold">마음 날씨</span>
                          <p className="text-xs font-bold text-gray-700">{event.mood}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-gray-400 font-bold">감사한 일</span>
                          <p className="text-xs font-bold text-gray-700">{event.thanks}</p>
                        </div>
                      </div>

                      {/* AI 고양이 해결책 처방전 댓글 */}
                      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-50/80 space-y-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">드림이의 처방전 🩺</span>
                          <span className="text-[10px] text-blue-600 font-bold">{solution.tip}</span>
                        </div>
                        <ul className="text-[11px] text-gray-600 font-bold space-y-1.5 list-disc pl-4 leading-relaxed">
                          {solution.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* =======================================================
            4. 마음 숲 소셜 커뮤니티 탭 (Community)
           ======================================================= */}
        {activeTab === "community" && (
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-800">마음 숲 피드</h2>
                <p className="text-xs text-gray-500">서로 위로를 나누는 따뜻한 커뮤니티냥 🌳</p>
              </div>
              
              <button 
                onClick={() => setIsCommunityWriteOpen(true)}
                className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> 글쓰기
              </button>
            </div>

            {/* 피드 목록 */}
            <div className="space-y-4">
              {feedPosts.map(post => (
                <div key={post.id} className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                  {/* 피드 헤더 */}
                  <div className="p-4 flex items-center justify-between bg-gray-50/50 border-b border-gray-50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                        <img src={post.avatar} alt="Avatar" className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-700">{post.author}</span>
                          <span className="text-[8px] bg-gray-800 text-white px-1.5 py-0.2 rounded font-bold">
                            Lv.{post.authorLevel}
                          </span>
                          {post.hasBestBadge && (
                            <span className="text-[8px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                              👑 상담왕
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold">{post.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* 피드 본문 */}
                  <div className="p-4 border-b border-gray-50">
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* 좋아요 & 댓글 액션 */}
                  <div className="px-4 py-2.5 bg-gray-50/20 flex items-center gap-4 border-b border-gray-50">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                        post.likedByMe ? "text-red-500" : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.likedByMe ? "fill-current" : ""}`} />
                      <span>{post.likes}</span>
                    </button>
                    
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>

                  {/* 댓글 목록 */}
                  {post.comments.length > 0 && (
                    <div className="p-4 bg-gray-50/30 space-y-2 border-b border-gray-50">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="text-xs font-bold flex items-start gap-1.5">
                          <span className="text-gray-800 font-black shrink-0">{comment.author}:</span>
                          <span className="text-gray-600 leading-relaxed">{comment.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 댓글 작성창 */}
                  <div className="p-3 bg-white flex gap-2">
                    <input 
                      type="text" 
                      placeholder="댓글을 달아달라냥..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-150 bg-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      onClick={(e) => {
                        const input = (e.currentTarget.previousSibling as HTMLInputElement);
                        handleAddComment(post.id, input.value);
                        input.value = "";
                      }}
                      className="px-3 bg-gray-800 text-white text-xs font-bold rounded-lg"
                    >
                      등록
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =======================================================
            5. 관리자 관리 페이지 탭 (Admin)
           ======================================================= */}
        {activeTab === "admin" && (
          <div className="p-5 space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-800">관리자 대시보드</h2>
              <p className="text-xs text-gray-500">서비스 운영 현황 및 테스트용 치트 패널냥 🛡️</p>
            </div>

            {!isAdminLoggedIn ? (
              <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                <h3 className="font-bold text-xs text-gray-700">관리자 비밀번호를 입력해달라냥</h3>
                <div className="space-y-3">
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요 (기본: 1234)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none"
                  />
                  <button 
                    onClick={() => {
                      if (adminPassword === "1234" || adminPassword === "admin") {
                        setIsAdminLoggedIn(true);
                        toast.success("관리자 권한으로 로그인했다냥! 🛡️");
                      } else {
                        toast.error("비밀번호가 틀렸다냥! 다시 확인해달라냥.");
                      }
                    }}
                    className="w-full py-2.5 bg-gray-800 text-white font-bold text-xs rounded-xl"
                  >
                    로그인
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* 대시보드 요약 통계 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 text-center">
                    <span className="text-[9px] text-gray-400 font-bold">누적 가입자</span>
                    <p className="text-base font-black text-gray-800 mt-1">1,248명</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 text-center">
                    <span className="text-[9px] text-gray-400 font-bold">오늘 작성 일기</span>
                    <p className="text-base font-black text-gray-800 mt-1">342개</p>
                  </div>
                </div>

                {/* 관리자 치트키 제어 (테스트용) */}
                <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                  <h3 className="font-bold text-xs text-gray-800 border-b border-gray-50 pb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-500" /> 테스트 전용 제어기
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setApples(prev => prev + 5);
                        toast.success("치트 발동! 사과 +5개 지급 완료냥 🍎");
                      }}
                      className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-lg transition-colors"
                    >
                      🍎 사과 +5개 받기
                    </button>
                    
                    <button 
                      onClick={() => {
                        gainExp(40, "관리자 치트");
                      }}
                      className="py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold text-xs rounded-lg transition-colors"
                    >
                      ✨ 경험치 +40 받기
                    </button>

                    <button 
                      onClick={() => {
                        setEvents([]);
                        toast.success("모든 일정이 초기화되었다냥.");
                      }}
                      className="py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-colors"
                    >
                      🧹 모든 일정 초기화
                    </button>

                    <button 
                      onClick={() => {
                        setIsAdminLoggedIn(false);
                        setAdminPassword("");
                        toast.info("관리자 모드에서 로그아웃했다냥.");
                      }}
                      className="py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg transition-colors"
                    >
                      🚪 로그아웃
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* --- BOTTOM AD BANNER (광고주 배너 영역) --- */}
      <div className="absolute bottom-20 left-0 right-0 h-12 bg-gray-50 border-t border-b border-gray-100 px-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-[8px] bg-gray-300 text-gray-600 px-1 rounded font-bold">AD</span>
          <span className="text-[10px] font-bold text-gray-500">🍎 맛있는 유기농 청송 사과 1+1 한정 특가 세일!</span>
        </div>
        <a 
          href="https://example.com" 
          target="_blank" 
          rel="noreferrer"
          className="text-[9px] text-blue-500 font-bold flex items-center gap-0.5 hover:underline"
        >
          바로가기 <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around px-4 z-10 shadow-lg">
        
        {/* 채팅 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("chat")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "chat" 
              ? "text-blue-500 scale-105" 
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* 달력 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("calendar")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "calendar" 
              ? "text-blue-500 scale-105" 
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <CalendarIcon className="w-5 h-5" />
        </button>

        {/* 메인 고양이 방 탭 버튼 (중앙) */}
        <button 
          onClick={() => setActiveTab("room")}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl -translate-y-4 transition-all shadow-md ${
            activeTab === "room" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
          }`}
        >
          <img src={CAT_CHARACTERS[catMood].image} alt="Cat Icon" className="w-9 h-9 object-contain" />
        </button>

        {/* 커뮤니티 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("community")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "community" 
              ? "text-blue-500 scale-105" 
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Users className="w-5 h-5" />
        </button>

        {/* 관리자 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("admin")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "admin" 
              ? "text-blue-500 scale-105" 
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Shield className="w-5 h-5" />
        </button>

      </nav>

      {/* --- MODAL: 소품 상점 (Shop Modal) --- */}
      {isShopOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-gray-800">꾸미기 상점</h3>
                <span className="text-[10px] bg-gray-50 border border-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  🍎 <span>{apples}개</span>
                </span>
              </div>
              <button 
                onClick={() => setIsShopOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* 아이템 리스트 */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {SHOP_ITEMS.map((item) => {
                const isBought = myItems.includes(item.id);
                const isEquipped = equippedItems.includes(item.id);
                
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl shrink-0">{item.emoji}</span>
                      <div>
                        <h4 className="font-bold text-xs text-gray-700">{item.name}</h4>
                        <p className="text-[9px] text-gray-400 font-bold">{item.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyItem(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isEquipped 
                          ? "bg-gray-800 text-white" 
                          : isBought 
                            ? "bg-gray-200 text-gray-700" 
                            : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                      }`}
                    >
                      {isEquipped ? "장착 해제" : isBought ? "방에 배치" : `🍎 ${item.price}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: 우편함 (Mail Modal) --- */}
      {isMailOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 space-y-4 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">우편함</h3>
              <button 
                onClick={() => setIsMailOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl p-4 bg-blue-50/50 border border-blue-50">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-bold">새 소식</span>
                  <span className="text-[10px] font-bold text-gray-400">2026-05-30</span>
                </div>
                <h4 className="font-bold text-xs text-gray-700 mb-1">{catName}이가 보내는 첫 편지 💌</h4>
                <p className="text-[11px] font-bold text-gray-600 leading-relaxed">
                  "드림님! 나와 함께 심리테스트를 마치고 매일 감정을 나누어 줘서 고맙다냥. 기쁠 때나 슬플 때나 난 언제나 당신 편이다냥! 🐾❤️"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: 설정 (Settings Modal) --- */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 space-y-4 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">설정</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">고양이 이름</label>
                <input 
                  type="text" 
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">사용자 닉네임</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">입양일수</label>
                <input 
                  type="number" 
                  value={adoptDays}
                  onChange={(e) => setAdoptDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-xs"
                />
              </div>

              <button 
                onClick={() => {
                  setIsSettingsOpen(false);
                  toast.success("설정이 저장되었습니다냥! 🐾");
                }}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl"
              >
                설정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: 일정 추가 모달 --- */}
      {isAddEventOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 space-y-4 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h3 className="text-xs font-bold text-gray-700">마음 일기 작성</h3>
              <button 
                onClick={() => setIsAddEventOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">날짜</label>
                <input 
                  type="text" 
                  value={selectedDateStr} 
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 font-bold text-xs text-gray-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">일기 제목</label>
                <input 
                  type="text" 
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="예: 오늘 중요한 발표를 끝냈다!"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">오늘의 핵심 감정</label>
                <select 
                  value={inputMood}
                  onChange={(e) => setInputMood(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none"
                >
                  <option>기쁨 😊</option>
                  <option>슬픔 😢</option>
                  <option>피곤 😴</option>
                  <option>불안 😰</option>
                  <option>외로움 🥺</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">오늘 하루 감사했던 일 한 줄</label>
                <textarea 
                  value={inputThanks}
                  onChange={(e) => setInputThanks(e.target.value)}
                  placeholder="아무리 작고 사소한 일이라도 감사함을 느껴보라냥..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none resize-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                일기 쓰고 맞춤 해결책 받기냥 🐾
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: 커뮤니티 글쓰기 모달 --- */}
      {isCommunityWriteOpen && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 space-y-4 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h3 className="text-xs font-bold text-gray-700">새 피드 작성</h3>
              <button 
                onClick={() => setIsCommunityWriteOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">마음 나누기</label>
                <textarea 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="마음 숲의 다른 집사들과 나누고 싶은 감정을 적어달라냥..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-xs focus:outline-none resize-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                피드 올리기냥 📸🐾
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL:  레벨업 축하 모달 --- */}
      {isLevelUpModalOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsLevelUpUpModalOpen(false)}
            className="w-full max-w-[320px] bg-white rounded-3xl p-6 text-center space-y-4 border border-gray-100 shadow-2xl cursor-pointer animate-in zoom-in-95 duration-200"
          >
            <div className="text-4xl">🎉🍎👑</div>
            <h3 className="text-lg font-black text-gray-800">LEVEL UP!</h3>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">
              드림님 축하한다냥! 드림이와 마음을 나눠 레벨이 올랐다냥!
            </p>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100 text-xs font-bold">
              보상: 사과 🍎 3개 획득!
            </div>
            <div className="text-[10px] text-gray-400 font-bold animate-pulse">
              [ 화면을 탭하면 방으로 돌아갑니다냥 ]
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
