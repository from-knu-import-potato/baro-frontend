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

| 분류          | 기술                                     |
| ------------- | ---------------------------------------- |
| 프레임워크    | React 19                                 |
| 언어          | TypeScript                               |
| 스타일링      | Tailwind CSS, Shadcn/UI                  |
| 상태 관리     | Zustand (클라이언트), React Query (서버) |
| API 통신      | Axios                                    |
| 폼 관리       | React Hook Form + Zod                    |
| 빌드          | Vite                                     |
| 패키지 매니저 | pnpm (`pnpm dev` / `pnpm build`)         |
| 테스트        | Vitest                                   |

## 프로젝트 구조

```
src/
├─ app/         # 레이아웃, 라우팅, 전역 스타일, AppInitializer
├─ features/    # 도메인별 기능 모듈
│  ├─ auth/              # 로그인, 회원가입, 인증 상태
│  ├─ dashboard/         # 메인 대시보드
│  ├─ customer-order/    # 손님 주문 메뉴판
│  ├─ inventory/         # 재고 현황
│  ├─ ocr-inbound/       # OCR 입고 처리
│  ├─ order-guide/       # 발주 가이드
│  ├─ closing/           # 마감하기
│  ├─ store-settings/    # 가게 설정 (메뉴, 레시피, 식자재, 테이블 등)
│  ├─ store-registration/ # 가게 등록, 계정 홈(내 가게 목록)
│  ├─ account-settings/  # 회원 설정
│  ├─ initial-setup/     # 가게 초기 세팅
│  ├─ landing/           # 랜딩 페이지
│  ├─ notification/      # 알림
│  └─ theme/             # 다크/라이트 테마
│  (각 도메인: components/, hooks/, api/, store/, types/)
├─ pages/       # 라우팅 페이지 — UI·로직 없이 features 조합만 담당
├─ widgets/     # 2개 이상 페이지에서 쓰는 조합형 UI (AppHeader, AppSidebar)
├─ lib/         # shadcn 유틸 (cn 함수)
├─ shadcn/      # Shadcn 컴포넌트 (수정 금지)
└─ shared/      # 도메인 무관 공용 리소스
   ├─ api/      # Axios 인스턴스, interceptor
   ├─ assets/   # 이미지, 폰트 등 정적 파일
   ├─ components/, hooks/, constants/, utils/
   └─ types/    # 공용 타입
   (디자인 토큰은 src/index.css @theme inline에 정의)
```

## 페이지 목록

| 경로                                    | 페이지                       | 접근 주체         |
| --------------------------------------- | ---------------------------- | ----------------- |
| `/`                                     | 랜딩 페이지                  | 전체              |
| `/login`                                | 로그인 (카카오 소셜)         | 비회원            |
| `/credential-login`                     | 로그인 (아이디/비밀번호)     | 비회원            |
| `/register`                             | 회원가입 (서비스 초대코드 필요) | 비회원          |
| `/auth/callback`                        | 카카오 OAuth 콜백 처리       | 자동 처리         |
| `/my-stores`                            | 계정 홈 (가게 선택)          | 사장님            |
| `/store-selection`                      | 새 가게 등록 또는 초대코드 합류 | 사장님          |
| `/initial-setup`                        | 가게 초기 세팅               | 사장님            |
| `/store-home`                           | 가게 홈 (영업 시작/마감 관리) | 사장님           |
| `/dashboard`                            | 메인 대시보드                | 사장님            |
| `/inventory`                            | 전체 재고 현황               | 사장님            |
| `/inbound-history`                      | 입고 내역                    | 사장님            |
| `/ocr-inbound`                          | OCR 재고 입고 처리           | 사장님            |
| `/order-guide`                          | 발주 가이드                  | 사장님            |
| `/closing`                              | 마감하기                     | 사장님            |
| `/closing/order-guide-detail`           | 마감 후 발주 가이드 상세      | 사장님           |
| `/day-closed`                           | 영업 종료 화면               | 사장님            |
| `/store-settings`                       | 가게 설정 (메인)             | 사장님            |
| `/store-settings/menus`                 | 메뉴 관리                    | 사장님            |
| `/store-settings/menu-board`            | 메뉴판 설정                  | 사장님            |
| `/store-settings/table`                 | 테이블 설정                  | 사장님            |
| `/store-settings/recipes`               | 레시피 관리                  | 사장님            |
| `/store-settings/ingredients`           | 식자재 관리                  | 사장님            |
| `/settings`                             | 회원 설정 (계정 설정)        | 사장님            |
| `/order/:storeId/table/:tableNumber`    | 손님 주문 메뉴판             | 손님 (비회원)     |
| `/notices`                              | 공지사항                     | 전체              |
| `/terms`                                | 이용약관                     | 전체              |
| `/privacy`                              | 개인정보처리방침             | 전체              |

## API 연동

- Base URL: `https://api.baro.com/v1` (임시)
- 로그인 방식:
  - 카카오 OAuth 소셜 로그인 (`/login` 페이지)
  - 아이디/비밀번호 로그인 (`/credential-login` 페이지)
  - 회원가입 (`/register` 페이지) — 서비스 초대코드 필요 (서버 환경변수로 관리하는 코드, 가게 멤버 초대코드와 별개)
- 로그인 후 리다이렉트: 항상 `/my-stores` (계정 홈)으로 이동
  - 카카오 OAuth: `/auth/callback`에서 토큰 파싱 후 `/my-stores`로 이동
  - 가게가 없으면 계정 홈에서 "가게 추가하기" → `/store-selection`
- 인증: JWT Bearer Token (Authorization 헤더)
- 토큰 갱신: refresh token → `/auth/refresh`
- 401 감지 시 Axios interceptor에서 자동 로그아웃
- 실시간 주문 수신: SSE (Server-Sent Events)

## 상태 관리 전략

- **서버 상태**: React Query — 모든 서버 데이터는 무조건 React Query
- **클라이언트 전역 상태**: Zustand
  - `authStore` (persist): accessToken, refreshToken, storeId, operatingHours
  - `closingStore` (persist): businessSession(isOpen/businessDate), todayClosing
  - `orderWarningsStore`: 주문별 재고 경고 (품절 처리용)
  - `customerOrderStore`: 손님 주문 목록 (현재 mock 데이터 사용)
  - `inventoryStore`: 재고 목록 (현재 mock 데이터 사용)
- **로컬 상태**: `useState`
- **폼 상태**: React Hook Form

## 디자인 토큰

| 토큰           | Primary | 용도                    |
| -------------- | ------- | ----------------------- |
| `baro-blue`    | #449CD4 | 주요 액션 버튼, 링크    |
| `baro-red`     | #BD5535 | 삭제, 경고              |
| `baro-green`   | #679436 | 입고 완료, 정상 상태    |
| `baro-yellow`  | #FFD94D | 주의, 경고 (누락 알림)  |
| `baro-black`   | #111111 | 텍스트                  |
| `baro-ivory`   | #F2E9E1 | 배경 포인트             |

각 색상에 `-dark` 변형 존재 (`baro-blue-dark`, `baro-red-dark` 등). 정의 위치: `src/index.css`

## 네비게이션 구조

### 사이드바 (AppSidebar) — AppLayout이 적용된 페이지에서만 표시

메인 메뉴:
- 대시보드 (`/dashboard`) — 영업 중이 아니거나 마감 완료 시 비활성화
- 전체 재고 현황 (`/inventory`)
- 발주 가이드 (`/order-guide`)
- 가게 설정 (`/store-settings`)

하단 메뉴:
- 회원 설정 (`/settings`)
- 계정 홈 (`/my-stores`)
- 가게 홈 (`/store-home`)
- 서비스 소개 (`/`)

**OCR 입고(`/ocr-inbound`)는 사이드바에 없음** — 대시보드 카드 또는 직접 URL 접근

### 헤더 (AppHeader) — AppLayout이 적용된 페이지에서만 표시

- **마감하기** 버튼: 영업 중(`isOpen`)이고 오늘 마감 미완료일 때 활성화. 사이드바가 아닌 헤더에 위치.
- 전날 마감 누락 경고 버튼: 조건부 표시

### AppLayout 적용 페이지

`/dashboard`, `/inventory`, `/inbound-history`, `/order-guide`, `/closing`, `/store-settings/*`, `/settings`
→ 사이드바 + 헤더 있음

### 사이드바 없는 독립 페이지

`/ocr-inbound`, `/store-home`, `/my-stores`, `/store-selection`, `/initial-setup`, `/day-closed`, `/closing/order-guide-detail`, `/order/:storeId/table/:tableNumber`
→ 사이드바 없음

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
- **로딩**: React Query `isLoading` + Skeleton UI (Suspense 미사용)
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
- 회원 탈퇴: 프론트엔드에서 별도 초기화 단계 없이 `DELETE /users/me` 호출 → 백엔드에서 가게 데이터(재고·메뉴·레시피 등) 일괄 삭제 처리

## 이슈 & PR 규칙

### 브랜치 전략

- **기능 브랜치 → `develop`**: 모든 기능/버그/리팩토링 브랜치는 PR 대상을 `develop`으로 설정
- **`develop` → `main`**: `develop`에서 `main`으로의 PR만 프로덕션 반영

### 이슈 생성

이슈 생성 시 `.github/ISSUE_TEMPLATE/` 내 적절한 템플릿을 반드시 사용한다.

| 템플릿 파일   | 용도                                        |
| ------------- | ------------------------------------------- |
| `feature.md`  | ✨ 새로운 기능 제안                         |
| `bug.md`      | 🐛 버그 신고                                |
| `refactor.md` | ♻️ 코드 개선·리팩토링                       |
| `style.md`    | 🎨 UI/디자인/CSS 변경                       |
| `config.md`   | 🔧 설정·빌드·의존성·문서·인프라 작업(Chore) |
| `deploy.md`   | 🚀 배포 관련 작업                           |
| `thinking.md` | 💭 기술 결정 고민·구현 방향 논의            |

### PR 생성

- PR 생성 시 `.github/PULL_REQUEST_TEMPLATE.md` 템플릿을 반드시 사용한다.
- PR 제목은 연관 이슈 번호를 포함한다 (예: `✨ (#55) feat: 카카오 로그인 구현`).
- 이슈와 연결할 때는 PR 본문에 `Closes #이슈번호`를 명시한다.

---

## 작업 규칙

1. **브랜치 필수**: 모든 작업은 작업 브랜치를 생성한 후 진행. 형식: `작업유형/이슈번호-작업이름` (예: `feature/15-menu-ocr-scan`)
2. **이슈 먼저**: 작업 시작 전 반드시 GitHub 이슈를 먼저 생성하고 이슈 번호를 브랜치명에 포함할 것. 이슈 생성 시 `.github/ISSUE_TEMPLATE/` 의 템플릿을 반드시 사용할 것.
3. **PR 템플릿 사용**: PR 생성 시 `.github/PULL_REQUEST_TEMPLATE.md` 템플릿을 반드시 사용할 것.
4. **커밋·머지·푸시 금지**: "커밋해줘", "푸시해줘" 등 명시적인 명령이 없는 이상 커밋, 머지, 푸시 단독으로 진행하지 않음. 사용자가 직접 테스트 후 명령할 때까지 대기.
5. **담당자 설정 필수**: 이슈·PR 생성 시 `gh api user --jq .login` 으로 현재 GitHub 사용자를 확인해 `--assignee` 옵션으로 설정할 것.
6. **커밋 전 린트·타입 검사 필수**: 커밋 전 반드시 `pnpm build` → `pnpm lint --fix` → `pnpm tsc --noEmit` 순서로 실행하여 린트 오류와 타입 오류를 모두 해결한 후 커밋할 것.

## 배포 규칙

### 버전 관리 (Semantic Versioning)

`Major.Minor.Patch` 형식을 사용한다.

| 구분 | 올리는 시점 | 예시 |
|---|---|---|
| **Major** | 하위 호환되지 않는 큰 변경 (UI 전면 개편, 서비스 구조 변경) | `1.0.0` → `2.0.0` |
| **Minor** | 하위 호환되는 기능 추가 (새 페이지, 새 기능 컴포넌트) | `0.1.0` → `0.2.0` |
| **Patch** | 하위 호환되는 버그 수정, 소규모 개선 | `0.1.0` → `0.1.1` |

### 배포 흐름

```
develop → release/vX.Y.Z → main
```

1. **배포 이슈 생성**: `.github/ISSUE_TEMPLATE/deploy.md` 템플릿 사용
2. **릴리즈 브랜치 생성**: `develop`에서 `release/vX.Y.Z` 브랜치 생성
3. **PR 생성**: `release/vX.Y.Z` → `main` PR 작성 (배포 이슈 연결)
   - PR 제목 형식: `🚀 (#배포이슈번호) deploy: 배포 버전과 배포 제목` (예: `🚀 (#56) deploy: v0.1.1 랜딩 페이지 개편 배포`)
4. **태그·릴리즈**: main 머지 후 GitHub Release 및 태그(`vX.Y.Z`) 생성

### 브랜치 네이밍

- 릴리즈 브랜치: `release/vX.Y.Z` (예: `release/v0.2.0`)
- 일반 작업 브랜치: `작업유형/이슈번호-작업이름` (예: `feature/15-menu-ocr-scan`)

## 프롬프트 단축키

- **"기능 개발 [도메인명]"**: `features/[도메인명]` 내 `api`, `hooks`, `types`, `components` 기본 구조 생성
- **"페이지 생성 [페이지명]"**: `pages/`에 페이지 컴포넌트 생성, features 조합 기본 레이아웃 구성
- **"UI 생성 [이름]"**: `shared/components`에 shadcn/ui 스타일 범용 컴포넌트 생성
- **"코드 리뷰"**: 현재 코드를 컨벤션 기준으로 점검 후 개선안 제시
- **"커밋 준비"**: 변경 파일 분석 후 커밋 컨벤션에 맞는 메시지 초안 작성
- **"테스트 작성"**: 현재 파일 핵심 로직에 대한 Vitest 테스트 코드 생성
