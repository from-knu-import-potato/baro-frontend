import type { OrderStatus } from '@/features/customer-order/types/customerOrder.types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: '신규 주문', className: 'bg-baro-yellow/10 text-baro-yellow-text' },
  preparing: { label: '준비중', className: 'bg-sky-50 text-sky-500' },
  completed: { label: '완료', className: 'bg-slate-100 text-slate-400' },
  cancelled: { label: '취소', className: 'bg-zinc-100 text-zinc-400' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

export default OrderStatusBadge;
