import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';

const SECTIONS = [
  {
    title: '제1조 (목적)',
    content: `이 약관은 FROM KNU IMPORT POTATO(이하 "회사")가 제공하는 BARO 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 회원 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.`,
  },
  {
    title: '제2조 (정의)',
    content: `① "서비스"란 회사가 제공하는 OCR·AI 기반 가게 운영 플랫폼 BARO 및 관련 제반 서비스를 의미합니다.
② "회원"이란 서비스에 접속하여 본 약관에 동의하고 회사와 이용 계약을 체결한 자를 의미합니다.
③ "비회원"이란 QR 코드를 통해 주문 메뉴판에 접근하는 손님으로, 별도 회원가입 없이 주문 기능만 이용할 수 있습니다.
④ "콘텐츠"란 서비스 내에서 회원이 생성·등록하는 메뉴, 재고, 레시피 등 일체의 데이터를 의미합니다.`,
  },
  {
    title: '제3조 (약관의 효력 및 변경)',
    content: `① 본 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.
② 회사는 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있으며, 개정 시 서비스 내 공지사항을 통해 7일 전에 공지합니다.
③ 회원이 개정 약관에 동의하지 않는 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.`,
  },
  {
    title: '제4조 (회원 가입)',
    content: `① 서비스는 카카오 소셜 로그인을 통해 회원 가입이 이루어집니다. 이메일·일반 회원가입은 제공하지 않습니다.
② 만 14세 미만의 아동은 서비스에 가입할 수 없습니다.
③ 회원은 본인의 계정 정보를 안전하게 관리할 책임이 있으며, 계정 도용으로 인한 손해에 대해 회사는 책임을 지지 않습니다.`,
  },
  {
    title: '제5조 (서비스의 제공)',
    content: `① 회사는 다음과 같은 서비스를 제공합니다.
  - QR 기반 비대면 주문 시스템
  - OCR 기반 입고 데이터 자동화
  - AI 기반 발주 가이드
  - 재고·매출·주문 통합 대시보드
  - 마감하기(레시피 기반 재고 차감)

② 서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검·설비 보수 등 불가피한 사유로 서비스 이용이 일시 중단될 수 있습니다.`,
  },
  {
    title: '제6조 (회원의 의무)',
    content: `회원은 다음 행위를 하여서는 안 됩니다.
① 타인의 계정 정보를 도용하거나 허위 정보를 등록하는 행위
② 서비스를 이용하여 법령 또는 공서양속에 반하는 행위
③ 회사의 지적 재산권을 침해하는 행위
④ 서비스 운영을 방해하거나 시스템을 악용하는 행위
⑤ 기타 회사가 정한 이용 정책에 위반되는 행위`,
  },
  {
    title: '제7조 (서비스 이용 제한)',
    content: `① 회사는 회원이 제6조를 위반한 경우 사전 통보 없이 서비스 이용을 제한하거나 계정을 삭제할 수 있습니다.
② 서비스 이용 제한에 이의가 있는 회원은 고객 지원(dd22dd22.yy66yy66@gmail.com)을 통해 이의를 제기할 수 있습니다.`,
  },
  {
    title: '제8조 (회원 탈퇴)',
    content: `① 회원은 언제든지 서비스 내 회원 설정 메뉴를 통해 탈퇴를 신청할 수 있습니다.
② 탈퇴 전 가게 데이터(재고, 메뉴, 레시피 등)를 초기화하는 절차가 선행됩니다.
③ 탈퇴 처리 후 회원 정보는 관련 법령에서 정한 기간 동안 보관 후 삭제됩니다.`,
  },
  {
    title: '제9조 (면책 조항)',
    content: `① 회사는 천재지변, 서비스 설비 장애, 기간통신사업자의 서비스 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.
② OCR·AI 기능의 결과는 참고용이며, 실제 데이터 확인은 회원이 직접 수행해야 합니다. 자동 처리 결과의 오류로 인한 손해에 대해 회사는 책임을 지지 않습니다.
③ 회원이 서비스를 이용하여 얻은 데이터·정보의 신뢰성 및 정확성에 대해 회사는 보증하지 않습니다.`,
  },
  {
    title: '제10조 (지적 재산권)',
    content: `① 서비스에 관한 저작권 및 지적 재산권은 회사에 귀속됩니다.
② 회원이 서비스 내에 등록한 콘텐츠(메뉴, 이미지 등)의 지적 재산권은 해당 회원에게 귀속됩니다.
③ 회원은 서비스를 이용하여 얻은 정보를 회사의 사전 동의 없이 복제·배포·방송·전송 등의 방법으로 영리 목적으로 이용하여서는 안 됩니다.`,
  },
  {
    title: '제11조 (분쟁 해결)',
    content: `① 서비스 이용과 관련하여 분쟁이 발생한 경우 회사와 회원은 상호 협의하여 해결하는 것을 원칙으로 합니다.
② 협의가 이루어지지 않는 경우, 관련 법령에 따른 관할 법원에 소를 제기할 수 있습니다.
③ 본 약관은 대한민국 법률에 따라 규율되고 해석됩니다.`,
  },
];

const TermsOfServicePage = () => {
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

        <h1 className="text-3xl font-bold text-baro-black mb-2">이용 약관</h1>
        <p className="text-sm text-gray-500 mb-10">
          시행일: 2026년 6월 22일 · 최종 업데이트: 2026년 6월 22일
        </p>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-baro-black mb-3">{section.title}</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-400 space-y-1">
          <p>운영사: FROM KNU IMPORT POTATO</p>
          <p>문의: dd22dd22.yy66yy66@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
