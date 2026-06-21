import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  {
    title: '제1조 (개인정보의 처리 목적)',
    content: `FROM KNU IMPORT POTATO(이하 "회사")는 다음 목적으로 개인정보를 처리합니다.
① 서비스 회원 가입 및 관리: 회원 식별, 서비스 제공, 본인 확인
② 서비스 제공: OCR 입고 처리, AI 발주 가이드, 주문 관리, 재고 관리 등 핵심 기능 제공
③ 고객 지원: 문의 응대, 불만 처리, 공지사항 전달
④ 서비스 개선: 이용 통계 분석 및 서비스 품질 향상`,
  },
  {
    title: '제2조 (처리하는 개인정보 항목)',
    content: `① 카카오 소셜 로그인 시 수집 항목
  - 필수: 카카오 고유 식별자(ID), 이메일 주소, 프로필 이름, 프로필 이미지
② 서비스 이용 과정에서 생성·수집되는 정보
  - 가게 정보(상호명, 운영 설정), 메뉴·레시피·재고 데이터, 발주 내역
  - 서비스 이용 기록, 접속 IP, 쿠키, 접속 환경 정보
③ OCR 처리 시 업로드된 거래명세서 이미지 (처리 완료 후 즉시 삭제)`,
  },
  {
    title: '제3조 (개인정보의 처리 및 보유 기간)',
    content: `① 회원이 서비스를 이용하는 동안 개인정보를 보유하며, 탈퇴 시 지체 없이 삭제합니다.
② 단, 관련 법령에 따라 아래 기간 동안 보관합니다.
  - 전자상거래 등에서의 소비자 보호에 관한 법률: 계약·청약 철회 기록 5년, 대금 결제·공급 기록 5년
  - 통신비밀보호법: 로그인 기록 3개월
  - 정보통신망법: 본인 확인 정보 6개월`,
  },
  {
    title: '제4조 (개인정보의 제3자 제공)',
    content: `회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
다만, 다음의 경우에는 예외로 합니다.
① 이용자가 사전에 동의한 경우
② 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우`,
  },
  {
    title: '제5조 (개인정보 처리의 위탁)',
    content: `회사는 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁하고 있습니다.

수탁업체: 카카오(주)
위탁 업무: 카카오 소셜 로그인 인증 서비스

수탁업체: 클라우드 인프라 제공사
위탁 업무: 서버 운영 및 데이터 보관

위탁 계약 시 개인정보 보호 관련 법규 준수, 개인정보에 관한 비밀 유지, 제3자 제공 금지 등을 규정하고 있습니다.`,
  },
  {
    title: '제6조 (정보주체의 권리·의무 및 그 행사방법)',
    content: `이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
① 개인정보 열람 요구
② 개인정보 정정·삭제 요구
③ 개인정보 처리 정지 요구
④ 동의 철회 및 회원 탈퇴

권리 행사는 서비스 내 회원 설정 메뉴 또는 고객 지원 이메일(dd22dd22.yy66yy66@gmail.com)을 통해 요청하실 수 있습니다.`,
  },
  {
    title: '제7조 (쿠키의 사용)',
    content: `① 회사는 이용자에게 개별적인 맞춤화된 서비스를 제공하기 위해 쿠키(cookie)를 사용합니다.
② 쿠키는 웹사이트를 운영하는 데 이용되는 서버가 이용자의 브라우저에게 보내는 소량의 정보이며 이용자의 PC 컴퓨터 내 저장 장치에 저장됩니다.
③ 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 서비스 이용에 불편이 생길 수 있습니다.`,
  },
  {
    title: '제8조 (개인정보의 안전성 확보 조치)',
    content: `회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취합니다.
① 개인정보 암호화: 비밀번호 및 민감 정보는 암호화하여 저장·전송
② 접근 통제: 개인정보 처리 시스템에 대한 접근 권한 최소화
③ 보안 프로그램 설치 및 주기적 갱신·점검
④ 개인정보 취급 직원 대상 정기 교육 실시`,
  },
  {
    title: '제9조 (개인정보 보호책임자)',
    content: `회사는 개인정보 처리에 관한 업무를 총괄하고 관련 불만 처리 및 피해 구제를 위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

개인정보 보호책임자
- 소속: FROM KNU IMPORT POTATO
- 이메일: dd22dd22.yy66yy66@gmail.com

이용자는 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의, 불만, 피해 구제 등에 관한 사항을 개인정보 보호책임자에게 문의할 수 있습니다.`,
  },
  {
    title: '제10조 (개인정보 처리방침의 변경)',
    content: `본 개인정보 처리방침은 시행일로부터 적용되며, 법령·정책 또는 서비스의 변경으로 내용 추가·삭제·수정이 있을 경우 변경 사항의 시행일 7일 전부터 서비스 내 공지사항을 통해 고지합니다.`,
  },
];

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </button>

        <h1 className="text-3xl font-bold text-baro-black mb-2">개인정보 처리방침</h1>
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

export default PrivacyPolicyPage;
