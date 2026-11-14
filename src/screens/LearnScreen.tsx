import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Droplet, 
  HelpCircle, 
  PhoneCall, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  DollarSign
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const LearnScreen: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Lead &amp; Water Safety Guide
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Everything families need to know about lead pipes and lab testing
        </p>
      </div>

      <DisclaimerBanner />

      {/* Section 1: Why Lead Pipes Matter */}
      <section className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Why Are Lead Pipes So Dangerous?
            </h2>
            <p className="text-xs text-slate-500">
              CDC: No safe blood lead level exists for children
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Lead is a toxic heavy metal that was commonly used for residential water service lines across the United States from the late 1800s until it was officially banned in 1986. Over time, chemical reactions can cause the lead to leach directly into drinking and cooking water.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
            <h3 className="text-xs font-bold text-rose-900">For Infants &amp; Children</h3>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              Damage to the developing brain and nervous system, lower IQ, attention disorders (ADHD), slowed physical growth, and hearing impairments.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
            <h3 className="text-xs font-bold text-amber-900">For Adults &amp; Mothers</h3>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Increased risk of high blood pressure, hypertension, kidney disease, and complications during pregnancy including reduced fetal growth.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: How to Request a Certified Water Test */}
      <section className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-600 text-white rounded-xl">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-sky-950">
              How to Get Your Tap Water Tested
            </h2>
            <p className="text-xs text-sky-700">
              Only a certified laboratory can test dissolved lead
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-sky-100">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">
                Call Your Local Water Utility
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Many municipal water providers will mail you a <strong>free water testing kit</strong> upon request, especially if your home was built before 1986 or is near known lead lines.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-sky-100">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">
                Contact an EPA-Certified Drinking Water Lab
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If your utility doesn't provide free kits, search your state drinking water directory for state-certified laboratories. Kits generally cost $20 to $40 and provide certified results in parts per billion (ppb).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-sky-100">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">
                Follow Proper Sampling Protocol
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Do not use any water in your house for 6 to 8 hours before collecting (first draw in the morning). Fill the lab bottle immediately from the cold kitchen tap.
              </p>
            </div>
          </div>
        </div>

        {/* EPA Hotline Quick Call */}
        <div className="p-3 bg-white rounded-xl border border-sky-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-brand-600" />
            <span className="font-semibold text-slate-800">EPA Safe Drinking Water Hotline:</span>
          </div>
          <a
            href="tel:1-800-426-4791"
            className="font-bold text-brand-600 hover:text-brand-800 underline"
          >
            1-800-426-4791
          </a>
        </div>
      </section>

      {/* Section 3: Water Filters - What Works & What Doesn't */}
      <section className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Understanding Water Filter Certifications
            </h2>
            <p className="text-xs text-slate-500">
              Not all water filters remove lead
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>NSF/ANSI Standard 53 or 58 (RECOMMENDED)</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              Certified by independent laboratories specifically to filter and reduce dissolved lead. Look for packaging stamped with "NSF 53" (carbon block) or "NSF 58" (Reverse Osmosis).
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>NSF/ANSI Standard 42 (DOES NOT REMOVE LEAD)</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Standard refrigerator filters and cheap pitchers are often only NSF 42 certified. This improves chlorine taste and odor, but leaves lead in the water.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Replacement Assistance & Grants */}
      <section className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-600 text-white rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-emerald-950">
              Free Lead Pipe Replacement Programs
            </h2>
            <p className="text-xs text-emerald-700">
              Federal &amp; Municipal Assistance
            </p>
          </div>
        </div>

        <p className="text-xs text-emerald-900 leading-relaxed">
          Through the <strong>Bipartisan Infrastructure Law</strong>, $15 Billion was allocated to help cities and towns replace 100% of lead service lines over the next decade.
        </p>

        <ul className="space-y-2 text-xs text-emerald-900">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Many cities offer <strong>full 100% grant replacements</strong> for low-to-moderate-income homeowners and renters.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>The new EPA Lead and Copper Rule Improvements (LCRI) requires water utilities to identify and replace all lead lines.</span>
          </li>
        </ul>
      </section>

      {/* Section 5: Frequently Asked Questions Accordion */}
      <section className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-slate-700" />
          <h2 className="text-base font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          {[
            {
              q: "Can I boil water to remove lead?",
              a: "NO! Never boil water to remove lead. Boiling evaporates water and actually concentrates the lead, making the water more dangerous to drink."
            },
            {
              q: "Does hot tap water have more lead than cold water?",
              a: "YES. Hot water dissolves metals like lead much faster than cold water. Never use warm or hot tap water to cook food or prepare baby formula. Always draw cold water."
            },
            {
              q: "Can I shower or bathe in water with lead pipes?",
              a: "Yes. Human skin does not absorb lead from bath or shower water. The primary danger comes from ingesting water through drinking, cooking, or making infant formula."
            },
            {
              q: "Why can't my phone camera tell if my water has lead?",
              a: "Lead in drinking water is completely invisible, odorless, and tasteless at dangerous levels. A camera can only inspect the physical metal pipe, not the water chemistry inside."
            },
            {
              q: "What should I do right now while waiting for a test?",
              a: "Flush your tap with cold water for 2-3 minutes before drinking in the morning, use a certified NSF 53 lead filter pitcher, and clean your faucet aerator mesh regularly."
            }
          ].map((item, idx) => (
            <div key={idx} className="py-3">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-900 hover:text-brand-600 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* External Verified Resources */}
      <section className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
          Official Government Resources:
        </h3>
        <ul className="space-y-1.5">
          <li>
            <a
              href="https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water"
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
            >
              <span>EPA: Basic Information About Lead in Drinking Water</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/lead-prevention/about/index.html"
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
            >
              <span>CDC: Childhood Lead Poisoning Prevention</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};
