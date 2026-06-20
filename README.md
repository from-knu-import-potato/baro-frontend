# baro-frontend

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
</div>

<br/>

**BARO(바로)** 는 소규모 카페·식당 사장님을 위한 OCR·AI 기반 통합 가게 운영 SaaS입니다. QR 주문부터 재고 관리, AI 발주 가이드, 마감 정산까지 하나의 플랫폼에서 처리할 수 있습니다. 이 레포지토리는 BARO의 백엔드 API 서버입니다.

<br/>


### 시작하기 (Getting Started)

#### 1. 프로젝트 복제 및 의존성 설치

##### 1-1. 레포지토리 클론

```
git clone https://github.com/from-knu-import-potato/baro-frontend.git
```

##### 1-2. 프로젝트 폴더로 이동

```
cd baro-frontend
```

##### 1-3. 의존성 설치 (pnpm이 설치되어 있어야 합니다)

```
pnpm install
```

##### 1-4. Husky 세팅 활성화

```
pnpm run prepare
```

<br/>

#### 2. 개발 서버 실행

```
pnpm run dev
```
