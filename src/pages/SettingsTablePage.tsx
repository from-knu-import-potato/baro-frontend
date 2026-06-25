import { useState } from 'react';

import { jsPDF } from 'jspdf';
import { ArrowLeft, Download, Loader2, QrCode } from 'lucide-react';
import QRCodeLib from 'qrcode';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import {
  useStoreSettings,
  useUpdateStoreSettings,
} from '@/features/store-settings/hooks/useStoreSettings';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { getApiErrorMessage } from '@/shared/utils/apiError';

const BASE_URL = window.location.origin;

const DPR = 150 / 25.4;
const px = (mm: number) => Math.round(mm * DPR);

const PAGE_W = px(210);
const PAGE_H = px(297);
const MARGIN = px(8);
const GAP = px(6);
const CARD_W = Math.floor((PAGE_W - MARGIN * 2 - GAP) / 2);
const CARD_H = Math.floor((PAGE_H - MARGIN * 2 - GAP) / 2);
const QR_SIZE = px(65);
const RADIUS = px(5);
const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';

const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });

const SettingsTablePage = () => {
  const navigate = useNavigate();
  const storeId = useAuthStore((s) => s.storeId);
  const { data: settings, isLoading } = useStoreSettings();
  const { mutate: updateSettings, isPending } = useUpdateStoreSettings();

  const [draft, setDraft] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const saved = settings?.tableCount ?? null;
  const tableCount = saved ?? 0;

  const handleEdit = () => {
    setDraft(saved != null ? String(saved) : '');
    setIsEditing(true);
  };

  const handleSave = () => {
    const n = parseInt(draft, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      toast.error('테이블 수는 1~100 사이로 입력해주세요.');
      return;
    }
    updateSettings(
      { tableCount: n },
      {
        onSuccess: () => {
          toast.success('테이블 수가 저장되었습니다.');
          setIsEditing(false);
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, '저장에 실패했습니다. 잠시 후 다시 시도해 주세요.'));
        },
      },
    );
  };

  const handleDownloadPDF = async () => {
    if (!storeId || tableCount === 0) return;
    setIsGenerating(true);

    try {
      const tables = Array.from({ length: tableCount }, (_, i) => i + 1);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      for (let pageIdx = 0; pageIdx * 4 < tables.length; pageIdx++) {
        const canvas = document.createElement('canvas');
        canvas.width = PAGE_W;
        canvas.height = PAGE_H;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#F0F4F8';
        ctx.fillRect(0, 0, PAGE_W, PAGE_H);

        const pageTables = tables.slice(pageIdx * 4, pageIdx * 4 + 4);

        for (let ci = 0; ci < pageTables.length; ci++) {
          const n = pageTables[ci];
          const col = ci % 2;
          const row = Math.floor(ci / 2);
          const cx = MARGIN + col * (CARD_W + GAP);
          const cy = MARGIN + row * (CARD_H + GAP);

          // 그림자
          ctx.fillStyle = 'rgba(0,0,0,0.06)';
          drawRoundRect(ctx, cx + 3, cy + 5, CARD_W, CARD_H, RADIUS);
          ctx.fill();

          // 카드 흰 배경
          ctx.fillStyle = '#FFFFFF';
          drawRoundRect(ctx, cx, cy, CARD_W, CARD_H, RADIUS);
          ctx.fill();

          // QR 코드 생성
          const url = `${BASE_URL}/order/${storeId}/table/${n}`;
          const qrDataUrl = await QRCodeLib.toDataURL(url, {
            width: QR_SIZE * 2,
            margin: 1,
            color: { dark: '#111111', light: '#FFFFFF' },
            errorCorrectionLevel: 'M',
          });
          const qrImg = await loadImage(qrDataUrl);

          // ── 컨텐츠 블록 세로 중앙 정렬 ──────────────────────────
          const tableFont = px(8); // "N번 테이블"
          const instrFont = px(4.5); // 안내 문구
          const baroFont = px(4); // 하단 워터마크

          const blockH =
            QR_SIZE + // QR 코드
            px(8) + // QR → 테이블명 간격
            tableFont + // 테이블명
            px(3) + // 테이블명 → 안내 간격
            instrFont + // 안내 문구
            px(10) + // 안내 → BARO 간격
            baroFont; // BARO 워터마크

          let y = cy + Math.round((CARD_H - blockH) / 2);
          const midX = cx + CARD_W / 2;

          // QR 코드
          ctx.drawImage(qrImg, cx + Math.round((CARD_W - QR_SIZE) / 2), y, QR_SIZE, QR_SIZE);
          y += QR_SIZE + px(8);

          // "N번 테이블"
          ctx.fillStyle = '#111827';
          ctx.font = `600 ${tableFont}px ${FONT_STACK}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(`${n}번 테이블`, midX, y);
          y += tableFont + px(3);

          // 안내 문구
          ctx.fillStyle = '#9CA3AF';
          ctx.font = `${instrFont}px ${FONT_STACK}`;
          ctx.fillText('QR 코드를 스캔하여 주문해 주세요', midX, y);
          y += instrFont + px(10);

          // BARO 워터마크
          ctx.fillStyle = '#D1D5DB';
          ctx.font = `bold ${baroFont}px sans-serif`;
          ctx.fillText('BARO', midX, y);
        }

        if (pageIdx > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      }

      pdf.save('BARO_테이블_QR코드.pdf');
      toast.success('QR 코드 PDF가 다운로드되었습니다.');
    } catch {
      toast.error('다운로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <header className="shrink-0 flex flex-wrap items-center gap-3 border-b px-4 py-3 bg-background md:px-6 md:py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.storeSettings)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">테이블 관리</p>
          <p className="text-xs text-muted-foreground">
            테이블 수를 설정하고 손님 주문용 QR 코드를 생성합니다.
          </p>
        </div>
        {tableCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5"
            onClick={() => void handleDownloadPDF()}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            {isGenerating ? 'PDF 생성 중…' : 'QR 다운로드'}
          </Button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-5">
          {/* 테이블 수 설정 */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="flex flex-col gap-3 px-4 py-3.5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium">테이블 수</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  최소 1 ~ 최대 100개까지 설정할 수 있습니다.
                </p>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24 rounded-lg" />
              ) : isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="h-8 flex-1 md:flex-none md:w-20 text-center text-sm"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    className="h-8 bg-baro-blue text-white hover:bg-baro-blue/90"
                    onClick={handleSave}
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '저장'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8"
                    onClick={() => setIsEditing(false)}
                    disabled={isPending}
                  >
                    취소
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {saved != null ? `${saved}개` : '미설정'}
                  </span>
                  <Button size="sm" variant="outline" className="h-8" onClick={handleEdit}>
                    {saved != null ? '변경' : '설정'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 테이블별 QR 코드 그리드 */}
          {tableCount > 0 && (
            <>
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">테이블별 QR 코드</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: tableCount }, (_, i) => i + 1).map((n) => {
                  const url = `${BASE_URL}/order/${storeId}/table/${n}`;
                  return (
                    <div
                      key={n}
                      className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3"
                    >
                      <p className="text-xs font-semibold">{n}번 테이블</p>
                      <QRCode value={url} size={80} />
                      <button
                        onClick={() => {
                          void navigator.clipboard.writeText(url);
                          toast.success(`${n}번 테이블 URL이 복사되었습니다.`);
                        }}
                        className="text-[10px] text-muted-foreground underline-offset-2 hover:text-baro-blue hover:underline transition-colors"
                      >
                        URL 복사
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTablePage;
