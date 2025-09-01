# 온라인 쇼핑몰 마이크로서비스

PNPM Workspace를 사용한 마이크로서비스 아키텍처 기반 온라인 쇼핑몰 프로젝트입니다.

## 📁 프로젝트 구조

```
online-shopping-mall/
├── docs/                   # 프로젝트 문서
│   ├── plan.md            # 마이크로서비스 아키텍처 설계 문서
│   └── WBS.md             # 작업 분해 구조 (Work Breakdown Structure)
├── apps/                   # 프론트엔드 애플리케이션
│   ├── web/               # 웹 애플리케이션 (React + Vite)
│   ├── admin/             # 관리자 패널 (React + Ant Design)
│   └── mobile/            # 모바일 앱 (React Native)
├── services/              # 마이크로서비스
│   ├── user/             # 사용자 서비스
│   ├── product/          # 상품 서비스
│   ├── order/            # 주문 서비스
│   ├── payment/          # 결제 서비스
│   ├── shipping/         # 배송 서비스
│   ├── cart/             # 장바구니 서비스
│   ├── review/           # 리뷰 서비스
│   └── notification/     # 알림 서비스
├── packages/             # 공유 패키지
│   ├── shared/           # 공통 유틸리티 및 미들웨어
│   ├── types/            # TypeScript 타입 정의
│   ├── config/           # 설정 관리
│   └── utils/            # 유틸리티 함수
└── docker/               # Docker 설정 파일
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- PNPM 8+
- Docker & Docker Compose

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 환경 실행
pnpm dev

# Docker로 전체 시스템 실행
pnpm docker:up
```

## 📦 패키지 관리

### 워크스페이스 명령어

```bash
# 모든 패키지 빌드
pnpm build

# 모든 패키지 개발 모드 실행
pnpm dev

# 특정 서비스 실행
pnpm --filter @shopping-mall/user-service dev

# 특정 앱 실행
pnpm --filter @shopping-mall/web-app dev

# 린트 검사
pnpm lint

# 테스트 실행
pnpm test

# 타입 체크
pnpm type-check
```

### 새로운 의존성 추가

```bash
# 루트에 개발 의존성 추가
pnpm add -D typescript

# 특정 서비스에 의존성 추가
pnpm --filter @shopping-mall/user-service add express

# 공유 패키지 사용
pnpm --filter @shopping-mall/user-service add @shopping-mall/shared
```

## 🏗️ 마이크로서비스

### 서비스 포트 할당

| 서비스 | 포트 | 설명 |
|--------|------|------|
| API Gateway | 3000 | 통합 진입점 |
| User Service | 3001 | 사용자 인증/관리 |
| Product Service | 3002 | 상품 관리 |
| Order Service | 3003 | 주문 처리 |
| Payment Service | 3004 | 결제 처리 |
| Shipping Service | 3005 | 배송 추적 |
| Cart Service | 3006 | 장바구니 |
| Review Service | 3007 | 상품 리뷰 |
| Notification Service | 3008 | 알림 발송 |

### 데이터베이스

| 서비스 | 데이터베이스 | 포트 |
|--------|-------------|------|
| User, Order, Payment, Shipping | PostgreSQL | 5432 |
| Product, Review | MongoDB | 27017 |
| Cart | Redis | 6379 |
| Message Queue | RabbitMQ | 5672, 15672 |

## 🔧 개발 환경 설정

### 환경 변수

각 서비스는 `.env` 파일을 통해 환경 변수를 관리합니다.

```bash
# 서비스별 환경 변수 예시
cp services/user/.env.example services/user/.env
```

### Docker 개발 환경

```bash
# 데이터베이스만 실행
docker-compose up postgres mongodb redis rabbitmq

# 전체 시스템 실행
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down
```

## 📊 모니터링

- **Logs**: 각 서비스의 로그는 `logs/` 디렉토리에 저장됩니다
- **Health Check**: `/health` 엔드포인트를 통한 헬스 체크
- **Metrics**: Prometheus 메트릭 수집 준비

## 🧪 테스트

```bash
# 전체 테스트
pnpm test

# 특정 서비스 테스트
pnpm --filter @shopping-mall/user-service test

# 테스트 커버리지
pnpm test:coverage
```

## 📝 API 문서

각 서비스의 API 문서는 개발 모드에서 `/docs` 엔드포인트에서 확인할 수 있습니다.

- User Service: http://localhost:3001/docs
- Product Service: http://localhost:3002/docs
- Order Service: http://localhost:3003/docs

## 🚀 배포

### Production 빌드

```bash
# 전체 빌드
pnpm build

# Docker 이미지 빌드
pnpm docker:build
```

### 환경별 배포

- **Development**: `pnpm dev`
- **Staging**: `NODE_ENV=staging pnpm start`
- **Production**: `NODE_ENV=production pnpm start`

## 📋 프로젝트 문서

- **[아키텍처 설계](docs/plan.md)**: 마이크로서비스 아키텍처 상세 설계 문서
- **[작업 분해 구조](docs/WBS.md)**: 프로젝트 WBS 및 개발 일정
- **[기술적 위험 분석](docs/RISK.md)**: 프로젝트 리스크 분석 및 완화 전략

## 🤝 기여 가이드

1. 새로운 기능 브랜치 생성
2. 변경사항 커밋
3. 테스트 실행 및 통과 확인
4. Pull Request 생성

## 📄 라이선스

MIT License