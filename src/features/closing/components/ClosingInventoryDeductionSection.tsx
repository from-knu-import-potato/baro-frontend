import { Info, Package, Plus, X } from 'lucide-react';

import type { ExtraDeductionRow } from '@/features/closing/components/ClosingExtraDeductionDialog';
import type { ClosingInventoryDeduction } from '@/features/closing/types/closing.types';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';

export type { ExtraDeductionRow };

export interface DeductionRow extends ClosingInventoryDeduction {
  actualUsage: number;
}

interface ClosingInventoryDeductionSectionProps {
  rows: DeductionRow[];
  onChange: (ingredientId: string, actualUsage: number) => void;
  extraRows: ExtraDeductionRow[];
  onAddExtra: () => void;
  onExtraAmountChange: (ingredientId: string, amount: number) => void;
  onExtraRemove: (ingredientId: string) => void;
}

const ClosingInventoryDeductionSection = ({
  rows,
  onChange,
  extraRows,
  onAddExtra,
  onExtraAmountChange,
  onExtraRemove,
}: ClosingInventoryDeductionSectionProps) => {
  return (
    <Card className="pb-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            재고 차감 현황
            <span className="text-xs font-normal text-muted-foreground">
              — {rows.length + extraRows.length}종 식자재
            </span>
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={onAddExtra}
          >
            <Plus className="w-3 h-3" />
            추가 차감
          </Button>
        </div>
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            이론 사용량은 레시피 기반 계산값입니다. 실제 사용량이 다르다면 직접 수정하세요.
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 && extraRows.length === 0 ? (
          <div className="flex items-center justify-center min-h-24 text-sm text-muted-foreground">
            차감할 재고 항목이 없어요.
          </div>
        ) : (
          <>
            {rows.length > 0 && (
              <>
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 bg-muted/40 border-t border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <span>식자재명</span>
                  <span className="text-right">현재 재고</span>
                  <span className="text-right">이론 사용량</span>
                  <span className="text-center">실제 사용량</span>
                  <span className="text-right">차감 후 재고</span>
                </div>
                <div className="divide-y max-h-80 overflow-y-auto">
                  {rows.map((row) => {
                    const remaining = row.currentStock - row.actualUsage;
                    const isNegative = remaining < 0;

                    return (
                      <div
                        key={row.ingredientId}
                        className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors"
                      >
                        <div className="col-span-2 md:col-span-1">
                          <span className="text-sm font-medium">{row.ingredientName}</span>
                          <span className="ml-1.5 text-xs text-muted-foreground">({row.unit})</span>
                        </div>
                        <div className="flex justify-between md:contents">
                          <span className="text-xs text-muted-foreground md:hidden self-center">
                            현재 재고
                          </span>
                          <span className="text-sm text-muted-foreground md:text-right self-center">
                            {row.currentStock.toLocaleString()}
                            {row.unit}
                          </span>
                        </div>
                        <div className="flex justify-between md:contents">
                          <span className="text-xs text-muted-foreground md:hidden self-center">
                            이론 사용량
                          </span>
                          <span className="text-sm text-muted-foreground md:text-right self-center">
                            {row.theoreticalUsage.toLocaleString()}
                            {row.unit}
                          </span>
                        </div>
                        <div className="flex justify-between md:contents items-center">
                          <span className="text-xs text-muted-foreground md:hidden">
                            실제 사용량
                          </span>
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
                        <div className="flex justify-between md:contents items-center">
                          <span className="text-xs text-muted-foreground md:hidden">
                            차감 후 재고
                          </span>
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

            {/* 추가 차감 행 */}
            {extraRows.length > 0 && (
              <>
                <div className="flex items-center gap-2 px-5 py-2 bg-red-50/60 dark:bg-red-950/20 border-t border-b">
                  <span className="text-xs font-semibold text-baro-red uppercase tracking-wide">
                    추가 차감
                  </span>
                </div>
                <div className="divide-y max-h-48 overflow-y-auto">
                  {extraRows.map((row) => {
                    const remaining = row.currentStock - row.amount;
                    const isNegative = remaining < 0;

                    return (
                      <div
                        key={row.ingredientId}
                        className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors"
                      >
                        <div className="col-span-2 md:col-span-1 flex items-center gap-2">
                          <span className="text-sm font-medium">{row.ingredientName}</span>
                          <span className="text-xs text-muted-foreground">({row.unit})</span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 border-baro-red/30 text-baro-red shrink-0"
                          >
                            추가
                          </Badge>
                        </div>
                        <div className="flex justify-between md:contents">
                          <span className="text-xs text-muted-foreground md:hidden self-center">
                            현재 재고
                          </span>
                          <span className="text-sm text-muted-foreground md:text-right self-center">
                            {row.currentStock.toLocaleString()}
                            {row.unit}
                          </span>
                        </div>
                        <div className="hidden md:flex items-center justify-end">
                          <span className="text-sm text-muted-foreground">—</span>
                        </div>
                        <div className="flex justify-between md:contents items-center">
                          <span className="text-xs text-muted-foreground md:hidden">
                            실제 사용량
                          </span>
                          <div className="flex items-center gap-1 md:justify-center">
                            <Input
                              type="number"
                              min={0.001}
                              step="any"
                              value={row.amount}
                              onChange={(e) =>
                                onExtraAmountChange(
                                  row.ingredientId,
                                  Math.max(0, Number(e.target.value)),
                                )
                              }
                              className="h-8 w-24 text-sm text-center"
                            />
                            <span className="text-xs text-muted-foreground">{row.unit}</span>
                          </div>
                        </div>
                        <div className="flex justify-between md:contents items-center">
                          <span className="text-xs text-muted-foreground md:hidden">
                            차감 후 재고
                          </span>
                          <div className="flex items-center gap-2 md:justify-end">
                            <span
                              className={`text-sm font-semibold ${isNegative ? 'text-baro-red' : 'text-foreground'}`}
                            >
                              {remaining.toLocaleString()}
                              {row.unit}
                              {isNegative && (
                                <span className="ml-1 text-xs font-normal text-baro-red">
                                  (부족)
                                </span>
                              )}
                            </span>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-baro-red hover:bg-red-50 shrink-0"
                              onClick={() => onExtraRemove(row.ingredientId)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClosingInventoryDeductionSection;
