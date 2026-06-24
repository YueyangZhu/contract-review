import { AlertTriangle, FileSearch, Scale } from 'lucide-react';

const features = [
  {
    icon: AlertTriangle,
    title: '风险识别',
    description:
      '基于法律规则库自动扫描合同文本，精准定位高风险、中风险与低风险条款，避免遗漏关键问题。',
  },
  {
    icon: FileSearch,
    title: '条款解析',
    description:
      '对付款、违约、知识产权、争议解决等核心条款进行结构化解析，快速呈现条款要点与潜在漏洞。',
  },
  {
    icon: Scale,
    title: '合规建议',
    description:
      '针对每处风险提供可执行的修改建议，帮助法务团队快速形成修订意见，提升谈判效率。',
  },
];

export default function Features() {
  return (
    <section className="bg-[#0B1B33] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-[#F7F5F0] md:text-4xl">
            核心能力
          </h2>
          <p className="mx-auto max-w-xl text-[#F7F5F0]/60">
            从上传到报告，三步完成合同智能审查
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[#1c3a5f] bg-[#F7F5F0] p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#C9A227]/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-6 inline-flex rounded-xl bg-[#0B1B33] p-4 text-[#C9A227]">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-semibold text-[#0B1B33]">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-[#0B1B33]/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
