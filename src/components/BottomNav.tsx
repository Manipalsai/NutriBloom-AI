import React from 'react';

export type NavTab = 'home' | 'journal' | 'scanner' | 'hydrate' | 'garden' | 'insights';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 w-full z-40 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto px-4 pointer-events-auto">
        <div className="bg-[#ffffff]/90 backdrop-blur-2xl rounded-full px-2 py-1.5 flex items-center justify-between shadow-[0_12px_32px_-4px_rgba(32,48,39,0.16),0_4px_12px_rgba(32,48,39,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-[#3e6b56]/15">
          {/* Home */}
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all active:scale-95 ${
              activeTab === 'home'
                ? 'text-[#25533f] font-bold shadow-[inset_0_2px_4px_rgba(32,48,39,0.08)] bg-[#e0f3e5]'
                : 'text-[#414944] hover:text-[#0f1f16]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span className="text-[10px] font-semibold mt-0.5">Home</span>
          </button>

          {/* Journal */}
          <button
            onClick={() => onTabChange('journal')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all active:scale-95 ${
              activeTab === 'journal'
                ? 'text-[#25533f] font-bold shadow-[inset_0_2px_4px_rgba(32,48,39,0.08)] bg-[#e0f3e5]'
                : 'text-[#414944] hover:text-[#0f1f16]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span className="text-[10px] font-semibold mt-0.5">Journal</span>
          </button>

          {/* Center Elevated Raised Camera Pill */}
          <div className="relative -top-3 px-1">
            <button
              onClick={() => onTabChange('scanner')}
              title="Open AI Food Scanner"
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ${
                activeTab === 'scanner'
                  ? 'bg-gradient-to-b from-[#569176] to-[#1c3e30] shadow-[0_10px_20px_rgba(37,83,63,0.45),inset_0_2px_2px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.25)] ring-2 ring-[#a1d1b8]'
                  : 'bg-gradient-to-b from-[#487A63] to-[#25533f] shadow-[0_8px_16px_rgba(37,83,63,0.38),inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.2)]'
              }`}
            >
              <span className="material-symbols-outlined text-[26px]">photo_camera</span>
            </button>
          </div>

          {/* Hydrate */}
          <button
            onClick={() => onTabChange('hydrate')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all active:scale-95 ${
              activeTab === 'hydrate'
                ? 'text-[#25533f] font-bold shadow-[inset_0_2px_4px_rgba(32,48,39,0.08)] bg-[#e0f3e5]'
                : 'text-[#414944] hover:text-[#0f1f16]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">water_drop</span>
            <span className="text-[10px] font-semibold mt-0.5">Hydrate</span>
          </button>

          {/* Garden */}
          <button
            onClick={() => onTabChange('garden')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all active:scale-95 ${
              activeTab === 'garden'
                ? 'text-[#25533f] font-bold shadow-[inset_0_2px_4px_rgba(32,48,39,0.08)] bg-[#e0f3e5]'
                : 'text-[#414944] hover:text-[#0f1f16]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">potted_plant</span>
            <span className="text-[10px] font-semibold mt-0.5">Garden</span>
          </button>

          {/* Insights */}
          <button
            onClick={() => onTabChange('insights')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all active:scale-95 ${
              activeTab === 'insights'
                ? 'text-[#25533f] font-bold shadow-[inset_0_2px_4px_rgba(32,48,39,0.08)] bg-[#e0f3e5]'
                : 'text-[#414944] hover:text-[#0f1f16]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">insights</span>
            <span className="text-[10px] font-semibold mt-0.5">Insights</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
