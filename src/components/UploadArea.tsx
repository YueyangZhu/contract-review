import { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { formatFileSize } from '@/utils/format';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadArea({ onFileSelect, disabled }: UploadAreaProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (selectedFile) {
    return (
      <div className="rounded-xl border border-[#C9A227]/40 bg-[#C9A227]/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0B1B33] text-[#C9A227]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-[#0B1B33]">{selectedFile.name}</p>
              <p className="text-sm text-[#0B1B33]/60">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearFile}
            disabled={disabled}
            className="rounded-full p-2 text-[#0B1B33]/60 transition-colors hover:bg-[#0B1B33]/10 hover:text-[#0B1B33] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all ${
        dragOver
          ? 'border-[#C9A227] bg-[#C9A227]/10'
          : 'border-[#1c3a5f] bg-[#0B1B33]/50 hover:border-[#C9A227]/60 hover:bg-[#0B1B33]'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.docx,.pdf"
        onChange={onChange}
        disabled={disabled}
        className="hidden"
      />
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
        <UploadCloud className="h-8 w-8" />
      </div>
      <p className="mb-2 font-medium text-[#F7F5F0]">
        点击或拖拽文件至此处上传
      </p>
      <p className="text-sm text-[#F7F5F0]/50">
        支持 DOCX、PDF、TXT 格式，最大 10MB
      </p>
    </div>
  );
}
