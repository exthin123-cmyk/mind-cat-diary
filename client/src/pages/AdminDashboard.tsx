import { useState, useEffect } from "react";
import { Save, Upload, Trash, Search, LogOut, Plus, Edit, X, Check, RotateCcw, Bell, Music, Users, FileText, BarChart2, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// --- 타입 정의 ---
interface Question {
  id: string;
  text: string;
  category?: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  emoji: string;
  specialty: string;
  rarity: "일반" | "언커먼" | "레어" | "레전더리";
  image?: string;
}

interface AdminUser {
  id: string;
  username: string;
  role: "admin" | "user" | "premium";
  createdAt: number;
  lastActive: number;
  status: "active" | "inactive" | "banned";
  email?: string;
}

interface AdminLog {
  id: string;
  timestamp: number;
  admin: string;
  action: string;
  details: string;
  category: "content" | "user" | "ad" | "music" | "notification" | "system";
}

interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  type: "info" | "warning" | "event";
  isRead?: boolean;
}

interface AdBanner {
  id: string;
  text: string;
  link: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  imageUrl?: string;
}

interface HistoryEntry {
  id: string;
  timestamp: number;
  description: string;
  data: Record<string, unknown>;
}

interface PageName {
  id: string;
  key: string;
  label: string;
}

const STORAGE_KEYS = {
  questions: "mindcat_questions",
  characters: "mindcat_characters",
  adminUsers: "mindcat_admin_users",
  adminLogs: "mindcat_admin_logs",
  notifications: "mindcat_notifications",
  musicFiles: "mindcat_music_files",
  adBanners: "mindcat_ad_banners",
  history: "mindcat_admin_history",
  pageNames: "mindcat_page_names",
  onboarding: "mindcat_onboarding_texts",
  // Home.tsx와 공유하는 키 (일반 화면에 반영됨)
  adminSettings: "mindcat_admin_settings",
};

const DEFAULT_PAGE_NAMES: PageName[] = [
  { id: "1", key: "home", label: "홈" },
  { id: "2", key: "chat", label: "대화" },
  { id: "3", key: "diary", label: "일기" },
  { id: "4", key: "calendar", label: "달력" },
  { id: "5", key: "community", label: "마음 숲" },
  { id: "6", key: "report", label: "리포트" },
  { id: "7", key: "dex", label: "도감" },
];

const DEFAULT_ONBOARDING = [
  "Mind Cat Diary에 오신 걸 환영한다냥!",
  "감정 테스트로 나만의 감정냥이를 만나보라냥!",
  "매일 일기를 쓰면 감정냥이가 성장한다냥!",
  "커뮤니티에서 다른 냥이들과 소통해보라냥!",
];

export default function AdminDashboard() {
  // --- DB 연동 ---
  const { data: dbConfig } = trpc.adminConfig.get.useQuery();
  const saveConfigMutation = trpc.adminConfig.save.useMutation({
    onSuccess: () => toast.success("DB에 저장되었다냥! 모든 기기에 반영됩니다! ✅"),
    onError: () => toast.error("DB 저장 실패. localStorage에만 저장됩니다."),
  });

  // --- 탭 상태 ---
  const [activeTab, setActiveTab] = useState<"content" | "users" | "ads" | "music" | "notifications" | "logs" | "history" | "settings">("content");

  // --- 데이터 상태 ---
  const [questions, setQuestions] = useState<Question[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [musicFiles, setMusicFiles] = useState<Record<string, string>>({});
  const [adBanners, setAdBanners] = useState<AdBanner[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [pageNames, setPageNames] = useState<PageName[]>(DEFAULT_PAGE_NAMES);
  const [onboardingTexts, setOnboardingTexts] = useState<string[]>(DEFAULT_ONBOARDING);

  // --- 일반 화면 연동 설정 (Home.tsx와 공유) ---
  const [adminSettings, setAdminSettings] = useState({
    pageNames: { home: "홈", chat: "대화", diary: "일기", calendar: "달력", community: "마음 숲", report: "리포트", dex: "도감" },
    gameLinks: { mindBlock: "", musicListen: "" },
    ads: { bannerText: "상담이 필요하신가요?", bannerLink: "" },
    adminPassword: "123456"
  });

  // --- 폼 상태: 질문 ---
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState("일반");
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState("");

  // --- 폼 상태: 캐릭터 ---
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({ name: "", description: "", emoji: "😺", specialty: "", rarity: "일반" });
  const [editingCharacter, setEditingCharacter] = useState<string | null>(null);
  const [editingCharacterData, setEditingCharacterData] = useState<Partial<Character>>({});

  // --- 폼 상태: 회원 ---
  const [searchQuery, setSearchQuery] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "active" | "inactive" | "banned">("all");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "admin" | "user" | "premium">("all");
  const [messageTarget, setMessageTarget] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");

  // --- 폼 상태: 광고 ---
  const [newBanner, setNewBanner] = useState<Partial<AdBanner>>({ text: "", link: "", startDate: "", endDate: "", isActive: true });
  const [editingBanner, setEditingBanner] = useState<string | null>(null);

  // --- 폼 상태: 공지 ---
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationContent, setNotificationContent] = useState("");
  const [notificationType, setNotificationType] = useState<"info" | "warning" | "event">("info");

  // --- 폼 상태: 페이지명 ---
  const [editingPageName, setEditingPageName] = useState<string | null>(null);
  const [editingPageLabel, setEditingPageLabel] = useState("");
  const [newPageKey, setNewPageKey] = useState("");
  const [newPageLabel, setNewPageLabel] = useState("");

  // --- 폼 상태: 온보딩 ---
  const [editingOnboarding, setEditingOnboarding] = useState<number | null>(null);
  const [editingOnboardingText, setEditingOnboardingText] = useState("");
  const [newOnboardingText, setNewOnboardingText] = useState("");

  // --- 로그 필터 ---
  const [logFilter, setLogFilter] = useState<"all" | "content" | "user" | "ad" | "music" | "notification" | "system">("all");

  // --- 초기 데이터 로드 ---
  useEffect(() => {
    const load = <T,>(key: string, fallback: T): T => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
      } catch { return fallback; }
    };
    setQuestions(load(STORAGE_KEYS.questions, []));
    setCharacters(load(STORAGE_KEYS.characters, []));
    setAdminUsers(load(STORAGE_KEYS.adminUsers, []));
    setAdminLogs(load(STORAGE_KEYS.adminLogs, []));
    setNotifications(load(STORAGE_KEYS.notifications, []));
    setMusicFiles(load(STORAGE_KEYS.musicFiles, {}));
    setAdBanners(load(STORAGE_KEYS.adBanners, []));
    setHistory(load(STORAGE_KEYS.history, []));
    setPageNames(load(STORAGE_KEYS.pageNames, DEFAULT_PAGE_NAMES));
    setOnboardingTexts(load(STORAGE_KEYS.onboarding, DEFAULT_ONBOARDING));
    setAdminSettings(load(STORAGE_KEYS.adminSettings, {
      pageNames: { home: "홈", chat: "대화", diary: "일기", calendar: "달력", community: "마음 숲", report: "리포트", dex: "도감" },
      gameLinks: { mindBlock: "", musicListen: "" },
      ads: { bannerText: "상담이 필요하신가요?", bannerLink: "" },
      adminPassword: "123456"
    }));
  }, []);

  // DB에서 불러온 설정으로 덮어쓰기
  useEffect(() => {
    if (dbConfig) {
      setAdminSettings(prev => ({
        ...prev,
        gameLinks: {
          mindBlock: dbConfig.mindBlockLink || "",
          musicListen: dbConfig.musicGameLink || "",
        },
        ads: {
          bannerText: dbConfig.adBannerText || "상담이 필요하신가요?",
          bannerLink: dbConfig.adBannerLink || "",
        },
        adminPassword: dbConfig.adminPassword || "123456",
      }));
    }
  }, [dbConfig]);

  // --- 로그 저장 ---
  const addLog = (action: string, details: string, category: AdminLog["category"] = "system") => {
    const newLog: AdminLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      admin: "admin",
      action,
      details,
      category,
    };
    setAdminLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 200);
      localStorage.setItem(STORAGE_KEYS.adminLogs, JSON.stringify(updated));
      return updated;
    });
  };

  // --- 변경 이력 저장 ---
  const saveHistory = (description: string, data: Record<string, unknown>) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      description,
      data,
    };
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(updated));
      return updated;
    });
  };

  // --- 변경 이력 복원 ---
  const restoreHistory = (entry: HistoryEntry) => {
    if (entry.data.questions) {
      const q = entry.data.questions as Question[];
      setQuestions(q);
      localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(q));
    }
    if (entry.data.characters) {
      const c = entry.data.characters as Character[];
      setCharacters(c);
      localStorage.setItem(STORAGE_KEYS.characters, JSON.stringify(c));
    }
    addLog("변경 이력 복원", entry.description, "system");
    toast.success("이전 버전으로 복원되었다냥! ↩️");
  };

  // ===================== 질문 관리 =====================
  const addQuestion = () => {
    if (!newQuestion.trim()) { toast.error("질문을 입력해주세요!"); return; }
    const q: Question = { id: Date.now().toString(), text: newQuestion, category: newQuestionCategory };
    const updated = [...questions, q];
    setQuestions(updated);
    localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(updated));
    saveHistory("질문 추가", { questions: updated });
    addLog("질문 추가", newQuestion, "content");
    setNewQuestion("");
    toast.success("질문이 추가되었다냥! 📝");
  };

  const updateQuestion = (id: string) => {
    const updated = questions.map(q => q.id === id ? { ...q, text: editingQuestionText } : q);
    setQuestions(updated);
    localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(updated));
    saveHistory("질문 수정", { questions: updated });
    addLog("질문 수정", editingQuestionText, "content");
    setEditingQuestion(null);
    toast.success("질문이 수정되었다냥! ✏️");
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(updated));
    saveHistory("질문 삭제", { questions: updated });
    addLog("질문 삭제", "질문 삭제됨", "content");
    toast.success("질문이 삭제되었다냥! 🗑️");
  };

  // ===================== 캐릭터 관리 =====================
  const addCharacter = () => {
    if (!newCharacter.name?.trim()) { toast.error("캐릭터 이름을 입력해주세요!"); return; }
    const c: Character = {
      id: Date.now().toString(),
      name: newCharacter.name || "",
      description: newCharacter.description || "",
      emoji: newCharacter.emoji || "😺",
      specialty: newCharacter.specialty || "",
      rarity: newCharacter.rarity || "일반",
      image: newCharacter.image || "",
    };
    const updated = [...characters, c];
    setCharacters(updated);
    localStorage.setItem(STORAGE_KEYS.characters, JSON.stringify(updated));
    saveHistory("캐릭터 추가", { characters: updated });
    addLog("캐릭터 추가", c.name, "content");
    setNewCharacter({ name: "", description: "", emoji: "😺", specialty: "", rarity: "일반" });
    toast.success("캐릭터가 추가되었다냥! 😺");
  };

  const updateCharacter = (id: string) => {
    const updated = characters.map(c => c.id === id ? { ...c, ...editingCharacterData } : c);
    setCharacters(updated);
    localStorage.setItem(STORAGE_KEYS.characters, JSON.stringify(updated));
    saveHistory("캐릭터 수정", { characters: updated });
    addLog("캐릭터 수정", editingCharacterData.name || "수정됨", "content");
    setEditingCharacter(null);
    toast.success("캐릭터가 수정되었다냥! ✏️");
  };

  const deleteCharacter = (id: string) => {
    const updated = characters.filter(c => c.id !== id);
    setCharacters(updated);
    localStorage.setItem(STORAGE_KEYS.characters, JSON.stringify(updated));
    saveHistory("캐릭터 삭제", { characters: updated });
    addLog("캐릭터 삭제", "캐릭터 삭제됨", "content");
    toast.success("캐릭터가 삭제되었다냥! 🗑️");
  };

  // ===================== 페이지명 관리 =====================
  const updatePageName = (id: string) => {
    const updated = pageNames.map(p => p.id === id ? { ...p, label: editingPageLabel } : p);
    setPageNames(updated);
    localStorage.setItem(STORAGE_KEYS.pageNames, JSON.stringify(updated));
    addLog("페이지명 수정", editingPageLabel, "content");
    setEditingPageName(null);
    toast.success("페이지 이름이 수정되었다냥! ✏️");
  };

  const addPageName = () => {
    if (!newPageKey.trim() || !newPageLabel.trim()) { toast.error("키와 이름을 입력해주세요!"); return; }
    const p: PageName = { id: Date.now().toString(), key: newPageKey, label: newPageLabel };
    const updated = [...pageNames, p];
    setPageNames(updated);
    localStorage.setItem(STORAGE_KEYS.pageNames, JSON.stringify(updated));
    addLog("페이지 추가", newPageLabel, "content");
    setNewPageKey(""); setNewPageLabel("");
    toast.success("페이지가 추가되었다냥! 📄");
  };

  const deletePageName = (id: string) => {
    const updated = pageNames.filter(p => p.id !== id);
    setPageNames(updated);
    localStorage.setItem(STORAGE_KEYS.pageNames, JSON.stringify(updated));
    addLog("페이지 삭제", "페이지 삭제됨", "content");
    toast.success("페이지가 삭제되었다냥! 🗑️");
  };

  // ===================== 온보딩 관리 =====================
  const updateOnboarding = (index: number) => {
    const updated = [...onboardingTexts];
    updated[index] = editingOnboardingText;
    setOnboardingTexts(updated);
    localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(updated));
    addLog("온보딩 수정", editingOnboardingText, "content");
    setEditingOnboarding(null);
    toast.success("온보딩 텍스트가 수정되었다냥! ✏️");
  };

  const addOnboarding = () => {
    if (!newOnboardingText.trim()) { toast.error("텍스트를 입력해주세요!"); return; }
    const updated = [...onboardingTexts, newOnboardingText];
    setOnboardingTexts(updated);
    localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(updated));
    addLog("온보딩 추가", newOnboardingText, "content");
    setNewOnboardingText("");
    toast.success("온보딩 텍스트가 추가되었다냥! 📝");
  };

  const deleteOnboarding = (index: number) => {
    const updated = onboardingTexts.filter((_, i) => i !== index);
    setOnboardingTexts(updated);
    localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(updated));
    addLog("온보딩 삭제", "온보딩 텍스트 삭제됨", "content");
    toast.success("온보딩 텍스트가 삭제되었다냥! 🗑️");
  };

  // ===================== 회원 관리 =====================
  const changeUserStatus = (id: string, status: AdminUser["status"]) => {
    const updated = adminUsers.map(u => u.id === id ? { ...u, status } : u);
    setAdminUsers(updated);
    localStorage.setItem(STORAGE_KEYS.adminUsers, JSON.stringify(updated));
    addLog("회원 상태 변경", `상태: ${status}`, "user");
    toast.success("회원 상태가 변경되었다냥! 👤");
  };

  const changeUserRole = (id: string, role: AdminUser["role"]) => {
    const updated = adminUsers.map(u => u.id === id ? { ...u, role } : u);
    setAdminUsers(updated);
    localStorage.setItem(STORAGE_KEYS.adminUsers, JSON.stringify(updated));
    addLog("회원 역할 변경", `역할: ${role}`, "user");
    toast.success("회원 역할이 변경되었다냥! 👤");
  };

  const deleteUser = (id: string) => {
    const updated = adminUsers.filter(u => u.id !== id);
    setAdminUsers(updated);
    localStorage.setItem(STORAGE_KEYS.adminUsers, JSON.stringify(updated));
    addLog("회원 강제 삭제", "회원 삭제됨", "user");
    toast.success("회원이 삭제되었다냥! 🗑️");
  };

  const sendMessageToUser = (userId: string) => {
    if (!messageContent.trim()) { toast.error("메시지를 입력해주세요!"); return; }
    addLog("회원 메시지 발송", `${userId}에게 메시지 발송`, "user");
    setMessageTarget(null);
    setMessageContent("");
    toast.success("메시지가 발송되었다냥! 💬");
  };

  const filteredUsers = adminUsers.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = userStatusFilter === "all" || u.status === userStatusFilter;
    const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  // ===================== 광고 배너 관리 =====================
  const addBanner = () => {
    if (!newBanner.text?.trim() || !newBanner.link?.trim()) { toast.error("배너 텍스트와 링크를 입력해주세요!"); return; }
    const b: AdBanner = {
      id: Date.now().toString(),
      text: newBanner.text || "",
      link: newBanner.link || "",
      startDate: newBanner.startDate || "",
      endDate: newBanner.endDate || "",
      isActive: newBanner.isActive ?? true,
      imageUrl: newBanner.imageUrl || "",
    };
    const updated = [...adBanners, b];
    setAdBanners(updated);
    localStorage.setItem(STORAGE_KEYS.adBanners, JSON.stringify(updated));
    addLog("광고 배너 추가", b.text, "ad");
    setNewBanner({ text: "", link: "", startDate: "", endDate: "", isActive: true });
    toast.success("광고 배너가 추가되었다냥! 📢");
  };

  const toggleBanner = (id: string) => {
    const updated = adBanners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    setAdBanners(updated);
    localStorage.setItem(STORAGE_KEYS.adBanners, JSON.stringify(updated));
    addLog("광고 배너 상태 변경", "배너 활성화/비활성화", "ad");
    toast.success("배너 상태가 변경되었다냥!");
  };

  const deleteBanner = (id: string) => {
    const updated = adBanners.filter(b => b.id !== id);
    setAdBanners(updated);
    localStorage.setItem(STORAGE_KEYS.adBanners, JSON.stringify(updated));
    addLog("광고 배너 삭제", "배너 삭제됨", "ad");
    toast.success("배너가 삭제되었다냥! 🗑️");
  };

  // ===================== 음악 파일 관리 =====================
  const handleMusicUpload = (charType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const updated = { ...musicFiles, [charType]: base64 };
      setMusicFiles(updated);
      localStorage.setItem(STORAGE_KEYS.musicFiles, JSON.stringify(updated));
      addLog("음악 파일 업로드", `${charType} 음악 업로드`, "music");
      toast.success(`${charType} 음악이 업로드되었다냥! 🎵`);
    };
    reader.readAsDataURL(file);
  };

  const deleteMusicFile = (charType: string) => {
    const updated = { ...musicFiles };
    delete updated[charType];
    setMusicFiles(updated);
    localStorage.setItem(STORAGE_KEYS.musicFiles, JSON.stringify(updated));
    addLog("음악 파일 삭제", `${charType} 음악 삭제`, "music");
    toast.success(`${charType} 음악이 삭제되었다냥! 🗑️`);
  };

  // ===================== 공지사항 관리 =====================
  const sendNotification = () => {
    if (!notificationTitle.trim() || !notificationContent.trim()) { toast.error("제목과 내용을 입력해주세요!"); return; }
    const n: Notification = {
      id: Date.now().toString(),
      title: notificationTitle,
      content: notificationContent,
      createdAt: Date.now(),
      type: notificationType,
    };
    const updated = [...notifications, n];
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(updated));
    addLog("공지사항 발송", notificationTitle, "notification");
    setNotificationTitle(""); setNotificationContent("");
    toast.success("공지사항이 발송되었다냥! 📢");
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(updated));
    addLog("공지사항 삭제", "공지 삭제됨", "notification");
    toast.success("공지사항이 삭제되었다냥! 🗑️");
  };

  const filteredLogs = adminLogs.filter(l => logFilter === "all" || l.category === logFilter);

  const RARITY_COLORS: Record<string, string> = {
    "일반": "bg-gray-100 text-gray-700",
    "언커먼": "bg-green-100 text-green-700",
    "레어": "bg-blue-100 text-blue-700",
    "레전더리": "bg-yellow-100 text-yellow-700",
  };

  const STATUS_COLORS: Record<string, string> = {
    "active": "bg-green-100 text-green-700",
    "inactive": "bg-gray-100 text-gray-700",
    "banned": "bg-red-100 text-red-700",
  };

  const NOTIFICATION_COLORS: Record<string, string> = {
    "info": "bg-blue-50 border-blue-200",
    "warning": "bg-yellow-50 border-yellow-200",
    "event": "bg-pink-50 border-pink-200",
  };

  const MUSIC_CHARS = [
    { key: "unfair", label: "억울냥 😤" },
    { key: "anxious", label: "불안냥 😰" },
    { key: "lonely", label: "외로움냥 🥺" },
    { key: "lethargic", label: "무기력냥 😞" },
    { key: "angry", label: "화남냥 😠" },
    { key: "love", label: "사랑냥 💕" },
    { key: "shy", label: "수줍냥 😊" },
    { key: "shocked", label: "충격냥 😱" },
  ];

  // ===================== 렌더링 =====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🐱</span>
            <div>
              <h1 className="text-base font-black text-gray-800">관리자 대시보드</h1>
              <p className="text-xs text-gray-500">마인드 캣 다이어리 관리 시스템</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-bold">
              로그 {adminLogs.length}개
            </span>
            <button
              onClick={() => { localStorage.removeItem("mindcat_admin_logged_in"); window.location.href = "/"; }}
              className="px-2 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="px-3 pb-0">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: "content", label: "📝 콘텐츠" },
              { id: "users", label: "👥 회원" },
              { id: "ads", label: "📢 광고" },
              { id: "music", label: "🎵 음악" },
              { id: "notifications", label: "📣 공지" },
              { id: "history", label: "↩️ 이력" },
              { id: "logs", label: "📋 로그" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-2 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 py-4 space-y-4">

        {/* ===================== 콘텐츠 탭 ===================== */}
        {activeTab === "content" && (
          <div className="space-y-6">

            {/* 감정 테스트 질문 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-black text-gray-800 mb-3 flex items-center gap-2">
                ❓ 감정 테스트 질문 관리
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{questions.length}개</span>
              </h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addQuestion()}
                  placeholder="새 질문 입력... (Enter로 추가)"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={newQuestionCategory}
                  onChange={e => setNewQuestionCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {["일반", "감정", "관계", "일상", "성격"].map(c => <option key={c}>{c}</option>)}
                </select>
                <button onClick={addQuestion} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg flex items-center gap-1 transition-colors">
                  <Plus className="w-4 h-4" /> 추가
                </button>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {questions.length === 0 && <p className="text-sm text-gray-400 text-center py-4">질문이 없습니다. 추가해보세요!</p>}
                {questions.map(q => (
                  <div key={q.id} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                    {editingQuestion === q.id ? (
                      <>
                        <input
                          type="text"
                          value={editingQuestionText}
                          onChange={e => setEditingQuestionText(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && updateQuestion(q.id)}
                          className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                          autoFocus
                        />
                        <button onClick={() => updateQuestion(q.id)} className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditingQuestion(null)} className="p-1.5 bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded font-bold">{q.category || "일반"}</span>
                        <p className="flex-1 text-sm font-bold text-gray-800">{q.text}</p>
                        <button onClick={() => { setEditingQuestion(q.id); setEditingQuestionText(q.text); }} className="p-1.5 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteQuestion(q.id)} className="p-1.5 bg-red-400 hover:bg-red-500 text-white rounded transition-colors"><Trash className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 캐릭터 관리 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-black text-gray-800 mb-3 flex items-center gap-2">
                😺 캐릭터 관리
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">{characters.length}개</span>
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input type="text" value={newCharacter.name || ""} onChange={e => setNewCharacter({ ...newCharacter, name: e.target.value })} placeholder="이름 *" className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-400" />
                <input type="text" value={newCharacter.emoji || ""} onChange={e => setNewCharacter({ ...newCharacter, emoji: e.target.value })} placeholder="이모지 (예: 😺)" className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-400" />
                <input type="text" value={newCharacter.description || ""} onChange={e => setNewCharacter({ ...newCharacter, description: e.target.value })} placeholder="설명" className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-400" />
                <input type="text" value={newCharacter.specialty || ""} onChange={e => setNewCharacter({ ...newCharacter, specialty: e.target.value })} placeholder="특기" className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </div>
              <div className="flex gap-2 mb-4">
                <select value={newCharacter.rarity || "일반"} onChange={e => setNewCharacter({ ...newCharacter, rarity: e.target.value as Character["rarity"] })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-400">
                  {["일반", "언커먼", "레어", "레전더리"].map(r => <option key={r}>{r}</option>)}
                </select>
                <button onClick={addCharacter} className="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-1 transition-colors">
                  <Plus className="w-4 h-4" /> 캐릭터 추가
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {characters.length === 0 && <p className="text-sm text-gray-400 text-center py-4 col-span-2">캐릭터가 없습니다. 추가해보세요!</p>}
                {characters.map(c => (
                  <div key={c.id} className="bg-pink-50 rounded-xl p-3 border border-pink-100">
                    {editingCharacter === c.id ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={editingCharacterData.name || ""} onChange={e => setEditingCharacterData({ ...editingCharacterData, name: e.target.value })} placeholder="이름" className="px-2 py-1 border border-pink-300 rounded text-sm font-bold focus:outline-none" />
                          <input type="text" value={editingCharacterData.emoji || ""} onChange={e => setEditingCharacterData({ ...editingCharacterData, emoji: e.target.value })} placeholder="이모지" className="px-2 py-1 border border-pink-300 rounded text-sm font-bold focus:outline-none" />
                          <input type="text" value={editingCharacterData.description || ""} onChange={e => setEditingCharacterData({ ...editingCharacterData, description: e.target.value })} placeholder="설명" className="px-2 py-1 border border-pink-300 rounded text-sm font-bold focus:outline-none" />
                          <input type="text" value={editingCharacterData.specialty || ""} onChange={e => setEditingCharacterData({ ...editingCharacterData, specialty: e.target.value })} placeholder="특기" className="px-2 py-1 border border-pink-300 rounded text-sm font-bold focus:outline-none" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => updateCharacter(c.id)} className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"><Check className="w-3 h-3" /> 저장</button>
                          <button onClick={() => setEditingCharacter(null)} className="px-2 py-1 bg-gray-400 hover:bg-gray-500 text-white text-xs font-bold rounded transition-colors"><X className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-black text-gray-800">{c.emoji} {c.name}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${RARITY_COLORS[c.rarity]}`}>{c.rarity}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{c.description}</p>
                        <p className="text-xs text-gray-500">특기: {c.specialty}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { setEditingCharacter(c.id); setEditingCharacterData({ name: c.name, emoji: c.emoji, description: c.description, specialty: c.specialty, rarity: c.rarity }); }} className="flex-1 px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"><Edit className="w-3 h-3" /> 수정</button>
                          <button onClick={() => deleteCharacter(c.id)} className="flex-1 px-2 py-1 bg-red-400 hover:bg-red-500 text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"><Trash className="w-3 h-3" /> 삭제</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 페이지 이름 관리 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-black text-gray-800 mb-3">📄 페이지 이름 관리</h2>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newPageKey} onChange={e => setNewPageKey(e.target.value)} placeholder="페이지 키 (예: shop)" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <input type="text" value={newPageLabel} onChange={e => setNewPageLabel(e.target.value)} placeholder="표시 이름 (예: 상점)" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <button onClick={addPageName} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg flex items-center gap-1 transition-colors"><Plus className="w-4 h-4" /> 추가</button>
              </div>
              <div className="space-y-2">
                {pageNames.map(p => (
                  <div key={p.id} className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100">
                    <span className="text-xs bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-bold w-20 text-center">{p.key}</span>
                    {editingPageName === p.id ? (
                      <>
                        <input type="text" value={editingPageLabel} onChange={e => setEditingPageLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && updatePageName(p.id)} className="flex-1 px-2 py-1 border border-indigo-300 rounded text-sm font-bold focus:outline-none" autoFocus />
                        <button onClick={() => updatePageName(p.id)} className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditingPageName(null)} className="p-1.5 bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </>
                    ) : (
                      <>
                        <p className="flex-1 text-sm font-bold text-gray-800">{p.label}</p>
                        <button onClick={() => { setEditingPageName(p.id); setEditingPageLabel(p.label); }} className="p-1.5 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deletePageName(p.id)} className="p-1.5 bg-red-400 hover:bg-red-500 text-white rounded transition-colors"><Trash className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 온보딩 텍스트 관리 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-black text-gray-800 mb-3">🎓 온보딩 튜토리얼 텍스트</h2>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newOnboardingText} onChange={e => setNewOnboardingText(e.target.value)} onKeyDown={e => e.key === "Enter" && addOnboarding()} placeholder="새 온보딩 텍스트 입력..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <button onClick={addOnboarding} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-lg flex items-center gap-1 transition-colors"><Plus className="w-4 h-4" /> 추가</button>
              </div>
              <div className="space-y-2">
                {onboardingTexts.map((text, i) => (
                  <div key={i} className="flex items-center gap-2 bg-teal-50 rounded-lg px-3 py-2 border border-teal-100">
                    <span className="text-xs bg-teal-200 text-teal-700 px-1.5 py-0.5 rounded font-bold">{i + 1}</span>
                    {editingOnboarding === i ? (
                      <>
                        <input type="text" value={editingOnboardingText} onChange={e => setEditingOnboardingText(e.target.value)} onKeyDown={e => e.key === "Enter" && updateOnboarding(i)} className="flex-1 px-2 py-1 border border-teal-300 rounded text-sm font-bold focus:outline-none" autoFocus />
                        <button onClick={() => updateOnboarding(i)} className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditingOnboarding(null)} className="p-1.5 bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </>
                    ) : (
                      <>
                        <p className="flex-1 text-sm font-bold text-gray-800">{text}</p>
                        <button onClick={() => { setEditingOnboarding(i); setEditingOnboardingText(text); }} className="p-1.5 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteOnboarding(i)} className="p-1.5 bg-red-400 hover:bg-red-500 text-white rounded transition-colors"><Trash className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== 게임/광고 설정 (콘텐츠 탭 하단) ===================== */}
        {activeTab === "content" && (
          <div className="space-y-4">
            {/* 게임 링크 관리 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-base font-black text-gray-800 mb-3">🎮 게임 링크 관리</h2>
              <p className="text-xs text-green-600 font-bold mb-3 bg-green-50 px-2 py-1 rounded">✅ 저장하면 일반 사용자 화면에 즉시 반영됩니다</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">🧠 마인드 블럭 링크</label>
                  <input
                    type="url"
                    value={adminSettings.gameLinks.mindBlock}
                    onChange={e => setAdminSettings({ ...adminSettings, gameLinks: { ...adminSettings.gameLinks, mindBlock: e.target.value } })}
                    placeholder="https://example.com/mindblock"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">🎵 음악 듣기 링크</label>
                  <input
                    type="url"
                    value={adminSettings.gameLinks.musicListen}
                    onChange={e => setAdminSettings({ ...adminSettings, gameLinks: { ...adminSettings.gameLinks, musicListen: e.target.value } })}
                    placeholder="https://example.com/music"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem(STORAGE_KEYS.adminSettings, JSON.stringify(adminSettings));
                    saveConfigMutation.mutate({
                      mindBlockLink: adminSettings.gameLinks.mindBlock,
                      musicGameLink: adminSettings.gameLinks.musicListen,
                    });
                    addLog("게임 링크 저장", "게임 링크가 업데이트됨", "content");
                  }}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> 저장 (일반 화면에 반영)
                </button>
              </div>
            </div>

            {/* 광고 문구 관리 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-base font-black text-gray-800 mb-3">📣 광고 문구 관리</h2>
              <p className="text-xs text-green-600 font-bold mb-3 bg-green-50 px-2 py-1 rounded">✅ 저장하면 일반 사용자 화면에 즉시 반영됩니다</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">배너 문구</label>
                  <input
                    type="text"
                    value={adminSettings.ads.bannerText}
                    onChange={e => setAdminSettings({ ...adminSettings, ads: { ...adminSettings.ads, bannerText: e.target.value } })}
                    placeholder="상담이 필요하신가요?"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">배너 링크 URL</label>
                  <input
                    type="url"
                    value={adminSettings.ads.bannerLink}
                    onChange={e => setAdminSettings({ ...adminSettings, ads: { ...adminSettings.ads, bannerLink: e.target.value } })}
                    placeholder="https://example.com/counseling"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem(STORAGE_KEYS.adminSettings, JSON.stringify(adminSettings));
                    saveConfigMutation.mutate({
                      adBannerText: adminSettings.ads.bannerText,
                      adBannerLink: adminSettings.ads.bannerLink,
                    });
                    addLog("광고 문구 저장", adminSettings.ads.bannerText, "ad");
                  }}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> 저장 (일반 화면에 반영)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== 회원 탭 ===================== */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-black text-gray-800 mb-3 flex items-center gap-2">
              👥 회원 관리
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{adminUsers.length}명</span>
            </h2>

            {/* 검색 및 필터 */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex items-center gap-2 flex-1 min-w-48">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="회원 검색..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <select value={userStatusFilter} onChange={e => setUserStatusFilter(e.target.value as typeof userStatusFilter)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="all">전체 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="banned">차단</option>
              </select>
              <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value as typeof userRoleFilter)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="all">전체 역할</option>
                <option value="user">사용자</option>
                <option value="premium">프리미엄</option>
                <option value="admin">관리자</option>
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  {adminUsers.length === 0 ? "등록된 회원이 없습니다." : "검색 결과가 없습니다."}
                </p>
              )}
              {filteredUsers.map(user => (
                <div key={user.id} className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-black text-gray-800">{user.username}</p>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${STATUS_COLORS[user.status]}`}>{user.status === "active" ? "활성" : user.status === "inactive" ? "비활성" : "차단"}</span>
                        <span className="text-xs text-gray-500">가입: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <select value={user.role} onChange={e => changeUserRole(user.id, e.target.value as AdminUser["role"])} className="px-2 py-1 border border-indigo-200 rounded text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        <option value="user">사용자</option>
                        <option value="premium">프리미엄</option>
                        <option value="admin">관리자</option>
                      </select>
                      <select value={user.status} onChange={e => changeUserStatus(user.id, e.target.value as AdminUser["status"])} className="px-2 py-1 border border-indigo-200 rounded text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                        <option value="banned">차단</option>
                      </select>
                      <button onClick={() => setMessageTarget(user.id)} className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors">💬 메시지</button>
                      <button onClick={() => deleteUser(user.id)} className="px-2 py-1 bg-red-400 hover:bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"><Trash className="w-3 h-3" /> 삭제</button>
                    </div>
                  </div>
                  {messageTarget === user.id && (
                    <div className="mt-3 flex gap-2">
                      <input type="text" value={messageContent} onChange={e => setMessageContent(e.target.value)} placeholder="메시지 입력..." className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm font-bold focus:outline-none" autoFocus />
                      <button onClick={() => sendMessageToUser(user.id)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded transition-colors">발송</button>
                      <button onClick={() => setMessageTarget(null)} className="px-2 py-1 bg-gray-400 hover:bg-gray-500 text-white text-xs font-bold rounded transition-colors"><X className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== 광고 탭 ===================== */}
        {activeTab === "ads" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-black text-gray-800 mb-3">📢 광고 배너 관리</h2>

              {/* 배너 추가 */}
              <div className="space-y-2 mb-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm font-black text-gray-700 mb-2">새 배너 추가</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input type="text" value={newBanner.text || ""} onChange={e => setNewBanner({ ...newBanner, text: e.target.value })} placeholder="배너 텍스트 *" className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <input type="url" value={newBanner.link || ""} onChange={e => setNewBanner({ ...newBanner, link: e.target.value })} placeholder="링크 URL *" className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <div>
                    <label className="text-xs font-bold text-gray-600">시작 날짜</label>
                    <input type="date" value={newBanner.startDate || ""} onChange={e => setNewBanner({ ...newBanner, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600">종료 날짜</label>
                    <input type="date" value={newBanner.endDate || ""} onChange={e => setNewBanner({ ...newBanner, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>
                <button onClick={addBanner} className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> 배너 추가
                </button>
              </div>

              {/* 배너 목록 */}
              <div className="space-y-3">
                {adBanners.length === 0 && <p className="text-sm text-gray-400 text-center py-4">등록된 배너가 없습니다.</p>}
                {adBanners.map(b => (
                  <div key={b.id} className={`rounded-xl p-4 border ${b.isActive ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200 opacity-60"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-black text-gray-800">{b.text}</p>
                        <p className="text-xs text-blue-600 mt-0.5 break-all">{b.link}</p>
                        {b.startDate && b.endDate && (
                          <p className="text-xs text-gray-500 mt-1">📅 {b.startDate} ~ {b.endDate}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => toggleBanner(b.id)} className={`px-2 py-1 text-xs font-bold rounded transition-colors ${b.isActive ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-400 hover:bg-gray-500 text-white"}`}>
                          {b.isActive ? "활성" : "비활성"}
                        </button>
                        <button onClick={() => deleteBanner(b.id)} className="p-1.5 bg-red-400 hover:bg-red-500 text-white rounded transition-colors"><Trash className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== 음악 탭 ===================== */}
        {activeTab === "music" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-black text-gray-800 mb-3">🎵 로파이 음악 관리</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MUSIC_CHARS.map(({ key, label }) => (
                <div key={key} className={`rounded-xl p-4 border ${musicFiles[key] ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-black text-gray-800">{label}</p>
                    {musicFiles[key] && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">✓ 업로드됨</span>
                        <button onClick={() => deleteMusicFile(key)} className="p-1 bg-red-400 hover:bg-red-500 text-white rounded transition-colors"><Trash className="w-3 h-3" /></button>
                      </div>
                    )}
                  </div>
                  {musicFiles[key] ? (
                    <audio controls className="w-full h-8" src={musicFiles[key]} />
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" /> 음악 파일 업로드
                      <input type="file" accept="audio/*" onChange={e => handleMusicUpload(key, e)} className="hidden" />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== 공지 탭 ===================== */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-black text-gray-800 mb-3">📣 공지사항 발송</h2>
              <div className="space-y-3 mb-4 p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex gap-2">
                  <input type="text" value={notificationTitle} onChange={e => setNotificationTitle(e.target.value)} placeholder="공지사항 제목 *" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-400" />
                  <select value={notificationType} onChange={e => setNotificationType(e.target.value as Notification["type"])} className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-400">
                    <option value="info">일반</option>
                    <option value="warning">경고</option>
                    <option value="event">이벤트</option>
                  </select>
                </div>
                <textarea value={notificationContent} onChange={e => setNotificationContent(e.target.value)} placeholder="공지사항 내용 *" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-400 h-28 resize-none" />
                <button onClick={sendNotification} className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Bell className="w-4 h-4" /> 공지사항 발송
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {notifications.length === 0 && <p className="text-sm text-gray-400 text-center py-4">발송된 공지사항이 없습니다.</p>}
                {[...notifications].reverse().map(n => (
                  <div key={n.id} className={`rounded-xl p-4 border ${NOTIFICATION_COLORS[n.type]}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-black text-gray-800">{n.title}</p>
                          <span className="text-xs bg-white px-1.5 py-0.5 rounded border font-bold text-gray-600">{n.type === "info" ? "일반" : n.type === "warning" ? "경고" : "이벤트"}</span>
                        </div>
                        <p className="text-xs text-gray-600">{n.content}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      <button onClick={() => deleteNotification(n.id)} className="p-1.5 bg-red-400 hover:bg-red-500 text-white rounded transition-colors ml-2"><Trash className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== 변경 이력 탭 ===================== */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-black text-gray-800 mb-3 flex items-center gap-2">
              ↩️ 변경 이력
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">{history.length}개</span>
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {history.length === 0 && <p className="text-sm text-gray-400 text-center py-8">변경 이력이 없습니다.</p>}
              {history.map((entry, i) => (
                <div key={entry.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold">#{history.length - i}</span>
                        <p className="text-sm font-black text-gray-800">{entry.description}</p>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {Array.isArray(entry.data.questions) && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">질문 {(entry.data.questions as Question[]).length}개</span>}
                        {Array.isArray(entry.data.characters) && <span className="text-xs bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded font-bold">캐릭터 {(entry.data.characters as Character[]).length}개</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => restoreHistory(entry)}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors ml-3"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> 복원
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== 로그 탭 ===================== */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-black text-gray-800 mb-3 flex items-center gap-2">
              📋 관리자 활동 로그
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">{filteredLogs.length}개</span>
            </h2>
            <div className="flex gap-2 mb-4 flex-wrap">
              {["all", "content", "user", "ad", "music", "notification", "system"].map(f => (
                <button key={f} onClick={() => setLogFilter(f as typeof logFilter)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${logFilter === f ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {f === "all" ? "전체" : f === "content" ? "콘텐츠" : f === "user" ? "회원" : f === "ad" ? "광고" : f === "music" ? "음악" : f === "notification" ? "공지" : "시스템"}
                </button>
              ))}
              <button onClick={() => { setAdminLogs([]); localStorage.removeItem(STORAGE_KEYS.adminLogs); toast.success("로그가 초기화되었다냥!"); }} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors ml-auto">
                로그 초기화
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredLogs.length === 0 && <p className="text-sm text-gray-400 text-center py-8">로그가 없습니다.</p>}
              {filteredLogs.map(log => (
                <div key={log.id} className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                        log.category === "content" ? "bg-blue-100 text-blue-700" :
                        log.category === "user" ? "bg-indigo-100 text-indigo-700" :
                        log.category === "ad" ? "bg-orange-100 text-orange-700" :
                        log.category === "music" ? "bg-purple-100 text-purple-700" :
                        log.category === "notification" ? "bg-red-100 text-red-700" :
                        "bg-gray-200 text-gray-700"
                      }`}>{log.category}</span>
                      <p className="text-sm font-black text-gray-800">{log.action}</p>
                    </div>
                    <p className="text-xs text-gray-500">{log.details}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold whitespace-nowrap ml-3">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
