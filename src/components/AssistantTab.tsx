import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Stethoscope, Users } from 'lucide-react';
import { FarmerAccount } from '../types/agriculture';
import { FruitLogo } from './FruitLogo';

// These views contain the chat rules, image-analysis UI, and expert directory.
// Loading just the active view keeps the assistant landing page responsive on
// lower-end phones and avoids downloading unused UI.
const AiAssistantTab = lazy(() =>
  import('./AiAssistantTab').then((module) => ({ default: module.AiAssistantTab }))
);
const DiagnosisTab = lazy(() =>
  import('./DiagnosisTab').then((module) => ({ default: module.DiagnosisTab }))
);
const ExpertChatTab = lazy(() =>
  import('./ExpertChatTab').then((module) => ({ default: module.ExpertChatTab }))
);

const AssistantViewFallback = () => (
  <div className="min-h-72 rounded-3xl border border-slate-200 bg-white flex items-center justify-center text-sm font-semibold text-slate-500">
    Đang tải công cụ hỗ trợ…
  </div>
);

interface AssistantTabProps {
  currentFarmer?: FarmerAccount;
  defaultSubTab?: 'chat' | 'diagnosis' | 'experts';
}

export const AssistantTab: React.FC<AssistantTabProps> = ({
  currentFarmer,
  defaultSubTab = 'chat',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'diagnosis' | 'experts'>(defaultSubTab);
  const [forwardedQuestion, setForwardedQuestion] = useState<string | undefined>(undefined);

  // The parent can request a specific assistant view (for example, opening
  // diagnosis directly from the overview). Keep the internal tab in sync.
  useEffect(() => {
    setActiveSubTab(defaultSubTab);
  }, [defaultSubTab]);

  const handleAskAssistant = (question: string) => {
    setForwardedQuestion(question);
    setActiveSubTab('chat');
  };

  return (
    <div className="space-y-5 pb-12 font-['Times_New_Roman',Times,serif]">
      {/* Sub-navigation Switcher: 3 tabs */}
      <div className="bg-white rounded-3xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs">
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'chat'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FruitLogo fruit="lychee" className="text-sm shrink-0" />
            <span className="leading-tight text-center">Trợ Lý AI</span>
          </button>

          <button
            onClick={() => setActiveSubTab('diagnosis')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'diagnosis'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-tight text-center">Chẩn Đoán Bệnh</span>
          </button>

          <button
            onClick={() => setActiveSubTab('experts')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer relative ${
              activeSubTab === 'experts'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-tight text-center">Kết Nối Chuyên Gia</span>
            {activeSubTab !== 'experts' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 border border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Render selected sub-tab */}
      <Suspense fallback={<AssistantViewFallback />}>
        {activeSubTab === 'chat' && (
          <AiAssistantTab
            currentFarmer={currentFarmer}
            initialQuestion={forwardedQuestion}
            onGoToDiagnosis={() => setActiveSubTab('diagnosis')}
          />
        )}
        {activeSubTab === 'diagnosis' && (
          <DiagnosisTab onAskAssistant={handleAskAssistant} />
        )}
        {activeSubTab === 'experts' && (
          <ExpertChatTab currentFarmer={currentFarmer} />
        )}
      </Suspense>
    </div>
  );
};
