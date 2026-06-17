import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

import useAuthStore from '@/features/auth/store/authStore';
import OrderStatusCard from '@/features/customer-order/components/CustomerOrderStatusCard';
import MemoCard from '@/features/dashboard/components/MemoCard';
import OcrUploadCard from '@/features/dashboard/components/OcrUploadCard';
import SalesConsumptionCard from '@/features/dashboard/components/SalesConsumptionCard';
import StoreStatusCard from '@/features/dashboard/components/StoreStatusCard';
import { useDashboardSales } from '@/features/dashboard/hooks/useDashboardSales';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { Skeleton } from '@/shadcn/ui/skeleton';

const getYesterdayKST = () => {
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  kstNow.setDate(kstNow.getDate() - 1);
  return kstNow.toISOString().slice(0, 10);
};

const DashboardPage = () => {
  const storeId = useAuthStore((s) => s.storeId);

  const { data: stats, isLoading: statsLoading } = useDashboardStats(storeId);
  const { data: salesData, isLoading: salesLoading } = useDashboardSales(storeId);

  return (
    <main className="flex-1 min-h-0 overflow-hidden p-4 flex gap-4">
      {/* 왼쪽: 주문 현황 */}
      <div className="flex-1 min-w-0">
        <OrderStatusCard storeId={storeId} />
      </div>

      {/* 오른쪽: 가게 현황 */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* 누락 마감 배너 */}
        {stats?.missedClosing && (
          <Link
            to={`/closing?date=${getYesterdayKST()}`}
            className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>
              <span className="font-semibold">전날 마감이 누락되었습니다.</span> 클릭하여 소급
              마감을 진행하세요.
            </span>
          </Link>
        )}
        {/* 상단: 오늘의 가게 현황 요약 */}
        {statsLoading || !stats ? (
          <Skeleton className="h-[92px] w-full rounded-xl" />
        ) : (
          <StoreStatusCard stats={stats} storeId={storeId} />
        )}

        {/* 하단: 좌(이번달 현황 + OCR) / 우(메모) */}
        <div className="flex gap-5 flex-1 min-h-0">
          {/* 좌: 이번달 현황 + OCR 빠른 입고 처리 */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              {salesLoading || !salesData || salesData.length === 0 ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <SalesConsumptionCard data={salesData} />
              )}
            </div>
            <div className="shrink-0">
              <OcrUploadCard />
            </div>
          </div>

          {/* 우: 메모 */}
          <div className="w-60 shrink-0 flex flex-col">
            <MemoCard />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
