import { apiGet, apiPost, apiFormData } from './client';

export interface BackendRisk {
  id: string;
  clause: string;
  start_index: number;
  end_index: number;
  level: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  suggestion: string;
}

export interface BackendReview {
  id: string;
  contract_id: string;
  score: number;
  summary: string;
  status: string;
  created_at: string;
  risks: BackendRisk[];
}

export interface BackendContract {
  id: string;
  title: string;
  file_name: string;
  file_type: string;
  file_size: number;
  status: string;
  uploader_id: string;
  created_at: string;
  updated_at: string;
  content?: string;
  review?: BackendReview;
}

export async function listContracts(): Promise<BackendContract[]> {
  return apiGet<BackendContract[]>('/contracts');
}

export async function getContract(id: string): Promise<BackendContract> {
  return apiGet<BackendContract>(`/contracts/${id}`);
}

export async function uploadContract(file: File, title: string): Promise<BackendContract> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title || file.name);
  return apiFormData<BackendContract>('/contracts/upload', formData);
}

export async function reviewContract(id: string): Promise<{ review_id: string; status: string }> {
  return apiPost<{ review_id: string; status: string }>(`/contracts/${id}/review`, {});
}

export async function archiveContract(id: string): Promise<BackendContract> {
  return apiPost<BackendContract>(`/contracts/${id}/archive`, {});
}
