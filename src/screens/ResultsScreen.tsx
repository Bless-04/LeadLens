import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  ShieldCheck, 
  RotateCcw, 
  PhoneCall, 
  Droplet, 
  Sparkles, 
  Share2, 
  Check, 
  ChevronRight, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { PipeAnalysisResult } from '../types/pipe';

interface ResultsScreenProps {
  result: PipeAnalysisResult;
  onRetest: () => void;
  onNavigateToLearn: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  onRetest,
  onNavigateToLearn,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const text = `I just checked my water pipes using LeadLens! It's a free, mobile tool to identify potential lead water pipes. Check yours at: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LeadLens - Water Pipe Check',
          text,
          url: window.location.origin,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getMaterialTheme = () => {
    switch (result.material) {
      case 'lead':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-300',
          badgeBg: 'bg-rose-600',
          badgeText: 'text-white',
          titleColor: 'text-rose-950',
          icon: <ShieldAlert className="w-8 h-8 text-rose-600" />,
          riskTag: 'High Risk Material',
          riskClass: 'bg-rose-100 text-rose-800 border-rose-300'
        };
      case 'copper':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          badgeBg: 'bg-amber-600',
          badgeText: 'text-white',
          titleColor: 'text-amber-950',
          icon: <CheckCircle className="w-8 h-8 text-amber-600" />,
          riskTag: result.riskLevel === 'moderate' ? 'Moderate Risk (Old Solder)' : 'Low Pipe Risk',
          riskClass: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      case 'galvanized_steel':
        return {
          bg: 'bg-slate-100',
          border: 'border-slate-300',
          badgeBg: 'bg-slate-700',
          badgeText: 'text-white',
          titleColor: 'text-slate-950',
          icon: <AlertTriangle className="w-8 h-8 text-slate-700" />,
          riskTag: 'Moderate Risk (Can Trap Lead)',
          riskClass: 'bg-slate-200 text-slate-800 border-slate-300'
        };
      case 'plastic':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-300',
          badgeBg: 'bg-emerald-600',
          badgeText: 'text-white',
          titleColor: 'text-emerald-950',
          icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
          riskTag: 'Low Risk Material',
          riskClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
      default:
        return {
          bg: 'bg-slate-100',
          border: 'border-slate-300',
          badgeBg: 'bg-slate-600',
          badgeText: 'text-white',
          titleColor: 'text-slate-900',
          icon: <HelpCircle className="w-8 h-8 text-slate-600" />,
          riskTag: 'Inconclusive / Unknown',
          riskClass: 'bg-slate-200 text-slate-700 border-slate-300'
        };
    }
  };

  const theme = getMaterialTheme();

  return (
    <div className="space-y-6 pb-28">
      {/* Demo Notice Banner (if Demo Mode) */}
      {result.isDemo && (
        <div className="bg-amber-500 text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between border-2 border-amber-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-200 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold uppercase tracking-wider block">
                DEMO MODE RESULT
              </span>
              <span>This result is based on pre-loaded simulation data for demonstration.</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Material Result Card */}
      <section className={`rounded-3xl border-2 ${theme.border} ${theme.bg} p-6 shadow-sm space-y-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="p-3 bg-white rounded-2xl shadow-xs border border-black/5">
            {theme.icon}
          </div>
          <span className={`text-xs font-extrabold uppercase tracking-wide px-3 py-1 rounded-full border ${theme.riskClass}`}>
            {theme.riskTag}
          </span>
        </div>

        <div className="space-y-1">
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.titleColor}`}>
            {result.materialName}
          </h1>
          <p className="text-sm font-semibold text-slate-700">
            {result.title}
          </p>
        </div>

        <p className="text-sm text-slate-800 leading-relaxed bg-white/70 p-3.5 rounded-xl border border-black/5">
          {result.summary}
        </p>

        {/* Why this conclusion was reached */}
        <div className="space-y-2 pt-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Why We Identified This:
          </h2>
          <ul className="space-y-1.5">
            {result.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CRITICAL MEDICAL / EPA SAFETY DISCLAIMER */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 text-rose-950 space-y-2">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>Crucial Safety Rule</span>
        </div>
        <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
          {result.disclaimer}
        </p>
      </div>

      {/* Immediate Safe Action Steps */}
      <section className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-sky-600" />
          <h2 className="font-bold text-slate-900 text-base">
            Immediate Safe Drinking Steps
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Follow these EPA best practices immediately while your pipe is evaluated:
        </p>
        <div className="space-y-2.5 pt-1">
          {result.immediateActions.map((action, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {action}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Recommendations */}
      <section className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-slate-900 text-base">
            Certified Water Filter Advice
          </h2>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
          {result.filterRecommendations}
        </p>
        <p className="text-[11px] text-slate-500">
          ⚠️ <em>Standard refrigerator or pitcher filters only remove chlorine for taste unless they explicitly state <strong>NSF/ANSI Standard 53 or 58</strong> for lead reduction.</em>
        </p>
      </section>

      {/* Water Utility & Lab Test Next Steps */}
      <section className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sky-900">
          <PhoneCall className="w-5 h-5 text-brand-600" />
          <h2 className="font-bold text-base">
            Order a Certified Water Test
          </h2>
        </div>
        <p className="text-xs text-sky-900 leading-relaxed">
          {result.utilityNextSteps}
        </p>
        <button
          onClick={onNavigateToLearn}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>See How to Request a Free Water Test Kit</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>
      </section>

      {/* Action Footer Buttons */}
      <div className="pt-2 space-y-2.5">
        <button
          onClick={handleShare}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 px-5 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Link Copied to Clipboard!' : 'Share LeadLens with Neighbors & Family'}</span>
        </button>

        <button
          onClick={onRetest}
          className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Test Another Water Pipe</span>
        </button>
      </div>
    </div>
  );
};
