import { useState } from 'react';

import { Download, FileImage, Package } from 'lucide-react';
import { toast } from 'sonner';

import { useInboundDetail } from '@/features/ocr-inbound/hooks/useInboundHistory';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Skeleton } from '@/shadcn/ui/skeleton';

interface InboundDetailModalProps {
  recordId: string | null;
  onClose: () => void;
}

const downloadImage = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = 'invoice.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
};

const InboundDetailModal = ({ recordId, onClose }: InboundDetailModalProps) => {
  const { data, isLoading } = useInboundDetail(recordId);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatAmount = (val: string | null) =>
    val != null ? `${Number(val).toLocaleString()}원` : '—';

  const handleDownload = async () => {
    if (!data?.invoiceImageUrl) return;
    setIsDownloading(true);
    try {
      await downloadImage(data.invoiceImageUrl);
    } catch {
      toast.error('이미지 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={!!recordId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 py-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Package className="w-4 h-4 text-baro-blue" />
            입고 상세
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-1/3 rounded" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-52 w-full rounded-lg" />
          </div>
        ) : data ? (
          <div className="flex flex-col md:flex-row min-h-0 flex-1 overflow-hidden">
            {/* 이미지 패널 */}
            {data.invoiceImageUrl && (
              <div className="flex flex-col md:w-[42%] shrink-0 border-b md:border-b-0 md:border-r bg-muted/20">
                <div className="flex-1 overflow-auto flex items-start justify-center p-4 max-h-56 md:max-h-none">
                  <img
                    src={data.invoiceImageUrl}
                    alt="거래명세서 이미지"
                    className="max-w-full rounded-md shadow-sm object-contain"
                  />
                </div>
                <div className="shrink-0 px-4 py-2.5 border-t bg-background/90 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileImage className="w-3.5 h-3.5" />
                    거래명세서
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 text-xs h-7 px-2.5"
                  >
                    <Download className="w-3 h-3" />
                    {isDownloading ? '저장 중...' : '저장'}
                  </Button>
                </div>
              </div>
            )}

            {/* 상세 정보 패널 */}
            <div
              className={`flex flex-col gap-4 overflow-y-auto p-5 ${
                data.invoiceImageUrl ? 'md:flex-1' : 'w-full'
              }`}
            >
              {/* 메타데이터 그리드 */}
              <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm shrink-0">
                {data.transactionDate && (
                  <>
                    <span className="text-muted-foreground whitespace-nowrap">거래일자</span>
                    <span className="font-medium">{data.transactionDate}</span>
                  </>
                )}
                {data.supplierName && (
                  <>
                    <span className="text-muted-foreground whitespace-nowrap">공급업체</span>
                    <span className="font-medium">{data.supplierName}</span>
                  </>
                )}
                {data.invoiceNumber && (
                  <>
                    <span className="text-muted-foreground whitespace-nowrap">명세서 번호</span>
                    <span className="font-medium">{data.invoiceNumber}</span>
                  </>
                )}
                {data.totalSupplyAmount != null && (
                  <>
                    <span className="text-muted-foreground whitespace-nowrap">공급가액</span>
                    <span className="font-medium">{formatAmount(data.totalSupplyAmount)}</span>
                  </>
                )}
                {data.totalTax != null && (
                  <>
                    <span className="text-muted-foreground whitespace-nowrap">세액</span>
                    <span className="font-medium">{formatAmount(data.totalTax)}</span>
                  </>
                )}
                {data.totalAmount != null && (
                  <>
                    <span className="text-muted-foreground whitespace-nowrap">총 거래금액</span>
                    <span className="font-semibold">{formatAmount(data.totalAmount)}</span>
                  </>
                )}
              </div>

              {/* 품목 목록 */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <p className="text-sm font-semibold">
                  입고 품목{' '}
                  <span className="text-muted-foreground font-normal">({data.items.length}개)</span>
                </p>
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full text-sm min-w-[440px]">
                    <thead className="bg-muted/50">
                      <tr className="text-xs text-muted-foreground font-medium">
                        <th className="text-left px-3 py-2">식자재명</th>
                        <th className="text-right px-3 py-2">수량</th>
                        <th className="text-right px-3 py-2">단가</th>
                        <th className="text-right px-3 py-2">공급가</th>
                        <th className="text-left px-3 py-2">유통기한</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.items.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-3 py-2 font-medium whitespace-nowrap">
                            {item.ingredientName}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                            {Number(item.amount).toLocaleString()} {item.unit}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground whitespace-nowrap">
                            {item.unitPrice != null
                              ? `${Number(item.unitPrice).toLocaleString()}원`
                              : '—'}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground whitespace-nowrap">
                            {item.supplyPrice != null
                              ? `${Number(item.supplyPrice).toLocaleString()}원`
                              : '—'}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                            {item.expiryDate ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default InboundDetailModal;
