import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { SAMPLE_PIPE_SCENARIOS } from '../data/demoScenarios';
import { DemoScenario } from '../types/pipe';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: DemoScenario) => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-amber-50/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 text-white rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900">
                Choose a Demo Pipe Scenario
              </h2>
              <p className="text-[11px] text-slate-500">
                Pre-configured realistic samples for testing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {SAMPLE_PIPE_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                onSelectScenario(scenario);
                onClose();
              }}
              className="w-full text-left p-3.5 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-300">
                <img
                  src={scenario.imageUrl}
                  alt={scenario.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    scenario.expectedMaterial === 'lead'
                      ? 'bg-rose-100 text-rose-800'
                      : scenario.expectedMaterial === 'copper'
                      ? 'bg-amber-100 text-amber-800'
                      : scenario.expectedMaterial === 'galvanized_steel'
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {scenario.expectedMaterial.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900 mt-0.5 truncate">
                  {scenario.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {scenario.subtitle}
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
