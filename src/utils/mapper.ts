import type { ReviewReport, ContractRisk } from '@/types';
import type { BackendContract, BackendRisk } from '@/api/contracts';

export function mapRisk(risk: BackendRisk): ContractRisk {
  return {
    id: risk.id,
    clause: risk.clause,
    startIndex: risk.start_index,
    endIndex: risk.end_index,
    level: risk.level,
    category: risk.category,
    description: risk.description,
    suggestion: risk.suggestion,
  };
}

export function mapContractToReport(contract: BackendContract): ReviewReport {
  const review = contract.review;
  return {
    id: contract.id,
    fileName: contract.file_name,
    fileSize: contract.file_size,
    uploadTime: contract.created_at,
    status: (review ? 'completed' : 'reviewing') as ReviewReport['status'],
    score: review?.score ?? 0,
    summary: review?.summary ?? '审核进行中，请稍候…',
    risks: review?.risks.map(mapRisk) ?? [],
    content: contract.content ?? '',
  };
}
