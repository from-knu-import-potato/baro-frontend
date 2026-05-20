import AiDemandCard from '@/features/dashboard/components/AiDemandCard';
import OcrUploadCard from '@/features/dashboard/components/OcrUploadCard';
import SalesConsumptionCard from '@/features/dashboard/components/SalesConsumptionCard';
import StoreStatusCard from '@/features/dashboard/components/StoreStatusCard';
import {
  MOCK_DEMAND_PREDICTION,
  MOCK_SALES_DATA,
  MOCK_STATS,
} from '@/features/dashboard/data/dashboard.mock';
import OrderStatusCard from '@/features/orders/components/OrderStatusCard';

const DashboardPage = () => {
  return (
    <main className="flex-1 min-h-0 overflow-hidden p-4 flex gap-5">
      {/* 왼쪽: 주문 현황 */}
      <div className="flex-1 min-w-0">
        <OrderStatusCard />
      </div>

      {/* 오른쪽: 가게 현황 */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <StoreStatusCard stats={MOCK_STATS} />

        <div className="flex gap-5 flex-1 min-h-0">
          <div className="flex-1 min-w-0">
            <SalesConsumptionCard data={MOCK_SALES_DATA} />
          </div>
          <div className="flex-1 min-h-0 flex flex-col gap-4">
            <div className="flex-1 min-h-0">
              <OcrUploadCard />
            </div>
            <AiDemandCard prediction={MOCK_DEMAND_PREDICTION} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
