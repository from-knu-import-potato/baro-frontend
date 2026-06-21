import { useRef } from 'react';

import { Camera, FileImage } from 'lucide-react';

import { Button } from '@/shadcn/ui/button';

interface OcrUploadStepProps {
  onFileSelect: (file: File) => void;
}

const STEPS = [
  { num: 1, label: '거래명세서 촬영 또는 업로드' },
  { num: 2, label: '인식 결과 확인 및 수정' },
  { num: 3, label: '입고 확정' },
];

const OcrUploadStep = ({ onFileSelect }: OcrUploadStepProps) => {
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
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 overflow-y-auto -mt-16">
      <div className="w-full max-w-lg flex flex-col gap-8">
        {/* 설명 섹션 */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-base font-semibold">거래명세서를 등록해주세요</p>
            <p className="text-sm text-muted-foreground mt-1">
              이미지를 업로드하면 AI가 식자재 항목을 자동으로 인식합니다
            </p>
          </div>

          {/* 단계 표시 */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-2">
                  <span className="w-5 h-5 rounded-full bg-baro-blue text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {step.num}
                  </span>
                  <span className="text-xs font-medium text-foreground/80 whitespace-nowrap">
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="text-muted-foreground/40 text-sm">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 업로드 영역 */}
        <div className="flex flex-col gap-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-baro-blue/50 rounded-xl bg-muted/20 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 py-14"
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

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileImage className="w-4 h-4" />
              파일 선택
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
              사진 촬영
            </Button>
          </div>
        </div>
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

export default OcrUploadStep;
