import { AlertTriangle, PackageOpen } from 'lucide-react';

export const REASON_CONFIG = {
  expiring: {
    label: '유통기한 임박',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    className: 'bg-red-50 text-red-500 border border-red-200',
  },
  low_stock: {
    label: '재고 부족',
    icon: <PackageOpen className="w-3.5 h-3.5" />,
    className: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
};
