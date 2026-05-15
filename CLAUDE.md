# BARO 프로젝트 컨텍스트

## 서비스 개요

**BARO(바로)** — OCR·AI 기반 식자재 재고관리 SaaS.
소규모 카페·식당 사장님이 거래명세서를 촬영하면 입고 데이터를 자동 등록하고 재고를 관리할 수 있도록 설계된 웹 서비스.

핵심 기능:
1. OCR 기반 입고 데이터 자동화 (거래명세서 촬영 → 자동 디지털화)
2. AI 기반 보관·발주 가이드 (소비 패턴 분석 → 적정 발주량 추천)
3. 식자재 가격 변동 분석 및 시세 정보 제공
4. 마감하기 — 판매 메뉴 입력 시 레시피 기반 이론 사용량 자동 계산

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
├─ features/    # 도메인별 기능 모듈 (auth, dashboard, invoice, inventory, order, analytics, settings)
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

| 경로 | 페이지 |
|---|---|
| `/` | 랜딩 페이지 |
| `/login`, `/signup` | 로그인·회원가입 |
| `/initial-setup` | 초기 세팅 (가게 정보 입력) |
| `/dashboard` | 대시보드 |
| `/inventory/current`, `/inventory/depleted` | 전체 재고 현황 |
| `/order-guide` | 발주 가이드·수요 예측 |
| `/ingredient-price-analysis` | 가격 변동 분석 |
| `/settings` | 설정 |

## API 연동

- Base URL: `https://api.baro.com/v1` (임시)
- 인증: JWT Bearer Token (Authorization 헤더)
- 토큰 갱신: refresh token → `/auth/refresh`
- 401 감지 시 Axios interceptor에서 자동 로그아웃

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

## 알려진 제약

- 이미지 업로드 최대 10MB
- 시세 API: 평일 오전 9시 이후만 데이터 갱신 (주말/공휴일 예외 처리 필요)

## 프롬프트 단축키

- **"기능 개발 [도메인명]"**: `features/[도메인명]` 내 `api`, `hooks`, `types`, `components` 기본 구조 생성
- **"페이지 생성 [페이지명]"**: `pages/`에 페이지 컴포넌트 생성, features 조합 기본 레이아웃 구성
- **"UI 생성 [이름]"**: `shared/components`에 shadcn/ui 스타일 범용 컴포넌트 생성
- **"코드 리뷰"**: 현재 코드를 컨벤션 기준으로 점검 후 개선안 제시
- **"커밋 준비"**: 변경 파일 분석 후 커밋 컨벤션에 맞는 메시지 초안 작성
- **"테스트 작성"**: 현재 파일 핵심 로직에 대한 Vitest 테스트 코드 생성
