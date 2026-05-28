# BARO 프로젝트 컨텍스트

## 서비스 개요

**BARO(바로)** — OCR·AI 기반 통합 가게 운영 SaaS.
소규모 카페·식당 사장님을 위한 주문부터 재고, 발주, 마감까지 관리하는 올인원 플랫폼.

사용자:
- **사장님 (Owner)**: 서비스 주 사용자. 주문 수락, 재고 관리, 발주, 마감 수행
- **손님 (Guest)**: QR 스캔으로 접근하는 비회원. 별도 로그인 없이 주문만 가능

핵심 기능:
1. QR 기반 비대면 주문 시스템 (테이블 QR → 손님 주문 → 사장님 실시간 수신)
2. OCR 기반 입고 데이터 자동화 (거래명세서 촬영 → 자동 디지털화)
3. AI 기반 발주 가이드 (재고 데이터 분석 → 적정 발주량 + 서술형 추천 이유)
4. 마감하기 (판매 메뉴 + 레시피 기반 재고 자동 차감)
5. 통합 대시보드 (실시간 주문·재고·매출 현황 한 화면)

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | React 19 |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS, Shadcn/UI |
| 상태 관리 | Zustand (클라이언트), React Query (서버) |
| API 통신 | Axios |
| 폼 관리 | React Hook Form + Zod |
| 빌드 | Vite |
| 패키지 매니저 | pnpm (`pnpm dev` / `pnpm build`) |
| 테스트 | Vitest |

## 프로젝트 구조

```
src/
├─ app/         # 레이아웃, 라우팅, 전역 스타일, AppInitializer
├─ features/    # 도메인별 기능 모듈 (auth, dashboard, order, inventory, ocr-inbound, order-guide, closing, settings, account-settings)
│  └─ [domain]/ # components/, hooks/, api/, store/, types/
├─ pages/       # 라우팅 페이지 — UI·로직 없이 features 조합만 담당
├─ widgets/     # 2개 이상 페이지에서 쓰는 조합형 UI
├─ shadcn/      # Shadcn 컴포넌트 (수정 금지)
└─ shared/      # 도메인 무관 공용 리소스
   ├─ api/      # Axios 인스턴스, interceptor
   ├─ components/, hooks/, constants/, utils/
   ├─ design-token/  # colors.css, spacing.css, typography.css
   ├─ lib/      # queryClient 등
   ├─ store/    # 전역 상태 (사용자 정보, 인증 토큰)
   └─ types/    # 공용 타입
```

## 페이지 목록

| 경로 | 페이지 | 접근 주체 |
|---|---|---|
| `/` | 랜딩 페이지 | 전체 |
| `/login` | 로그인 (카카오 소셜) | 비회원 |
| `/initial-setup` | 가게 초기 세팅 | 사장님 (최초 1회) |
| `/dashboard` | 메인 대시보드 | 사장님 |
| `/inventory` | 전체 재고 현황 | 사장님 |
| `/ocr-inbound` | OCR 재고 입고 처리 | 사장님 |
| `/order-guide` | 발주 가이드 | 사장님 |
| `/closing` | 마감하기 | 사장님 |
| `/settings` | 가게 설정 | 사장님 |
| `/my-account` | 회원 설정 | 사장님 |
| `/order?table={n}` | 손님 주문 메뉴판 | 손님 (비회원) |

## API 연동

- Base URL: `https://api.baro.com/v1` (임시)
- 로그인: 카카오 OAuth 소셜 로그인 → JWT 발급 (이메일/일반 회원가입 없음)
- 인증: JWT Bearer Token (Authorization 헤더)
- 토큰 갱신: refresh token → `/auth/refresh`
- 401 감지 시 Axios interceptor에서 자동 로그아웃
- 실시간 주문 수신: WebSocket 또는 SSE (Server-Sent Events)

## 상태 관리 전략

- **서버 상태**: React Query — 모든 서버 데이터는 무조건 React Query
- **클라이언트 전역 상태**: Zustand — 사용자 정보, 인증 토큰, 사이드바, 모달 등 순수 UI 상태만
- **로컬 상태**: `useState`
- **폼 상태**: React Hook Form

## 디자인 토큰

| 토큰 | Primary | 용도 |
|---|---|---|
| `baro-blue` | #449CD4 | 주요 액션 버튼, 링크 |
| `baro-red` | #BD5535 | 삭제, 경고 |
| `baro-green` | #679436 | 입고 완료, 정상 상태 |
| `baro-black` | #111111 | 텍스트 |
| `baro-ivory` | #F2E9E1 | 배경 포인트 |

## UI/UX 지침

- 로딩: Skeleton UI 우선 (레이아웃 흔들림 방지)
- 아이콘: `lucide-react` 기본 사용
- 토스트 에러: "~에 실패했습니다. 잠시 후 다시 시도해 주세요." 형식
- 반응형: 데스크탑 우선, 브레이크포인트 sm:640 md:768 lg:1024

## 개발 컨벤션

### 네이밍
- 컴포넌트: PascalCase (`InventoryTable.tsx`)
- 훅: `use` 접두사 camelCase (`useInventory.ts`)
- 유틸: camelCase (`formatDate.ts`)
- 상수: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)
- API 함수: 동사 + camelCase (`fetchInventory`, `createOrder`)

### 컴포넌트 작성 순서
1. import: React → 외부 라이브러리 → 내부 모듈 → 타입
2. Props 타입/interface 정의
3. `const 컴포넌트명 = () => {}` 함수형 컴포넌트
4. `export default` 사용
5. 스타일은 Tailwind CSS 클래스

### Git 커밋 컨벤션
형식: `[gitmoji] [태그]: [제목]`

주요 gitmoji:
- ✨ `feat`: 새 기능
- 🐛 `fix`: 버그 수정
- 💄 `ui`: UI·스타일 수정
- ♻️ `refactor`: 리팩토링
- 📝 `docs`: 문서 수정

## 에러 처리 전략

- **전역 에러**: ErrorBoundary
- **API 에러**: Axios interceptor 공통 처리 + 토스트 피드백
- **폼 유효성**: Zod 스키마 → 서버 에러는 `setError`로 필드 바인딩
- **로딩**: Suspense + Skeleton UI
- **404/권한 없음**: 전용 에러 페이지 리다이렉트

## 금지 사항

- `any` 타입 금지 (불가피 시 `// @ts-expect-error` + 사유 주석)
- 인라인 스타일 (`style={{}}`) 금지 — Tailwind 또는 CSS 모듈 사용
- API 키·민감 정보 하드코딩 금지 — 환경 변수 사용
- `console.log` 프로덕션 코드에 잔류 금지
- 클래스 컴포넌트 금지
- OCR 결과 자동 확정 로직 추가 금지 (반드시 수동 검수 단계 유지)
- 마감하기 이론 사용량 자동 차감 금지 (사용자가 검토·수정 후 최종 확정)

## 알려진 제약

- 이미지 업로드 최대 10MB
- 식자재 단위: `g`, `ml`, `개` 세 가지만 사용
- OCR 단위 환산: `kg→g` (×1000), `L→ml` (×1000) — 프론트엔드에서 처리 후 서버에 표준 단위로 전송
- 재고 미등록 시 재고 관련 기능 비활성화(disabled) 처리 + 안내 문구 표시
- 회원 탈퇴: 가게 데이터(재고·메뉴·레시피 등) 초기화 선행 필수

## 이슈 & PR 규칙

### 브랜치 전략

- **기능 브랜치 → `develop`**: 모든 기능/버그/리팩토링 브랜치는 PR 대상을 `develop`으로 설정
- **`develop` → `main`**: `develop`에서 `main`으로의 PR만 프로덕션 반영

### 이슈 생성

이슈 생성 시 `.github/ISSUE_TEMPLATE/` 내 적절한 템플릿을 반드시 사용한다.

| 템플릿 파일     | 용도                                      |
| --------------- | ----------------------------------------- |
| `feature.md`    | ✨ 새로운 기능 제안                        |
| `bug.md`        | 🐛 버그 신고                              |
| `refactor.md`   | ♻️ 코드 개선·리팩토링                     |
| `style.md`      | 🎨 UI/디자인/CSS 변경                     |
| `config.md`     | 🔧 설정·빌드·의존성·문서·인프라 작업(Chore) |
| `deploy.md`     | 🚀 배포 관련 작업                          |
| `thinking.md`   | 💭 기술 결정 고민·구현 방향 논의           |

### PR 생성

- PR 생성 시 `.github/PULL_REQUEST_TEMPLATE.md` 템플릿을 반드시 사용한다.
- PR 제목은 연관 이슈 번호를 포함한다 (예: `✨ (#55) feat: 카카오 로그인 구현`).
- 이슈와 연결할 때는 PR 본문에 `Closes #이슈번호`를 명시한다.

## 프롬프트 단축키

- **"기능 개발 [도메인명]"**: `features/[도메인명]` 내 `api`, `hooks`, `types`, `components` 기본 구조 생성
- **"페이지 생성 [페이지명]"**: `pages/`에 페이지 컴포넌트 생성, features 조합 기본 레이아웃 구성
- **"UI 생성 [이름]"**: `shared/components`에 shadcn/ui 스타일 범용 컴포넌트 생성
- **"코드 리뷰"**: 현재 코드를 컨벤션 기준으로 점검 후 개선안 제시
- **"커밋 준비"**: 변경 파일 분석 후 커밋 컨벤션에 맞는 메시지 초안 작성
- **"테스트 작성"**: 현재 파일 핵심 로직에 대한 Vitest 테스트 코드 생성
