import { useState, useEffect } from "react";
import { X, Save, RotateCcw, Eye, Upload, Trash2, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface AdminSettings {
  pageNames: Record<string, string>;
  ads: { bannerText: string; bannerLink: string; bannerImage: string };
  gameLinks: { mindBlock: string; musicListen: string };
  adminPassword: string;
  characters: Record<string, { name: string; description: string }>;
  questions: string[];
}

interface EditHistory {
  id: string;
  timestamp: number;
  section: string;
  changes: Record<string, { before: string; after: string }>;
  user: string;
}

interface GeneralUser {
  id: string;
  username: string;
  createdAt: number;
  lastActive: number;
  status: "active" | "inactive";
}

export default function AdminEditor() {
  const STORAGE_KEYS = {
    adminSettings: "mindcat_admin_settings",
    editHistory: "mindcat_edit_history",
    generalUsers: "mindcat_general_users",
  };

  // --- 상태 관리 ---
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    pageNames: { 홈: "홈", 대화: "대화", 달력: "달력", 마음숲: "마음숲", 리포트: "리포트", 도감: "도감" },
    ads: { bannerText: "광고 배너", bannerLink: "", bannerImage: "" },
    gameLinks: { mindBlock: "", musicListen: "" },
    adminPassword: "123456",
    characters: {},
    questions: [],
  });

  const [editHistory, setEditHistory] = useState<EditHistory[]>([]);
  const [generalUsers, setGeneralUsers] = useState<GeneralUser[]>([]);
  const [activeSection, setActiveSection] = useState<"content" | "ads" | "images" | "users" | "history">("content");
  const [previewMode, setPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  // --- 초기화 ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.adminSettings);
    if (saved) setAdminSettings(JSON.parse(saved));

    const savedHistory = localStorage.getItem(STORAGE_KEYS.editHistory);
    if (savedHistory) setEditHistory(JSON.parse(savedHistory));

    const savedUsers = localStorage.getItem(STORAGE_KEYS.generalUsers);
    if (savedUsers) setGeneralUsers(JSON.parse(savedUsers));
  }, []);

  // --- 변경 이력 저장 ---
  const saveToHistory = (section: string, changes: Record<string, { before: string; after: string }>) => {
    const newEntry: EditHistory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      section,
      changes,
      user: "admin",
    };
    const updated = [newEntry, ...editHistory].slice(0, 50); // 최근 50개만 유지
    setEditHistory(updated);
    localStorage.setItem(STORAGE_KEYS.editHistory, JSON.stringify(updated));
  };

  // --- 되돌리기 ---
  const restoreFromHistory = (historyId: string) => {
    const history = editHistory.find((h) => h.id === historyId);
    if (!history) return;

    // 간단한 복원 로직 (실제로는 더 복잡할 수 있음)
    const restored = { ...adminSettings };
    Object.entries(history.changes).forEach(([key, change]) => {
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        (restored as any)[parent] = { ...(restored as any)[parent], [child]: change.before };
      } else {
        (restored as any)[key] = change.before;
      }
    });

    setAdminSettings(restored);
    localStorage.setItem(STORAGE_KEYS.adminSettings, JSON.stringify(restored));
    toast.success("이전 버전으로 복원되었다냥! ⏮️");
  };

  // --- 콘텐츠 관리 섹션 ---
  const ContentManager = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-gray-800">📝 콘텐츠 관리</h3>

      {/* 페이지 이름 수정 */}
      <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200 space-y-3">
        <h4 className="font-bold text-sm text-gray-800">페이지 이름 수정</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(adminSettings.pageNames).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-bold text-gray-600">{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const oldValue = adminSettings.pageNames[key];
                  setAdminSettings({
                    ...adminSettings,
                    pageNames: { ...adminSettings.pageNames, [key]: e.target.value },
                  });
                  if (e.target.value !== oldValue) {
                    saveToHistory("pageNames", { [key]: { before: oldValue, after: e.target.value } });
                  }
                }}
                className="w-full px-2 py-1 rounded-lg border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 광고 문구 수정 */}
      <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200 space-y-3">
        <h4 className="font-bold text-sm text-gray-800">광고 문구 수정</h4>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">배너 텍스트</label>
          <input
            type="text"
            value={adminSettings.ads.bannerText}
            onChange={(e) => {
              const oldValue = adminSettings.ads.bannerText;
              setAdminSettings({
                ...adminSettings,
                ads: { ...adminSettings.ads, bannerText: e.target.value },
              });
              if (e.target.value !== oldValue) {
                saveToHistory("ads.bannerText", { bannerText: { before: oldValue, after: e.target.value } });
              }
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* 게임 링크 수정 */}
      <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200 space-y-3">
        <h4 className="font-bold text-sm text-gray-800">게임 링크 수정</h4>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">마인드 블럭</label>
          <input
            type="text"
            value={adminSettings.gameLinks.mindBlock}
            onChange={(e) => {
              const oldValue = adminSettings.gameLinks.mindBlock;
              setAdminSettings({
                ...adminSettings,
                gameLinks: { ...adminSettings.gameLinks, mindBlock: e.target.value },
              });
              if (e.target.value !== oldValue) {
                saveToHistory("gameLinks.mindBlock", { mindBlock: { before: oldValue, after: e.target.value } });
              }
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">음악 듣기</label>
          <input
            type="text"
            value={adminSettings.gameLinks.musicListen}
            onChange={(e) => {
              const oldValue = adminSettings.gameLinks.musicListen;
              setAdminSettings({
                ...adminSettings,
                gameLinks: { ...adminSettings.gameLinks, musicListen: e.target.value },
              });
              if (e.target.value !== oldValue) {
                saveToHistory("gameLinks.musicListen", { musicListen: { before: oldValue, after: e.target.value } });
              }
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );

  // --- 광고/링크 관리 섹션 ---
  const AdsManager = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-gray-800">📢 광고/링크 관리</h3>

      <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200 space-y-3">
        <h4 className="font-bold text-sm text-gray-800">광고 배너 설정</h4>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">광고 링크 URL</label>
          <input
            type="text"
            value={adminSettings.ads.bannerLink}
            onChange={(e) => {
              const oldValue = adminSettings.ads.bannerLink;
              setAdminSettings({
                ...adminSettings,
                ads: { ...adminSettings.ads, bannerLink: e.target.value },
              });
              if (e.target.value !== oldValue) {
                saveToHistory("ads.bannerLink", { bannerLink: { before: oldValue, after: e.target.value } });
              }
            }}
            placeholder="https://example.com"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">광고 이미지 URL</label>
          <input
            type="text"
            value={adminSettings.ads.bannerImage}
            onChange={(e) => {
              const oldValue = adminSettings.ads.bannerImage;
              setAdminSettings({
                ...adminSettings,
                ads: { ...adminSettings.ads, bannerImage: e.target.value },
              });
              if (e.target.value !== oldValue) {
                saveToHistory("ads.bannerImage", { bannerImage: { before: oldValue, after: e.target.value } });
              }
            }}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </div>
  );

  // --- 회원 관리 섹션 ---
  const UsersManager = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-gray-800">👥 회원 관리</h3>

      <div className="bg-indigo-50 rounded-2xl p-4 border-2 border-indigo-200 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-gray-600" />
          <input
            type="text"
            placeholder="회원 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {generalUsers
            .filter((u) => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((user) => (
              <div key={user.id} className="bg-white rounded-lg p-3 border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">{user.username}</p>
                  <p className="text-[10px] text-gray-500">가입: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <select
                  value={user.status}
                  onChange={(e) => {
                    const updated = generalUsers.map((u) => (u.id === user.id ? { ...u, status: e.target.value as "active" | "inactive" } : u));
                    setGeneralUsers(updated);
                    localStorage.setItem(STORAGE_KEYS.generalUsers, JSON.stringify(updated));
                    toast.success("회원 상태가 변경되었다냥!");
                  }}
                  className="px-2 py-1 rounded text-[10px] font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>
            ))}
        </div>

        <div className="bg-white rounded-lg p-3 border border-indigo-100">
          <p className="text-xs font-bold text-gray-600">📊 회원 통계</p>
          <p className="text-sm font-black text-indigo-600 mt-1">총 {generalUsers.length}명</p>
          <p className="text-xs text-gray-500 font-bold mt-1">활성: {generalUsers.filter((u) => u.status === "active").length}명</p>
        </div>
      </div>
    </div>
  );

  // --- 변경 이력 섹션 ---
  const HistoryManager = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-gray-800">⏱️ 변경 이력</h3>

      <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 space-y-2 max-h-96 overflow-y-auto">
        {editHistory.length === 0 ? (
          <p className="text-xs text-gray-500 font-bold text-center py-4">변경 이력이 없다냥!</p>
        ) : (
          editHistory.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => setSelectedHistoryId(selectedHistoryId === entry.id ? null : entry.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">{entry.section}</p>
                  <p className="text-[10px] text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${selectedHistoryId === entry.id ? "rotate-180" : ""}`} />
              </div>

              {selectedHistoryId === entry.id && (
                <div className="mt-3 space-y-2 pt-3 border-t border-gray-100">
                  {Object.entries(entry.changes).map(([key, change]) => (
                    <div key={key} className="text-[10px] space-y-1">
                      <p className="font-bold text-gray-600">{key}</p>
                      <p className="text-red-600">이전: {change.before}</p>
                      <p className="text-green-600">변경: {change.after}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => restoreFromHistory(entry.id)}
                    className="w-full mt-2 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[10px] rounded-lg transition-colors"
                  >
                    이 버전으로 복원
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-white rounded-3xl flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
        <h2 className="font-black text-gray-800 text-lg">⚙️ 관리자 에디터</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-2 rounded-lg transition-colors ${previewMode ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 섹션 탭 */}
      <div className="px-5 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto shrink-0">
        {[
          { id: "content", label: "📝 콘텐츠" },
          { id: "ads", label: "📢 광고/링크" },
          { id: "images", label: "🖼️ 이미지" },
          { id: "users", label: "👥 회원" },
          { id: "history", label: "⏱️ 이력" },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-colors ${
              activeSection === section.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeSection === "content" && <ContentManager />}
        {activeSection === "ads" && <AdsManager />}
        {activeSection === "users" && <UsersManager />}
        {activeSection === "history" && <HistoryManager />}
        {activeSection === "images" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800">🖼️ 이미지 관리</h3>
            <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200 space-y-3">
              <p className="text-xs text-gray-600 font-bold">이미지 업로드 기능은 추후 추가될 예정입니다.</p>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 py-4 border-t border-gray-100 flex gap-2 shrink-0">
        <button
          onClick={() => {
            localStorage.setItem(STORAGE_KEYS.adminSettings, JSON.stringify(adminSettings));
            toast.success("모든 설정이 저장되었다냥! 💾");
          }}
          className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          저장
        </button>
        <button
          onClick={() => {
            setAdminSettings({
              pageNames: { 홈: "홈", 대화: "대화", 달력: "달력", 마음숲: "마음숲", 리포트: "리포트", 도감: "도감" },
              ads: { bannerText: "광고 배너", bannerLink: "", bannerImage: "" },
              gameLinks: { mindBlock: "", musicListen: "" },
              adminPassword: "123456",
              characters: {},
              questions: [],
            });
            toast.success("초기화되었다냥!");
          }}
          className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          초기화
        </button>
      </div>
    </div>
  );
}
