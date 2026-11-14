import React from 'react';
import { Droplet, Sparkles, Home } from 'lucide-react';

interface NavbarProps {
  currentScreen: string;
  onNavigate: (screen: 'home' | 'camera' | 'check' | 'results' | 'learn') => void;
  isDemoActive?: boolean;
  onExitDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  isDemoActive,
  onExitDemo
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 safe-pt transition-all">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg group"
          aria-label="LeadLens Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-400 flex items-center justify-center shadow-md shadow-brand-500/20 text-white transform group-hover:scale-105 transition-transform">
            <div className="relative">
              <Droplet className="w-6 h-6 fill-white text-brand-700" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-300 rounded-full animate-ping opacity-75" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                LeadLens
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-md border border-sky-200">
                Towson
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 -mt-0.5">
              Water Pipe Safety
            </p>
          </div>
        </button>

        {/* Right action area */}
        <div className="flex items-center gap-2">
          {isDemoActive ? (
            <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-300 shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo Mode</span>
              {onExitDemo && (
                <button
                  onClick={onExitDemo}
                  className="ml-1 text-amber-700 hover:text-amber-900 text-[10px] underline font-bold"
                  title="Exit Demo Mode"
                >
                  Exit
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className={`p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors ${
                currentScreen === 'home' ? 'text-brand-600 bg-brand-50' : ''
              }`}
              title="Home"
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
