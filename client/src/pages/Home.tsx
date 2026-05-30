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
  HelpCircle,
  X,
  Music,
  Play,
  Pause,
  Home as HomeIcon,
  ShoppingBag,
  Users,
  Shield,
  UserPlus,
  Compass,
  MessageCircle,
  TrendingUp,
  Coins
} from "lucide-react";
import { toast } from "sonner";
import { MoodType, CAT_CHARACTERS, SHOP_ITEMS, ShopItem, ScheduleEvent, Message, FeedPost } from "../lib/types";

export default function Home() {
  // --- 1. 기본 상태 관리 ---
  const [activeTab, setActiveTab] = useState<"room" | "chat" | "calendar" | "community" | "admin">("room");
  const [catMood, setCatMood] = useState<MoodType>("unfair");
  const [userName, setUserName] = useState("드림님");
  const [catName, setCatName] = useState("드림이");
  const [adoptDays, setAdoptDays] = useState(10);

  // --- 2. 레벨 및 사과(화폐) 시스템 ---
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(20);
  const maxExp = 100;
  const [apples, setApples] = useState(5); // 상점에서 쓰는 화폐

  // --- 3. 고양이 방 꾸미기 시스템 ---
  const [myItems, setMyItems] = useState<string[]>(["f3"]); // 구매한 아이템 ID 목록
  const [equippedItems, setEquippedItems] = useState<string[]>(["f3"]); // 방에 배치한 아이템 ID 목록
  const [currentWallpaper, setCurrentWallpaper] = useState<string>("default"); // 현재 벽지 상태
  const [isShopOpen, setIsShopOpen] = useState(false);

  // --- 4. 실제 음악 재생 시스템 (Royalty-free Lofi Music) ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- 5. 달력 및 일정/감사일기 시스템 ---
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

  // --- 6. 대화(채팅) 시스템 ---
  const [chatInput, setChatInput] = useState("");
  const [bubbleText, setBubbleText] = useState("드림아 좋은 아침! 오늘 기분은 어때냥?");
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", sender: "cat", text: "안녕 드림님! 오늘 하루는 어땠어냥? 무슨 일이든 나한테 다 털어놓으라냥! 🐾", timestamp: "10:00" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- 7. 인스타그램 스타일 커뮤니티 시스템 ---
  const [isCommunityWriteOpen, setIsCommunityWriteOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: "p1",
      author: "냥이집사3호",
      authorLevel: 5,
      avatar: "/manus-storage/unfair_cat_445e67f2.png",
      content: "오늘 드림이랑 대화하다가 레벨업했어냥! 사과 3개 받아서 바로 선글라스 사줬는데 너무 힙하고 귀엽지 않냐냥? 😎🍎",
      likes: 12,
      likedByMe: false,
      comments: [
        { id: "c1", author: "초보집사", text: "우와 부럽다냥! 선글라스 너무 잘 어울린다냥!", date: "10분 전" },
        { id: "c2", author: "드림맘", text: "저도 얼른 사과 모아서 사줘야겠어요냥!", date: "5분 전" }
      ],
      date: "30분 전"
    },
    {
      id: "p2",
      author: "행복한하루",
      authorLevel: 3,
      avatar: "/manus-storage/lonely_cat_f6458b7c.png",
      content: "달력에 감사일기 매일 쓰니까 마음이 한결 편안해지는 것 같다냥. 사소한 일상에도 감사함을 느끼는 게 중요한 것 같다냥... 🌸✨",
      likes: 8,
      likedByMe: true,
      comments: [
        { id: "c3", author: "냥이집사3호", text: "맞아요냥! 마음의 숲을 가꾸는 느낌이다냥.", date: "15분 전" }
      ],
      date: "1시간 전"
    }
  ]);

  // --- 8. 관리자 관리 페이지 상태 ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- 9. 경험치 획득 및 레벨업 로직 ---
  const gainExp = (amount: number, actionType: string) => {
    setExp(prev => {
      const nextExp = prev + amount;
      if (nextExp >= maxExp) {
        setLevel(l => {
          const nextLvl = l + 1;
          setApples(a => a + 3); // 레벨업 보상: 사과 3개
          toast.success(`🎉 축하한다냥! 레벨 ${nextLvl}로 올랐다냥! 보상으로 사과 🍎 3개를 획득했다냥!`);
          return nextLvl;
        });
        return nextExp - maxExp;
      }
      toast.info(`🐾 ${actionType} 완료! EXP +${amount} 획득했다냥.`);
      return nextExp;
    });
  };

  // --- 10. 오디오 이펙트 및 음악 컨트롤 ---
  useEffect(() => {
    // 로열티 프리 힐링 로파이 음악 연동
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      toast.info("음악을 일시정지했다냥 🎵");
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        toast.success("포근한 힐링 음악을 재생한다냥 🎶");
      }).catch(() => {
        toast.error("음악 재생에 실패했다냥. 브라우저 설정을 확인해달라냥!");
      });
    }
  };

  // --- 11. 냥체 대화 시뮬레이션 및 경험치 획득 ---
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userText, timestamp: timeStr }]);
    setChatInput("");
    gainExp(15, "드림이와 대화");

    // 고양이 자동 냥체 답변
    setTimeout(() => {
      let catReply = "";
      const lower = userText.toLowerCase();

      if (lower.includes("안녕") || lower.includes("하이")) {
        catReply = `반갑다냥! 오늘 날씨처럼 기분 좋은 하루 보내고 있냐냥? ☀️`;
      } else if (lower.includes("슬퍼") || lower.includes("우울") || lower.includes("힘들어")) {
        catReply = `속상해하지 말라냥... 내가 따뜻한 꾹꾹이로 위로해 주겠다냥. 토닥토닥 힘내라냥 🐾❤️`;
        setCatMood("lonely");
      } else if (lower.includes("행복") || lower.includes("기뻐") || lower.includes("신나")) {
        catReply = `우와냥! 드림님이 기쁘다니 나도 기분 좋아서 사과 한 입 앙! 베어 물고 싶다냥! 🍎⚡`;
        setCatMood("unfair");
      } else if (lower.includes("졸려") || lower.includes("피곤") || lower.includes("잘래")) {
        catReply = `하아암... 오늘 하루도 너무 수고 많았다냥. 이불 푹 덮고 좋은 꿈 꾸며 꿀잠 자라냥 😴💤`;
        setCatMood("lethargic");
      } else if (lower.includes("불안") || lower.includes("걱정")) {
        catReply = `너무 걱정하지 말라냥. 종이 상자 속에 들어온 것처럼 마음을 편안하게 먹으라냥. 다 잘 될 거다냥! 📦🐾`;
        setCatMood("anxious");
      } else {
        catReply = `그렇구냥! 드림님의 솔직한 이야기를 들려줘서 고맙다냥. 항상 내 귀는 쫑긋 열려있다냥! 🐾`;
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "cat", text: catReply, timestamp: timeStr }]);
      setBubbleText(catReply);
    }, 1000);
  };

  // --- 12. 달력 일정 추가 ---
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
    toast.success("달력에 소중한 마음과 일정을 기록했다냥! 📅✨");
  };

  // --- 13. 상점 아이템 구매 및 방 배치 ---
  const handleBuyItem = (item: ShopItem) => {
    if (myItems.includes(item.id)) {
      // 이미 보유 중인 경우 장착/해제 토글
      if (equippedItems.includes(item.id)) {
        setEquippedItems(prev => prev.filter(id => id !== item.id));
        if (item.category === "wallpaper") setCurrentWallpaper("default");
        toast.info(`${item.name} 장착을 해제했다냥.`);
      } else {
        if (item.category === "wallpaper") {
          // 벽지는 하나만 적용 가능
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
      // 새로 구매해야 하는 경우
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

  // --- 14. 커뮤니티 피드백 및 댓글 작성 ---
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
      date: "방금 전"
    };

    setFeedPosts([newPost, ...feedPosts]);
    setNewPostText("");
    setIsCommunityWriteOpen(false);
    gainExp(25, "커뮤니티 피드 작성");
    toast.success("마음 숲 피드에 글을 등록했다냥! 🌳📸");
  };

  // --- 15. 달력 렌더링을 위한 헬퍼 ---
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = new Date(year, month, 1).getDay();

    const days = [];
    // 빈 칸 채우기
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // 날짜 채우기
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
              ? "bg-black text-white border-black font-black scale-105" 
              : "bg-white text-black border-transparent hover:bg-gray-100"
          }`}
        >
          <span className="text-xs font-bold">{day}</span>
          {hasEvent && (
            <span className="absolute bottom-1 w-2 h-2 bg-[#FF80B5] rounded-full border border-black"></span>
          )}
        </button>
      );
    }
    return days;
  };

  // --- 16. 고양이 방 배경 색상 클래스 가져오기 ---
  const getRoomBackgroundClass = () => {
    if (currentWallpaper === "w1") return "bg-[#E5F9FF] border-dashed border-4 border-black"; // 땡땡이 벽지 느낌
    if (currentWallpaper === "w2") return "bg-[#1E293B] text-white"; // 밤하늘 벽지 느낌
    return "bg-[#FAF8F5]"; // 기본 포근한 크림색
  };

  return (
    <div className="flex-1 flex flex-col relative h-full bg-white select-none">
      
      {/* --- TOP BAR --- */}
      <header className="px-5 py-3.5 flex items-center justify-between border-b-4 border-black bg-white z-10">
        <button 
          onClick={() => setIsMailOpen(true)}
          className="p-2.5 rounded-xl neo-border bg-white neo-shadow-sm neo-shadow-active hover:bg-primary/10 transition-colors"
        >
          <Mail className="w-5 h-5 stroke-[2.5]" />
        </button>
        
        <h1 className="font-display text-xl md:text-2xl font-black tracking-tight flex items-center gap-1.5">
          MIND CAT DIARY
        </h1>
        
        <div className="flex gap-2">
          {/* 음악 플레이어 토글 버튼 */}
          <button 
            onClick={toggleMusic}
            className={`p-2.5 rounded-xl neo-border neo-shadow-sm neo-shadow-active transition-all ${
              isPlaying ? "bg-[#FFD93D] text-black" : "bg-white text-gray-500 hover:bg-primary/10"
            }`}
          >
            <Music className={`w-5 h-5 stroke-[2.5] ${isPlaying ? "animate-bounce" : ""}`} />
          </button>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-xl neo-border bg-white neo-shadow-sm neo-shadow-active hover:bg-primary/10 transition-colors"
          >
            <Settings className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* --- LEVEL & EXP & CURRENCY BAR --- */}
      <div className="px-5 py-2.5 bg-[#FAF8F5] border-b-3 border-black flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white text-[11px] font-black px-2.5 py-1 rounded-full border border-black">
            Lv.{level}
          </div>
          <div className="w-28 md:w-36 h-3.5 bg-gray-200 rounded-full border-2 border-black overflow-hidden relative">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${(exp / maxExp) * 100}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-black">
              {exp}/{maxExp} EXP
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border-2 border-black neo-shadow-sm">
          <span className="text-sm">🍎</span>
          <span className="font-display font-black text-xs">{apples}개</span>
        </div>
      </div>

      {/* --- MAIN SCROLL AREA --- */}
      <main className="flex-1 overflow-y-auto bg-white pb-24 relative">
        
        {/* =======================================================
            1. 고양이 방 탭 (Room)
           ======================================================= */}
        {activeTab === "room" && (
          <div className="p-5 space-y-5 h-full flex flex-col justify-between min-h-[500px]">
            
            {/* 고양이 말풍선 */}
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[320px]">
                <div className="neo-border bg-white rounded-2xl p-3.5 neo-shadow text-center font-bold text-xs md:text-sm leading-relaxed relative">
                  {bubbleText}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-4 border-black rotate-45"></div>
                </div>
              </div>
            </div>

            {/* 고양이 아늑한 방 (꾸미기 가구 배치되는 공간) */}
            <div className={`flex-1 min-h-[260px] max-h-[340px] neo-border rounded-3xl relative overflow-hidden flex flex-col items-center justify-end p-6 ${getRoomBackgroundClass()}`}>
              
              {/* 장착된 가구/악세서리 렌더링 */}
              <div className="absolute inset-0 pointer-events-none">
                {equippedItems.map(itemId => {
                  const item = SHOP_ITEMS.find(si => si.id === itemId);
                  if (!item) return null;
                  
                  // 아이템 카테고리별 임시 절대 위치 배치
                  if (item.category === "furniture") {
                    if (item.id === "f1") return <div key={item.id} className="absolute left-6 bottom-10 text-5xl">🐈‍⬛🗼</div>;
                    if (item.id === "f2") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-2 text-6xl opacity-80">🧶</div>;
                    if (item.id === "f3") return <div key={item.id} className="absolute right-8 bottom-8 text-4xl">🐟</div>;
                  }
                  if (item.category === "accessory") {
                    if (item.id === "a1") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-24 text-3xl z-30 animate-pulse">🌸</div>;
                    if (item.id === "a2") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-20 text-3xl z-30">🎀</div>;
                    if (item.id === "a3") return <div key={item.id} className="absolute left-1/2 -translate-x-1/2 bottom-28 text-3xl z-30">🕶️</div>;
                  }
                  return null;
                })}
              </div>

              {/* 고양이 캐릭터 본체 */}
              <div className="relative z-10 flex flex-col items-center cursor-pointer group" onClick={() => {
                const moods: MoodType[] = ["unfair", "anxious", "lonely", "lethargic"];
                const nextMood = moods[(moods.indexOf(catMood) + 1) % moods.length];
                setCatMood(nextMood);
                setBubbleText(`${CAT_CHARACTERS[nextMood].name}로 변신했다냥! 어떠냐냥?`);
                gainExp(5, "고양이 교감");
              }}>
                {/* 발판 그림자 */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-primary rounded-full border-2 border-black opacity-80 transition-transform group-hover:scale-110"></div>
                
                {/* 크롭한 실제 고양이 일러스트 이미지 적용 */}
                <img 
                  src={CAT_CHARACTERS[catMood].image} 
                  alt={CAT_CHARACTERS[catMood].name} 
                  className="w-44 h-44 object-contain relative z-10 transition-transform group-hover:-translate-y-2.5 duration-300"
                />
                
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white font-display text-[10px] font-black px-2.5 py-0.5 rounded-full border border-black whitespace-nowrap">
                  {CAT_CHARACTERS[catMood].name}
                </div>
              </div>

            </div>

            {/* 하단: 상점 바로가기 및 퀵메뉴 */}
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsShopOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 bg-[#FFD93D] text-black font-bold text-xs md:text-sm rounded-xl neo-border neo-shadow-sm neo-shadow-active"
              >
                <ShoppingBag className="w-4 h-4" /> 소품 상점 (사과 상점)
              </button>
              
              <button 
                onClick={() => {
                  setActiveTab("chat");
                  setBubbleText("무슨 재밌는 얘기를 들려줄 거냐냥? 🐾");
                }}
                className="flex items-center gap-1.5 px-5 py-3 bg-primary text-black font-bold text-xs md:text-sm rounded-xl neo-border neo-shadow-sm neo-shadow-active"
              >
                <MessageSquare className="w-4 h-4" /> 드림이랑 수다떨기냥
              </button>
            </div>

          </div>
        )}

        {/* =======================================================
            2. AI 채팅 탭 (Chat)
           ======================================================= */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-full bg-white">
            <div className="px-5 py-3 bg-[#E5F9FF] border-b-3 border-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black border-2 border-black overflow-hidden flex items-center justify-center">
                <img src={CAT_CHARACTERS[catMood].image} alt="Profile" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{catName} <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded ml-1">AI 단짝</span></h3>
                <p className="text-xs text-gray-600">끝에 항상 ~냥을 붙여서 상냥하게 대답해준다냥!</p>
              </div>
            </div>

            {/* 메시지 리스트 */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[360px]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "cat" && (
                    <div className="w-8 h-8 rounded-full bg-black border-2 border-black overflow-hidden flex items-center justify-center mr-2 mt-1 shrink-0">
                      <img src={CAT_CHARACTERS[catMood].image} alt="Cat" className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] p-3.5 rounded-2xl font-bold text-xs md:text-sm leading-relaxed neo-border ${
                    msg.sender === "user" 
                      ? "bg-black text-white rounded-tr-none" 
                      : "bg-[#E5F9FF] text-black rounded-tl-none neo-shadow-sm"
                  }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-gray-400 text-right" : "text-gray-500"}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* 채팅 입력창 */}
            <form onSubmit={handleSendChat} className="p-4 border-t-3 border-black bg-white flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`${catName}이에게 오늘 하루를 들려달라냥...`}
                className="flex-1 px-4 py-3 rounded-xl neo-border bg-white font-bold text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                className="p-3 bg-primary text-black rounded-xl neo-border neo-shadow-sm neo-shadow-active hover:bg-primary/90"
              >
                <Send className="w-5 h-5" />
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
                className="p-2 rounded-lg border-2 border-black hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <h2 className="font-display font-black text-lg md:text-xl">
                {currentDate.getFullYear()}년 {String(currentDate.getMonth() + 1).padStart(2, "0")}월
              </h2>
              
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-2 rounded-lg border-2 border-black hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 달력 요일 라벨 */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-black border-b-2 border-black pb-1 text-gray-500">
              <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>

            {/* 달력 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {renderCalendarDays()}
            </div>

            {/* 선택한 날짜의 일정 목록 */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs md:text-sm text-gray-600">
                  📅 {selectedDateStr} 기록
                </h3>
                <button 
                  onClick={() => setIsAddEventOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#FF80B5] text-white font-bold text-xs rounded-lg neo-border-sm neo-shadow-sm"
                >
                  <Plus className="w-3 h-3 stroke-[3]" /> 일정 추가
                </button>
              </div>

              {events.filter(e => e.date === selectedDateStr).length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-bold text-gray-500">이날은 등록된 일정이 없다냥.</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">우측 상단 버튼을 눌러 새 일정을 적어보라냥!</p>
                </div>
              ) : (
                events.filter(e => e.date === selectedDateStr).map(event => (
                  <div key={event.id} className="neo-border rounded-xl p-4 bg-black text-white space-y-2.5 relative">
                    <button 
                      onClick={() => {
                        setEvents(prev => prev.filter(e => e.id !== event.id));
                        toast.success("일정을 삭제했다냥.");
                      }}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="text-[10px] text-[#FF80B5] font-bold">★일정</span>
                      <p className="text-xs md:text-sm font-black">{event.title}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-primary font-bold">★감정</span>
                      <p className="text-xs font-bold text-gray-300">{event.mood}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#FFD93D] font-bold">★감사</span>
                      <p className="text-xs font-bold text-gray-300">{event.thanks}</p>
                    </div>
                  </div>
                ))
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
                <h2 className="font-display text-lg md:text-xl font-black">MIND FOREST</h2>
                <p className="text-xs font-bold text-gray-500">집사들의 실시간 마음 나눔 피드냥 🌳</p>
              </div>
              
              <button 
                onClick={() => setIsCommunityWriteOpen(true)}
                className="flex items-center gap-1 px-4 py-2.5 bg-primary text-black font-bold text-xs rounded-xl neo-border neo-shadow-sm neo-shadow-active"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> 글쓰기
              </button>
            </div>

            {/* 피드 목록 */}
            <div className="space-y-5">
              {feedPosts.map(post => (
                <div key={post.id} className="neo-border rounded-2xl bg-white neo-shadow overflow-hidden">
                  {/* 피드 헤더 */}
                  <div className="p-4 border-b-2 border-black flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-black border-2 border-black overflow-hidden flex items-center justify-center shrink-0">
                        <img src={post.avatar} alt="Avatar" className="w-7 h-7 object-contain" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs md:text-sm">{post.author}</span>
                          <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-black">
                            Lv.{post.authorLevel}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">{post.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* 피드 본문 */}
                  <div className="p-4 border-b-2 border-black">
                    <p className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* 좋아요 & 댓글 액션 */}
                  <div className="px-4 py-2.5 border-b-2 border-black bg-gray-50 flex items-center gap-4">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 text-xs font-black transition-colors ${
                        post.likedByMe ? "text-red-500" : "text-black hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.likedByMe ? "fill-current" : ""}`} />
                      <span>{post.likes}</span>
                    </button>
                    
                    <div className="flex items-center gap-1 text-xs font-black text-black">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>

                  {/* 댓글 목록 */}
                  {post.comments.length > 0 && (
                    <div className="p-4 bg-gray-50/50 space-y-2.5 border-b-2 border-black">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="text-xs font-bold flex items-start gap-1.5">
                          <span className="text-black font-black shrink-0">{comment.author}:</span>
                          <span className="text-gray-700 leading-relaxed">{comment.text}</span>
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
                      className="flex-1 px-3 py-2 rounded-lg neo-border-sm bg-white font-bold text-xs focus:outline-none"
                    />
                    <button 
                      onClick={(e) => {
                        const input = (e.currentTarget.previousSibling as HTMLInputElement);
                        handleAddComment(post.id, input.value);
                        input.value = "";
                      }}
                      className="px-3 bg-black text-white text-xs font-bold rounded-lg neo-border-sm"
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
              <h2 className="font-display text-lg md:text-xl font-black">ADMIN DASHBOARD</h2>
              <p className="text-xs font-bold text-gray-500">서비스 운영 현황 및 관리자 제어 패널냥 🛡️</p>
            </div>

            {!isAdminLoggedIn ? (
              <div className="neo-border rounded-2xl p-5 bg-white neo-shadow space-y-4">
                <h3 className="font-bold text-sm">관리자 비밀번호를 입력해달라냥</h3>
                <div className="space-y-3">
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요 (기본: 1234)"
                    className="w-full px-3.5 py-2.5 rounded-xl neo-border font-bold text-xs focus:outline-none"
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
                    className="w-full py-2.5 bg-black text-white font-bold text-xs rounded-xl neo-border"
                  >
                    로그인
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* 대시보드 요약 통계 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="neo-border rounded-xl p-4 bg-[#E5F9FF] neo-shadow-sm text-center">
                    <span className="text-[10px] text-gray-500 font-bold">누적 가입자</span>
                    <p className="text-lg font-black mt-1">1,248명</p>
                  </div>
                  <div className="neo-border rounded-xl p-4 bg-[#FFD93D] neo-shadow-sm text-center">
                    <span className="text-[10px] text-gray-500 font-bold">오늘 작성 일기</span>
                    <p className="text-lg font-black mt-1">342개</p>
                  </div>
                  <div className="neo-border rounded-xl p-4 bg-[#FF80B5] text-white neo-shadow-sm text-center">
                    <span className="text-[10px] text-white/80 font-bold">커뮤니티 활성</span>
                    <p className="text-lg font-black mt-1">89%</p>
                  </div>
                  <div className="neo-border rounded-xl p-4 bg-black text-white neo-shadow-sm text-center">
                    <span className="text-[10px] text-gray-400 font-bold">소모된 사과 수</span>
                    <p className="text-lg font-black mt-1">4,210개</p>
                  </div>
                </div>

                {/* 관리자 치트키 제어 (테스트용) */}
                <div className="neo-border rounded-2xl p-5 bg-white neo-shadow space-y-4">
                  <h3 className="font-bold text-sm border-b-2 border-black pb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> 관리자 전용 테스트 제어기
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setApples(prev => prev + 5);
                        toast.success("치트 발동! 사과 +5개 지급 완료냥 🍎");
                      }}
                      className="py-2 bg-primary text-black font-bold text-xs rounded-lg neo-border-sm"
                    >
                      🍎 사과 +5개 받기
                    </button>
                    
                    <button 
                      onClick={() => {
                        gainExp(40, "관리자 치트");
                      }}
                      className="py-2 bg-yellow-200 text-black font-bold text-xs rounded-lg neo-border-sm"
                    >
                      ✨ 경험치 +40 받기
                    </button>

                    <button 
                      onClick={() => {
                        setEvents([]);
                        toast.success("모든 일정이 초기화되었다냥.");
                      }}
                      className="py-2 bg-red-100 text-red-700 font-bold text-xs rounded-lg neo-border-sm"
                    >
                      🧹 모든 일정 초기화
                    </button>

                    <button 
                      onClick={() => {
                        setIsAdminLoggedIn(false);
                        setAdminPassword("");
                        toast.info("관리자 모드에서 로그아웃했다냥.");
                      }}
                      className="py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg neo-border-sm"
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

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-primary border-t-4 border-black flex items-center justify-around px-4 z-10">
        
        {/* 채팅 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("chat")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "chat" 
              ? "bg-black text-white scale-110 neo-border-sm" 
              : "text-black hover:bg-black/10"
          }`}
        >
          <MessageSquare className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* 달력 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("calendar")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "calendar" 
              ? "bg-black text-white scale-110 neo-border-sm" 
              : "text-black hover:bg-black/10"
          }`}
        >
          <CalendarIcon className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* 메인 고양이 방 탭 버튼 (중앙) */}
        <button 
          onClick={() => setActiveTab("room")}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl -translate-y-4 transition-all neo-border-lg ${
            activeTab === "room" 
              ? "bg-black text-white neo-shadow" 
              : "bg-white text-black hover:bg-gray-100 neo-shadow-sm"
          }`}
        >
          <img src={CAT_CHARACTERS[catMood].image} alt="Cat Icon" className="w-10 h-10 object-contain" />
        </button>

        {/* 커뮤니티 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("community")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "community" 
              ? "bg-black text-white scale-110 neo-border-sm" 
              : "text-black hover:bg-black/10"
          }`}
        >
          <Users className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* 관리자 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("admin")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "admin" 
              ? "bg-black text-white scale-110 neo-border-sm" 
              : "text-black hover:bg-black/10"
          }`}
        >
          <Shield className="w-5 h-5 stroke-[2.5]" />
        </button>

      </nav>

      {/* --- MODAL: 소품 상점 (Shop Modal) --- */}
      {isShopOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl neo-border neo-shadow-lg p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-black text-base">APPLE SHOP</h3>
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full border border-black flex items-center gap-1">
                  🍎 <span className="font-display font-black">{apples}</span>
                </span>
              </div>
              <button 
                onClick={() => setIsShopOpen(false)}
                className="p-1 rounded-lg border-2 border-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 아이템 리스트 */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {SHOP_ITEMS.map((item) => {
                const isBought = myItems.includes(item.id);
                const isEquipped = equippedItems.includes(item.id);
                
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-black bg-[#FAF8F5]">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl shrink-0">{item.emoji}</span>
                      <div>
                        <h4 className="font-bold text-xs md:text-sm">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 font-bold">{item.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyItem(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 border-black transition-all ${
                        isEquipped 
                          ? "bg-black text-white" 
                          : isBought 
                            ? "bg-gray-200 text-black" 
                            : "bg-primary text-black neo-shadow-sm active:translate-y-0.5 active:shadow-none"
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
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl neo-border neo-shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg">POST BOX</h3>
              <button 
                onClick={() => setIsMailOpen(false)}
                className="p-1 rounded-lg border-2 border-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="neo-border rounded-2xl p-4 bg-[#E5F9FF]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-bold">새 소식</span>
                  <span className="text-xs font-bold text-gray-600">2026-05-30</span>
                </div>
                <h4 className="font-bold text-sm mb-1">{catName}이가 보내는 첫 편지 💌</h4>
                <p className="text-xs font-bold text-gray-700 leading-relaxed">
                  "드림님! 나를 입양하고 매일 대화해 줘서 정말 고맙다냥. 드림님이 기쁠 때나 슬플 때나 난 언제나 곁에 있을 거다냥. 아프지 말고 밥 잘 챙겨 먹기냥!"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: 설정 (Settings Modal) --- */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl neo-border neo-shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg">APP SETTINGS</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg border-2 border-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 고양이 이름 설정 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">고양이 이름</label>
                <input 
                  type="text" 
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl neo-border font-bold text-xs"
                />
              </div>

              {/* 사용자 이름 설정 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">사용자 닉네임</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl neo-border font-bold text-xs"
                />
              </div>

              {/* 입양일 설정 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">입양일수</label>
                <input 
                  type="number" 
                  value={adoptDays}
                  onChange={(e) => setAdoptDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl neo-border font-bold text-xs"
                />
              </div>

              <button 
                onClick={() => {
                  setIsSettingsOpen(false);
                  toast.success("설정이 저장되었습니다냥! 🐾");
                }}
                className="w-full py-2.5 bg-black text-white font-bold text-sm rounded-xl neo-border hover:bg-gray-800"
              >
                설정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: 일정 추가 모달 --- */}
      {isAddEventOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl neo-border neo-shadow-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-display font-black text-sm">ADD SCHEDULE</h3>
              <button 
                onClick={() => setIsAddEventOpen(false)}
                className="p-1 rounded-lg border-2 border-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">날짜</label>
                <input 
                  type="text" 
                  value={selectedDateStr} 
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 rounded-xl border-2 border-black font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">일정 제목</label>
                <input 
                  type="text" 
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="예: 광고주와 미팅"
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">오늘의 감정</label>
                <select 
                  value={inputMood}
                  onChange={(e) => setInputMood(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-xs focus:outline-none"
                >
                  <option>기쁨 😊</option>
                  <option>슬픔 😢</option>
                  <option>피곤 😴</option>
                  <option>불안 😰</option>
                  <option>외로움 🥺</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">오늘의 감사 일기</label>
                <textarea 
                  value={inputThanks}
                  onChange={(e) => setInputThanks(e.target.value)}
                  placeholder="오늘 하루 감사했던 일을 한 줄로 적어달라냥..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-xs focus:outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-[#FF80B5] text-white font-bold text-xs rounded-xl neo-border-sm neo-shadow-sm"
              >
                일정 및 감사일기 등록하기냥 🐾
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: 커뮤니티 글쓰기 모달 --- */}
      {isCommunityWriteOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl neo-border neo-shadow-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-display font-black text-sm">WRITE FEED</h3>
              <button 
                onClick={() => setIsCommunityWriteOpen(false)}
                className="p-1 rounded-lg border-2 border-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500">마음 나누기</label>
                <textarea 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="마음 숲의 다른 집사들과 나누고 싶은 감정을 적어달라냥..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-xs focus:outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-primary text-black font-bold text-xs rounded-xl neo-border-sm neo-shadow-sm"
              >
                피드 올리기냥 📸🐾
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
