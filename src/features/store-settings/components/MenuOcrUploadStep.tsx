import { useRef } from 'react';

import { Camera, FileImage } from 'lucide-react';

import { Button } from '@/shadcn/ui/button';

interface MenuOcrUploadStepProps {
  onFileSelect: (file: File) => void;
  onBack?: () => void;
}

const STEPS = [
  { num: 1, label: '메뉴판 업로드' },
  { num: 2, label: '인식 결과 확인' },
  { num: 3, label: '메뉴 등록' },
];

const MenuOcrUploadStep = ({ onFileSelect, onBack }: MenuOcrUploadStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) onFileSelect(file);
  };

  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0 overflow-y-auto">
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <p className="text-sm font-semibold">메뉴판을 등록해주세요</p>
          <p className="text-xs text-muted-foreground mt-1">
            이미지를 업로드하면 AI가 메뉴 항목을 자동으로 인식합니다
          </p>
        </div>

        <div className="flex items-start justify-center">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-start">
              <div className="flex flex-col items-center gap-2 text-center w-20">
                <span className="w-6 h-6 rounded-full bg-baro-blue text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {step.num}
                </span>
                <span className="text-[10px] font-medium text-foreground/70 leading-snug">
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="text-muted-foreground/40 text-sm mt-1 px-1 shrink-0">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border hover:border-baro-blue/50 rounded-xl bg-muted/20 hover:bg-baro-blue/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 py-12"
        >
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
            <FileImage className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">여기에 파일을 끌어다 놓거나</p>
            <p className="text-xs text-muted-foreground mt-0.5">클릭하여 파일을 선택해주세요</p>
          </div>
          <span className="text-xs text-muted-foreground/60 bg-muted px-2.5 py-1 rounded-full">
            JPG, PNG · 최대 10MB
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <Button
            variant="outline"
            className="w-full md:flex-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileImage className="w-4 h-4" />
            파일 선택
          </Button>
          <Button
            variant="outline"
            className="w-full md:flex-1"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="w-4 h-4" />
            사진 촬영
          </Button>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors self-center"
          >
            ← 직접 입력으로 돌아가기
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default MenuOcrUploadStep;
