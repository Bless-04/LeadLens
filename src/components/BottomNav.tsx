import React from 'react';
import { Home, Camera, BookOpen, MapPin, Sparkles } from 'lucide-react';
import type { ScreenType } from '../types/pipe';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenDemoPicker?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenDemoPicker,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 safe-pb">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-colors ${
            currentScreen === 'home'
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${currentScreen === 'home' ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[11px] mt-1">Home</span>
        </button>

        {/* Check Pipe / Camera */}
        <button
          onClick={() => onNavigate('camera')}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-colors relative ${
            currentScreen === 'camera' || currentScreen === 'check' || currentScreen === 'results'
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-full ${currentScreen === 'camera' || currentScreen === 'check' ? 'bg-brand-100 text-brand-700' : ''}`}>
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5">Check Pipe</span>
        </button>

        {/* Demo Mode */}
        <button
          onClick={() => {
            if (onOpenDemoPicker) onOpenDemoPicker();
            else onNavigate('home');
          }}
          className="flex flex-col items-center justify-center w-16 py-1 text-amber-700 hover:text-amber-900 font-medium transition-colors"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-[11px] mt-1 text-slate-600">Demo</span>
        </button>

        <button
          onClick={() => onNavigate('map')}
          aria-current={currentScreen === 'map' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-colors ${
            currentScreen === 'map'
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[11px] mt-1">Map</span>
        </button>

        {/* Learn */}
        <button
          onClick={() => onNavigate('learn')}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-colors ${
            currentScreen === 'learn'
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${currentScreen === 'learn' ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[11px] mt-1">Learn</span>
        </button>
      </div>
    </nav>
  );
};
