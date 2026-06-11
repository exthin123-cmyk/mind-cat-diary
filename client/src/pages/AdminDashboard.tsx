'use client';

import { useState, useEffect } from "react";
import { X, Save, RotateCcw, Eye, Upload, Trash2, Search, ChevronDown, LogOut, Plus, Edit, Trash } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  emoji: string;
  specialty: string;
  image: string;
}

interface AdminUser {
  id: string;
  username: string;
  role: "admin" | "user";
  createdAt: number;
  lastActive: number;
  status: "active" | "inactive";
}

interface AdminLog {
  id: string;
  timestamp: number;
  admin: string;
  action: string;
  details: string;
}

interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  scheduledFor?: number;
}

export default function AdminDashboard() {
  const STORAGE_KEYS = {
    questions: "mindcat_questions",
    characters: "mindcat_characters",
    adminUsers: "mindcat_admin_users",
    adminLogs: "mindcat_admin_logs",
    notifications: "mindcat_notifications",
    musicFiles: "mindcat_music_files",
    adSchedule: "mindcat_ad_schedule",
  };

  // --- 상태 관리 ---
  const [activeTab, setActiveTab] = useState<"content" | "users" | "ads" | "music" | "notifications" | "logs">("content");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [musicFiles, setMusicFiles] = useState<Record<string, string>>({});
  const [adSchedule, setAdSchedule] = useState<{ startDate: string; endDate: string }>({ startDate: "", endDate: "" });

  // 폼 상태
  const [newQuestion, setNewQuestion] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState("");

  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: "",
    description: "",
    emoji: "",
    specialty: "",
    image: "",
  });
  const [editingCharacter, setEditingCharacter] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationContent, setNotificationContent] = useState("");

  // --- 초기화 ---
  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem(STORAGE_KEYS.questions);
      if (saved) setQuestions(JSON.parse(saved));

      const savedChars = localStorage.getItem(STORAGE_KEYS.characters);
      if (savedChars) setCharacters(JSON.parse(savedChars));

      const savedUsers = localStorage.getItem(STORAGE_KEYS.adminUsers);
      if (savedUsers) setAdminUsers(JSON.parse(savedUsers));

      const savedLogs = localStorage.getItem(STORAGE_KEYS.adminLogs);
      if (savedLogs) setAdminLogs(JSON.parse(savedLogs));

      const savedNotifications = localStorage.getItem(STORAGE_KEYS.notifications);
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

      const savedMusic = localStorage.getItem(STORAGE_KEYS.musicFiles);
      if (savedMusic) setMusicFiles(JSON.parse(savedMusic));

      const savedSchedule = localStorage.getItem(STORAGE_KEYS.adSchedule);
      if (savedSchedule) setAdSchedule(JSON.parse(savedSchedule));
    };
    loadData();
  }, []);

  // --- 로그 저장 ---
  const addLog = (action: string, details: string) => {
    const newLog: AdminLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      admin: "admin",
      action,
      details,
    };
    const updated = [newLog, ...adminLogs].slice(0, 100);
    setAdminLogs(updated);
    localStorage.setItem(STORAGE_KEYS.adminLogs, JSON.stringify(updated));
  };

  // --- 질문 관리 ---
  const addQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error("질문을 입력해주세요!");
      return;
    }
    const question: Question = {
      id: Date.now().toString(),
      text: newQuestion,
    };
    const updated = [...questions, question];
    setQuestions(updated);
    localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(updated));
    addLog("질문 추가", newQuestion);
    setNewQuestion("");
    toast.success("질문이 추가되었다냥! 📝");
  };

  const updateQuestion = (id: string) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, text: editingQuestionText } : q));
    setQuestions(updated);
    localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(updated));
    addLog("질문 수정", editingQuestionText);
    setEditingQuestion(null);
    toast.success("질문이 수정되었다냥! ✏️");
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(updated));
    addLog("질문 삭제", "질문이 삭제되었습니다");
    toast.success("질문이 삭제되었다냥! 🗑️");
  };

  // --- 캐릭터 관리 ---
  const addCharacter = () => {
    if (!newCharacter.name?.trim()) {
      toast.error("캐릭터 이름을 입력해주세요!");
      return;
    }
    const character: Character = {
      id: Date.now().toString(),
      name: newCharacter.name || "",
      description: newCharacter.description || "",
      emoji: newCharacter.emoji || "😺",
      specialty: newCharacter.specialty || "",
      image: newCharacter.image || "",
    };
    const updated = [...characters, character];
    setCharacters(updated);
    localStorage.setItem(STORAGE_KEYS.characters, JSON.stringify(updated));
    addLog("캐릭터 추가", character.name);
    setNewCharacter({ name: "", description: "", emoji: "", specialty: "", image: "" });
    toast.success("캐릭터가 추가되었다냥! 😺");
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    const updated = characters.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCharacters(updated);
    localStorage.setItem(STORAGE_KEYS.characters, JSON.stringify(updated));
    addLog("캐릭터 수정", updates.name || "캐릭터가 수정되었습니다");
    setEditingCharacter(null);
    toast.success("캐릭터가 수정되었다냥! ✏️");
  };

  const deleteCharacter = (id: string) => {
    const updated = characters.filter((c) => c.id !== id);
    setCharacters(updated);
    localStorage.setItem(STORAGE_KEYS.characters, JSON.stringify(updated));
    addLog("캐릭터 삭제", "캐릭터가 삭제되었습니다");
    toast.success("캐릭터가 삭제되었다냥! 🗑️");
  };

  // --- 회원 관리 ---
  const deleteUser = (id: string) => {
    const updated = adminUsers.filter((u) => u.id !== id);
    setAdminUsers(updated);
    localStorage.setItem(STORAGE_KEYS.adminUsers, JSON.stringify(updated));
    addLog("회원 강제 삭제", "회원이 삭제되었습니다");
    toast.success("회원이 삭제되었다냥! 🗑️");
  };

  const changeUserRole = (id: string, role: "admin" | "user") => {
    const updated = adminUsers.map((u) => (u.id === id ? { ...u, role } : u));
    setAdminUsers(updated);
    localStorage.setItem(STORAGE_KEYS.adminUsers, JSON.stringify(updated));
    addLog("회원 역할 변경", `역할이 ${role}로 변경되었습니다`);
    toast.success("회원 역할이 변경되었다냥! 👤");
  };

  // --- 공지사항 관리 ---
  const sendNotification = () => {
    if (!notificationTitle.trim() || !notificationContent.trim()) {
      toast.error("제목과 내용을 입력해주세요!");
      return;
    }
    const notification: Notification = {
      id: Date.now().toString(),
      title: notificationTitle,
      content: notificationContent,
      createdAt: Date.now(),
    };
    const updated = [...notifications, notification];
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(updated));
    addLog("공지사항 발송", notificationTitle);
    setNotificationTitle("");
    setNotificationContent("");
    toast.success("공지사항이 발송되었다냥! 📢");
  };

  // --- 음악 파일 업로드 ---
  const handleMusicUpload = (characterName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const updated = { ...musicFiles, [characterName]: base64 };
        setMusicFiles(updated);
        localStorage.setItem(STORAGE_KEYS.musicFiles, JSON.stringify(updated));
        addLog("음악 파일 업로드", `${characterName} 음악이 업로드되었습니다`);
        toast.success(`${characterName} 음악이 업로드되었다냥! 🎵`);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 광고 스케줄링 ---
  const saveAdSchedule = () => {
    localStorage.setItem(STORAGE_KEYS.adSchedule, JSON.stringify(adSchedule));
    addLog("광고 스케줄링", `${adSchedule.startDate} ~ ${adSchedule.endDate}`);
    toast.success("광고 스케줄이 저장되었다냥! 📅");
  };

  // --- UI 렌더링 ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-800">🐱 관리자 대시보드</h1>
            <p className="text-sm text-gray-600 mt-1">마인드 캣 다이어리 관리 시스템</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("mindcat_admin_logged_in");
              window.location.href = "/";
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "content", label: "📝 콘텐츠", icon: "📝" },
            { id: "users", label: "👥 회원", icon: "👥" },
            { id: "ads", label: "📢 광고", icon: "📢" },
            { id: "music", label: "🎵 음악", icon: "🎵" },
            { id: "notifications", label: "📣 공지", icon: "📣" },
            { id: "logs", label: "📋 로그", icon: "📋" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 관리 */}
        {activeTab === "content" && (
          <div className="space-y-6">
            {/* 질문 관리 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-black text-gray-800 mb-4">❓ 감정 테스트 질문</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="새 질문 입력..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addQuestion}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    추가
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {questions.map((q) => (
                    <div key={q.id} className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                      {editingQuestion === q.id ? (
                        <input
                          type="text"
                          value={editingQuestionText}
                          onChange={(e) => setEditingQuestionText(e.target.value)}
                          className="flex-1 px-2 py-1 border border-blue-200 rounded font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm font-bold text-gray-800">{q.text}</p>
                      )}
                      <div className="flex gap-2">
                        {editingQuestion === q.id ? (
                          <button
                            onClick={() => updateQuestion(q.id)}
                            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded transition-colors"
                          >
                            저장
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingQuestion(q.id);
                              setEditingQuestionText(q.text);
                            }}
                            className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            수정
                          </button>
                        )}
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"
                        >
                          <Trash className="w-3 h-3" />
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 캐릭터 관리 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-black text-gray-800 mb-4">😺 캐릭터 관리</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newCharacter.name || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                    placeholder="캐릭터 이름"
                    className="px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="text"
                    value={newCharacter.emoji || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, emoji: e.target.value })}
                    placeholder="이모지 (예: 😺)"
                    className="px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="text"
                    value={newCharacter.description || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                    placeholder="설명"
                    className="px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="text"
                    value={newCharacter.specialty || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, specialty: e.target.value })}
                    placeholder="특기"
                    className="px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <button
                  onClick={addCharacter}
                  className="w-full px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  캐릭터 추가
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {characters.map((c) => (
                    <div key={c.id} className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                      <p className="text-lg font-black">{c.emoji} {c.name}</p>
                      <p className="text-xs text-gray-600 font-bold mt-1">{c.description}</p>
                      <p className="text-xs text-gray-600 font-bold">특기: {c.specialty}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => deleteCharacter(c.id)}
                          className="flex-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                        >
                          <Trash className="w-3 h-3" />
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 회원 관리 */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-black text-gray-800 mb-4">👥 회원 관리</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  placeholder="회원 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {adminUsers
                  .filter((u) => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((user) => (
                    <div key={user.id} className="bg-indigo-50 rounded-lg p-3 flex items-center justify-between border border-indigo-200">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{user.username}</p>
                        <p className="text-xs text-gray-500">역할: {user.role === "admin" ? "관리자" : "사용자"}</p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => changeUserRole(user.id, e.target.value as "admin" | "user")}
                          className="px-2 py-1 border border-indigo-200 rounded text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="user">사용자</option>
                          <option value="admin">관리자</option>
                        </select>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"
                        >
                          <Trash className="w-3 h-3" />
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 광고 관리 */}
        {activeTab === "ads" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-black text-gray-800 mb-4">📅 광고 스케줄링</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-bold text-gray-700">시작 날짜</label>
                  <input
                    type="date"
                    value={adSchedule.startDate}
                    onChange={(e) => setAdSchedule({ ...adSchedule, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">종료 날짜</label>
                  <input
                    type="date"
                    value={adSchedule.endDate}
                    onChange={(e) => setAdSchedule({ ...adSchedule, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <button
                onClick={saveAdSchedule}
                className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                스케줄 저장
              </button>
              {adSchedule.startDate && adSchedule.endDate && (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p className="text-sm font-bold text-gray-800">
                    📅 {adSchedule.startDate} ~ {adSchedule.endDate}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 음악 관리 */}
        {activeTab === "music" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-black text-gray-800 mb-4">🎵 로파이 음악 관리</h2>
            <div className="space-y-3">
              {["unfair", "anxious", "lonely", "lethargic", "angry"].map((charType) => (
                <div key={charType} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-sm font-bold text-gray-800 mb-2">{charType}</p>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleMusicUpload(charType, e)}
                      className="flex-1 px-2 py-1 border border-purple-200 rounded text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {musicFiles[charType] && (
                      <div className="text-xs font-bold text-green-600">✓ 업로드됨</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 공지사항 */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-black text-gray-800 mb-4">📣 공지사항 발송</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="공지사항 제목"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <textarea
                value={notificationContent}
                onChange={(e) => setNotificationContent(e.target.value)}
                placeholder="공지사항 내용"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
              />
              <button
                onClick={sendNotification}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                공지사항 발송
              </button>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <p className="text-sm font-black text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-600 font-bold mt-1">{n.content}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 로그 */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-black text-gray-800 mb-4">📋 관리자 활동 로그</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {adminLogs.map((log) => (
                <div key={log.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-black text-gray-800">{log.action}</p>
                      <p className="text-xs text-gray-600 font-bold">{log.details}</p>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
