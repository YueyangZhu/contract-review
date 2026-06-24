import { riskRules } from '@/data/riskRules';
import type { ContractRisk, ReviewReport, RiskLevel } from '@/types';

export function analyzeContract(
  fileName: string,
  fileSize: number,
  content: string
): ReviewReport {
  const risks: ContractRisk[] = [];

  riskRules.forEach((rule) => {
    rule.patterns.forEach((pattern) => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match.index === undefined) continue;
        const id = `${rule.id}-${match.index}`;
        if (risks.some((r) => r.id === id)) continue;
        risks.push({
          id,
          clause: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          level: rule.level,
          category: rule.category,
          description: rule.description,
          suggestion: rule.suggestion,
        });
      }
    });
  });

  // Sort by level severity
  const levelWeight: Record<RiskLevel, number> = { high: 3, medium: 2, low: 1 };
  risks.sort((a, b) => levelWeight[b.level] - levelWeight[a.level]);

  const score = Math.max(0, 100 - risks.reduce((sum, r) => {
    if (r.level === 'high') return sum + 15;
    if (r.level === 'medium') return sum + 8;
    return sum + 3;
  }, 0));

  const highCount = risks.filter((r) => r.level === 'high').length;
  const mediumCount = risks.filter((r) => r.level === 'medium').length;
  const lowCount = risks.filter((r) => r.level === 'low').length;

  let summary = `本次审核共发现 ${risks.length} 处风险：`;
  summary += ` 高风险 ${highCount} 处、中风险 ${mediumCount} 处、低风险 ${lowCount} 处。`;
  if (score >= 80) {
    summary += ' 整体合同健康状况良好，但仍有部分条款建议优化。';
  } else if (score >= 60) {
    summary += ' 合同存在一定数量的风险点，建议重点审查高风险条款。';
  } else {
    summary += ' 合同风险较高，建议在签署前进行重大修改。';
  }

  return {
    id: crypto.randomUUID(),
    fileName,
    fileSize,
    uploadTime: new Date().toISOString(),
    status: 'completed',
    score,
    risks,
    summary,
    content,
  };
}
