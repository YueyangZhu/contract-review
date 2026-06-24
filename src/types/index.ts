export type RiskLevel = 'high' | 'medium' | 'low';

export interface ContractRisk {
  id: string;
  clause: string;
  startIndex: number;
  endIndex: number;
  level: RiskLevel;
  category: string;
  description: string;
  suggestion: string;
}

export interface ReviewReport {
  id: string;
  fileName: string;
  fileSize: number;
  uploadTime: string;
  status: 'reviewing' | 'completed';
  score: number;
  risks: ContractRisk[];
  summary: string;
  content: string;
}

export interface RiskRule {
  id: string;
  level: RiskLevel;
  category: string;
  patterns: RegExp[];
  description: string;
  suggestion: string;
}

export type ReviewStep = {
  label: string;
  status: 'pending' | 'active' | 'completed';
};
