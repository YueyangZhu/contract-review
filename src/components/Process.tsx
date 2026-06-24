import { Upload, FileText, ScanLine, FileCheck } from 'lucide-react';

const steps = [
  { icon: Upload, title: '上传合同', description: '支持 DOCX、PDF、TXT 格式' },
  { icon: FileText, title: '智能解析', description: '自动提取合同文本与条款' },
  { icon: ScanLine, title: '风险评估', description: '多维度识别潜在法律风险' },
  { icon: FileCheck, title: '导出报告', description: '一键生成结构化审核报告' },
];

export default function Process() {
  return (
    <section className="bg-[#F7F5F0] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-[#0B1B33] md:text-4xl">
            使用流程
          </h2>
          <p className="mx-auto max-w-xl text-[#0B1B33]/60">
            简单四步，即可完成专业级合同审查
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-0.5 w-full -translate-x-0 bg-[#C9A227]/30 md:block" />
              )}
              <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#F7F5F0] bg-[#0B1B33] text-[#C9A227] shadow-lg">
                <step.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-[#0B1B33]">
                {step.title}
              </h3>
              <p className="text-sm text-[#0B1B33]/60">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
