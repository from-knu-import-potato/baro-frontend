# BARO 프로젝트 컨텍스트

이 파일은 BARO 프론트엔드 프로젝트의 컨텍스트 정보야.
아래 내용을 참고해서 GEMINI.md를 작성해줘.
GEMINI.md는 Gemini CLI가 자동으로 읽는 프로젝트 컨텍스트 파일이야.
코드 생성·리뷰·리팩터링 시 기준이 되도록 명확하고 간결하게 작성해줘.

---

## 서비스 개요

BARO는 소규모 음식점·카페 점주를 위한 AI 기반 웹 재고관리 SaaS야.
거래명세서를 촬영하면 OCR로 입고 데이터를 자동 등록하고, AI가 수요 예측·발주 가이드·유통기한 알림까지 제공해.

| 항목     | 내용                                                              |
| -------- | ----------------------------------------------------------------- |
| 서비스명 | BARO (바로)                                                       |
| 슬로건   | 찍으면 바로, 분석과 예측도 바로!                                  |
| 의미     | Best Inventory · AI-Assistant · Recommendation · Outlook-Future   |
| 타겟     | 30~50대 소규모 자영업자 (1~3인 운영, 월 식자재 비용 100~200만 원) |


**타겟층**
- 30~50대 소규모 음식점·카페·분식점 사장님 (1~3인 운영 구조)
- 직접 재고 관리와 발주를 담당하며 디지털 도구에 중간 수준으로 익숙한 사용자
- 매주 2~3회 식자재 입고, 월 식자재 비용 약 100~200만 원 수준
- 복잡한 재고관리 프로그램은 사용하지 않지만, 재고 문제는 계속 겪는 소규모 자영업자

**핵심 기능 4가지**

1. **OCR 입고 자동화** — 거래명세서 이미지 → 품목·수량·가격 자동 입력
2. **AI 발주 가이드** — 소비 패턴 분석 → 적정 발주량 추천, 유통기한 알림
3. **시세 정보 제공** — 외부 API로 도매/소매 식자재 가격 변동 시각화
4. **마감하기 재고 자동화** — 판매 메뉴 입력 → 레시피 기반 이론 사용량 계산 → 실제 사용량과 오차 분석 → 재고 현황·발주 가이드에 연계

---

## 기술 스택

| 분류            | 기술                     |
| --------------- | ------------------------ |
| 프레임워크      | React 19                 |
| 언어            | TypeScript               |
| 스타일링        | Tailwind CSS + shadcn/ui |
| 서버 상태       | React Query              |
| 클라이언트 상태 | Zustand                  |
| API 통신        | Axios                    |
| 폼              | React Hook Form + Zod    |
| 빌드            | Vite                     |
| 패키지 매니저   | pnpm                     |
| 테스트          | Vitest                   |
| 아이콘          | Lucide React             |
| 토스트          | react-hot-toast          |

---

## 프로젝트 구조

```
src/
├─ app/
│  ├─ layout/         # Header, Sidebar 등 공통 UI
│  ├─ routes/         # React Router 라우팅 설정
│  └─ styles/
│     └─ AppInitializer.tsx   # 토큰 확인, 전역 초기화
│
├─ features/          # 도메인별 비즈니스 로직 (로직·UI 여기에)
│  ├─ auth/
│  ├─ dashboard/
│  ├─ invoice/        # 거래명세서·OCR
│  ├─ inventory/      # 재고 목록·편집
│  ├─ order/          # 발주 가이드·수요 예측
│  ├─ analytics/      # 소비 패턴·폐기율
│  └─ settings/
│     └─ (공통 내부 구조)
│        ├─ components/
│        ├─ hooks/
│        ├─ api/
│        ├─ store/
│        └─ types/
│
├─ pages/             # 라우팅 페이지 (features/ 조합만, 로직 없음)
│  ├─ DashboardPage.tsx
│  ├─ InvoicePage.tsx
│  ├─ InventoryPage.tsx
│  ├─ OrderGuidePage.tsx
│  ├─ AnalyticsPage.tsx
│  └─ SettingsPage.tsx
│
├─ widgets/           # 2개 이상 페이지에서 쓰이는 조합형 UI
│  ├─ StockStatusCard.tsx
│  ├─ AlertBanner.tsx
│  └─ OcrStatusBadge.tsx
│
├─ shadcn/            # shadcn 컴포넌트 전용 (수정 금지)
│
├─ shared/
│  ├─ api/            # Axios 인스턴스, interceptor
│  ├─ assets/
│  ├─ components/     # Button, Modal 등 범용 컴포넌트
│  ├─ constants/
│  ├─ design-token/   # colors.css, typography.css 등
│  ├─ hooks/          # useDebounce 등 범용 훅
│  ├─ lib/            # queryClient 등 라이브러리 설정
│  ├─ store/          # 전역 상태 (유저 정보, 인증)
│  ├─ types/          # 공용 타입
│  └─ utils/          # 날짜, 포맷 등 유틸
│
├─ App.tsx
└─ main.tsx
```

**레이어 의존 규칙 (반드시 준수)**

```
pages → features → shared   ✅
pages → widgets → shared    ✅
features/A → features/B     ❌ (shared 경유할 것)
shared → features           ❌ (역방향 금지)
```

---

## 핵심 데이터 모델

추후 백엔드 API 확정 후 도입 예정 (InventoryItem, Invoice, PurchaseOrder 등)

---

## 주요 페이지 & 라우팅

| 페이지                | 경로                                        | 역할                                                  |
| --------------------- | ------------------------------------------- | ----------------------------------------------------- |
| 랜딩                  | `/`                                         | 서비스 소개                                           |
| 대시보드              | `/dashboard`                                | 오늘의 현황, 발주 요약, 빠른 OCR 입고, 소비·매출 분석 |
| 재고 현황             | `/inventory/current`, `/inventory/depleted` | 전체 재고 조회·편집                                   |
| 발주 가이드·수요 예측 | `/order-guide`                              | 수요 예측 및 발주 추천                                |
| 가격 변동 분석        | `/ingredient-price-analysis`                | 식자재 시세 시각화                                    |
| 설정                  | `/settings`                                 | 가게 정보·레시피·알림 설정                            |

---

## API 연동

- **Base URL**: `https://api.baro.com/v1` (임시)
- **인증**: JWT Bearer Token (`Authorization` 헤더)
- **토큰 갱신**: `/auth/refresh` 호출 (refresh token 방식)
- **에러 응답 포맷**: 추후 백엔드 확정 후 도입 예정
- **공통 처리**: Axios interceptor — 401 감지 시 자동 로그아웃

---

## 상태 관리

- **서버 상태**: React Query (캐싱·동기화·로딩·에러)
- **전역 클라이언트 상태**: Zustand (유저 정보, 사이드바 상태 등)
- **로컬 UI 상태**: `useState`
- **폼 상태**: React Hook Form (Zod 스키마 검증)

---

## 디자인 토큰

**색상 팔레트**

| 토큰         | 색상값                                       | 용도                       |
| ------------ | -------------------------------------------- | -------------------------- |
| `baro-blue`  | #449CD4 (Primary), #468FC1, #05668D, #055D80 | 주요 버튼, 링크            |
| `baro-red`   | #BD5535 (Primary), #C5745B, #9C482E, #773926 | 삭제, 경고                 |
| `baro-green` | #679436 (Primary), #679436, #567A2E, #3F5A21 | 입고 완료, 정상 상태       |
| `baro-black` | #111111 (Primary), #343333, #6A6A6A, #B7B7B7 | 텍스트 (단계적 그라데이션) |
| `baro-ivory` | #F2E9E1 (Primary), #E1D7C7, #D8D0C4, #B2ADA4 | 배경, 카드                 |

**공통 규칙**

- 반응형: 데스크탑 우선, 브레이크포인트 `sm:640` `md:768` `lg:1024`
- 모달: 공통 Modal 컴포넌트 사용
- 토스트: `react-hot-toast`

---

## 코딩 컨벤션

**네이밍**

- 컴포넌트: `PascalCase` (`InventoryTable.tsx`)
- 훅: `use` 접두사 + camelCase (`useInventory.ts`)
- 유틸·API 함수: camelCase (`formatDate`, `fetchInventory`)
- 상수: `UPPER_SNAKE_CASE`

**컴포넌트 작성 순서**

1. import (React → 외부 라이브러리 → 내부 모듈 → 타입)
2. Props interface 정의
3. 컴포넌트 함수 (named export)
4. Tailwind 클래스로 스타일링

**도구**

- ESLint + Prettier + husky pre-commit 훅 적용

---

## 주요 외부 연동

추후 기획 확정 후 도입 예정 (OCR 서비스, 시세 API, 스토리지 등)

---

## 환경 변수

추후 확정 후 도입 예정

---

## 에러 처리

- **런타임 에러**: `ErrorBoundary` 컴포넌트로 캐치
- **API 에러**: Axios interceptor 공통 처리 → 토스트 피드백
- **폼 에러**: Zod 검증 → `setError`로 필드 바인딩
- **로딩**: `Suspense` + Skeleton UI
- **404 / 권한 없음**: 전용 에러 페이지 리다이렉트

---

## 주의사항

- OCR 결과는 반드시 수동 검수 단계를 거쳐야 함 — 자동 확정 로직 추가 금지
- 시세 API는 평일 오전 9시 이후에만 갱신 — 주말·공휴일 예외 처리 필요
- 이미지 업로드 최대 10MB 제한

---

## 금지사항

- `any` 타입 금지 — 불가피하면 `// @ts-expect-error` + 사유 주석 필수
- 인라인 스타일 `style={{}}` 금지 — Tailwind 클래스 사용
- API 키·민감 정보 하드코딩 금지 — 환경 변수 사용
- `console.log` 프로덕션 코드에 잔존 금지
- 클래스 컴포넌트 사용 금지
- `shadcn/` 폴더 내 파일 직접 수정 금지
