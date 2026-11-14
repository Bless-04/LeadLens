import React from 'react';
import { Camera, Sparkles, BookOpen, ShieldCheck, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SAMPLE_PIPE_SCENARIOS } from '../data/demoScenarios';
import { DemoScenario } from '../types/pipe';

interface HomeScreenProps {
  onStartCheck: () => void;
  onSelectDemo: (scenario: DemoScenario) => void;
  onNavigateToLearn: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartCheck,
  onSelectDemo,
  onNavigateToLearn,
}) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Hero Card */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-sky-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-brand-900/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CodeClash Hackathon — Towson University</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Know Your Pipes.<br />
              <span className="text-sky-200">Protect Your Family.</span>
            </h1>
            <p className="text-sky-100 text-base sm:text-lg leading-relaxed max-w-sm">
              Millions of homes still have toxic lead water pipes. LeadLens helps you check your pipe in 2 minutes for free.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={onStartCheck}
              className="w-full bg-white text-brand-800 hover:bg-sky-50 active:scale-[0.98] font-bold text-lg py-4 px-6 rounded-2xl shadow-lg shadow-black/10 flex items-center justify-center gap-3 transition-all duration-150 border-2 border-white/80"
              aria-label="Start Pipe Check"
            >
              <div className="p-1.5 bg-brand-100 rounded-xl text-brand-700">
                <Camera className="w-6 h-6" />
              </div>
              <span>Check My Pipe</span>
              <ChevronRight className="w-5 h-5 ml-auto text-brand-500" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-sky-100 pt-1 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              No login required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              100% Free
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Instant results
            </span>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-brand-900/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Safety Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Demo Mode / Judge Showcase Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/90 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 text-white rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">
              Try Interactive Demo Mode
            </h2>
          </div>
          <span className="text-[11px] font-bold uppercase bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
            For Judges &amp; Testing
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Not near your basement water intake pipe right now? Try pre-loaded realistic scenarios to test our pipe analysis engine:
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {SAMPLE_PIPE_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelectDemo(scenario)}
              className="text-left bg-white hover:bg-amber-100/50 border border-amber-200 rounded-xl p-3 shadow-xs hover:border-amber-400 active:scale-[0.98] transition-all flex flex-col justify-between"
            >
              <div>
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
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
                <h3 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                  {scenario.title.split('(')[0]}
                </h3>
              </div>
              <span className="text-[11px] font-medium text-amber-700 mt-2 flex items-center gap-1">
                Test this <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works: 3 Simple Steps */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
            ?
          </span>
          How LeadLens Works
        </h2>

        <div className="space-y-3.5">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">Find the Water Intake</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Look where the main pipe enters your basement or lower level through the floor or wall, before the water meter.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">Magnet &amp; Coin Test</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                See if a fridge magnet sticks to the pipe. Then gently scratch the surface with a key or coin to see what color shines through.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">Get Immediate Advice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learn your likely pipe material, safe drinking steps, filter recommendations, and how to get certified lab testing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Quick Link */}
      <section className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">Why Does Lead Matter?</h2>
            <p className="text-xs text-slate-300">Lead is dangerous even in tiny amounts</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Children under 6 who drink lead-contaminated water can experience permanent brain, nerve, and hearing damage.
        </p>
        <button
          onClick={onNavigateToLearn}
          className="w-full bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Read the Lead Safety &amp; Testing Guide</span>
          <ArrowRight className="w-3.5 h-3.5 ml-auto" />
        </button>
      </section>
    </div>
  );
};
