import { AlertTriangle, Info, Package } from 'lucide-react';

import type { ClosingInventoryDeduction } from '@/features/closing/types/closing.types';
import { Badge } from '@/shadcn/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';

export interface DeductionRow extends ClosingInventoryDeduction {
  remainingStock: number;
}

interface ClosingInventoryDeductionSectionProps {
  rows: DeductionRow[];
  onChange: (ingredientId: string, remainingStock: number) => void;
}

const ClosingInventoryDeductionSection = ({
  rows,
  onChange,
}: ClosingInventoryDeductionSectionProps) => {
  const negativeRows = rows.filter((r) => r.isNegative);

  return (
    <Card className="pb-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            재고 차감 현황
            <span className="text-xs font-normal text-muted-foreground">
              — {rows.length}종 식자재
            </span>
          </CardTitle>
        </div>
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>예상 잔량을 확인하고, 실제 남은 재고가 다르다면 직접 수정하세요.</span>
        </div>

        {/* 마이너스 재고 경고 */}
        {negativeRows.length > 0 && (
          <div className="flex items-start gap-2 rounded-md bg-baro-red/5 border border-baro-red/30 px-3 py-2 text-xs mt-2">
            <AlertTriangle className="w-3.5 h-3.5 text-baro-red shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-baro-red">재고가 마이너스인 항목이 있어요.</p>
              <p className="text-baro-red/80 mt-0.5">
                {negativeRows.map((r) => r.ingredientName).join(', ')} — 실제 재고를 확인하고 보정해
                주세요.
              </p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <div className="flex items-center justify-center min-h-24 text-sm text-muted-foreground">
            차감할 재고 항목이 없어요.
          </div>
        ) : (
          <>
            {/* 데스크탑 헤더 */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 bg-muted/40 border-t border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <span>식자재명</span>
              <span className="text-right">개점 재고</span>
              <span className="text-right">주문 차감량</span>
              <span className="text-right">예상 잔량</span>
              <span className="text-center">실제 잔량</span>
            </div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {rows.map((row) => (
                <div key={row.ingredientId} className="hover:bg-muted/20 transition-colors">
                  {/* 데스크탑 행 */}
                  <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">{row.ingredientName}</span>
                      <span className="text-xs text-muted-foreground">({row.unit})</span>
                      {row.isNegative && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-4 border-baro-red/40 text-baro-red shrink-0"
                        >
                          마이너스
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground text-right">
                      {row.openingStock.toLocaleString()}
                      {row.unit}
                    </span>
                    <span className="text-sm text-muted-foreground text-right">
                      {row.orderDeductedAmount.toLocaleString()}
                      {row.unit}
                    </span>
                    <span
                      className={`text-sm font-semibold text-right ${
                        row.isNegative ? 'text-baro-red' : 'text-foreground'
                      }`}
                    >
                      {row.currentStock.toLocaleString()}
                      {row.unit}
                    </span>
                    <div className="flex items-center gap-1 justify-center">
                      <Input
                        type="number"
                        min={0}
                        value={row.remainingStock}
                        onChange={(e) =>
                          onChange(row.ingredientId, Math.max(0, Number(e.target.value)))
                        }
                        className="h-8 w-24 text-sm text-center"
                      />
                      <span className="text-xs text-muted-foreground">{row.unit}</span>
                    </div>
                  </div>

                  {/* 모바일 카드 */}
                  <div className="md:hidden px-4 py-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-sm font-medium truncate">{row.ingredientName}</span>
                        <span className="text-xs text-muted-foreground shrink-0">({row.unit})</span>
                        {row.isNegative && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 border-baro-red/40 text-baro-red shrink-0"
                          >
                            마이너스
                          </Badge>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-muted-foreground">예상 잔량</p>
                        <p
                          className={`text-sm font-semibold ${
                            row.isNegative ? 'text-baro-red' : 'text-foreground'
                          }`}
                        >
                          {row.currentStock.toLocaleString()}
                          {row.unit}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-0.5 text-xs text-muted-foreground">
                      <div>
                        <p className="text-[10px] mb-0.5">개점 재고</p>
                        <p>
                          {row.openingStock.toLocaleString()}
                          {row.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] mb-0.5">주문 차감</p>
                        <p>
                          {row.orderDeductedAmount.toLocaleString()}
                          {row.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] mb-0.5">실제 잔량</p>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min={0}
                            value={row.remainingStock}
                            onChange={(e) =>
                              onChange(row.ingredientId, Math.max(0, Number(e.target.value)))
                            }
                            className="h-7 w-full text-xs text-center"
                          />
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {row.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClosingInventoryDeductionSection;
