import OcrUploadCard from '@/features/dashboard/components/OcrUploadCard';
import OrderPredictionCard from '@/features/dashboard/components/OrderPredictionCard';
import SalesConsumptionCard from '@/features/dashboard/components/SalesConsumptionCard';
import TodayStatusSection from '@/features/dashboard/components/TodayStatusSection';
import {
  MOCK_DEMAND_PREDICTION,
  MOCK_RECOMMENDATIONS,
  MOCK_SALES_DATA,
  MOCK_STATS,
} from '@/features/dashboard/data/dashboard.mock';

const DashboardPage = () => {
  return (
    <main className="flex-1 p-6 flex flex-col gap-5">
      <TodayStatusSection stats={MOCK_STATS} onClosingClick={() => {}} />

      <div className="flex gap-5 flex-1">
        {/* 왼쪽: 발주 및 수요 예측 */}
        <div className="flex-1 min-w-0">
          <OrderPredictionCard
            demandPrediction={MOCK_DEMAND_PREDICTION}
            recommendations={MOCK_RECOMMENDATIONS}
          />
        </div>

        {/* 오른쪽: 매출 현황 + OCR */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <SalesConsumptionCard data={MOCK_SALES_DATA} />
          <OcrUploadCard />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
