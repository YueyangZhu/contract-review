import { create } from 'zustand';
import type { ReviewReport } from '@/types';

interface AppState {
  reports: ReviewReport[];
  currentReport: ReviewReport | null;
  addReport: (report: ReviewReport) => void;
  setCurrentReport: (report: ReviewReport | null) => void;
  updateReport: (id: string, updates: Partial<ReviewReport>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  reports: [],
  currentReport: null,
  addReport: (report) =>
    set((state) => ({
      reports: [report, ...state.reports],
      currentReport: report,
    })),
  setCurrentReport: (report) => set({ currentReport: report }),
  updateReport: (id, updates) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      currentReport:
        state.currentReport?.id === id
          ? { ...state.currentReport, ...updates }
          : state.currentReport,
    })),
}));
