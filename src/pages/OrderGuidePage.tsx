import OrderGuideList from '@/features/order-guide/components/OrderGuideList';
import { MOCK_ORDER_GUIDE_ITEMS } from '@/features/order-guide/data/orderGuide.mock';

const OrderGuidePage = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <OrderGuideList items={MOCK_ORDER_GUIDE_ITEMS} />
    </div>
  );
};

export default OrderGuidePage;
