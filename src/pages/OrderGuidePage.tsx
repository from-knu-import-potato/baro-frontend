import { Package } from 'lucide-react';

import useAuthStore from '@/features/auth/store/authStore';
import OrderGuideList from '@/features/order-guide/components/OrderGuideList';
import { useOrderGuide } from '@/features/order-guide/hooks/useOrderGuide';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Skeleton } from '@/shadcn/ui/skeleton';

const OrderGuidePage = () => {
  const storeId = useAuthStore((s) => s.storeId);
  const { data, isLoading, isError } = useOrderGuide(storeId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              발주 가이드를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <OrderGuideList items={data.items} generatedAt={data.generatedAt} />
    </div>
  );
};

export default OrderGuidePage;
