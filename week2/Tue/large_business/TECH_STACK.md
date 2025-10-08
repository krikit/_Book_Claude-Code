# BiznestHub 기술 스택 추천서

## 최종 추천 스택 (Primary)

```
Frontend: React 18 + TypeScript + Vite + TailwindCSS
State: React Query + Zustand
Backend: Node.js + Express + TypeScript
ORM: Prisma
Database: PostgreSQL (Supabase)
Deploy: Vercel (Frontend) + Railway (Backend)
Auth: Supabase Auth
```

---

## 1. 프론트엔드 프레임워크 비교

### ✅ **추천: React 18 + TypeScript**

**선정 이유**:
- **생태계**: 가장 큰 커뮤니티, 풍부한 라이브러리 (Chart.js, QR 스캐너 등)
- **개발 속도**: hooks, 컴포넌트 재사용성으로 빠른 프로토타이핑
- **인력 풀**: 국내 개발자 가장 많음 → 향후 팀 확장 용이
- **PWA 지원**: Vite PWA 플러그인으로 간편한 모바일 앱화
- **TypeScript**: 대시보드/매출 계산 로직에서 타입 안정성 필수

**대안 비교**:

| 항목 | React | Vue 3 | Angular |
|------|-------|-------|---------|
| 학습 곡선 | 중간 | 쉬움 | 어려움 |
| 개발 속도 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 생태계 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 타입 지원 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| PWA 지원 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 비용 (학습) | 낮음 | 낮음 | 높음 |

**Vue 선택 시**: Nuxt 3 사용하면 SEO 유리, 하지만 차트/QR 라이브러리 선택지 적음
**Angular 선택 시**: 대규모 엔터프라이즈에 적합, 2명 팀에는 과한 스펙

---

## 2. 백엔드 프레임워크 비교

### ✅ **추천: Node.js (Express) + TypeScript**

**선정 이유**:
- **풀스택 효율성**: 프론트와 같은 언어 → 코드 재사용 (타입 정의, 유틸 함수)
- **빠른 개발**: Express 미들웨어 생태계로 인증/파일 업로드 등 빠른 구현
- **비동기 처리**: 재고 알림, 엑셀 생성 등 I/O 작업에 강점
- **비용**: Vercel Serverless Functions 또는 Railway 무료 티어 활용 가능
- **JSON 처리**: REST API 응답 직렬화가 Python보다 자연스러움

**대안 비교**:

| 항목 | Node.js | Python (FastAPI) | Java (Spring Boot) |
|------|---------|------------------|-------------------|
| 개발 속도 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 풀스택 호환성 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 비동기 성능 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 무료 호스팅 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| 타입 안정성 | ⭐⭐⭐⭐ (TS) | ⭐⭐⭐⭐ (Pydantic) | ⭐⭐⭐⭐⭐ |
| 메모리 효율 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

**Python 선택 시**: 향후 AI 기능(재고 예측) 추가 시 유리, 하지만 초기엔 과한 스펙
**Java 선택 시**: 금융권 연동 필요 시 적합, 하지만 개발 속도 느리고 호스팅 비용 高

---

## 3. 데이터베이스 비교

### ✅ **추천: PostgreSQL (Supabase 호스팅)**

**선정 이유**:
- **관계형 데이터**: 재고-매출-고객 간 복잡한 관계 처리 필수
- **트랜잭션**: 재고 차감 + 매출 기록 동시 처리 시 데이터 정합성 보장
- **무료 티어**: Supabase 25,000 rows 무료 (베타 단계 충분)
- **Prisma 호환**: TypeScript 자동완성으로 생산성 극대화
- **Full-text search**: 고객 이름/상품명 검색 기능

**대안 비교**:

| 항목 | PostgreSQL | MongoDB | Firebase |
|------|-----------|---------|----------|
| 데이터 구조 적합성 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 트랜잭션 지원 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| 무료 티어 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 마이그레이션 관리 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ |
| 복잡한 쿼리 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 실시간 기능 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**MongoDB 선택 시**: 스키마 변경 빈번한 초기 단계에 유리, 하지만 JOIN 복잡
**Firebase 선택 시**: 실시간 동기화 강력, 하지만 복잡한 쿼리 어렵고 비용 증가 빠름

---

## 4. 배포 플랫폼 비교

### ✅ **추천: Vercel (Frontend) + Railway (Backend)**

**선정 이유**:
- **Vercel**: React 최적화, 자동 HTTPS, CDN, 무료 티어 관대
- **Railway**: PostgreSQL + Express 한 번에 배포, GitHub 연동 자동 배포
- **비용**: 초기 월 0원, 트래픽 증가 시 점진적 확장
- **DX**: Git push만으로 배포 완료, 별도 DevOps 불필요

**대안 비교**:

| 항목 | Vercel+Railway | AWS (EC2+RDS) | Netlify+Heroku |
|------|----------------|---------------|----------------|
| 초기 비용 | ⭐⭐⭐⭐⭐ (무료) | ⭐⭐ (~$30/월) | ⭐⭐⭐⭐ (무료) |
| 배포 난이도 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| 확장성 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 자동 배포 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| DB 호스팅 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**AWS 선택 시**: 대규모 트래픽 대비 가능, 하지만 초기 설정 복잡 + 비용 높음
**Netlify 선택 시**: Heroku가 2022년 무료 중단, 대안으로 Render 사용 가능

---

## 5. 상태 관리 비교

### ✅ **추천: React Query + Zustand**

**선정 이유**:
- **React Query**: 서버 데이터 캐싱, 자동 리프레시 (매출 대시보드에 최적)
- **Zustand**: 전역 상태(로그인 유저, 다크 모드 등) 간단히 관리
- **조합**: 서버 상태(React Query) + 클라이언트 상태(Zustand) 명확히 분리

**대안 비교**:

| 항목 | React Query + Zustand | Redux Toolkit | Context API |
|------|----------------------|---------------|-------------|
| 학습 곡선 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 보일러플레이트 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 서버 상태 관리 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ |
| DevTools | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 번들 크기 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Redux 선택 시**: 복잡한 비즈니스 로직 많을 때 유리, 하지만 MVP엔 과함
**Context API 선택 시**: 별도 의존성 없지만, 서버 데이터 캐싱 직접 구현 필요

---

## 단계별 설정 가이드

### Phase 1: 프로젝트 초기화 (1일차)

```bash
# 1. 프론트엔드 생성
npm create vite@latest biznest-frontend -- --template react-ts
cd biznest-frontend
npm install

# 2. 필수 라이브러리 설치
npm install react-router-dom react-query zustand
npm install tailwindcss postcss autoprefixer
npm install chart.js react-chartjs-2
npm install react-qr-scanner # QR 스캔

# 3. TailwindCSS 설정
npx tailwindcss init -p

# 4. 백엔드 생성
mkdir biznest-backend && cd biznest-backend
npm init -y
npm install express cors dotenv
npm install prisma @prisma/client
npm install -D typescript @types/node @types/express ts-node-dev

# 5. TypeScript 설정
npx tsc --init

# 6. Prisma 초기화
npx prisma init --datasource-provider postgresql
```

### Phase 2: Supabase 연동 (2일차)

```bash
# 1. Supabase 프로젝트 생성 (웹에서)
# https://supabase.com → New Project

# 2. 환경 변수 설정 (.env)
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGc..."

# 3. 프론트엔드에 Supabase 클라이언트 설치
npm install @supabase/supabase-js
```

### Phase 3: DB 스키마 설계 (3일차)

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())

  products  Product[]
  sales     Sale[]
  customers Customer[]
}

model Product {
  id          String   @id @default(uuid())
  name        String
  barcode     String?  @unique
  stock       Int
  minStock    Int      @default(10)
  costPrice   Decimal
  salePrice   Decimal
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  stockLogs   StockLog[]
  saleItems   SaleItem[]
}

model Sale {
  id          String     @id @default(uuid())
  totalAmount Decimal
  createdAt   DateTime   @default(now())
  userId      String
  user        User       @relation(fields: [userId], references: [id])

  items       SaleItem[]
}

model SaleItem {
  id        String  @id @default(uuid())
  quantity  Int
  price     Decimal
  saleId    String
  sale      Sale    @relation(fields: [saleId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
}

model Customer {
  id          String   @id @default(uuid())
  name        String
  phone       String   @unique
  birthday    DateTime?
  points      Int      @default(0)
  visitCount  Int      @default(0)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

model StockLog {
  id        String   @id @default(uuid())
  type      String   // "IN" | "OUT"
  quantity  Int
  createdAt DateTime @default(now())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
}
```

```bash
# 마이그레이션 실행
npx prisma migrate dev --name init
npx prisma generate
```

### Phase 4: 배포 설정 (10주차)

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 프론트엔드 배포
cd biznest-frontend
vercel --prod

# 3. Railway 배포 (웹에서)
# https://railway.app → New Project → Deploy from GitHub

# 4. 환경 변수 설정 (Railway 대시보드에서)
DATABASE_URL=...
SUPABASE_URL=...
```

---

## 대안 기술 스택 (Option B)

상황별 대안 스택:

### 시나리오 1: "향후 AI 기능 추가 예정"
```
Backend: Python (FastAPI) + SQLAlchemy
배포: Render (Python 무료 티어 지원)
이유: 재고 예측 AI 모델 연동 용이
```

### 시나리오 2: "실시간 동기화 필수"
```
Database: Firebase Firestore
배포: Firebase Hosting
이유: 다중 디바이스 실시간 재고 업데이트
```

### 시나리오 3: "예산 추가 확보 시"
```
Backend: NestJS (Node.js 프레임워크)
배포: AWS ECS + RDS
이유: 엔터프라이즈급 확장성, MSA 전환 용이
```

---

## 마이그레이션 계획

### 1단계: PostgreSQL → MongoDB (재고 스키마 변경 빈번할 경우)

**시점**: 베타 테스트 중 상품 속성 변동 심할 때

**절차**:
1. MongoDB Atlas 무료 계정 생성
2. Prisma 대신 Mongoose 설치
3. 스키마리스 모델 정의
4. ETL 스크립트 작성 (pg → mongo)
5. 점진적 마이그레이션 (읽기 → 쓰기)

**비용**: 개발 2주, 데이터 손실 리스크 中

---

### 2단계: Monolith → Microservices (유저 1000명 돌파 시)

**시점**: 트래픽 급증으로 단일 서버 한계 도달

**분리 전략**:
```
Before: Express (All-in-one)
After:
  - Auth Service (인증/회원)
  - Inventory Service (재고)
  - Sales Service (매출)
  - Notification Service (알림)
```

**절차**:
1. API Gateway 도입 (Kong/Nginx)
2. 서비스별 DB 분리 (DB per service)
3. 이벤트 기반 통신 (RabbitMQ/Kafka)
4. 독립 배포 파이프라인 구축

**비용**: 개발 3개월, 인프라 비용 월 50만원 추가

---

### 3단계: React → Next.js (SEO 중요해질 때)

**시점**: 검색 유입 비율 50% 돌파 목표 시

**절차**:
1. Next.js 프로젝트 생성
2. 기존 컴포넌트 점진적 이동
3. SSR 전환 (대시보드는 CSR 유지)
4. ISR로 정적 페이지 캐싱

**비용**: 개발 1개월, Vercel Pro 플랜 월 $20

---

## 비용 최적화 팁

### 무료 티어 활용 전략

| 서비스 | 무료 한도 | 초과 시 대안 |
|--------|----------|------------|
| Supabase | 500MB DB | Neon (3GB 무료) |
| Vercel | 100GB 대역폭/월 | Cloudflare Pages |
| Railway | $5 크레딧/월 | Render (750시간/월) |
| Sentry | 5K 에러/월 | LogRocket (1K 세션) |

### 프로덕션 예상 비용 (월 사용자 100명 기준)

```
Vercel: $0 (무료 티어 내)
Railway: $5 (Postgres + Express)
Supabase: $0 (무료 티어 내)
도메인: $1 (Cloudflare 등록)
---
월 합계: $6 (~8,000원)
```

---

## 결론

**최종 추천 스택이 BiznestHub에 최적인 이유**:

1. ✅ **빠른 개발**: React + Node.js로 3개월 내 MVP 완성 가능
2. ✅ **비용 효율**: 초기 월 비용 1만원 이하
3. ✅ **타입 안정성**: TypeScript로 매출 계산 오류 방지
4. ✅ **확장성**: PostgreSQL로 향후 복잡한 리포트 대응
5. ✅ **유지보수**: Prisma Migrate로 스키마 변경 추적

**위험 요소**:
- Node.js 단일 스레드 한계 → 유저 1만명 이상 시 Go/Rust 고려
- Vercel 무료 티어 제한 → 트래픽 급증 시 Cloudflare Pages 이전

**최종 의견**: 현재 조건(2명, 3개월, 500만원)에서 **추천 스택보다 나은 조합은 없음**. 단, 6개월 후 피벗 가능성 있다면 Firebase로 시작해 빠른 검증 후 마이그레이션 전략도 고려 가능.
