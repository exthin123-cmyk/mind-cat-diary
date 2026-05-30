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
  ChevronRight, 
  Heart, 
  Sparkles, 
  Trash2,
  Check,
  Award,
  HelpCircle,
  X
} from "lucide-react";
import { toast } from "sonner";

// 생성한 고양이 캐릭터 이미지 URL 상수 설정 (압축된 webp 포맷 사용)
const CAT_IMAGES = {
  main: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/dream_cat_main-JvUmDzpb3hdUzcJaMBhTPq.webp",
  happy: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/dream_cat_happy-b9yzbeeMi9ed3An8z3WjDZ.webp",
  sad: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/dream_cat_sad-dHLi7oeWEKW5rwUMH4bN6r.webp",
  sleepy: "https://d2xsxph8kpxj0f.cloudfront.net/310519663712963517/8RRVSLjawLcuSnjpxSgnMb/dream_cat_sleepy-JUbmWKfgiaigfZsUaVSGGz.webp"
};

// 감정 타입 정의
type MoodType = "happy" | "sad" | "sleepy" | "normal";

interface Message {
  id: string;
  sender: "user" | "cat";
  text: string;
  timestamp: Date;
}

interface DiaryEntry {
  id: string;
  date: string;
  mood: MoodType;
  title: string;
  content: string;
  catResponse: string;
}

export default function Home() {
  // 현재 탭 상태: 'main' (홈), 'chat' (채팅), 'calendar' (일기 목록), 'stats' (통계/기분)
  const [activeTab, setActiveTab] = useState<"main" | "chat" | "calendar" | "stats">("main");
  
  // 고양이 기분 상태 (캐릭터 이미지 변경용)
  const [catMood, setCatCatMood] = useState<MoodType>("normal");
  
  // 고양이 대화 말풍선 텍스트
  const [bubbleText, setBubbleText] = useState("드림아 좋은 아침!\n오늘 기분은 어때?");
  
  // 사용자의 오늘 상태 입력 말풍선 텍스트
  const [userResponseText, setUserResponseText] = useState("안녕! 오늘 기분은 좀 별로야 ㅠㅠ");

  // 채팅 상태
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "cat",
      text: "안녕 드림님! 오늘 하루는 어땠어? 기쁜 일이나 슬픈 일, 모두 나한테 들려줘! 🐾",
      timestamp: new Date()
    }
  ]);

  // 일기 쓰기 모달 및 리스트 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryMood, setDiaryMood] = useState<MoodType>("happy");
  const [diaries, setDiaryEntries] = useState<DiaryEntry[]>([
    {
      id: "1",
      date: "2026-05-29",
      mood: "happy",
      title: "친구들과 즐거운 한강 피크닉!",
      content: "오늘 날씨가 정말 맑아서 친구들과 돗자리 펴고 한강에서 피자를 먹었다. 바람도 선선하고 고양이들도 많이 봐서 힐링되는 하루였다.",
      catResponse: "우와! 한강 피크닉이라니 정말 부럽다냥! 친구들과 맛있는 피자 먹으면서 보낸 시간은 드림님 마음에 따뜻한 햇살을 가득 채워줬을 거야. 나도 드림님이 행복해서 너무 기쁘다냥! 🍕☀️"
    },
    {
      id: "2",
      date: "2026-05-28",
      mood: "sad",
      title: "프로젝트 마감의 압박...",
      content: "일이 생각대로 풀리지 않아서 스트레스를 많이 받았다. 마감 기한은 다가오는데 버그는 안 잡히고 너무 지치는 밤이다.",
      catResponse: "많이 힘들었겠다냥... 토닥토닥. 드림님이 열심히 하려다 보니 더 마음이 조급해진 걸 거야. 가끔은 버그도 자고 싶어 하니까, 오늘은 푹 쉬고 내일 맑은 정신으로 다시 해보자냥. 내가 항상 응원하고 있다냥! 🐾❤️"
    },
    {
      id: "3",
      date: "2026-05-27",
      mood: "sleepy",
      title: "하루 종일 비가 내리는 날",
      content: "비가 와서 그런지 몸이 천근만근 무거웠다. 아무것도 하기 싫고 침대 누워 하루 종일 넷플릭스만 보며 뒹굴거렸다.",
      catResponse: "비 오는 날은 침대 속이 제일 안전하고 아늑하다냥! 뒹굴거리는 건 시간 낭비가 아니라 드림님의 지친 몸과 마음에 휴식을 주는 소중한 시간이다냥. 푹 쉬었으니 내일은 더 가벼운 발걸음이 될 거다냥~ 💤🌧️"
    }
  ]);

  // 설정 및 알림 모달 상태
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [catName, setCatName] = useState("드림이");
  const [userName, setUserName] = useState("드림님");
  const [adoptDays, setAdoptDays] = useState(10);

  // 채팅창 스크롤 자동 내리기용 ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 홈 화면에서 고양이 기분 변경 인터랙션
  const handleCatClick = () => {
    const moods: MoodType[] = ["happy", "sad", "sleepy", "normal"];
    const currentIdx = moods.indexOf(catMood);
    const nextIdx = (currentIdx + 1) % moods.length;
    const nextMood = moods[nextIdx];
    setCatCatMood(nextMood);

    // 기분에 따른 말풍선 반응
    if (nextMood === "happy") {
      setBubbleText("우와! 드림님이 날 만져주니까\n너무너무 기분이 좋다냥! ⚡");
      setUserResponseText("기분이 좋아 보이네! 나도 기뻐!");
    } else if (nextMood === "sad") {
      setBubbleText("흑흑... 드림님, 혹시 오늘\n슬픈 일이 있었냐냥? 💧");
      setUserResponseText("응... 위로가 필요한 하루야.");
    } else if (nextMood === "sleepy") {
      setBubbleText("하아암... 드림님 품은\n참 따뜻하고 노곤노곤하다냥... 💤");
      setUserResponseText("졸리구나? 우리 같이 푹 자자.");
    } else {
      setBubbleText("드림아 좋은 아침!\n오늘 기분은 어때?");
      setUserResponseText("안녕! 오늘 기분은 좀 별로야 ㅠㅠ");
    }
  };

  // 말풍선 아래 유저 답변 클릭 시 채팅방으로 이동 및 해당 텍스트 전송
  const handleUserResponseClick = () => {
    setActiveTab("chat");
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: userResponseText,
        timestamp: new Date()
      }
    ]);
    
    // 고양이 자동 답장 시뮬레이션
    setTimeout(() => {
      let response = "그랬구나냥... 더 자세히 이야기해 줄 수 있어? 귀 쫑긋 세우고 들을 준비 완료다냥! 🐾";
      if (catMood === "happy") {
        response = "나랑 같이 기쁨을 나눠줘서 너무 고맙다냥! 드림님 덕분에 온 세상이 무지갯빛이다냥! 🌈✨";
      } else if (catMood === "sad") {
        response = "오늘 슬픈 일이 있었구나... 속상해하지 말라냥. 내가 드림님 곁에서 따뜻한 위로의 꾹꾹이를 해줄게냥. 🐾❤️";
      } else if (catMood === "sleepy") {
        response = "몸이 노곤노곤할 땐 따뜻한 우유 한 잔 마시고 푹 자는 게 최고다냥. 오늘 밤엔 좋은 꿈만 꿀 거다냥... 🌙💤";
      }
      
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "cat",
          text: response,
          timestamp: new Date()
        }
      ]);
    }, 1000);
  };

  // 채팅 전송 함수
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: userMsg,
        timestamp: new Date()
      }
    ]);
    setChatInput("");

    // AI 고양이 답장 시뮬레이션
    setTimeout(() => {
      let response = "";
      const lowerMsg = userMsg.toLowerCase();
      
      if (lowerMsg.includes("안녕") || lowerMsg.includes("하이")) {
        response = `안녕 드림님! 오늘 하루도 반갑다냥! 무슨 재미있는 일 있었어?`;
      } else if (lowerMsg.includes("힘들") || lowerMsg.includes("지친") || lowerMsg.includes("피곤")) {
        response = `오늘 정말 고생 많았다냥... 😿 힘든 일은 나한테 다 털어놓고 드림님은 따뜻한 물로 샤워하고 푹 쉬었으면 좋겠다냥. 내가 항상 곁에 있을게냥.`;
        setCatCatMood("sad");
      } else if (lowerMsg.includes("좋은") || lowerMsg.includes("행복") || lowerMsg.includes("기뻐")) {
        response = `와아! 드림님이 행복하다니 나도 꼬리가 절로 살랑살랑 흔들린다냥! 😸 이 행복한 기운이 내일까지 쭉 이어지길 바란다냥! 🎉`;
        setCatCatMood("happy");
      } else if (lowerMsg.includes("졸려") || lowerMsg.includes("자고") || lowerMsg.includes("잘래")) {
        response = `하아암... 드림님이 졸리니까 나도 눈꺼풀이 무거워진다냥... 💤 이불 꼭 덮고 꿀잠 자라냥. 내 꿈에서 만나자냥!`;
        setCatCatMood("sleepy");
      } else {
        response = `그랬구나냥! 드림님의 이야기를 듣는 건 언제나 즐겁다냥. 내가 드림님의 감정을 다 기억해 두고 예쁜 일기장에 적어줄게냥! 📝🐾`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "cat",
          text: response,
          timestamp: new Date()
        }
      ]);
    }, 1000);
  };

  // 일기 등록 함수
  const handleSaveDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryTitle.trim() || !diaryContent.trim()) {
      toast.error("제목과 내용을 모두 입력해 주세요!");
      return;
    }

    // 감정에 따른 고양이 피드백 생성
    let catResponse = "";
    if (diaryMood === "happy") {
      catResponse = `우와! 정말 행복한 하루였나 보다냥! 드림님의 마음속 기쁨이 글에서도 고스란히 전해진다냥. 이 기쁜 추억을 가슴속에 예쁘게 저장하자냥! 💖`;
    } else if (diaryMood === "sad") {
      catResponse = `토닥토닥... 비가 온 뒤에 땅이 굳는 것처럼, 오늘의 아픔이 드림님을 더 단단하게 만들어 줄 거다냥. 힘든 감정을 솔직하게 글로 적은 것만으로도 대단하다냥. 내가 안아줄게냥 🐾`;
    } else {
      catResponse = `스르륵... 오늘 하루도 무사히 마친 스스로에게 박수를 보내자냥. 침대 속에서 이불 폭 덮고 푹 쉬는 게 최고의 힐링이다냥. 고생 많았다냥 💤`;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: todayStr,
      mood: diaryMood,
      title: diaryTitle,
      content: diaryContent,
      catResponse
    };

    setDiaryEntries([newEntry, ...diaries]);
    setIsWriteModalOpen(false);
    setDiaryTitle("");
    setDiaryContent("");
    toast.success("오늘의 일기가 성공적으로 저장되었습니다냥! 🐾");
    setActiveTab("calendar");
  };

  // 일기 삭제 함수
  const handleDeleteDiary = (id: string) => {
    setDiaryEntries(diaries.filter(d => d.id !== id));
    toast.success("일기가 삭제되었습니다냥.");
  };

  // 고양이 이미지 가져오기
  const getCatImage = () => {
    switch (catMood) {
      case "happy": return CAT_IMAGES.happy;
      case "sad": return CAT_IMAGES.sad;
      case "sleepy": return CAT_IMAGES.sleepy;
      default: return CAT_IMAGES.main;
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full bg-white select-none">
      
      {/* --- TOP BAR --- */}
      <header className="px-6 py-4 flex items-center justify-between border-b-4 border-black bg-white z-10">
        <button 
          onClick={() => setIsMailOpen(true)}
          className="p-2.5 rounded-xl neo-border bg-white neo-shadow-sm neo-shadow-active hover:bg-primary/10 transition-colors"
        >
          <Mail className="w-5 h-5 stroke-[2.5]" />
        </button>
        
        <h1 className="font-display text-xl md:text-2xl font-black tracking-tight flex items-center gap-1.5">
          MIND CAT DIARY
        </h1>
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 rounded-xl neo-border bg-white neo-shadow-sm neo-shadow-active hover:bg-primary/10 transition-colors"
        >
          <Settings className="w-5 h-5 stroke-[2.5]" />
        </button>
      </header>

      {/* --- MAIN CONTENT SCROLL AREA --- */}
      <main className="flex-1 overflow-y-auto bg-white pb-24">
        
        {/* 1. 홈 탭 (Main) */}
        {activeTab === "main" && (
          <div className="p-6 flex flex-col items-center h-full justify-between min-h-[520px]">
            
            {/* 입양 상태 및 고양이 메시지 */}
            <div className="w-full text-center mt-2">
              <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded-full mb-2">
                {catName} 입양 {adoptDays}일차
              </div>
              <p className="text-sm font-bold text-gray-700">
                {catName}이가 {userName}의 감정을 궁금해 합니다
              </p>
            </div>

            {/* 고양이 대화 말풍선 */}
            <div className="relative mt-4 w-full max-w-[320px]">
              <div className="neo-border bg-white rounded-2xl p-4 neo-shadow text-center font-bold text-sm leading-relaxed relative">
                {bubbleText.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                {/* 말풍선 아래 화살표 꼬리 */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-4 border-black rotate-45"></div>
              </div>
            </div>

            {/* 검은 고양이 캐릭터 인터랙션 영역 */}
            <div className="relative my-6 group cursor-pointer" onClick={handleCatClick}>
              {/* 고양이 발판/그림자 */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-8 bg-primary rounded-full border-3 border-black opacity-90 transition-transform group-hover:scale-110"></div>
              
              {/* 고양이 캐릭터 이미지 */}
              <img 
                src={getCatImage()} 
                alt="Dream Cat" 
                className="w-56 h-56 object-contain relative z-10 transition-transform group-hover:-translate-y-2 duration-300"
              />
              
              {/* 레벨 배지 */}
              <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 bg-black text-white font-display text-xs font-black px-2.5 py-1 rounded-full neo-border border-white z-20">
                Lv.01
              </div>

              {/* 캐릭터 이름 */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-display text-lg font-black text-black z-20">
                {catName}
              </div>
            </div>

            {/* 사용자의 오늘 기분 답변 버튼 */}
            <div className="w-full max-w-[320px] mt-10">
              <button 
                onClick={handleUserResponseClick}
                className="w-full py-3 px-4 bg-black text-white rounded-2xl font-bold text-xs md:text-sm tracking-tight text-center relative hover:bg-gray-800 transition-colors neo-shadow-sm active:translate-y-0.5 active:shadow-none"
              >
                {userResponseText}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rotate-45"></div>
              </button>
            </div>

          </div>
        )}

        {/* 2. AI 채팅 탭 (Chat) */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-full bg-white">
            {/* 고양이 프로필 헤더 */}
            <div className="px-6 py-3 bg-[#E5F9FF] border-b-3 border-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black border-2 border-black overflow-hidden flex items-center justify-center">
                <img src={CAT_IMAGES.main} alt="Profile" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{catName} <span className="text-xs bg-black text-white px-1.5 py-0.5 rounded ml-1">AI 단짝</span></h3>
                <p className="text-xs text-gray-600">지금 드림님의 이야기에 귀 기울이고 있어요</p>
              </div>
            </div>

            {/* 메시지 리스트 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "cat" && (
                    <div className="w-8 h-8 rounded-full bg-black border-2 border-black overflow-hidden flex items-center justify-center mr-2 mt-1 shrink-0">
                      <img src={getCatImage()} alt="Cat" className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] p-3.5 rounded-2xl font-bold text-sm leading-relaxed neo-border ${
                    msg.sender === "user" 
                      ? "bg-black text-white rounded-tr-none" 
                      : "bg-[#E5F9FF] text-black rounded-tl-none neo-shadow-sm"
                  }`}>
                    {msg.text}
                    <div className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-gray-400 text-right" : "text-gray-500"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                placeholder={`${catName}이에게 오늘 일을 들려주세요...`}
                className="flex-1 px-4 py-3 rounded-xl neo-border bg-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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

        {/* 3. 일기장 탭 (Calendar) */}
        {activeTab === "calendar" && (
          <div className="p-6 space-y-6">
            
            {/* 상단 섹션: 일기 추가 및 소개 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-black">DIARY LOG</h2>
                <p className="text-xs font-bold text-gray-600">감정이 담긴 드림이와의 추억들</p>
              </div>
              <button 
                onClick={() => setIsWriteModalOpen(true)}
                className="flex items-center gap-1 px-4 py-2.5 bg-primary text-black font-bold text-sm rounded-xl neo-border neo-shadow-sm neo-shadow-active"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> 일기 쓰기
              </button>
            </div>

            {/* 일기 리스트 */}
            <div className="space-y-4">
              {diaries.length === 0 ? (
                <div className="text-center py-16 neo-border rounded-2xl bg-[#FAF8F5] p-6">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="font-bold text-gray-700">아직 기록된 일기가 없습니다냥.</p>
                  <p className="text-xs text-gray-500 mt-1">첫 번째 감정 일기를 작성해 보세요!</p>
                </div>
              ) : (
                diaries.map((entry) => (
                  <div key={entry.id} className="neo-border rounded-2xl p-5 bg-white neo-shadow relative group">
                    {/* 상단: 날짜 및 기분 아이콘 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-1 bg-black text-white rounded-full">
                          {entry.date}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border-2 border-black ${
                          entry.mood === "happy" ? "bg-yellow-200" :
                          entry.mood === "sad" ? "bg-blue-200" : "bg-purple-200"
                        }`}>
                          {entry.mood === "happy" ? "😊 기쁨" :
                           entry.mood === "sad" ? "😢 슬픔" : "😴 피곤"}
                        </span>
                      </div>
                      
                      {/* 삭제 버튼 */}
                      <button 
                        onClick={() => handleDeleteDiary(entry.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 일기 제목 & 본문 */}
                    <h3 className="font-bold text-base mb-2">{entry.title}</h3>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed mb-4 whitespace-pre-line">
                      {entry.content}
                    </p>

                    {/* 고양이 코멘트 답변 말풍선 */}
                    <div className="bg-[#E5F9FF] rounded-xl p-4 border-2 border-black relative">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-black border-2 border-black overflow-hidden flex items-center justify-center shrink-0">
                          <img 
                            src={
                              entry.mood === "happy" ? CAT_IMAGES.happy :
                              entry.mood === "sad" ? CAT_IMAGES.sad : CAT_IMAGES.sleepy
                            } 
                            alt="Cat profile" 
                            className="w-5.5 h-5.5 object-contain" 
                          />
                        </div>
                        <div>
                          <span className="text-xs font-black text-black block mb-0.5">{catName}의 위로냥</span>
                          <p className="text-xs text-gray-800 font-bold leading-relaxed">
                            {entry.catResponse}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* 4. 감정 분석 및 통계 탭 (Stats) */}
        {activeTab === "stats" && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="font-display text-xl font-black">MOOD STATS</h2>
              <p className="text-xs font-bold text-gray-600">{userName}의 감정 캘린더 & 마음 보고서</p>
            </div>

            {/* 이번 달 마음 보고서 카드 */}
            <div className="neo-border rounded-2xl p-5 bg-primary text-black neo-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 fill-current" />
                <h3 className="font-display font-black text-base">MAY REPORT</h3>
              </div>
              <p className="text-sm font-bold leading-relaxed">
                이번 달은 대체로 <span className="bg-black text-white px-1.5 py-0.5 rounded">기쁨 😊</span> 감정이 가장 많았어요! 
                {catName}이와 함께 나누며 감정의 온도가 1.2도 더 따뜻해졌답니다냥.
              </p>
            </div>

            {/* 감정 분포 차트 */}
            <div className="neo-border rounded-2xl p-5 bg-white neo-shadow space-y-4">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4" /> 감정 분포도
              </h4>
              
              <div className="space-y-3">
                {/* 기쁨 */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>😊 기쁨 (Happy)</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full border-2 border-black overflow-hidden">
                    <div className="h-full bg-yellow-300 border-r-2 border-black" style={{ width: "60%" }}></div>
                  </div>
                </div>

                {/* 슬픔 */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>😢 슬픔 (Sad)</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full border-2 border-black overflow-hidden">
                    <div className="h-full bg-blue-300 border-r-2 border-black" style={{ width: "25%" }}></div>
                  </div>
                </div>

                {/* 피곤 */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>😴 피곤 (Sleepy)</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full border-2 border-black overflow-hidden">
                    <div className="h-full bg-purple-300 border-r-2 border-black" style={{ width: "15%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 감정 가이드 및 미션 */}
            <div className="neo-border rounded-2xl p-5 bg-[#FAF8F5] neo-shadow space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-500 fill-current" /> 오늘의 마음 돌봄 미션
              </h4>
              <ul className="text-xs font-bold text-gray-700 space-y-2.5">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary border-2 border-black flex items-center justify-center text-black shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  따뜻한 물 한 잔 마시기
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary border-2 border-black flex items-center justify-center text-black shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  하늘 올려다보고 3초간 심호흡하기
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white border-2 border-black flex items-center justify-center text-black shrink-0"></div>
                  {catName}이 쓰다듬고 대화 나누기
                </li>
              </ul>
            </div>

          </div>
        )}

      </main>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-primary border-t-4 border-black flex items-center justify-around px-4 z-10">
        
        {/* 채팅 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("chat")}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
            activeTab === "chat" 
              ? "bg-black text-white scale-110 neo-border-sm" 
              : "text-black hover:bg-black/10"
          }`}
        >
          <MessageSquare className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 메인 홈 탭 버튼 (중앙 검은 고양이 아이콘) */}
        <button 
          onClick={() => setActiveTab("main")}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl -translate-y-4 transition-all neo-border-lg ${
            activeTab === "main" 
              ? "bg-black text-white neo-shadow" 
              : "bg-white text-black hover:bg-gray-100 neo-shadow-sm"
          }`}
        >
          <img src={CAT_IMAGES.main} alt="Cat Icon" className="w-10 h-10 object-contain" />
        </button>

        {/* 일기 목록 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("calendar")}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
            activeTab === "calendar" 
              ? "bg-black text-white scale-110 neo-border-sm" 
              : "text-black hover:bg-black/10"
          }`}
        >
          <CalendarIcon className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 감정 통계 탭 버튼 */}
        <button 
          onClick={() => setActiveTab("stats")}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
            activeTab === "stats" 
              ? "bg-black text-white scale-110 neo-border-sm" 
              : "text-black hover:bg-black/10"
          }`}
        >
          <Smile className="w-6 h-6 stroke-[2.5]" />
        </button>

      </nav>

      {/* --- MODAL: 일기 쓰기 (Write Diary Modal) --- */}
      {isWriteModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl neo-border neo-shadow-lg p-6 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg">WRITE DIARY</h3>
              <button 
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 rounded-lg border-2 border-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDiary} className="space-y-4">
              {/* 기분 선택 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">오늘의 마음 날씨</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "happy", label: "😊 기쁨", color: "bg-yellow-200" },
                    { type: "sad", label: "😢 슬픔", color: "bg-blue-200" },
                    { type: "sleepy", label: "😴 피곤", color: "bg-purple-200" }
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setDiaryMood(item.type as MoodType)}
                      className={`py-2.5 rounded-xl font-bold text-xs border-2 border-black transition-all ${
                        diaryMood === item.type 
                          ? `${item.color} neo-shadow-sm scale-105` 
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 제목 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">일기 제목</label>
                <input 
                  type="text" 
                  value={diaryTitle}
                  onChange={(e) => setDiaryTitle(e.target.value)}
                  placeholder="오늘 있었던 핵심 사건은?"
                  className="w-full px-3.5 py-2.5 rounded-xl neo-border font-bold text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* 내용 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">일기 내용</label>
                <textarea 
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  placeholder="마음을 담아 오늘 하루를 자유롭게 적어보세요..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl neo-border font-bold text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* 저장 버튼 */}
              <button 
                type="submit"
                className="w-full py-3 bg-primary text-black font-bold text-sm rounded-xl neo-border neo-shadow-sm neo-shadow-active"
              >
                저장하고 드림이의 위로 받기냥 🐾
              </button>
            </form>
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

              <div className="neo-border rounded-2xl p-4 bg-gray-50 opacity-60">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] bg-gray-400 text-white px-1.5 py-0.5 rounded font-bold">읽음</span>
                  <span className="text-xs font-bold text-gray-500">2026-05-20</span>
                </div>
                <h4 className="font-bold text-sm mb-1">입양 축하 메시지 🎉</h4>
                <p className="text-xs font-bold text-gray-600 leading-relaxed">
                  Mind Cat Diary 패밀리가 되신 것을 환영합니다! 검은 고양이와 감정을 공유해 보세요.
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
                  className="w-full px-3.5 py-2 rounded-xl neo-border font-bold text-xs md:text-sm"
                />
              </div>

              {/* 사용자 이름 설정 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">사용자 닉네임</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl neo-border font-bold text-xs md:text-sm"
                />
              </div>

              {/* 입양일 설정 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">입양일수</label>
                <input 
                  type="number" 
                  value={adoptDays}
                  onChange={(e) => setAdoptDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl neo-border font-bold text-xs md:text-sm"
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

    </div>
  );
}
