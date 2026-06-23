import useAuthStore from '@/features/auth/store/authStore';
import OrderStatusCard from '@/features/customer-order/components/CustomerOrderStatusCard';
import MemoCard from '@/features/dashboard/components/MemoCard';
import OcrUploadCard from '@/features/dashboard/components/OcrUploadCard';
import SalesConsumptionCard from '@/features/dashboard/components/SalesConsumptionCard';
import StoreStatusCard from '@/features/dashboard/components/StoreStatusCard';
import { useDashboardSales } from '@/features/dashboard/hooks/useDashboardSales';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { Skeleton } from '@/shadcn/ui/skeleton';

const DashboardPage = () => {
  const storeId = useAuthStore((s) => s.storeId);

  const { data: stats, isLoading: statsLoading } = useDashboardStats(storeId);
  const { data: salesData, isLoading: salesLoading } = useDashboardSales(storeId);

  return (
    <main className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden p-3 flex flex-col gap-4 md:flex-row">
      {/* 주문 현황 */}
      <div className="flex-1 min-w-0 md:min-h-0 md:overflow-hidden p-1">
        <OrderStatusCard storeId={storeId} />
      </div>

      {/* 가게 현황 */}
      <div className="flex-1 min-w-0 flex flex-col gap-4 md:min-h-0 p-1">
        {/* 오늘의 가게 현황 요약 */}
        {statsLoading || !stats ? (
          <Skeleton className="h-23 w-full rounded-xl" />
        ) : (
          <StoreStatusCard stats={stats} storeId={storeId} />
        )}

        {/* 이번달 현황 + OCR / 메모 */}
        <div className="flex flex-col gap-4 flex-1 min-h-0 md:flex-row md:gap-5">
          {/* 이번달 현황 + OCR 빠른 입고 처리 */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 md:min-h-0">
            <div className="md:flex-1 md:min-h-0">
              {salesLoading || !salesData || salesData.length === 0 ? (
                <Skeleton className="h-40 w-full rounded-xl md:h-full" />
              ) : (
                <SalesConsumptionCard data={salesData} />
              )}
            </div>
            <div className="shrink-0">
              <OcrUploadCard />
            </div>
          </div>

          {/* 메모 */}
          <div className="min-h-48 md:min-h-0 md:w-60 md:shrink-0 flex flex-col">
            <MemoCard />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
