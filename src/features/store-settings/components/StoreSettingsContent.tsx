import { useEffect, useRef, useState } from 'react';

import CustomerOrderSection from '@/features/store-settings/components/sections/CustomerOrderSection';
import DataSection from '@/features/store-settings/components/sections/DataSection';
import OperatingHoursSection from '@/features/store-settings/components/sections/OperatingHoursSection';
import StaffSection from '@/features/store-settings/components/sections/StaffSection';
import StoreInfoSection from '@/features/store-settings/components/sections/StoreInfoSection';
import StoreOperationSection from '@/features/store-settings/components/sections/StoreOperationSection';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'store-info', label: '가게 정보' },
  { id: 'operating-hours', label: '영업 시간' },
  { id: 'customer-order', label: '손님 주문' },
  { id: 'store-operation', label: '운영 정보' },
  { id: 'staff', label: '직원 관리' },
  { id: 'data', label: '데이터' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

const StoreSettingsContent = () => {
  const [active, setActive] = useState<SectionId>('store-info');
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 탭 클릭으로 인한 스크롤 중에는 observer 업데이트 무시
        if (isProgrammaticScroll.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: '0px 0px -85% 0px', threshold: 0 },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: SectionId) => {
    setActive(id); // 클릭 즉시 탭 활성화
    isProgrammaticScroll.current = true;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // smooth scroll 완료 예상 시간 후 observer 재활성화
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 800);
  };

  return (
    <div className="flex flex-col">
      {/* 섹션 이동 탭 바 — 스크롤 컨테이너 내에서 sticky */}
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-2.5">
        <div className="flex gap-1.5 overflow-x-auto">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                active === id
                  ? 'bg-baro-blue text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 섹션 목록 */}
      <div className="space-y-5 p-4">
        <div>
          <p className="text-sm font-semibold leading-tight">가게 설정</p>
          <p className="text-xs text-muted-foreground">가게 정보 및 운영 데이터를 관리합니다.</p>
        </div>
        <div id="store-info" className="scroll-mt-14">
          <StoreInfoSection />
        </div>
        <div id="operating-hours" className="scroll-mt-14">
          <OperatingHoursSection />
        </div>
        <div id="customer-order" className="scroll-mt-14">
          <CustomerOrderSection />
        </div>
        <div id="store-operation" className="scroll-mt-14">
          <StoreOperationSection />
        </div>
        <div id="staff" className="scroll-mt-14">
          <StaffSection />
        </div>
        <div id="data" className="scroll-mt-14">
          <DataSection />
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsContent;
