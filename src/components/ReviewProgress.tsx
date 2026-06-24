import { Check, Loader2 } from 'lucide-react';
import type { ReviewStep } from '@/types';

interface ReviewProgressProps {
  steps: ReviewStep[];
}

export default function ReviewProgress({ steps }: ReviewProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.label} className="relative flex flex-1 flex-col items-center">
            {index < steps.length - 1 && (
              <div
                className={`absolute left-1/2 top-5 h-0.5 w-full ${
                  step.status === 'completed' ? 'bg-[#C9A227]' : 'bg-[#1c3a5f]'
                }`}
              />
            )}
            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                step.status === 'completed'
                  ? 'border-[#C9A227] bg-[#C9A227] text-[#0B1B33]'
                  : step.status === 'active'
                    ? 'border-[#C9A227] bg-[#0B1B33] text-[#C9A227]'
                    : 'border-[#1c3a5f] bg-[#0B1B33] text-[#F7F5F0]/40'
              }`}
            >
              {step.status === 'completed' ? (
                <Check className="h-5 w-5" />
              ) : step.status === 'active' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`mt-3 text-center text-xs font-medium ${
                step.status === 'pending'
                  ? 'text-[#F7F5F0]/40'
                  : 'text-[#F7F5F0]'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
