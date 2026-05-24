import { ScanLine, Upload } from 'lucide-react';

const OcrUploadCard = () => {
  return (
    <div className="flex flex-col rounded-xl bg-card ring-1 ring-foreground/10 overflow-hidden">
      {/* 헤더 */}
      <div className="border-b px-4 py-2.5 shrink-0">
        <p className="text-sm font-medium flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-muted-foreground" />
          OCR 빠른 입고 처리
        </p>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex flex-col min-h-0 p-3 ">
        <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-5 bg-blue-50/10 cursor-pointer hover:bg-blue-50 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Upload className="w-4 h-4 text-baro-blue" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">거래명세서를 여기에 올려주세요</p>
            <p className="text-xs text-muted-foreground mt-1">이미지 파일 (JPG, PNG) · 최대 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OcrUploadCard;
