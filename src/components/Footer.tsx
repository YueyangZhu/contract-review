import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#1c3a5f] bg-[#0B1B33] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2 text-[#F7F5F0]">
          <ShieldCheck className="h-6 w-6 text-[#C9A227]" />
          <span className="font-serif text-lg font-semibold">法审通</span>
        </div>
        <p className="text-sm text-[#F7F5F0]/50">
          © 2026 法审通 · 智能合同审核系统 · 本系统输出仅供参考，不构成正式法律意见
        </p>
      </div>
    </footer>
  );
}
