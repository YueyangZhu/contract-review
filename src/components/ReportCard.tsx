import { FileText, ChevronRight } from 'lucide-react';
import { formatDate, formatFileSize } from '@/utils/format';
import type { ReviewReport } from '@/types';

interface ReportCardProps {
  report: ReviewReport;
  onClick: () => void;
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-[#C9A227]';
  return 'text-red-400';
};

export default function ReportCard({ report, onClick }: ReportCardProps) {
  const highCount = report.risks.filter((r) => r.level === 'high').length;
  const mediumCount = report.risks.filter((r) => r.level === 'medium').length;
  const lowCount = report.risks.filter((r) => r.level === 'low').length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-xl border border-[#1c3a5f] bg-[#0f2541] p-5 text-left transition-all hover:border-[#C9A227]/50 hover:bg-[#0B1B33]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/10 text-[#C9A227]">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h4 className="mb-1 font-medium text-[#F7F5F0]">{report.fileName}</h4>
          <p className="mb-2 text-sm text-[#F7F5F0]/50">
            {formatFileSize(report.fileSize)} · {formatDate(report.uploadTime)}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {highCount > 0 && (
              <span className="rounded-full bg-red-400/10 px-2 py-1 text-red-400">
                高风险 {highCount}
              </span>
            )}
            {mediumCount > 0 && (
              <span className="rounded-full bg-[#C9A227]/10 px-2 py-1 text-[#C9A227]">
                中风险 {mediumCount}
              </span>
            )}
            {lowCount > 0 && (
              <span className="rounded-full bg-blue-300/10 px-2 py-1 text-blue-300">
                低风险 {lowCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`text-2xl font-bold ${scoreColor(report.score)}`}>
            {report.score}
          </p>
          <p className="text-xs text-[#F7F5F0]/50">健康分</p>
        </div>
        <ChevronRight className="h-5 w-5 text-[#F7F5F0]/30 transition-colors group-hover:text-[#C9A227]" />
      </div>
    </button>
  );
}
