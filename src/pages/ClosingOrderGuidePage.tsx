import { LogOut, Package } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import useAuthStore from '@/features/auth/store/authStore';
import OrderGuideList from '@/features/order-guide/components/OrderGuideList';
import { useOrderGuide } from '@/features/order-guide/hooks/useOrderGuide';
import type { OrderGuideItem } from '@/features/order-guide/types/orderGuide.types';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Skeleton } from '@/shadcn/ui/skeleton';

const ClosingOrderGuidePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateItems = (location.state as { items?: OrderGuideItem[] } | null)?.items;

  const storeId = useAuthStore((s) => s.storeId);
  const { data, isLoading, isError } = useOrderGuide(stateItems ? null : storeId);

  const items = stateItems ?? data?.items;

  const handleExit = () => {
    navigate('/system-start', { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-lg font-bold">발주 가이드</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 text-muted-foreground"
          onClick={handleExit}
        >
          <LogOut className="w-4 h-4" />
          프로그램 종료
        </Button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col flex-1 p-6 min-h-0">
        {!stateItems && isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        ) : !stateItems && (isError || !data) ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                발주 가이드를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            </CardContent>
          </Card>
        ) : (
          <OrderGuideList items={items ?? []} />
        )}
      </div>
    </div>
  );
};

export default ClosingOrderGuidePage;
