import { Archive, ClipboardList, MonitorPlay } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shadcn/ui/button';

const formatToday = () =>
  new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

const DayClosedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 ring-1 ring-white/10 mb-6">
            <span className="text-4xl">🌙</span>
          </div>
          <h1 className="text-2xl font-bold text-white">오늘 영업이 종료되었습니다</h1>
          <p className="text-sm text-slate-400">{formatToday()}</p>
          <p className="text-xs text-slate-500 mt-1">
            마감이 완료되었습니다. 이 창을 닫으셔도 됩니다.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate('/inventory')}
            className="h-12 bg-white text-slate-900 hover:bg-white/90 font-semibold flex items-center gap-2"
          >
            <Archive className="w-4 h-4" />
            재고 현황 확인
          </Button>
          <Button
            onClick={() => navigate('/order-guide')}
            className="h-12 bg-white text-slate-900 hover:bg-white/90 font-semibold flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            발주 가이드 확인
          </Button>
          <Button
            onClick={() => navigate('/system-start')}
            className="h-12 bg-transparent border border-white/20 text-white hover:bg-white/10 font-medium flex items-center gap-2"
          >
            <MonitorPlay className="w-4 h-4" />
            시작 화면으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DayClosedPage;
