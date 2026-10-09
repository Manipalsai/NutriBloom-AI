import React, { useState, useEffect } from 'react';
import { Meal, WaterLog, GardenPlant, DailyGoal, UserGoals, Badge } from './types/nutrition';
import { StorageService, GardenReserves } from './services/storage';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { ProfileModal } from './components/ProfileModal';
import { HomeView } from './views/HomeView';
import { ScannerView } from './views/ScannerView';
import { JournalView } from './views/JournalView';
import { HydrationView } from './views/HydrationView';
import { GardenView } from './views/GardenView';
import { InsightsView } from './views/InsightsView';
import { ManualMealModal } from './views/ManualMealModal';
import { SageChatModal } from './components/SageChatModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualModalSlot, setManualModalSlot] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('lunch');

  // Application State
  const [meals, setMeals] = useState<Meal[]>(() => StorageService.getMeals());
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => StorageService.getWaterLogs());
  const [plants, setPlants] = useState<GardenPlant[]>(() => StorageService.getPlants());
  const [goals, setGoals] = useState<DailyGoal[]>(() => StorageService.getDailyGoals());
  const [userGoals, setUserGoals] = useState<UserGoals>(() => StorageService.getUserGoals());
  const [badges, setBadges] = useState<Badge[]>(() => StorageService.getBadges());
  const [reserves, setReserves] = useState<GardenReserves>(() => StorageService.getReserves());
  const [streak, setStreak] = useState<number>(() => StorageService.getStreak());

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sync state to local storage
  useEffect(() => {
    StorageService.saveMeals(meals);
  }, [meals]);

  useEffect(() => {
    StorageService.saveWaterLogs(waterLogs);
  }, [waterLogs]);

  useEffect(() => {
    StorageService.savePlants(plants);
  }, [plants]);

  useEffect(() => {
    StorageService.saveDailyGoals(goals);
  }, [goals]);

  useEffect(() => {
    StorageService.saveUserGoals(userGoals);
  }, [userGoals]);

  useEffect(() => {
    StorageService.saveBadges(badges);
  }, [badges]);

  useEffect(() => {
    StorageService.saveReserves(reserves);
  }, [reserves]);

  useEffect(() => {
    StorageService.saveStreak(streak);
  }, [streak]);

  // Log meal handler from Scanner or manual entry
  const handleMealLogged = (newMeal: Meal, nectarReward: number = 15) => {
    const updatedMeals = [newMeal, ...meals];
    setMeals(updatedMeals);

    // Boost reserves & plant health
    const updatedReserves: GardenReserves = {
      ...reserves,
      sunNectar: reserves.sunNectar + nectarReward,
      waterDrops: reserves.waterDrops + 10,
    };
    setReserves(updatedReserves);

    // Update goals progress
    const proteinSum = updatedMeals.reduce((s, m) => s + (m.protein || 0), 0);
    setGoals((prev) =>
      prev.map((g) => {
        if (g.type === 'protein') {
          return {
            ...g,
            current: proteinSum,
            subtitle: `${proteinSum} / ${g.target}g consumed`,
            completed: proteinSum >= g.target,
          };
        }
        return g;
      })
    );

    // Advance sunflower or bonsai progress
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === 'plant-3') {
          return {
            ...p,
            health: Math.min(100, p.health + 10),
            metricLabel: `${proteinSum} / 120g protein synthesized`,
          };
        }
        return p;
      })
    );

    triggerToast(`🌿 ${newMeal.title} logged! +${nectarReward} Sun Nectar & +10 Water Drops!`);
    setActiveTab('journal');
  };

  // Log water handler
  const handleAddWater = (amount: number, label: string, type: WaterLog['type']) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const newLog: WaterLog = {
      id: `w-${Date.now()}`,
      amount,
      type,
      label,
      time: timeStr,
      timestamp: Date.now(),
    };

    const updatedLogs = [newLog, ...waterLogs];
    setWaterLogs(updatedLogs);

    // Earn drops
    const dropsEarned = Math.round(amount / 50) * 5;
    const updatedReserves = {
      ...reserves,
      waterDrops: reserves.waterDrops + dropsEarned,
    };
    setReserves(updatedReserves);

    // Update Aloe health
    const totalWater = updatedLogs.reduce((s, l) => s + l.amount, 0);
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === 'plant-2') {
          const moisture = Math.min(100, Math.round((totalWater / userGoals.dailyWaterMl) * 100));
          return {
            ...p,
            health: moisture,
            metricLabel: `${(totalWater / 1000).toFixed(1)}L / ${(userGoals.dailyWaterMl / 1000).toFixed(1)}L Logged Today`,
          };
        }
        return p;
      })
    );

    // Update water goal
    setGoals((prev) =>
      prev.map((g) => {
        if (g.type === 'water') {
          const met = totalWater >= g.target;
          return {
            ...g,
            current: totalWater,
            subtitle: met ? `Goal Met! ${totalWater.toLocaleString()} mL reached 💧` : `${totalWater.toLocaleString()} / ${g.target.toLocaleString()} mL reached`,
            completed: met,
          };
        }
        return g;
      })
    );

    triggerToast(`💧 Logged +${amount} ml! +${dropsEarned} Drops stored in terrarium.`);
  };

  const handleUndoWater = () => {
    if (waterLogs.length === 0) return;
    const last = waterLogs[0];
    setWaterLogs(waterLogs.slice(1));
    setReserves({
      ...reserves,
      waterDrops: Math.max(0, reserves.waterDrops - 20),
    });
    triggerToast(`Undid ${last.amount} ml hydration entry.`);
  };

  // Toggle goal checklist item
  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newCompleted = !g.completed;
          if (newCompleted) {
            setReserves((r) => ({ ...r, sunNectar: r.sunNectar + g.xp }));
            triggerToast(`Goal completed! +${g.xp} XP & Sun Nectar!`);
          }
          return { ...g, completed: newCompleted };
        }
        return g;
      })
    );
  };

  // Water All plants in garden
  const handleWaterPlants = (): boolean => {
    if (reserves.waterDrops < 50) return false;
    setReserves({
      ...reserves,
      waterDrops: reserves.waterDrops - 50,
      oasisLevel: reserves.oasisLevel + (reserves.waterDrops % 200 === 0 ? 1 : 0),
    });
    setPlants((prev) =>
      prev.map((p) => ({
        ...p,
        health: Math.min(100, p.health + 12),
      }))
    );
    return true;
  };

  // Feed Compost in garden
  const handleFeedCompost = (): boolean => {
    if (reserves.sunNectar < 20) return false;
    setReserves({
      ...reserves,
      sunNectar: reserves.sunNectar - 20,
    });
    setPlants((prev) =>
      prev.map((p) => ({
        ...p,
        health: Math.min(100, p.health + 8),
        stage: p.health >= 90 && p.stage < p.maxStage ? p.stage + 1 : p.stage,
      }))
    );
    return true;
  };

  // Reset to default demo data
  const handleResetDemoData = () => {
    StorageService.resetToDefaults();
    setMeals(StorageService.getMeals());
    setWaterLogs(StorageService.getWaterLogs());
    setPlants(StorageService.getPlants());
    setGoals(StorageService.getDailyGoals());
    setUserGoals(StorageService.getUserGoals());
    setBadges(StorageService.getBadges());
    setReserves(StorageService.getReserves());
    setStreak(StorageService.getStreak());
    triggerToast('Demo state reset to initial archival journal.');
  };

  // Dynamic header title
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'scanner':
        return 'Scanner';
      case 'journal':
        return 'Journal';
      case 'hydrate':
        return 'Hydrate';
      case 'garden':
        return 'Terrarium';
      case 'insights':
        return 'Insights';
      default:
        return 'NutriBloom AI';
    }
  };

  return (
    <div className="min-h-screen bg-[#ebfef0] text-[#0f1f16] flex flex-col font-sans selection:bg-[#bceed3] selection:text-[#002114]">
      {/* Top Fixed Header */}
      <Header
        streak={streak}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        title={getHeaderTitle()}
        onBack={activeTab !== 'home' ? () => setActiveTab('home') : undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16">
        {activeTab === 'home' && (
          <HomeView
            meals={meals}
            goals={goals}
            userGoals={userGoals}
            plants={plants}
            streak={streak}
            onNavigate={(t) => setActiveTab(t)}
            onToggleGoal={handleToggleGoal}
            onOpenQuickMeal={(slot) => {
              setManualModalSlot(slot);
              setIsManualModalOpen(true);
            }}
            onOpenQuickWater={() => handleAddWater(250, 'Quick Glass', 'Pure Spring Water')}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === 'scanner' && (
          <ScannerView
            onMealLogged={handleMealLogged}
            onCancel={() => setActiveTab('home')}
            onOpenManualEntry={() => {
              setManualModalSlot('lunch');
              setIsManualModalOpen(true);
            }}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView
            meals={meals}
            userGoals={userGoals}
            onAddMeal={(m) => handleMealLogged(m, 15)}
            onDeleteMeal={(id) => {
              setMeals(meals.filter((m) => m.id !== id));
              triggerToast('Entry removed from journal.');
            }}
            onOpenScanner={() => setActiveTab('scanner')}
            onOpenManualEntry={(slot) => {
              setManualModalSlot(slot || 'lunch');
              setIsManualModalOpen(true);
            }}
          />
        )}

        {activeTab === 'hydrate' && (
          <HydrationView
            waterLogs={waterLogs}
            userGoals={userGoals}
            onAddWater={handleAddWater}
            onUndoLast={handleUndoWater}
            onNavigate={(t) => setActiveTab(t)}
          />
        )}

        {activeTab === 'garden' && (
          <GardenView
            plants={plants}
            reserves={reserves}
            badges={badges}
            streak={streak}
            onWaterPlants={handleWaterPlants}
            onFeedCompost={handleFeedCompost}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            onPrelogMeal={(m) => {
              handleMealLogged(m, 10);
            }}
          />
        )}
      </main>

      {/* Fixed Bottom Tactile Navigation Bar */}
      <BottomNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />

      {/* Profile & Target Calibration Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userGoals={userGoals}
        onSaveGoals={(newGoals) => {
          setUserGoals(newGoals);
          triggerToast('Goals updated successfully!');
        }}
        reserves={reserves}
        streak={streak}
        totalMealsCount={meals.length}
        onResetDemoData={handleResetDemoData}
      />

      {/* Manual Meal Entry Modal */}
      <ManualMealModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        defaultMealType={manualModalSlot}
        onSaveMeal={(m) => handleMealLogged(m, 10)}
      />

      {/* Sage AI Botanical Chatbot Modal */}
      <SageChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userContext={{
          calories: meals.reduce((s, m) => s + (m.calories || 0), 0),
          targetCalories: userGoals.dailyCalories,
          protein: meals.reduce((s, m) => s + (m.protein || 0), 0),
          targetProtein: userGoals.dailyProtein,
          carbs: meals.reduce((s, m) => s + (m.carbs || 0), 0),
          targetCarbs: userGoals.dailyCarbs,
          fat: meals.reduce((s, m) => s + (m.fat || 0), 0),
          targetFat: userGoals.dailyFat,
          water: waterLogs.reduce((s, l) => s + l.amount, 0),
          targetWater: userGoals.dailyWaterMl,
          oasisLevel: reserves.oasisLevel,
          streak: streak,
        }}
      />

      {/* Floating Apothecary Chat Button */}
      {!isChatOpen && activeTab !== 'scanner' && (
        <button
          onClick={() => setIsChatOpen(true)}
          title="Ask Sage AI"
          className="fixed bottom-20 right-4 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-b from-[#3e6b56] to-[#25533f] text-white shadow-[0_8px_20px_rgba(37,83,63,0.38),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all border border-[#a1d1b8]/40"
        >
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span className="text-xs font-bold font-sans">Ask Sage</span>
        </button>
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#0f1f16]/95 text-white shadow-xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md border border-[#3e6b56]/40 animate-fade-in pointer-events-none">
          <span className="material-symbols-outlined text-[18px] text-[#bceed3]">eco</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
