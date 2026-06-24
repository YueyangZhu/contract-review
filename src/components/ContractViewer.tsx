import { useMemo } from 'react';
import type { ContractRisk } from '@/types';

interface ContractViewerProps {
  content: string;
  risks: ContractRisk[];
  activeRiskId: string | null;
  onRiskHover: (id: string | null) => void;
}

export default function ContractViewer({
  content,
  risks,
  activeRiskId,
  onRiskHover,
}: ContractViewerProps) {
  const segments = useMemo(() => {
    const sorted = [...risks].sort((a, b) => a.startIndex - b.startIndex);
    const parts: { type: 'text' | 'risk'; value: string; risk?: ContractRisk }[] = [];
    let lastIndex = 0;

    sorted.forEach((risk) => {
      if (risk.startIndex > lastIndex) {
        parts.push({ type: 'text', value: content.slice(lastIndex, risk.startIndex) });
      }
      parts.push({
        type: 'risk',
        value: content.slice(risk.startIndex, risk.endIndex),
        risk,
      });
      lastIndex = risk.endIndex;
    });

    if (lastIndex < content.length) {
      parts.push({ type: 'text', value: content.slice(lastIndex) });
    }

    return parts;
  }, [content, risks]);

  return (
    <div className="h-full overflow-y-auto rounded-xl border border-[#1c3a5f] bg-[#F7F5F0] p-6">
      <h3 className="mb-4 font-serif text-lg font-semibold text-[#0B1B33]">
        合同原文
      </h3>
      <div className="whitespace-pre-wrap font-serif leading-loose text-[#0B1B33]/90">
        {segments.map((part, index) => {
          if (part.type === 'text') {
            return <span key={index}>{part.value}</span>;
          }

          const risk = part.risk!;
          const isActive = activeRiskId === risk.id;
          const levelColor =
            risk.level === 'high'
              ? 'bg-red-100 border-red-400 text-red-800'
              : risk.level === 'medium'
                ? 'bg-[#C9A227]/15 border-[#C9A227] text-[#0B1B33]'
                : 'bg-blue-50 border-blue-300 text-blue-900';

          return (
            <mark
              key={index}
              onMouseEnter={() => onRiskHover(risk.id)}
              onMouseLeave={() => onRiskHover(null)}
              className={`cursor-pointer rounded border-l-4 px-1 py-0.5 transition-all ${levelColor} ${
                isActive ? 'ring-2 ring-[#C9A227] ring-offset-1' : ''
              }`}
            >
              {part.value}
            </mark>
          );
        })}
      </div>
    </div>
  );
}
