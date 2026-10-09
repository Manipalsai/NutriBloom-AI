import React from 'react';

interface HeaderProps {
  streak: number;
  onOpenProfile: () => void;
  onOpenChat?: () => void;
  title?: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  onOpenProfile,
  onOpenChat,
  title,
  onBack,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 w-full z-40 bg-[#ebfef0]/90 backdrop-blur-xl border-b border-[#3e6b56]/10 shadow-[0_4px_16px_-4px_rgba(32,48,39,0.06)]">
      <div className="max-w-xl mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#0f1f16] bg-[#e5f8ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(32,48,39,0.06)] active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          ) : null}

          {/* Logo Mark */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bceed3] to-[#3e6b56] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_4px_rgba(32,48,39,0.12)]">
            <span className="text-[17px] leading-none select-none">🌱</span>
          </div>

          <div className="flex flex-col">
            <span className="font-headline text-[19px] leading-tight text-[#25533f] font-semibold tracking-tight">
              {title || 'NutriBloom AI'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ask Sage AI Chatbot Trigger */}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              title="Chat with Sage AI Herbalist"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#25533f] text-white shadow-[0_2px_6px_rgba(37,83,63,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] active:translate-y-0.5 transition-all text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span className="hidden sm:inline font-sans">Ask Sage</span>
            </button>
          )}

          {/* 12 Day Bloom Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e5f8ea] shadow-[inset_0_1px_2px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.9)]">
            <span className="text-xs leading-none">🌱</span>
            <span className="text-[11px] font-bold text-[#25533f] tracking-wider uppercase font-sans">
              {streak}d
            </span>
          </div>

          {/* User Profile Avatar with Tactile Ring */}
          <button
            onClick={onOpenProfile}
            title="Profile & Goal Settings"
            className="w-9 h-9 rounded-full p-0.5 bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.15),0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-center active:scale-95 transition-transform"
          >
            <img
              alt="User Profile"
              className="w-8 h-8 rounded-full object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
