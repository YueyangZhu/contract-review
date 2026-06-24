import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, FileCheck, ArrowRight } from 'lucide-react';
import UploadArea from '@/components/UploadArea';
import ReviewProgress from '@/components/ReviewProgress';
import ContractViewer from '@/components/ContractViewer';
import RiskPanel from '@/components/RiskPanel';
import { useAppStore } from '@/stores/appStore';
import { uploadContract, reviewContract, getContract } from '@/api/contracts';
import { mapContractToReport } from '@/utils/mapper';
import type { ReviewReport, ReviewStep } from '@/types';

const initialSteps: ReviewStep[] = [
  { label: '文本提取', status: 'pending' },
  { label: '条款分析', status: 'pending' },
  { label: '风险评估', status: 'pending' },
  { label: '报告生成', status: 'pending' },
];

export default function Review() {
  const navigate = useNavigate();
  const addReport = useAppStore((s) => s.addReport);
  const [file, setFile] = useState<File | null>(null);
  const [steps, setSteps] = useState<ReviewStep[]>(initialSteps);
  const [report, setReport] = useState<ReviewReport | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeRiskId, setActiveRiskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runStepAnimation = async () => {
    for (let i = 0; i < initialSteps.length; i++) {
      setSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx === i ? 'active' : idx < i ? 'completed' : 'pending',
        }))
      );
      await new Promise((r) => setTimeout(r, 700));
    }
  };

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setReport(null);
    setError(null);
    setSteps(initialSteps);
    setIsReviewing(true);

    try {
      await runStepAnimation();

      const contract = await uploadContract(selectedFile, selectedFile.name);
      await reviewContract(contract.id);

      // Poll until review is completed
      let completed = false;
      let attempts = 0;
      let detail = await getContract(contract.id);

      while (!completed && attempts < 30) {
        if (detail.review && detail.status !== 'reviewing') {
          completed = true;
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
        detail = await getContract(contract.id);
        attempts++;
      }

      const result = mapContractToReport(detail);
      setReport(result);
      addReport(result);
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
    } catch (err: any) {
      setError(err.message || '审核失败，请稍后重试');
    } finally {
      setIsReviewing(false);
    }
  }, [addReport]);

  const handleReset = () => {
    setFile(null);
    setReport(null);
    setSteps(initialSteps);
    setIsReviewing(false);
    setError(null);
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-[#C9A227]';
    return 'text-red-400';
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B1B33]">
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#F7F5F0]">审核工作台</h1>
              <p className="mt-1 text-[#F7F5F0]/60">
                上传合同，AI 将自动识别并标注潜在风险
              </p>
            </div>
            {(report || isReviewing) && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isReviewing}
                className="inline-flex items-center gap-2 rounded-lg border border-[#1c3a5f] px-4 py-2 text-sm font-medium text-[#F7F5F0] transition-colors hover:border-[#C9A227]/50 hover:text-[#C9A227] disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                重新上传
              </button>
            )}
          </div>

          {!file && !isReviewing && !report && (
            <div className="rounded-2xl border border-[#1c3a5f] bg-[#0f2541] p-8">
              <UploadArea onFileSelect={handleFileSelect} />
            </div>
          )}

          {isReviewing && (
            <div className="rounded-2xl border border-[#1c3a5f] bg-[#0f2541] p-10">
              <ReviewProgress steps={steps} />
              <p className="mt-8 text-center text-[#F7F5F0]/70">
                正在智能分析合同内容，请稍候…
              </p>
            </div>
          )}

          {error && !isReviewing && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-400">
              {error}
            </div>
          )}

          {report && !isReviewing && (
            <>
              <div className="mb-6 rounded-2xl border border-[#1c3a5f] bg-[#0f2541] p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
                      <FileCheck className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="font-medium text-[#F7F5F0]">{report.fileName}</h2>
                      <p className="text-sm text-[#F7F5F0]/60">{report.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className={`text-3xl font-bold ${scoreColor(report.score)}`}>
                        {report.score}
                      </p>
                      <p className="text-xs text-[#F7F5F0]/50">健康分</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/reports')}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-5 py-2.5 text-sm font-semibold text-[#0B1B33] transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      查看报告
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid h-[600px] gap-6 lg:grid-cols-2">
                <ContractViewer
                  content={report.content}
                  risks={report.risks}
                  activeRiskId={activeRiskId}
                  onRiskHover={setActiveRiskId}
                />
                <RiskPanel
                  risks={report.risks}
                  activeRiskId={activeRiskId}
                  onRiskHover={setActiveRiskId}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
