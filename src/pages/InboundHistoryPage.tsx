import { useState } from 'react';

import { ArrowLeft, FileImage, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import InboundDetailModal from '@/features/ocr-inbound/components/InboundDetailModal';
import { useInboundHistory } from '@/features/ocr-inbound/hooks/useInboundHistory';
import type { InboundRecord } from '@/features/ocr-inbound/types/ocrInbound.api.types';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Skeleton } from '@/shadcn/ui/skeleton';

const InboundHistoryPage = () => {
  const navigate = useNavigate();
  const { data: records = [], isLoading } = useInboundHistory();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const formatDate = (record: InboundRecord) =>
    record.transactionDate ?? record.createdAt.slice(0, 10);

  const formatAmount = (val: string | null) =>
    val != null ? `${Number(val).toLocaleString()}원` : null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <header className="shrink-0 flex items-center gap-3 border-b px-4 py-3 bg-background md:px-6 md:py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.inventory)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0">
          <p className="text-sm font-semibold">입고 이력</p>
          <p className="text-xs text-muted-foreground">OCR로 처리한 입고 기록을 확인하세요</p>
        </div>
      </header>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
            <Package className="w-12 h-12 opacity-20" />
            <p className="text-sm">아직 입고 이력이 없어요</p>
            <p className="text-xs">OCR 입고 처리를 완료하면 여기에 기록됩니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((record) => (
              <Card key={record.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* 날짜 */}
                    <div className="shrink-0 w-16 sm:w-20 text-center">
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                        {formatDate(record).slice(0, 7)}
                      </p>
                      <p className="text-base sm:text-lg font-bold tabular-nums leading-tight">
                        {formatDate(record).slice(8, 10)}일
                      </p>
                    </div>

                    <div className="w-px h-9 bg-border shrink-0" />

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="font-semibold text-sm truncate">
                          {record.supplierName ?? '공급업체 정보 없음'}
                        </p>
                        {record.invoiceImageUrl && (
                          <span className="shrink-0 inline-flex items-center gap-0.5 text-[10px] text-baro-blue bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded-full dark:bg-blue-950/40 dark:border-blue-800/40">
                            <FileImage className="w-2.5 h-2.5" />
                            명세서
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        품목 {record.itemCount}개
                        {record.totalAmount != null && ` · ${formatAmount(record.totalAmount)}`}
                        {record.invoiceNumber && ` · ${record.invoiceNumber}`}
                      </p>
                    </div>

                    {/* 상세보기 */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-xs"
                      onClick={() => setSelectedId(record.id)}
                    >
                      상세보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <InboundDetailModal recordId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
};

export default InboundHistoryPage;
