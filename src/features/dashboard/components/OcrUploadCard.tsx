import { ScanLine, Upload } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

const OcrUploadCard = () => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b pb-4 shrink-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-muted-foreground" />
          OCR 빠른 입고 처리
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-4">
        <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 flex-1 min-h-20 bg-blue-50/10 cursor-pointer hover:bg-blue-50 hover:dark:bg-baro-blue/20 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Upload className="w-4 h-4 text-baro-blue" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">거래명세서를 여기에 올려주세요</p>
            <p className="text-xs text-muted-foreground mt-1">이미지 파일 (JPG, PNG) · 최대 10MB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OcrUploadCard;
