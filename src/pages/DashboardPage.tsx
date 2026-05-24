import OrderStatusCard from '@/features/customer-order/components/CustomerOrderStatusCard';
import MemoCard from '@/features/dashboard/components/MemoCard';
import OcrUploadCard from '@/features/dashboard/components/OcrUploadCard';
import SalesConsumptionCard from '@/features/dashboard/components/SalesConsumptionCard';
import StoreStatusCard from '@/features/dashboard/components/StoreStatusCard';
import { MOCK_SALES_DATA, MOCK_STATS } from '@/features/dashboard/data/dashboard.mock';

const DashboardPage = () => {
  return (
    <main className="flex-1 min-h-0 overflow-hidden p-4 flex gap-4">
      {/* 왼쪽: 주문 현황 */}
      <div className="flex-1 min-w-0">
        <OrderStatusCard />
      </div>

      {/* 오른쪽: 가게 현황 */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* 상단: 오늘의 가게 현황 요약 */}
        <StoreStatusCard stats={MOCK_STATS} />

        {/* 하단: 좌(이번달 현황 + OCR) / 우(메모) */}
        <div className="flex gap-5 flex-1 min-h-0">
          {/* 좌: 이번달 현황 + OCR 빠른 입고 처리 */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <SalesConsumptionCard data={MOCK_SALES_DATA} />
            </div>
            <div className="shrink-0">
              <OcrUploadCard />
            </div>
          </div>

          {/* 우: 메모 */}
          <div className="w-52 shrink-0 flex flex-col">
            <MemoCard />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
