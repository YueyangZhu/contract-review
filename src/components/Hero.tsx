import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1B33] px-6 pb-24 pt-20 lg:pt-28">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(201,162,39,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#C9A227]/10 blur-3xl" />
      <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-[#1e4b7a]/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-4 py-1.5 text-sm text-[#C9A227]">
          <Sparkles className="h-4 w-4" />
          <span>AI 驱动的合同风险审查助手</span>
        </div>

        <h1 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-[#F7F5F0] md:text-6xl lg:text-7xl">
          让每一份合同
          <br />
          <span className="text-[#C9A227]">都经得起推敲</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#F7F5F0]/70 md:text-xl">
          上传合同文本，智能识别潜在风险条款，自动输出结构化审核报告，
          助力法务与业务团队高效决策。
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/review"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-8 py-3.5 text-base font-semibold text-[#0B1B33] transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C9A227]/25"
          >
            开始智能审核
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 rounded-lg border border-[#C9A227]/50 px-8 py-3.5 text-base font-semibold text-[#C9A227] transition-all hover:-translate-y-1 hover:bg-[#C9A227]/10"
          >
            查看历史报告
          </Link>
        </div>
      </div>
    </section>
  );
}
