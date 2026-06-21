import { useState } from 'react';

import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';

type Notice = {
  id: number;
  title: string;
  date: string;
  content: string;
};

const NOTICES: Notice[] = [
  {
    id: 2,
    title: '이용약관 및 개인정보 처리방침 시행 안내',
    date: '2026.06.22',
    content: `BARO 서비스 이용약관 및 개인정보 처리방침이 서비스 오픈일인 2026년 6월 22일부터 시행됩니다.

이용약관과 개인정보 처리방침은 홈페이지 하단 푸터에서 언제든지 확인하실 수 있습니다.

주요 내용:
• 서비스 이용 조건 및 회원의 권리·의무
• 카카오 소셜 로그인을 통한 회원 가입 방식
• 수집하는 개인정보 항목 및 이용 목적
• 개인정보 보유 기간 및 파기 방침

궁금하신 점은 1:1 문의를 통해 언제든지 문의해 주세요.`,
  },
  {
    id: 1,
    title: 'BARO 서비스 오픈 안내',
    date: '2026.06.22',
    content: `안녕하세요, BARO 팀입니다.

소규모 카페·식당 사장님을 위한 올인원 가게 운영 플랫폼 BARO가 정식 오픈했습니다.

BARO와 함께라면 주문부터 재고, 발주, 마감까지 한 곳에서 관리할 수 있습니다.

주요 기능:
• QR 기반 비대면 주문 시스템
• OCR 기반 거래명세서 자동 디지털화
• AI 기반 발주 가이드
• 레시피 기반 재고 자동 차감 마감하기
• 실시간 주문·재고·매출 대시보드

서비스 이용 중 불편한 점이나 개선 의견은 1:1 문의를 통해 남겨주세요.
더 좋은 서비스로 보답하겠습니다. 감사합니다.`,
  },
];

const NoticeItem = ({ notice }: { notice: Notice }) => {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-gray-200 last:border-none">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="shrink-0 text-xs text-gray-400 w-20">{notice.date}</span>
          <span className="text-sm font-medium text-baro-black truncate">{notice.title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-6 px-1">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {notice.content}
          </p>
        </div>
      )}
    </li>
  );
};

const NoticesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to={routePaths.landing}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Link>

        <h1 className="text-3xl font-bold text-baro-black mb-10">공지사항</h1>

        <ul>
          {NOTICES.map((notice) => (
            <NoticeItem key={notice.id} notice={notice} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NoticesPage;
