import React, { useState } from "react";
import { X, Lock, Star, BookOpen, Share2, Check, Music } from "lucide-react";
import { MoodType, CAT_CHARACTERS, CatCharacter } from "../lib/types";
import { toast } from "sonner";

interface DexProps {
  collectedCats: MoodType[];       // 수집된 냥이 목록
  currentCatMood: MoodType;        // 현재 방에 있는 냥이
  testCount: number;               // 심리테스트 진행 횟수
  onClose?: () => void;            // 닫기 콜백 (탭 전환용)
  onSetCat: (mood: MoodType) => void; // 방 냥이 변경 콜백
  onRetakeTest: () => void;        // 심리테스트 재도전 콜백
}

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  common:    { bg: "bg-gray-50",   text: "text-gray-600",  border: "border-gray-200",  badge: "bg-gray-200 text-gray-600" },
  uncommon:  { bg: "bg-blue-50",   text: "text-blue-600",  border: "border-blue-200",  badge: "bg-blue-200 text-blue-700" },
  rare:      { bg: "bg-pink-50",   text: "text-pink-600",  border: "border-pink-200",  badge: "bg-pink-200 text-pink-700" },
  legendary: { bg: "bg-amber-50",  text: "text-amber-600", border: "border-amber-200", badge: "bg-amber-200 text-amber-700" },
};

const RARITY_STARS: Record<string, number> = {
  common: 1, uncommon: 2, rare: 3, legendary: 4
};

export default function Dex({ collectedCats, currentCatMood, testCount, onSetCat, onRetakeTest }: DexProps) {
  const [selectedCat, setSelectedCat] = useState<CatCharacter | null>(null);
  const [filterRarity, setFilterRarity] = useState<string>("all");

  const allCats = Object.values(CAT_CHARACTERS).sort((a, b) => a.dexNo - b.dexNo);
  const filteredCats = filterRarity === "all" ? allCats : allCats.filter(c => c.rarity === filterRarity);

  const collectedCount = collectedCats.length;
  const totalCount = allCats.length;
  const completionRate = Math.round((collectedCount / totalCount) * 100);

  const isUnlocked = (cat: CatCharacter) => collectedCats.includes(cat.type);

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      
      {/* 도감 헤더 */}
      <div className="px-5 pt-5 pb-4 bg-gradient-to-b from-blue-50 to-white border-b border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-800 leading-tight">감정냥이 도감</h2>
              <p className="text-[10px] text-gray-500 font-bold">심리테스트로 수집한 나만의 냥이들</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-blue-500">{collectedCount}<span className="text-sm text-gray-400 font-bold">/{totalCount}</span></div>
            <div className="text-[9px] text-gray-400 font-bold">수집 완료</div>
            {/* 심리테스트 재도전 버튼 */}
            <button
              onClick={onRetakeTest}
              className="mt-1 px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-bold rounded-full transition-colors shadow-sm flex items-center gap-1"
            >
              재도전 {testCount >= 2 ? "(편당 🍎 10개)" : `(${testCount + 1}/2회 무료)`}
            </button>
          </div>
        </div>

        {/* 수집 진행 바 */}
        <div className="space-y-1">
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-bold text-gray-400">
            <span>수집률 {completionRate}%</span>
            {completionRate === 100 && <span className="text-amber-500">🏆 전체 수집 완료!</span>}
          </div>
        </div>

        {/* 희귀도 필터 탭 */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
          {[
            { key: "all", label: "전체", count: allCats.length },
            { key: "common", label: "일반", count: allCats.filter(c => c.rarity === "common").length },
            { key: "uncommon", label: "희귀", count: allCats.filter(c => c.rarity === "uncommon").length },
            { key: "rare", label: "레어", count: allCats.filter(c => c.rarity === "rare").length },
            { key: "legendary", label: "전설", count: allCats.filter(c => c.rarity === "legendary").length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterRarity(tab.key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                filterRarity === tab.key
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.label} <span className={`text-[9px] ${filterRarity === tab.key ? "text-blue-100" : "text-gray-400"}`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 도감 그리드 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredCats.map((cat) => {
            const unlocked = isUnlocked(cat);
            const isCurrent = currentCatMood === cat.type;
            const rarityStyle = RARITY_COLORS[cat.rarity];
            const stars = RARITY_STARS[cat.rarity];

            return (
              <button
                key={cat.type}
                onClick={() => setSelectedCat(cat)}
                className={`relative rounded-2xl p-3 flex flex-col items-center gap-2 transition-all active:scale-95 border ${
                  unlocked
                    ? `${rarityStyle.bg} ${rarityStyle.border} shadow-sm hover:shadow-md`
                    : "bg-gray-100 border-gray-200 opacity-70"
                } ${isCurrent ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}
              >
                {/* 현재 냥이 배지 */}
                {isCurrent && (
                  <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                    현재
                  </div>
                )}

                {/* 도감 번호 */}
                <div className={`absolute top-2 left-2 text-[8px] font-black ${unlocked ? "text-gray-400" : "text-gray-300"}`}>
                  #{String(cat.dexNo).padStart(3, "0")}
                </div>

                {/* 냥이 이미지 or 잠금 */}
                <div className="w-14 h-14 flex items-center justify-center mt-2">
                  {unlocked ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* 냥이 이름 */}
                <div className={`text-[9px] font-black text-center leading-tight ${unlocked ? "text-gray-700" : "text-gray-400"}`}>
                  {unlocked ? cat.name.split(" ")[0] : "???"}
                </div>

                {/* 희귀도 별 */}
                <div className="flex gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${unlocked ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`}
                    />
                  ))}
                </div>

                {/* 희귀도 배지 */}
                <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${unlocked ? rarityStyle.badge : "bg-gray-200 text-gray-400"}`}>
                  {cat.rarityLabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* 하단 여백 */}
        <div className="h-8"></div>
      </div>

      {/* 냥이 상세 모달 */}
      {selectedCat && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-end justify-center p-4">
          <div className="w-full max-w-[400px] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            
            {/* 모달 헤더 (희귀도 컬러) */}
            <div className={`relative px-5 pt-6 pb-4 ${RARITY_COLORS[selectedCat.rarity].bg}`}>
              <button
                onClick={() => setSelectedCat(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <div className="flex items-center gap-4">
                {/* 냥이 이미지 */}
                <div className="w-20 h-20 shrink-0">
                  {isUnlocked(selectedCat) ? (
                    <img src={selectedCat.image} alt={selectedCat.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gray-200 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* 기본 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] text-gray-400 font-bold">#{String(selectedCat.dexNo).padStart(3, "0")}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${RARITY_COLORS[selectedCat.rarity].badge}`}>
                      {selectedCat.rarityLabel}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-gray-800 leading-tight">
                    {isUnlocked(selectedCat) ? selectedCat.name : "???"}
                  </h3>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: RARITY_STARS[selectedCat.rarity] }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${isUnlocked(selectedCat) ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 모달 본문 */}
            <div className="px-5 py-4 space-y-4 max-h-[50vh] overflow-y-auto">
              
              {isUnlocked(selectedCat) ? (
                <>
                  {/* 설명 */}
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-wide">소개</h4>
                    <p className="text-xs font-bold text-gray-700 leading-relaxed">{selectedCat.description}</p>
                  </div>

                  {/* 특기 */}
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 space-y-1">
                    <h4 className="text-[10px] font-black text-blue-600 flex items-center gap-1">
                      ⚡ 특기
                    </h4>
                    <p className="text-xs font-bold text-blue-700">{selectedCat.specialty}</p>
                  </div>

                  {/* 명언 */}
                  <div className="p-3 rounded-xl bg-pink-50 border border-pink-100 space-y-1">
                    <h4 className="text-[10px] font-black text-pink-600">💬 대표 명언</h4>
                    <p className="text-xs font-bold text-pink-700 italic leading-relaxed">"{selectedCat.quote}"</p>
                  </div>

                  {/* Lofi 음악 표시 */}
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <Music className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="text-[10px] font-bold text-gray-600">전용 Lofi: {selectedCat.lofiMusic.title}</span>
                  </div>

                  {/* 방에 배치하기 버튼 */}
                  <button
                    onClick={() => {
                      onSetCat(selectedCat.type);
                      setSelectedCat(null);
                    }}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                      currentCatMood === selectedCat.type
                        ? "bg-gray-100 text-gray-500 cursor-default"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {currentCatMood === selectedCat.type ? "✅ 현재 방에 있는 냥이다냥!" : `🏠 ${selectedCat.name.split(" ")[0]}를 방에 배치하기냥`}
                  </button>

                  {/* 도감 카드 공유 버튼 */}
                  <button
                    onClick={async () => {
                      const shareText = `🐾 Mind Cat Diary 도감 카드\n\n${selectedCat.emoji} ${selectedCat.name}\n#${String(selectedCat.dexNo).padStart(3, "0")} | ${selectedCat.rarityLabel}\n\n"${selectedCat.quote}"\n\n특기: ${selectedCat.specialty}\n\n나만의 감정냥이를 만나보라냥! 🍎\n${window.location.origin}`;
                      if (navigator.share) {
                        try { await navigator.share({ title: `Mind Cat Diary - ${selectedCat.name}`, text: shareText, url: window.location.origin }); }
                        catch (e) {}
                      } else {
                        await navigator.clipboard.writeText(shareText);
                        toast.success("도감 카드가 클립보드에 복사되었다냥! 🐾");
                      }
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" /> 이 냥이 카드 공유하기냥
                  </button>
                </>
              ) : (
                <>
                  {/* 잠금 상태 */}
                  <div className="text-center py-4 space-y-3">
                    <div className="text-4xl">🔒</div>
                    <div>
                      <h4 className="text-sm font-black text-gray-700 mb-1">아직 만나지 못한 냥이다냥...</h4>
                      <p className="text-xs text-gray-500 font-bold">심리테스트를 통해 이 냥이를 만나보라냥!</p>
                    </div>
                  </div>

                  {/* 해금 조건 */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
                    <h4 className="text-[10px] font-black text-amber-600 flex items-center gap-1">
                      🔑 해금 조건
                    </h4>
                    <p className="text-xs font-bold text-amber-700 leading-relaxed">{selectedCat.unlockCondition}</p>
                  </div>

                  <div className="text-center text-[10px] text-gray-400 font-bold">
                    이 냥이의 이름과 특기는 해금 후 확인할 수 있다냥.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
