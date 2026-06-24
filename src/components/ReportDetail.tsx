import { useState } from 'react';
import { X, AlertCircle, AlertTriangle, Info, Download } from 'lucide-react';
import { formatDate, formatFileSize } from '@/utils/format';
import type { ReviewReport, ContractRisk } from '@/types';

interface ReportDetailProps {
  report: ReviewReport;
  onClose: () => void;
}

const levelConfig = {
  high: { label: '高风险', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  medium: { label: '中风险', icon: AlertTriangle, color: 'text-[#C9A227]', bg: 'bg-[#C9A227]/10' },
  low: { label: '低风险', icon: Info, color: 'text-blue-300', bg: 'bg-blue-300/10' },
};

export default function ReportDetail({ report, onClose }: ReportDetailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleExport = () => {
    const data = {
      fileName: report.fileName,
      uploadTime: formatDate(report.uploadTime),
      score: report.score,
      summary: report.summary,
      risks: report.risks,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `审核报告-${report.fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1B33]/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-[#1c3a5f] bg-[#0B1B33] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1c3a5f] px-6 py-4">
          <h2 className="font-serif text-xl font-semibold text-[#F7F5F0]">
            审核报告详情
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#F7F5F0]/60 transition-colors hover:bg-[#F7F5F0]/10 hover:text-[#F7F5F0]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="mb-6 rounded-xl border border-[#1c3a5f] bg-[#0f2541] p-5">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-medium text-[#F7F5F0]">{report.fileName}</h3>
                <p className="text-sm text-[#F7F5F0]/50">
                  {formatFileSize(report.fileSize)} · {formatDate(report.uploadTime)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-bold text-[#C9A227]">{report.score}</p>
                <p className="text-xs text-[#F7F5F0]/50">合同健康分</p>
              </div>
            </div>
            <p className="rounded-lg bg-[#C9A227]/10 p-3 text-sm leading-relaxed text-[#F7F5F0]/80">
              {report.summary}
            </p>
          </div>

          <div className="space-y-3">
            {report.risks.map((risk: ContractRisk) => {
              const config = levelConfig[risk.level];
              const Icon = config.icon;
              const isExpanded = expandedId === risk.id;

              return (
                <div
                  key={risk.id}
                  className="rounded-xl border border-[#1c3a5f] bg-[#0f2541]"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : risk.id)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                      <span className="font-medium text-[#F7F5F0]">{risk.category}</span>
                    </div>
                  </button>
                  <div className="border-t border-[#1c3a5f] px-4 pb-4 pt-3">
                    <p className="mb-2 text-sm text-[#F7F5F0]/80">
                      <span className="text-[#C9A227]">条款：</span>
                      {risk.clause}
                    </p>
                    <p className="mb-2 text-sm text-[#F7F5F0]/80">
                      <span className="text-[#C9A227]">说明：</span>
                      {risk.description}
                    </p>
                    <p className="rounded-lg bg-[#C9A227]/10 p-3 text-sm text-[#F7F5F0]/90">
                      <span className="font-medium text-[#C9A227]">建议：</span>
                      {risk.suggestion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#1c3a5f] px-6 py-4">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-6 py-2.5 text-sm font-semibold text-[#0B1B33] transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Download className="h-4 w-4" />
            导出报告
          </button>
        </div>
      </div>
    </div>
  );
}
