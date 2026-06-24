import { useEffect, useState } from 'react';
import { FileText, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReportCard from '@/components/ReportCard';
import ReportDetail from '@/components/ReportDetail';
import { listContracts } from '@/api/contracts';
import { mapContractToReport } from '@/utils/mapper';
import type { ReviewReport } from '@/types';

export default function Reports() {
  const [reports, setReports] = useState<ReviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReviewReport | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listContracts()
      .then((contracts) => {
        if (cancelled) return;
        setReports(contracts.map(mapContractToReport));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || '加载失败');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0B1B33]">
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-[#F7F5F0]">
              报告中心
            </h1>
            <p className="mt-1 text-[#F7F5F0]/60">
              查看历史审核记录，导出详细报告
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20 text-[#F7F5F0]/60">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              加载中…
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div className="rounded-2xl border border-[#1c3a5f] bg-[#0f2541] p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-[#F7F5F0]">
                暂无审核记录
              </h3>
              <p className="mb-6 text-[#F7F5F0]/60">
                上传第一份合同，开启智能审核体验
              </p>
              <Link
                to="/review"
                className="inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-6 py-2.5 text-sm font-semibold text-[#0B1B33] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Upload className="h-4 w-4" />
                去上传
              </Link>
            </div>
          )}

          {!loading && !error && reports.length > 0 && (
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedReport && (
        <ReportDetail report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}
