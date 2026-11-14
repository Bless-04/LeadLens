import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Calendar, Sparkles } from 'lucide-react';
import { PipeCheckAnswers, PipeExteriorColor, MagnetResponse, ScratchColorResponse } from '../types/pipe';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { MagneticFieldReading } from '../components/MagneticFieldReading';

interface PipeCheckScreenProps {
  initialAnswers?: Partial<PipeCheckAnswers>;
  pipePhotoUrl?: string;
  isDemo?: boolean;
  onSubmit: (answers: PipeCheckAnswers) => void;
  onBack: () => void;
}

export const PipeCheckScreen: React.FC<PipeCheckScreenProps> = ({
  initialAnswers = {},
  pipePhotoUrl,
  isDemo = false,
  onSubmit,
  onBack,
}) => {
  const [exteriorColor, setExteriorColor] = useState<PipeExteriorColor>(
    initialAnswers.exteriorColor || 'painted_or_unsure'
  );
  const [magnetSticks, setMagnetSticks] = useState<MagnetResponse>(
    initialAnswers.magnetSticks || 'not_tested'
  );
  const [scratchResult, setScratchResult] = useState<ScratchColorResponse>(
    initialAnswers.scratchResult || 'not_tested'
  );
  const [homeBuiltBefore1986, setHomeBuiltBefore1986] = useState<boolean | 'unsure'>(
    initialAnswers.homeBuiltBefore1986 ?? 'unsure'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      exteriorColor,
      magnetSticks,
      scratchResult,
      homeBuiltBefore1986,
      pipePhotoUrl,
      isDemo,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pipe Check
            </h1>
            {isDemo && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Answer 3 simple physical questions
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>

      <DisclaimerBanner compact />

      {/* Photo reference if uploaded */}
      {pipePhotoUrl && (
        <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl border border-slate-200">
          <img
            src={pipePhotoUrl}
            alt="Pipe reference"
            className="w-12 h-12 object-cover rounded-lg border border-slate-300 shrink-0"
          />
          <div className="text-xs">
            <p className="font-bold text-slate-800">Photo Attached</p>
            <p className="text-slate-500">You can request an AI photo assessment after the physical check.</p>
          </div>
        </div>
      )}

      {/* QUESTION 1: Exterior Appearance */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
              1
            </span>
            What does the outside of the pipe look like?
          </label>
        </div>

        <div className="space-y-2">
          {[
            {
              id: 'dull_grey',
              title: 'Dull grey or silver (soft look)',
              desc: 'Matte grey, often with a rounded or swollen joint where it connects to the valve.',
              badge: 'Common in Lead'
            },
            {
              id: 'copper_brown',
              title: 'Reddish-brown like a penny',
              desc: 'May have green or greenish-blue tarnishing (patina).',
              badge: 'Common in Copper'
            },
            {
              id: 'dark_grey_matte',
              title: 'Dark grey or silver with threaded screw fittings',
              desc: 'Thick metal pipe with screw threads visible at elbows and couplings.',
              badge: 'Common in Steel'
            },
            {
              id: 'white_or_blue_plastic',
              title: 'White, blue, or black smooth plastic',
              desc: 'Rigid PVC, CPVC, or flexible PEX tubing.',
              badge: 'Plastic / Safe'
            },
            {
              id: 'painted_or_unsure',
              title: 'Covered in paint or not sure',
              desc: 'Layer of white, gray, or colored paint hides the bare metal.',
              badge: 'Painted'
            }
          ].map((opt) => (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                exteriorColor === opt.id
                  ? 'border-brand-600 bg-brand-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="exteriorColor"
                value={opt.id}
                checked={exteriorColor === opt.id}
                onChange={() => setExteriorColor(opt.id as PipeExteriorColor)}
                className="mt-1 w-4 h-4 text-brand-600 focus:ring-brand-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* QUESTION 2: Magnet Test */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
              2
            </span>
            The Magnet Test
          </label>
          <p className="text-xs text-slate-600 leading-relaxed pl-8">
            Take any refrigerator or tool magnet and hold it against the pipe. Does it stick?
          </p>
        </div>

        <div className="space-y-2">
          {[
            {
              id: 'does_not_stick',
              title: 'No, the magnet falls right off',
              desc: 'Lead and copper are non-magnetic. Magnets will not stick to them.',
              icon: '🧲 ❌'
            },
            {
              id: 'sticks',
              title: 'Yes, it sticks firmly!',
              desc: 'Galvanized iron and steel are magnetic. The magnet will clamp firmly.',
              icon: '🧲 🧲'
            },
            {
              id: 'not_tested',
              title: "I don't have a magnet right now",
              desc: 'You can still get an estimate based on color and scratch test.',
              icon: '❓'
            }
          ].map((opt) => (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                magnetSticks === opt.id
                  ? 'border-brand-600 bg-brand-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="magnetSticks"
                value={opt.id}
                checked={magnetSticks === opt.id}
                onChange={() => setMagnetSticks(opt.id as MagnetResponse)}
                className="mt-1 w-4 h-4 text-brand-600 focus:ring-brand-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs">{opt.icon}</span>
                  <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {!isDemo && <MagneticFieldReading />}

      {/* QUESTION 3: Scratch Test */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
              3
            </span>
            The Scratch Test
          </label>
          <p className="text-xs text-slate-600 leading-relaxed pl-8">
            Carefully use the edge of a coin or key to scratch a small mark on the bare metal. What shines underneath?
          </p>
        </div>

        <div className="space-y-2">
          {[
            {
              id: 'shiny_silver',
              title: 'Shiny silver like a new nickel (soft & easily scratched)',
              desc: 'Lead is a very soft metal. A coin easily cuts a bright, shiny silver line.',
              badge: 'High Lead Indicator'
            },
            {
              id: 'copper_penny',
              title: 'Bright metallic copper (like a shiny new penny)',
              desc: 'Scratch reveals the reddish-orange sheen of pure copper metal.',
              badge: 'Copper'
            },
            {
              id: 'dull_grey_hard',
              title: 'Dull grey and very hard to scratch',
              desc: 'Galvanized steel is difficult to scratch and will not turn bright silver.',
              badge: 'Steel'
            },
            {
              id: 'white_colored_plastic',
              title: 'Plastic shavings / plastic surface',
              desc: 'Scratching peels small curls of plastic without any metal sheen.',
              badge: 'Plastic'
            },
            {
              id: 'not_tested',
              title: 'Pipe is painted / Have not scratched it',
              desc: 'Do not scratch painted pipes if you suspect lead paint could be present.',
              badge: 'Unscratched'
            }
          ].map((opt) => (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                scratchResult === opt.id
                  ? 'border-brand-600 bg-brand-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="scratchResult"
                value={opt.id}
                checked={scratchResult === opt.id}
                onChange={() => setScratchResult(opt.id as ScratchColorResponse)}
                className="mt-1 w-4 h-4 text-brand-600 focus:ring-brand-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    opt.id === 'shiny_silver'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* QUESTION 4: Home Age Context */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            Was your home built before 1986?
          </label>
          <p className="text-xs text-slate-500 leading-relaxed">
            In 1986, the U.S. Safe Drinking Water Act banned the installation of lead pipes and lead solder nationwide.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { val: true, label: 'Yes (Pre-1986)' },
            { val: false, label: 'No (1987+)' },
            { val: 'unsure', label: 'Not sure' }
          ].map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setHomeBuiltBefore1986(item.val as boolean | 'unsure')}
              className={`py-2.5 px-2 text-xs font-bold rounded-xl border-2 transition-all ${
                homeBuiltBefore1986 === item.val
                  ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit CTA */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-lg shadow-brand-700/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>Calculate Results</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
