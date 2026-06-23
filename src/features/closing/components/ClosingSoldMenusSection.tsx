import { ShoppingBag } from 'lucide-react';

import type { ClosingSoldMenu } from '@/features/closing/types/closing.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface ClosingSoldMenusSectionProps {
  menus: ClosingSoldMenu[];
}

const formatCurrency = (amount: number) => `${amount.toLocaleString('ko-KR')}원`;

const ClosingSoldMenusSection = ({ menus }: ClosingSoldMenusSectionProps) => {
  return (
    <Card className="pb-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          오늘 판매 메뉴
          <span className="text-xs font-normal text-muted-foreground">— 총 {menus.length}종</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {menus.length === 0 ? (
          <div className="flex items-center justify-center min-h-24 text-sm text-muted-foreground">
            오늘 판매된 메뉴가 없어요.
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 bg-muted/40 border-t border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <span>메뉴명</span>
              <span className="text-right">단가</span>
              <span className="text-right">수량</span>
              <span className="text-right">소계</span>
            </div>
            <div className="divide-y max-h-72 overflow-y-auto">
              {menus.map((menu) => (
                <div
                  key={menu.menuId}
                  className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2 md:gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors"
                >
                  <span className="text-sm font-medium col-span-2 md:col-span-1">
                    {menu.menuName}
                  </span>
                  <div className="flex justify-between md:contents">
                    <span className="text-xs text-muted-foreground md:hidden">단가</span>
                    <span className="text-sm text-muted-foreground md:text-right">
                      {formatCurrency(menu.unitPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between md:contents">
                    <span className="text-xs text-muted-foreground md:hidden">수량</span>
                    <span className="text-sm font-medium md:text-right">{menu.quantity}개</span>
                  </div>
                  <div className="flex justify-between md:contents">
                    <span className="text-xs text-muted-foreground md:hidden">소계</span>
                    <span className="text-sm font-semibold text-foreground md:text-right">
                      {formatCurrency(menu.subtotal)}
                    </span>
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

export default ClosingSoldMenusSection;
