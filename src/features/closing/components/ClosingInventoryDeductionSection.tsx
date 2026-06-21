import { Info, Package } from 'lucide-react';

import type { ClosingInventoryDeduction } from '@/features/closing/types/closing.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';

export interface DeductionRow extends ClosingInventoryDeduction {
  actualUsage: number;
}

interface ClosingInventoryDeductionSectionProps {
  rows: DeductionRow[];
  onChange: (ingredientId: string, actualUsage: number) => void;
}

const ClosingInventoryDeductionSection = ({
  rows,
  onChange,
}: ClosingInventoryDeductionSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          재고 차감 현황
          <span className="text-xs font-normal text-muted-foreground">
            — {rows.length}종 식자재
          </span>
        </CardTitle>
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            이론 사용량은 레시피 기반 계산값입니다. 실제 사용량이 다르다면 직접 수정하세요.
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <div className="flex items-center justify-center min-h-24 text-sm text-muted-foreground">
            차감할 재고 항목이 없어요.
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 bg-muted/40 border-t border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <span>식자재명</span>
              <span className="text-right">현재 재고</span>
              <span className="text-right">이론 사용량</span>
              <span className="text-center">실제 사용량</span>
              <span className="text-right">차감 후 재고</span>
            </div>
            <div className="divide-y">
              {rows.map((row) => {
                const remaining = row.currentStock - row.actualUsage;
                const isNegative = remaining < 0;

                return (
                  <div
                    key={row.ingredientId}
                    className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
                  >
                    {/* 식자재명 */}
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-sm font-medium">{row.ingredientName}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground">({row.unit})</span>
                    </div>

                    {/* 현재 재고 */}
                    <div className="flex justify-between md:contents">
                      <span className="text-xs text-muted-foreground md:hidden self-center">
                        현재 재고
                      </span>
                      <span className="text-sm text-muted-foreground md:text-right self-center">
                        {row.currentStock.toLocaleString()}
                        {row.unit}
                      </span>
                    </div>

                    {/* 이론 사용량 */}
                    <div className="flex justify-between md:contents">
                      <span className="text-xs text-muted-foreground md:hidden self-center">
                        이론 사용량
                      </span>
                      <span className="text-sm text-muted-foreground md:text-right self-center">
                        {row.theoreticalUsage.toLocaleString()}
                        {row.unit}
                      </span>
                    </div>

                    {/* 실제 사용량 (편집 가능) */}
                    <div className="flex justify-between md:contents items-center">
                      <span className="text-xs text-muted-foreground md:hidden">실제 사용량</span>
                      <div className="flex items-center gap-1 md:justify-center">
                        <Input
                          type="number"
                          min={0}
                          value={row.actualUsage}
                          onChange={(e) =>
                            onChange(row.ingredientId, Math.max(0, Number(e.target.value)))
                          }
                          className="h-8 w-24 text-sm text-center"
                        />
                        <span className="text-xs text-muted-foreground">{row.unit}</span>
                      </div>
                    </div>

                    {/* 차감 후 재고 */}
                    <div className="flex justify-between md:contents items-center">
                      <span className="text-xs text-muted-foreground md:hidden">차감 후 재고</span>
                      <span
                        className={`text-sm font-semibold md:text-right ${
                          isNegative ? 'text-baro-red' : 'text-foreground'
                        }`}
                      >
                        {remaining.toLocaleString()}
                        {row.unit}
                        {isNegative && (
                          <span className="ml-1 text-xs font-normal text-baro-red">(부족)</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClosingInventoryDeductionSection;
