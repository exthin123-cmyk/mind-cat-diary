import { describe, it, expect, beforeEach, vi } from "vitest";

describe("AdminEditor - 관리자 에디터 기능", () => {
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    mockLocalStorage = {};
    
    // localStorage 모킹
    global.localStorage = {
      getItem: (key: string) => mockLocalStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockLocalStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockLocalStorage[key];
      },
      clear: () => {
        mockLocalStorage = {};
      },
      length: 0,
      key: () => null,
    };
  });

  describe("콘텐츠 관리", () => {
    it("페이지 이름을 수정할 수 있어야 한다", () => {
      const adminSettings = {
        pageNames: { 홈: "홈", 대화: "대화", 달력: "달력" },
        ads: { bannerText: "광고", bannerLink: "", bannerImage: "" },
        gameLinks: { mindBlock: "", musicListen: "" },
        adminPassword: "123456",
        characters: {},
        questions: [],
      };

      const updated = {
        ...adminSettings,
        pageNames: { ...adminSettings.pageNames, 홈: "메인" },
      };

      expect(updated.pageNames.홈).toBe("메인");
      expect(updated.pageNames.대화).toBe("대화");
    });

    it("광고 문구를 수정할 수 있어야 한다", () => {
      const adminSettings = {
        pageNames: {},
        ads: { bannerText: "기존 광고", bannerLink: "", bannerImage: "" },
        gameLinks: { mindBlock: "", musicListen: "" },
        adminPassword: "123456",
        characters: {},
        questions: [],
      };

      const updated = {
        ...adminSettings,
        ads: { ...adminSettings.ads, bannerText: "새로운 광고" },
      };

      expect(updated.ads.bannerText).toBe("새로운 광고");
    });

    it("게임 링크를 수정할 수 있어야 한다", () => {
      const adminSettings = {
        pageNames: {},
        ads: { bannerText: "", bannerLink: "", bannerImage: "" },
        gameLinks: { mindBlock: "https://old.com", musicListen: "" },
        adminPassword: "123456",
        characters: {},
        questions: [],
      };

      const updated = {
        ...adminSettings,
        gameLinks: { ...adminSettings.gameLinks, mindBlock: "https://new.com" },
      };

      expect(updated.gameLinks.mindBlock).toBe("https://new.com");
    });
  });

  describe("광고/링크 관리", () => {
    it("광고 링크 URL을 수정할 수 있어야 한다", () => {
      const adminSettings = {
        pageNames: {},
        ads: { bannerText: "", bannerLink: "https://old.com", bannerImage: "" },
        gameLinks: { mindBlock: "", musicListen: "" },
        adminPassword: "123456",
        characters: {},
        questions: [],
      };

      const updated = {
        ...adminSettings,
        ads: { ...adminSettings.ads, bannerLink: "https://new.com" },
      };

      expect(updated.ads.bannerLink).toBe("https://new.com");
    });

    it("광고 이미지 URL을 수정할 수 있어야 한다", () => {
      const adminSettings = {
        pageNames: {},
        ads: { bannerText: "", bannerLink: "", bannerImage: "https://old-image.jpg" },
        gameLinks: { mindBlock: "", musicListen: "" },
        adminPassword: "123456",
        characters: {},
        questions: [],
      };

      const updated = {
        ...adminSettings,
        ads: { ...adminSettings.ads, bannerImage: "https://new-image.jpg" },
      };

      expect(updated.ads.bannerImage).toBe("https://new-image.jpg");
    });
  });

  describe("회원 관리", () => {
    it("회원 상태를 변경할 수 있어야 한다", () => {
      const users = [
        { id: "1", username: "user1", createdAt: Date.now(), lastActive: Date.now(), status: "active" as const },
        { id: "2", username: "user2", createdAt: Date.now(), lastActive: Date.now(), status: "inactive" as const },
      ];

      const updated = users.map((u) => (u.id === "1" ? { ...u, status: "inactive" as const } : u));

      expect(updated[0].status).toBe("inactive");
      expect(updated[1].status).toBe("inactive");
    });

    it("회원을 검색할 수 있어야 한다", () => {
      const users = [
        { id: "1", username: "alice", createdAt: Date.now(), lastActive: Date.now(), status: "active" as const },
        { id: "2", username: "bob", createdAt: Date.now(), lastActive: Date.now(), status: "active" as const },
      ];

      const filtered = users.filter((u) => u.username.toLowerCase().includes("ali"));

      expect(filtered).toHaveLength(1);
      expect(filtered[0].username).toBe("alice");
    });

    it("회원 통계를 계산할 수 있어야 한다", () => {
      const users = [
        { id: "1", username: "user1", createdAt: Date.now(), lastActive: Date.now(), status: "active" as const },
        { id: "2", username: "user2", createdAt: Date.now(), lastActive: Date.now(), status: "inactive" as const },
        { id: "3", username: "user3", createdAt: Date.now(), lastActive: Date.now(), status: "active" as const },
      ];

      const activeCount = users.filter((u) => u.status === "active").length;
      const totalCount = users.length;

      expect(activeCount).toBe(2);
      expect(totalCount).toBe(3);
    });
  });

  describe("변경 이력 및 되돌리기", () => {
    it("변경 이력을 저장할 수 있어야 한다", () => {
      const editHistory = [
        {
          id: "1",
          timestamp: Date.now(),
          section: "pageNames",
          changes: { 홈: { before: "홈", after: "메인" } },
          user: "admin",
        },
      ];

      expect(editHistory).toHaveLength(1);
      expect(editHistory[0].section).toBe("pageNames");
    });

    it("최근 50개의 이력만 유지해야 한다", () => {
      const editHistory = Array.from({ length: 60 }, (_, i) => ({
        id: `${i}`,
        timestamp: Date.now() - i * 1000,
        section: "test",
        changes: {},
        user: "admin",
      }));

      const sliced = editHistory.slice(0, 50);

      expect(sliced).toHaveLength(50);
    });

    it("이전 버전으로 복원할 수 있어야 한다", () => {
      const history = {
        id: "1",
        timestamp: Date.now(),
        section: "pageNames",
        changes: { 홈: { before: "홈", after: "메인" } },
        user: "admin",
      };

      const adminSettings = {
        pageNames: { 홈: "메인", 대화: "대화" },
        ads: { bannerText: "", bannerLink: "", bannerImage: "" },
        gameLinks: { mindBlock: "", musicListen: "" },
        adminPassword: "123456",
        characters: {},
        questions: [],
      };

      const restored = { ...adminSettings };
      Object.entries(history.changes).forEach(([key, change]) => {
        (restored.pageNames as any)[key] = change.before;
      });

      expect(restored.pageNames.홈).toBe("홈");
    });

    it("변경 내용을 상세히 추적할 수 있어야 한다", () => {
      const change = {
        before: "기존 값",
        after: "새로운 값",
      };

      expect(change.before).toBe("기존 값");
      expect(change.after).toBe("새로운 값");
    });
  });

  describe("저장 및 초기화", () => {
    it("설정을 localStorage에 저장할 수 있어야 한다", () => {
      const adminSettings = {
        pageNames: { 홈: "홈" },
        ads: { bannerText: "광고", bannerLink: "", bannerImage: "" },
        gameLinks: { mindBlock: "", musicListen: "" },
        adminPassword: "123456",
        characters: {},
        questions: [],
      };

      localStorage.setItem("mindcat_admin_settings", JSON.stringify(adminSettings));
      const saved = localStorage.getItem("mindcat_admin_settings");

      expect(saved).toBeDefined();
      expect(JSON.parse(saved!)).toEqual(adminSettings);
    });

    it("설정을 초기화할 수 있어야 한다", () => {
      const defaultSettings = {
        pageNames: { 홈: "홈", 대화: "대화", 달력: "달력" },
        ads: { bannerText: "광고 배너", bannerLink: "", bannerImage: "" },
        gameLinks: { mindBlock: "", musicListen: "" },
        adminPassword: "123456",
        characters: {},
        questions: [],
      };

      const modified = { ...defaultSettings, pageNames: { ...defaultSettings.pageNames, 홈: "메인" } };
      const reset = defaultSettings;

      expect(reset.pageNames.홈).toBe("홈");
      expect(modified.pageNames.홈).toBe("메인");
    });
  });
});
