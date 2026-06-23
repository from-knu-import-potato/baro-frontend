import { Archive, ClipboardList, Moon, MonitorPlay } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* 아이콘 */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-slate-800 ring-1 ring-white/10 flex items-center justify-center">
            <Moon className="w-10 h-10 text-slate-300 fill-slate-400" />
          </div>
          <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl -z-10" />
        </div>

        {/* 텍스트 */}
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-500">{formatToday()}</p>
          <h1 className="text-2xl font-bold text-white">오늘 영업이 종료되었습니다</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            마감이 완료되었습니다. 오늘도 수고하셨습니다!
          </p>
        </div>

        <div className="w-full border-t border-white/10" />

        {/* 액션 버튼 */}
        <div className="w-full flex flex-col gap-3">
          <Button
            onClick={() => navigate('/order-guide')}
            className="h-12 bg-baro-blue hover:bg-baro-blue/90 text-white font-semibold flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            내일 발주 가이드 확인
          </Button>
          <Button
            onClick={() => navigate('/inventory')}
            className="h-11 bg-transparent border border-white/20 text-white hover:bg-white/10 font-medium flex items-center gap-2"
          >
            <Archive className="w-4 h-4" />
            재고 현황 확인
          </Button>
          <Button
            onClick={() => navigate('/store-home')}
            variant="ghost"
            className="h-10 text-slate-500 hover:text-slate-300 hover:bg-white/5 flex items-center gap-2"
          >
            <MonitorPlay className="w-4 h-4" />
            시작 화면으로 이동
          </Button>
        </div>

        <p className="text-xs text-slate-600">이 창을 닫으셔도 됩니다</p>
      </div>
    </div>
  );
};

export default DayClosedPage;
