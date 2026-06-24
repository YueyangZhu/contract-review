import { useState } from 'react';
import { ChevronDown, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { ContractRisk } from '@/types';

interface RiskPanelProps {
  risks: ContractRisk[];
  activeRiskId: string | null;
  onRiskHover: (id: string | null) => void;
}

const levelConfig = {
  high: {
    label: '高风险',
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/30',
  },
  medium: {
    label: '中风险',
    icon: AlertTriangle,
    color: 'text-[#C9A227]',
    bg: 'bg-[#C9A227]/10',
    border: 'border-[#C9A227]/30',
  },
  low: {
    label: '低风险',
    icon: Info,
    color: 'text-blue-300',
    bg: 'bg-blue-300/10',
    border: 'border-blue-300/30',
  },
};

export default function RiskPanel({ risks, activeRiskId, onRiskHover }: RiskPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto rounded-xl border border-[#1c3a5f] bg-[#0B1B33] p-5">
      <h3 className="mb-5 font-serif text-xl font-semibold text-[#F7F5F0]">
        风险清单
        <span className="ml-2 rounded-full bg-[#C9A227]/10 px-2.5 py-0.5 text-sm text-[#C9A227]">
          {risks.length}
        </span>
      </h3>

      {risks.length === 0 ? (
        <div className="rounded-lg border border-[#1c3a5f] p-8 text-center text-[#F7F5F0]/60">
          未发现明显风险条款
        </div>
      ) : (
        <div className="space-y-3">
          {risks.map((risk) => {
            const config = levelConfig[risk.level];
            const Icon = config.icon;
            const isExpanded = expandedId === risk.id;
            const isActive = activeRiskId === risk.id;

            return (
              <div
                key={risk.id}
                onMouseEnter={() => onRiskHover(risk.id)}
                onMouseLeave={() => onRiskHover(null)}
                className={`cursor-pointer rounded-xl border transition-all ${
                  isActive
                    ? 'border-[#C9A227] bg-[#C9A227]/10'
                    : `border-[#1c3a5f] bg-[#0f2541] hover:border-[#2a4d75]`
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : risk.id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {config.label}
                    </span>
                    <span className="font-medium text-[#F7F5F0]">
                      {risk.category}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-[#F7F5F0]/60 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-[#1c3a5f] px-4 pb-4 pt-3">
                    <p className="mb-3 text-sm leading-relaxed text-[#F7F5F0]/80">
                      <span className="text-[#C9A227]">风险条款：</span>
                      {risk.clause}
                    </p>
                    <p className="mb-3 text-sm leading-relaxed text-[#F7F5F0]/80">
                      <span className="text-[#C9A227]">风险说明：</span>
                      {risk.description}
                    </p>
                    <p className="rounded-lg bg-[#C9A227]/10 p-3 text-sm leading-relaxed text-[#F7F5F0]/90">
                      <span className="font-medium text-[#C9A227]">修改建议：</span>
                      {risk.suggestion}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
