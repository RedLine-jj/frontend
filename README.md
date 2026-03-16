# Redline Frontend

편집샵들의 재고를 추적하고, 원하는 제품이 어느 사이트에서 판매 중인지 한눈에 확인할 수 있는 서비스입니다.

## 기술 스택

- Vite
- TypeScript
- React
- Tanstack React Query
- shadcn-ui
- Tailwind CSS

## 주요 기능

- 모델 목록 (무한 스크롤, 브랜드/타입 필터)
- 모델 상세 (사이트별 가격 비교, 가격 추이 차트)
- 구독 관리
- 재입고 실시간 알림 (SSE 스트림 + 토스트 + 헤더 뱃지)
- 알림 목록 페이지 (읽음/안읽음 관리)

## 로컬 실행

```sh
npm install
npm run dev
```

기본 포트: http://localhost:8080
