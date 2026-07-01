<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/assets/baro-banner-black.png">
  <img alt="Baro Banner" src="./public/assets/baro-banner-white.png">
</picture>

<br/>

<div align="center">
  <a href="https://baro-web.vercel.app/">
    <img src="https://img.shields.io/badge/🌐 서비스 바로가기-Click-449CD4?style=flat-square" />
  </a>
  &nbsp;&nbsp;
  <a href="https://qa-baro-web.vercel.app/">
    <img src="https://img.shields.io/badge/🧪 테스트 서비스-Click-679436?style=flat-square" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/from-knu-import-potato/baro-backend">
    <img src="https://img.shields.io/badge/🗄️ 백엔드 레포-Click-E8A838?style=flat-square" />
  </a>
  &nbsp;&nbsp;
  <a href="https://baro-backend-production-c908.up.railway.app/doc">
    <img src="https://img.shields.io/badge/📄 API 문서 (Swagger)-Click-85EA2D?style=flat-square" />
  </a>
</div>

<br/>

**BARO(바로)** 프론트엔드 웹 클라이언트입니다. QR 손님 주문, OCR 재고 입고, AI 발주 가이드, 마감 정산까지 — 사장님이 하루 영업을 관리하는 모든 화면을 담당합니다.

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=기술%20스택&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

| 분류 | 기술 | 버전 | 선택 이유 |
|---|---|---|---|
| **프레임워크** | React | 19 | 최신 Concurrent 기능, 안정적인 생태계 |
| **언어** | TypeScript | ~6.0 | 컴파일 타임 타입 안전성, 런타임 오류 사전 차단 |
| **빌드 도구** | Vite | 8.0 | 빠른 HMR, ESM 기반 빌드로 개발 생산성 극대화 |
| **스타일링** | Tailwind CSS | 4.2 | 유틸리티 클래스 기반 디자인 일관성, 별도 CSS 파일 불필요 |
| **UI 컴포넌트** | Shadcn/UI + Base UI | - | 접근성(a11y) 준수 헤드리스 컴포넌트 + 커스터마이징 완전 자유 |
| **라우팅** | React Router DOM | 7.15 | 중첩 라우트 + `Outlet` 기반 레이아웃 구성 |
| **클라이언트 상태** | Zustand | 5.0 | 서버 상태와 분리된 경량 전역 UI 상태, 보일러플레이트 최소화 |
| **서버 상태** | TanStack Query | 5.x | 서버 상태 캐싱·동기화·백그라운드 refetch 자동화 |
| **폼 관리** | React Hook Form + Zod | - | 타입 안전 폼 검증, 서버 에러를 필드 단위로 바인딩 |
| **HTTP 클라이언트** | Axios | 1.16 | 인터셉터 기반 전역 인증(토큰 갱신)·에러 처리 |
| **날짜 처리** | date-fns | 4.4 | 경량 날짜 포맷팅 — businessDate, 매출 차트 등 |
| **아이콘** | lucide-react | - | 트리쉐이킹 가능, Shadcn 기본 아이콘 세트 |
| **토스트** | sonner | - | 접근성 갖춘 토스트 알림 (API 에러·성공 피드백) |
| **애니메이션** | Motion (Framer Motion) | - | 테마 토글, 온보딩 트랜지션 등 선언적 애니메이션 |
| **QR 코드** | qrcode, react-qr-code, jsPDF | - | 테이블 QR 코드 생성 + 인쇄용 PDF 내보내기 |
| **패키지 매니저** | pnpm | ≥10 | 빠른 설치, 엄격한 의존성 관리 |

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=배포%20환경&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

| 구분 | URL |
|---|---|
| 프론트엔드 (Production) | https://baro-web.vercel.app |
| 프론트엔드 (QA) | https://qa-baro-web.vercel.app |
| 백엔드 API | https://baro-backend-production-c908.up.railway.app/v1/ |
| API 문서 (Swagger) | https://baro-backend-production-c908.up.railway.app/doc |

Vercel이 GitHub 저장소와 연동되어 `main` 브랜치 푸시 시 자동 빌드·배포됩니다. SPA 라우팅을 위해 [`vercel.json`](vercel.json)에서 모든 경로를 `index.html`로 rewrite합니다.

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=시작하기&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

**사전 요구사항**: Node.js ≥ 22, pnpm ≥ 10

```bash
git clone https://github.com/from-knu-import-potato/baro-frontend.git
cd baro-frontend
pnpm install
pnpm run prepare       # Husky 훅 활성화 (최초 1회)
# 아래 "환경 변수" 섹션을 참고해 .env.local 파일 생성 후 실행
pnpm dev
# http://localhost:5173
```

| 명령어 | 설명 |
|---|---|
| `pnpm dev` | 개발 서버 실행 (Vite HMR) |
| `pnpm build` | TypeScript 컴파일 검사(`tsc -b`) + 프로덕션 빌드 |
| `pnpm lint` | ESLint 검사 |
| `pnpm lint:fix` | ESLint 자동 수정 + Prettier 포맷 |
| `pnpm preview` | 빌드 결과 로컬 미리보기 |
| `pnpm prepare` | Husky Git 훅 설치 |

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=환경%20변수&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000/v1
```

| 변수 | 설명 |
|---|---|
| `VITE_API_BASE_URL` | 백엔드 API Base URL (로컬은 `baro-backend`를 함께 실행, 프로덕션은 Railway 배포 주소) |

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=프로젝트%20구조&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

```
src/
├─ app/                       # 레이아웃·라우팅·부트스트랩
│  ├─ AppInitializer.tsx      # 새로고침 시 토큰 재발급 → storeId·영업상태 복원
│  ├─ layouts/AppLayout.tsx   # 사이드바 + 헤더 레이아웃
│  └─ routes/
│     ├─ routePaths.ts        # 전체 경로 상수
│     ├─ Router.tsx           # 라우트 트리 정의
│     └─ ProtectedRoute.tsx   # 인증 가드
├─ features/                  # 도메인별 기능 모듈
│  ├─ auth/                   # 로그인(카카오·아이디), JWT, 인증 스토어
│  ├─ dashboard/              # 대시보드, SSE 실시간 주문 수신
│  ├─ customer-order/         # 손님 QR 주문 메뉴판
│  ├─ inventory/              # 전체 재고 현황
│  ├─ ocr-inbound/            # OCR 입고 처리, 단위 변환 검수
│  ├─ order-guide/            # AI 발주 가이드
│  ├─ closing/                # 마감하기 (미리보기·확정·취소)
│  ├─ store-settings/         # 가게 설정 (메뉴·레시피·식자재·테이블·메뉴판)
│  ├─ store-registration/     # 가게 등록, 계정 홈(내 가게 목록)
│  ├─ account-settings/       # 회원 설정
│  ├─ initial-setup/          # 가게 초기 세팅 위저드
│  ├─ landing/                # 랜딩 페이지
│  ├─ notification/           # 알림
│  └─ theme/                  # 다크/라이트 테마, 손님 페이지 테마
│  (각 도메인: api/, components/, hooks/, store/, types/ 중 필요한 것만 구성)
├─ pages/                     # 라우팅 페이지 — features 조합만 담당, UI·로직 없음
├─ widgets/                   # 2개 이상 페이지에서 쓰는 조합형 UI (AppHeader, AppSidebar)
├─ shadcn/                    # Shadcn 컴포넌트 (직접 수정 금지)
├─ lib/                       # shadcn 유틸 (cn 함수)
└─ shared/                    # 도메인 무관 공용 리소스
   ├─ api/                    # axiosInstance(인증), publicAxiosInstance(비인증)
   ├─ components/             # ErrorBoundary, SafetyStockDial 등 공용 UI
   ├─ hooks/, constants/, types/
   └─ utils/                  # businessDate, apiError 등
   (디자인 토큰은 src/index.css @theme inline에 정의)
```

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=페이지%20/%20라우팅&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

<details>
<summary><b>전체 페이지 목록</b></summary>
<br/>

| 경로 | 페이지 | 접근 주체 | 레이아웃 |
|---|---|---|---|
| `/` | 랜딩 페이지 | 전체 | 독립 |
| `/login` | 로그인 (카카오 소셜) | 비회원 | 독립 |
| `/credential-login` | 로그인 (아이디/비밀번호) | 비회원 | 독립 |
| `/register` | 회원가입 (초대코드 필요) | 비회원 | 독립 |
| `/auth/callback` | 카카오 OAuth 콜백 처리 | 자동 처리 | 독립 |
| `/my-stores` | 계정 홈 (가게 선택) | 사장님 | 독립 |
| `/store-selection` | 새 가게 등록 또는 초대코드 합류 | 사장님 | 독립 |
| `/initial-setup` | 가게 초기 세팅 위저드 | 사장님 | 독립 |
| `/store-home` | 가게 홈 (영업 시작/마감 관리) | 사장님 | 독립 |
| `/dashboard` | 메인 대시보드 | 사장님 | 사이드바+헤더 |
| `/inventory` | 전체 재고 현황 | 사장님 | 사이드바+헤더 |
| `/inbound-history` | 입고 내역 | 사장님 | 사이드바+헤더 |
| `/ocr-inbound` | OCR 재고 입고 처리 | 사장님 | 독립 |
| `/order-guide` | AI 발주 가이드 | 사장님 | 사이드바+헤더 |
| `/closing` | 마감하기 | 사장님 | 사이드바+헤더 |
| `/closing/order-guide-detail` | 마감 후 발주 가이드 상세 | 사장님 | 독립 |
| `/day-closed` | 영업 종료 화면 | 사장님 | 독립 |
| `/store-settings` | 가게 설정 (메인) | 사장님 | 사이드바+헤더 |
| `/store-settings/menus` | 메뉴 관리 | 사장님 | 사이드바+헤더 |
| `/store-settings/menu-board` | 메뉴판 설정 | 사장님 | 사이드바+헤더 |
| `/store-settings/table` | 테이블 설정 (QR 생성) | 사장님 | 사이드바+헤더 |
| `/store-settings/recipes` | 레시피 관리 | 사장님 | 사이드바+헤더 |
| `/store-settings/ingredients` | 식자재 관리 | 사장님 | 사이드바+헤더 |
| `/settings` | 회원 설정 (계정 설정) | 사장님 | 사이드바+헤더 |
| `/order/:storeId/table/:tableNumber` | 손님 주문 메뉴판 | 손님 (비회원) | 독립 |
| `/notices` | 공지사항 | 전체 | 독립 |
| `/terms` | 이용약관 | 전체 | 독립 |
| `/privacy` | 개인정보처리방침 | 전체 | 독립 |

</details>

<details>
<summary><b>네비게이션 구조</b></summary>
<br/>

**사이드바 (`AppSidebar`)** — `AppLayout` 적용 페이지에서만 표시

- 메인: 대시보드(영업 중 아니거나 마감 완료 시 비활성화) · 전체 재고 현황 · 발주 가이드 · 가게 설정
- 하단: 회원 설정 · 계정 홈 · 가게 홈 · 서비스 소개

**헤더 (`AppHeader`)** — `AppLayout` 적용 페이지에서만 표시

- **마감하기** 버튼: 영업 중(`isOpen`)이고 오늘 마감 미완료일 때 활성화
- 전날 마감 누락 경고 버튼: 조건부 표시

> `OCR 입고(/ocr-inbound)`는 사이드바에 없음 — 대시보드 카드 또는 직접 URL 접근으로만 진입

</details>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=상태%20관리%20전략&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

| 상태 종류 | 담당 라이브러리 | 예시 |
|---|---|---|
| 서버 상태 (캐싱·동기화) | TanStack Query | 주문 목록, 재고, 발주 가이드, 마감 데이터 — 모든 서버 데이터는 무조건 React Query |
| 클라이언트 전역 상태 | Zustand | 인증 토큰, 영업일 상태, 재고 경고 |
| 로컬 상태 | `useState` | 컴포넌트 단위 UI 상태 |
| 폼 상태 | React Hook Form | 로그인 폼, 메뉴/레시피 등록 폼 |

**Zustand 스토어 목록**

| 스토어 | 위치 | 특징 |
|---|---|---|
| `authStore` | `features/auth/store` | `persist` — accessToken, refreshToken, storeId, operatingHours |
| `closingStore` | `features/closing/store` | `persist` — businessSession(isOpen/businessDate), todayClosing |
| `orderWarningsStore` | `features/dashboard/store` | 주문별 재고 경고 (품절 처리용, SSE 페이로드로 채워짐) |
| `customerOrderStore` | `features/customer-order/store` | 손님 주문 목록 (현재 mock 데이터) |
| `inventoryStore` | `features/inventory/store` | 재고 목록 (현재 mock 데이터) |

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=핵심%20기능%20플로우&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

<details>
<summary><b>앱 부팅 시퀀스 (AppInitializer)</b></summary>
<br/>

새로고침 시 인증·영업 상태를 복원합니다.

```
1. persist된 refreshToken으로 POST /auth/refresh → accessToken 재발급
   (실패 시 clearAuth — 로그아웃 상태로 진입)
2. authStore에 storeId가 없으면 GET /users/me/stores로 첫 번째 가게 resolve
3. storeId 확보 후 병렬로 fetch
   - 가게 영업시간 (fetchStoreSettings → operatingHours)
   - 오늘 개점 상태 (fetchBusinessOpenStatus → isOpen, businessDate)
4. 완료 전까지 children 렌더링 보류 (깜빡임 방지)
```

파일: [`src/app/AppInitializer.tsx`](src/app/AppInitializer.tsx)

</details>

<details>
<summary><b>실시간 주문 수신 (커스텀 SSE 클라이언트)</b></summary>
<br/>

브라우저 내장 `EventSource`는 커스텀 `Authorization` 헤더를 지원하지 않아 `fetch()` + `ReadableStream`으로 SSE를 직접 파싱합니다.

```
GET /stores/:id/orders/stream (Authorization: Bearer token)
  → response.body.getReader()로 청크 단위 디코딩
  → "event: "/"data: " 라인 직접 파싱

event: new-order
  → stockWarnings가 있으면 orderWarningsStore에 즉시 반영
  → queryClient.invalidateQueries(['orders', storeId])

event: order-status-changed
  → queryClient.invalidateQueries(['orders', storeId])

연결 실패/끊김 시 3초 후 자동 재연결, 언마운트 시 AbortController로 정리
```

파일: [`src/features/dashboard/hooks/useOrderSSE.ts`](src/features/dashboard/hooks/useOrderSSE.ts)

</details>

<details>
<summary><b>JWT 인증 & 자동 갱신 (Axios 인터셉터)</b></summary>
<br/>

```
요청 인터셉터: authStore의 accessToken을 Authorization 헤더에 자동 첨부

응답 인터셉터 (401 발생 시):
  - /auth/refresh, /auth/login, /auth/register 요청 자체는 재시도 대상 제외
  - refreshToken 없음 → 즉시 로그아웃 + /login 리다이렉트
  - 이미 갱신 중이면 대기열(failedQueue)에 등록 후 갱신 완료 시 일괄 재시도
  - POST /auth/refresh → 새 accessToken 저장 → 원래 요청 재시도
  - 갱신 실패 → 로그아웃 처리, 현재 경로를 sessionStorage에 저장 후 재로그인 시 복귀
```

파일: [`src/shared/api/axiosInstance.ts`](src/shared/api/axiosInstance.ts)

</details>

<details>
<summary><b>OCR 입고 검수 & 비표준 단위 변환</b></summary>
<br/>

```
거래명세서 업로드 → 백엔드(CLOVA OCR + Gemini) 파싱 결과 수신
  → 품목별 unit이 g/ml/개가 아닌 포장 단위(BOX·BTL 등)인 경우
  → spec 필드("박스/20개" 등)를 프론트에서 파싱해 변환 계수 자동 계산
  → 자동 변환 실패 시 검수 화면에서 변환 계수 직접 입력 요구
  → 확정 시 ingredientUnitConversions로 서버에 저장 (다음 입고부터 자동 적용)
검수 화면에서 경고 항목(수량·단가 이상치 등) 하이라이트 → 수동 확인 필수
확정 전까지 재고에 절대 반영되지 않음 (OCR 자동 확정 금지)
```

</details>

<details>
<summary><b>마감하기 플로우</b></summary>
<br/>

```
1. 마감하기 클릭 → GET /closing/preview → 식자재별 이론 차감량(orderDeductedAmount) 조회
2. 미리보기 화면에서 openingStock, 이론 차감량 확인
3. 사장님이 식자재별 실제 잔여 재고(remainingStock)를 직접 입력
4. POST /closing → 서버가 actualUsage·adjustmentAmount(보정값) 계산 후 확정
5. 마감 취소 시 DELETE /closing/:closingId → 보정값만 복원 (주문 차감분은 유지)
```

이론 사용량(레시피 기반)과 실측값의 차이를 명시적으로 드러내는 것이 목적이며, 프론트는 계산을 대신하지 않고 사용자의 실측 입력을 그대로 서버에 전달합니다 (마감 자동 차감 금지).

</details>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=디자인%20시스템&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

| 토큰 | Primary | 용도 |
|---|---|---|
| `baro-blue` | #449CD4 | 주요 액션 버튼, 링크 |
| `baro-red` | #BD5535 | 삭제, 경고 |
| `baro-green` | #679436 | 입고 완료, 정상 상태 |
| `baro-yellow` | #FFD94D | 주의, 경고 (누락 알림) |
| `baro-black` | #111111 | 텍스트 |
| `baro-ivory` | #F2E9E1 | 배경 포인트 |

각 색상에 `-dark` 변형 존재 (`baro-blue-dark`, `baro-red-dark` 등). 정의 위치: [`src/index.css`](src/index.css)의 `@theme inline`.

> 로고·아이콘 등 전체 디자인 에셋은 조직 프로필 레포(`from-knu-import-potato/.github`)의 대표 README 디자인 시스템 섹션을 참고하세요.

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=개발%20컨벤션&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

**네이밍**

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `InventoryTable.tsx` |
| 훅 | `use` 접두사 + camelCase | `useInventory.ts` |
| 유틸 | camelCase | `formatDate.ts` |
| 상수 | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` |
| API 함수 | 동사 + camelCase | `fetchInventory`, `createOrder` |

**컴포넌트 작성 순서**

```
1. import: React → 외부 라이브러리 → 내부 모듈 → 타입
2. Props 타입/interface 정의
3. const 컴포넌트명 = () => {} 함수형 컴포넌트
4. export default 사용
5. 스타일은 Tailwind CSS 클래스
```

**금지 사항**

- `any` 타입 금지 (불가피 시 `// @ts-expect-error` + 사유 주석)
- 인라인 스타일(`style={{}}`) 금지 — Tailwind 사용
- API 키·민감 정보 하드코딩 금지 — 환경 변수 사용
- `console.log` 프로덕션 코드에 잔류 금지
- 클래스 컴포넌트 금지
- OCR 결과 자동 확정 로직 추가 금지 (반드시 수동 검수 단계 유지)
- 마감하기 이론 사용량 자동 차감 금지 (사용자가 검토·수정 후 최종 확정)

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<a id="기여-가이드"></a>
<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=기여%20가이드&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

**브랜치 전략**

```
작업 브랜치 → develop → release/vX.Y.Z → main
```

| 브랜치 | 역할 |
|---|---|
| `main` | 프로덕션 배포 브랜치. 직접 커밋 금지 |
| `develop` | 모든 기능·버그·리팩토링 PR의 대상 브랜치 |
| `feature/`, `fix/` 등 | 실제 작업 브랜치. `develop`에서 분기 |
| `release/vX.Y.Z` | 배포 시 `develop`에서 분기, `main`으로 PR |

**작업 순서**

1. GitHub 이슈 먼저 생성 (`.github/ISSUE_TEMPLATE/` 템플릿 사용) — 이슈 없이 작업 시작 금지
2. 이슈 번호를 포함한 작업 브랜치 생성: `작업유형/이슈번호-작업이름`
   ```bash
   feature/15-qr-order-page      # 새 기능
   fix/42-sse-reconnect          # 버그 수정
   refactor/67-auth-store        # 리팩토링
   style/71-dashboard-layout     # UI·스타일
   config/80-vite-alias          # 설정·빌드·인프라
   ```
3. 커밋 전 검사 (순서대로 실행, 모두 통과해야 커밋)
   ```bash
   pnpm build          # 타입 검사 + 빌드
   pnpm lint:fix        # ESLint 자동 수정 + Prettier
   pnpm exec tsc --noEmit   # 타입 오류 최종 확인
   ```
4. 커밋 컨벤션: `[gitmoji] (#이슈번호) [태그]: [제목]`

   | gitmoji | 태그 | 용도 |
   |---|---|---|
   | ✨ | `feat` | 새 기능 |
   | 🐛 | `fix` | 버그 수정 |
   | 💄 | `ui` | UI·스타일 수정 |
   | ♻️ | `refactor` | 리팩토링 |
   | 📝 | `docs` | 문서 수정 |
   | 🔧 | `config` | 설정·빌드·인프라 |
   | 🚀 | `deploy` | 배포 |

   ```bash
   ✨ (#55) feat: 카카오 로그인 구현
   🐛 (#61) fix: SSE 재연결 시 인증 토큰 누락 수정
   ```
5. PR 생성 — `.github/PULL_REQUEST_TEMPLATE.md` 템플릿 사용, 대상 브랜치는 `develop`
   - PR 제목에 이슈 번호 포함, 본문에 `Closes #이슈번호` 명시

**이슈 템플릿**

| 템플릿 파일 | gitmoji | 용도 |
|---|---|---|
| `feature.md` | ✨ | 새로운 기능 제안 |
| `bug.md` | 🐛 | 버그 신고 |
| `refactor.md` | ♻️ | 코드 개선·리팩토링 |
| `style.md` | 🎨 | UI·디자인·CSS 변경 |
| `config.md` | 🔧 | 설정·빌드·의존성·문서·인프라 작업 |
| `deploy.md` | 🚀 | 배포 관련 작업 |
| `thinking.md` | 💭 | 기술 결정 고민·구현 방향 논의 |

**CI**: PR 생성 시 [`ci.yml`](.github/workflows/ci.yml)이 Lint → Type Check → Build를 `develop`/`main` 대상 PR에서 자동 실행합니다.

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=배포%20규칙&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

**버전 관리 (Semantic Versioning)**: `Major.Minor.Patch`

| 구분 | 올리는 시점 | 예시 |
|---|---|---|
| **Major** | 하위 호환 안 되는 큰 변경 (UI 전면 개편, 서비스 구조 변경) | `1.0.0` → `2.0.0` |
| **Minor** | 하위 호환되는 기능 추가 (새 페이지, 새 기능) | `0.1.0` → `0.2.0` |
| **Patch** | 버그 수정·소규모 개선 | `0.1.0` → `0.1.1` |

**배포 흐름**

```
develop ──→ release/vX.Y.Z ──→ main
```

1. 배포 이슈 생성 (`deploy.md` 템플릿)
2. `develop`에서 `release/vX.Y.Z` 브랜치 생성
3. `release/vX.Y.Z` → `main` PR 생성 (배포 이슈 연결)
   ```
   🚀 (#56) deploy: v0.2.0 OCR 입고 처리 기능 배포
   ```
4. `main` 머지 후 GitHub Release 및 태그(`vX.Y.Z`) 생성 → Vercel이 `main` 푸시를 감지해 자동 배포

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=알려진%20제한사항&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

- 이미지 업로드 최대 **10MB**
- 식자재 단위는 `g`, `ml`, `개` **3종만 지원** — OCR 단위 환산(`kg→g`, `L→ml`)은 프론트엔드에서 처리 후 표준 단위로 서버 전송
- 재고 미등록 시 재고 관련 기능은 비활성화(disabled) 처리 + 안내 문구 표시
- **OCR 결과 자동 확정 불가** — 반드시 수동 검수 단계를 거쳐야 함
- **마감 재고 자동 차감 불가** — 사용자 검토·수정 후 최종 확정 필수
- JWT 토큰 localStorage 저장 (XSS 취약점 존재, httpOnly 쿠키 마이그레이션 예정)
- 회원 탈퇴는 프론트 별도 초기화 단계 없이 `DELETE /users/me` 호출 — 가게 데이터 일괄 삭제는 백엔드 처리
- `customerOrderStore`, `inventoryStore`는 아직 mock 데이터 기반 (실 API 연동 예정)
- Vitest 테스트 코드 아직 없음 (`package.json`에 스크립트 미구성)

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=449CD4&height=45&text=라이선스&fontSize=18&fontColor=ffffff&fontAlign=50&fontAlignY=50" width="100%" />

This project is licensed under the MIT License.
