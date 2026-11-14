import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50 border-y sm:border sm:rounded-xl border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Important Safety Note:</strong> Visual &amp; scratch tests identify pipe material, not lead in drinking water. Only certified lab tests verify water safety.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-sm text-amber-950">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-sm">
          <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
            Important Water Safety Disclaimer
          </h4>
          <p className="text-amber-800 leading-relaxed text-xs sm:text-sm">
            The camera and physical scratch test identify what your <strong>pipe is made of</strong> (its material). 
            <span className="font-semibold underline decoration-amber-500 underline-offset-2 ml-1">
              Photos cannot measure lead dissolved in drinking water.
            </span>
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-medium text-amber-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Never consider water safe solely from a photo. We recommend requesting a certified lab test kit.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
