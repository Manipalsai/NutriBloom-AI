import React, { useState } from 'react';
import { GardenPlant, Badge } from '../types/nutrition';
import { GardenReserves } from '../services/storage';

interface GardenViewProps {
  plants: GardenPlant[];
  reserves: GardenReserves;
  badges: Badge[];
  streak: number;
  onWaterPlants: () => boolean;
  onFeedCompost: () => boolean;
  onUnlockPlant?: (plantId: string) => void;
}

export const GardenView: React.FC<GardenViewProps> = ({
  plants,
  reserves,
  badges,
  streak,
  onWaterPlants,
  onFeedCompost,
}) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showNurseryModal, setShowNurseryModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2400);
  };

  const handleWaterClick = () => {
    const success = onWaterPlants();
    if (success) {
      showToast('💧 Poured 50 fresh drops into the terrarium! Plants are nourished.');
    } else {
      showToast('Need more drops! Log water in the Hydrate tab to collect drops.');
    }
  };

  const handleFeedClick = () => {
    const success = onFeedCompost();
    if (success) {
      showToast('✨ Enriched soil compost with +20 Sun Nectar! Bloom synthesis boosted.');
    } else {
      showToast('Need more Sun Nectar! Log balanced meals with high bio-availability.');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 space-y-5 pt-2 select-none">
      {/* Garden Terrarium Header & Atmospheric Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#daeddf] p-4 shadow-[0_12px_24px_-4px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] border border-[#3e6b56]/15">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-full bg-[#25533f] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">yard</span>
            </span>
            <span className="font-headline text-lg text-[#25533f] font-semibold tracking-tight">
              Living Terrarium
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-white shadow-[inset_0_1px_2px_rgba(32,48,39,0.06),0_1px_0_rgba(255,255,255,0.9)] flex items-center gap-1 border border-[#3e6b56]/15">
            <span className="material-symbols-outlined text-[16px] text-[#855900]">workspace_premium</span>
            <span className="text-[11px] font-bold text-[#855900] uppercase font-sans">
              Lvl {reserves.oasisLevel} Oasis
            </span>
          </div>
        </div>

        {/* Positive Reinforcement Nurture Scroll */}
        <div className="relative rounded-xl bg-white/90 p-3 shadow-[inset_0_2px_4px_rgba(32,48,39,0.04),0_1px_0_rgba(255,255,255,0.9)] flex items-start gap-2.5">
          <span className="text-xl leading-none mt-0.5">🌿</span>
          <p className="text-xs text-[#414944] leading-relaxed">
            Your mindful eating and steady hydration have blossomed <strong className="text-[#25533f] font-semibold">3 plants</strong> this week! Your microbiome and physical energy are radiating balance.
          </p>
        </div>
      </div>

      {/* Skeuomorphic Reserves HUD (Water & Sun Nectar) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Water Bank Counter Dial */}
        <div className="relative overflow-hidden rounded-2xl bg-[#e0f3e5] p-3.5 shadow-[0_4px_12px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] border border-[#3e6b56]/15">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#414944] uppercase tracking-wider">
              Water Stored
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#25533f]">water_drop</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-headline text-2xl text-[#25533f] font-bold tracking-tight">
              {reserves.waterDrops}
            </span>
            <span className="text-xs text-[#3e6b56] font-semibold">drops</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3e6b56] to-[#25533f] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((reserves.waterDrops / 600) * 100))}%` }}
            ></div>
          </div>
        </div>

        {/* Sun Nectar Points Counter */}
        <div className="relative overflow-hidden rounded-2xl bg-[#e0f3e5] p-3.5 shadow-[0_4px_12px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] border border-[#3e6b56]/15">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#414944] uppercase tracking-wider">
              Sun Nectar
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#855900]">wb_sunny</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-headline text-2xl text-[#855900] font-bold tracking-tight">
              {reserves.sunNectar}
            </span>
            <span className="text-xs text-[#855900] font-semibold">pts</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#f9bc59] to-[#855900] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((reserves.sunNectar / 200) * 100))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Botanical Terrarium Canvas: Handcrafted Planter Box */}
      <div className="relative rounded-2xl bg-[#e5f8ea] p-4 shadow-[0_16px_32px_-8px_rgba(32,48,39,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15 space-y-3.5">
        {/* Greenhouse Ambient Badge & Weather Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25533f] animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase text-[#25533f] tracking-wider">
              Terrarium Biosphere
            </span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_1px_rgba(32,48,39,0.08)]">
            <span className="material-symbols-outlined text-[14px] text-[#855900]">routine</span>
            <span className="text-[10px] text-[#414944] font-medium">Warm Sunlit 23°C</span>
          </div>
        </div>

        {/* Botanical Plants Showcase */}
        <div className="space-y-3">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className={`relative overflow-hidden rounded-2xl p-3.5 shadow-[0_6px_16px_rgba(32,48,39,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15 transition-all ${
                plant.isLocked ? 'bg-[#d4e7d9]/60 opacity-80' : 'bg-[#ffffff]'
              }`}
            >
              <div className="flex gap-3.5">
                {/* Plant Photo */}
                <div className="relative w-24 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#e0f3e5] shadow-[inset_0_2px_4px_rgba(32,48,39,0.12)]">
                  <img
                    alt={plant.name}
                    className="w-full h-full object-cover"
                    src={plant.image}
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-[#ffddb0] text-[#281800] text-[9px] font-bold shadow-sm">
                    {plant.isLocked ? 'Locked' : `Stage ${plant.stage}`}
                  </span>
                </div>

                {/* Plant details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-headline text-base text-[#0f1f16] font-semibold truncate">
                        {plant.name}
                      </h3>
                      <span className="text-base leading-none">
                        {plant.id === 'plant-1' ? '🌻' : plant.id === 'plant-2' ? '💧' : plant.id === 'plant-3' ? '🌿' : '🪻'}
                      </span>
                    </div>
                    <p className="text-xs text-[#414944] mt-0.5">{plant.species}</p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[#25533f] font-semibold">
                      <span className="material-symbols-outlined text-[13px]">
                        {plant.metricType === 'hydration' ? 'water_drop' : 'local_fire_department'}
                      </span>
                      <span>{plant.metricLabel}</span>
                    </div>
                  </div>

                  {/* Health or progress bar */}
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1 text-[10px]">
                      <span className="text-[#414944] font-medium">
                        {plant.isLocked ? 'Unlock Progress' : 'Bloom Radiance'}
                      </span>
                      <span className="text-[#25533f] font-bold">{plant.health}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.12)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          plant.isLocked
                            ? 'bg-[#717973]'
                            : 'bg-gradient-to-r from-[#a1d1b8] via-[#3e6b56] to-[#25533f]'
                        }`}
                        style={{ width: `${plant.health}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tactile Gardening Tools & Actions */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-base text-[#25533f] font-semibold">Tending Routine</h3>
          <span className="text-xs text-[#414944]">Tap to care</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Water Button */}
          <button
            onClick={handleWaterClick}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-[#3e6b56] to-[#25533f] text-white shadow-[0_6px_14px_rgba(37,83,63,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-1 shadow-inner">
              <span className="material-symbols-outlined text-[22px]">shower</span>
            </div>
            <span className="text-sm font-bold tracking-wide">Water All</span>
            <span className="text-[10px] text-[#bceed3] mt-0.5">-50 Drops 💧</span>
          </button>

          {/* Compost & Nutrient Button */}
          <button
            onClick={handleFeedClick}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-[#fe9572] to-[#99462a] text-white shadow-[0_6px_14px_rgba(153,70,42,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-1 shadow-inner">
              <span className="material-symbols-outlined text-[22px]">compost</span>
            </div>
            <span className="text-sm font-bold tracking-wide">Feed Compost</span>
            <span className="text-[10px] text-[#ffddb0] mt-0.5">-20 Nectar ✨</span>
          </button>
        </div>

        {/* Nursery Seed Catalog Button */}
        <button
          onClick={() => setShowNurseryModal(true)}
          className="w-full p-4 rounded-2xl bg-white flex items-center justify-between shadow-[0_4px_12px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15 hover:bg-[#e5f8ea] transition-all active:translate-y-0.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#daeddf] flex items-center justify-center text-[#25533f]">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-[#0f1f16]">Greenhouse Seed Nursery</h4>
              <p className="text-xs text-[#414944]">Acquire Chamomile, Wild Mint &amp; Star Magnolia</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#717973]">chevron_right</span>
        </button>
      </div>

      {/* Weekly Habit Botanical Badges */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-base text-[#25533f] font-semibold">Weekly Botanical Badges</h3>
          <span className="text-xs font-semibold text-[#855900]">
            {badges.filter((b) => b.unlocked).length} Earned
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="relative rounded-2xl bg-white p-3.5 flex flex-col items-center text-center shadow-[0_6px_14px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white relative mb-2 shadow-md ${
                  badge.unlocked
                    ? badge.type === 'brass'
                      ? 'bg-gradient-to-br from-[#ffd8a1] to-[#855900]'
                      : 'bg-gradient-to-br from-[#fe9572] to-[#99462a]'
                    : 'bg-[#d4e7d9] text-[#717973]'
                }`}
              >
                <span className="material-symbols-outlined text-[28px] text-white">
                  {badge.icon}
                </span>
                {badge.unlocked && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#25533f] text-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">check</span>
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-[#0f1f16]">{badge.title}</h4>
              <p className="text-[11px] text-[#414944] mt-0.5">{badge.subtitle}</p>

              {badge.unlocked ? (
                <span className="mt-2 px-2.5 py-0.5 rounded-full bg-[#bceed3] text-[#002114] text-[10px] font-bold">
                  Unlocked
                </span>
              ) : (
                <div className="w-full mt-2">
                  <div className="flex justify-between items-center mb-1 text-[9px] text-[#717973]">
                    <span>Progress</span>
                    <span className="font-bold text-[#25533f]">{badge.progressText}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#d4e7d9] overflow-hidden">
                    <div
                      className="h-full bg-[#25533f] rounded-full"
                      style={{ width: `${badge.progressPercent || 75}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Botanical Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-[#0f1f16] text-white shadow-2xl flex items-center gap-2 z-50 text-xs font-semibold animate-bounce border border-white/20">
          <span className="material-symbols-outlined text-[18px] text-[#bceed3]">spa</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Greenhouse Seed Nursery Modal */}
      {showNurseryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-[#3e6b56]/20 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#d4e7d9]">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🌱</span>
                <h3 className="font-headline text-base font-bold text-[#0f1f16]">Greenhouse Nursery</h3>
              </div>
              <button
                onClick={() => setShowNurseryModal(false)}
                className="w-7 h-7 rounded-full bg-[#e5f8ea] flex items-center justify-center text-[#414944]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#414944]">
              Harvest Sun Nectar to sprout rare botanical species in your terrarium:
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#e5f8ea] flex items-center justify-between border border-[#3e6b56]/15">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🌼</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0f1f16]">Roman Chamomile</h4>
                    <p className="text-[10px] text-[#414944]">Calms digestion • 80 Nectar</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast('🌼 Roman Chamomile seed adopted and planted in terrarium!');
                    setShowNurseryModal(false);
                  }}
                  className="px-3 py-1 rounded-full bg-[#25533f] text-white text-[11px] font-bold"
                >
                  Adopt
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#e5f8ea] flex items-center justify-between border border-[#3e6b56]/15">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🌿</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0f1f16]">Sweet Spearmint</h4>
                    <p className="text-[10px] text-[#414944]">Restores clarity • 100 Nectar</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast('🌿 Sweet Spearmint seed adopted and planted in terrarium!');
                    setShowNurseryModal(false);
                  }}
                  className="px-3 py-1 rounded-full bg-[#25533f] text-white text-[11px] font-bold"
                >
                  Adopt
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowNurseryModal(false)}
              className="w-full py-2 rounded-xl bg-[#d4e7d9] text-[#25533f] text-xs font-bold"
            >
              Close Nursery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
