import AiDemandPredictionBubble from '@/features/order-guide/components/AiDemandPredictionBubble';
import OrderGuideList from '@/features/order-guide/components/OrderGuideList';
import {
  MOCK_DEMAND_PREDICTION,
  MOCK_ORDER_GUIDE_ITEMS,
} from '@/features/order-guide/data/orderGuide.mock';

const OrderGuidePage = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 페이지 제목 */}

      {/* AI 수요 예측 말풍선 */}
      <AiDemandPredictionBubble prediction={MOCK_DEMAND_PREDICTION} />

      {/* 발주 가이드 리스트 */}
      <OrderGuideList items={MOCK_ORDER_GUIDE_ITEMS} />
    </div>
  );
};

export default OrderGuidePage;
