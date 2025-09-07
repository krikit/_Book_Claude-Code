# CookShare 프로젝트 구조

## 1. 전체 프로젝트 구조

```
cookshare/
├── frontend/                 # Next.js 프론트엔드 애플리케이션
├── backend/                  # NestJS 백엔드 애플리케이션
├── mobile/                   # React Native 모바일 앱 (Phase 2)
├── shared/                   # 공유 타입 및 유틸리티
├── infrastructure/           # 인프라 설정 (Docker, K8s, Terraform)
├── scripts/                  # 프로젝트 관리 스크립트
├── docs/                     # 프로젝트 문서
├── .github/                  # GitHub Actions CI/CD
├── docker-compose.yml        # 로컬 개발 환경
├── Makefile                  # 프로젝트 명령어 관리
└── README.md                 # 프로젝트 개요
```

## 2. Frontend 구조 (Next.js 14 App Router)

```
frontend/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (auth)/                       # 인증 관련 라우트 그룹
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   ├── (main)/                       # 메인 애플리케이션 라우트
│   │   │   ├── recipes/
│   │   │   │   ├── page.tsx              # 레시피 목록
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx          # 레시피 상세
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx      # 레시피 수정
│   │   │   │   └── create/
│   │   │   │       └── page.tsx          # 레시피 작성
│   │   │   ├── search/
│   │   │   │   └── page.tsx              # 검색 페이지
│   │   │   ├── profile/
│   │   │   │   ├── [userId]/
│   │   │   │   │   └── page.tsx          # 사용자 프로필
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx          # 설정
│   │   │   └── layout.tsx                # 메인 레이아웃
│   │   ├── api/                          # API 라우트 (필요시)
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   ├── layout.tsx                    # 루트 레이아웃
│   │   ├── page.tsx                      # 홈페이지
│   │   ├── loading.tsx                   # 로딩 UI
│   │   ├── error.tsx                     # 에러 바운더리
│   │   └── not-found.tsx                 # 404 페이지
│   │
│   ├── components/                       # 재사용 가능한 컴포넌트
│   │   ├── common/                       # 공통 컴포넌트
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Header.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Footer/
│   │   │   ├── Navigation/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   └── LoadingSpinner/
│   │   ├── recipe/                       # 레시피 관련 컴포넌트
│   │   │   ├── RecipeCard/
│   │   │   ├── RecipeList/
│   │   │   ├── RecipeDetail/
│   │   │   ├── RecipeForm/
│   │   │   ├── IngredientList/
│   │   │   ├── StepList/
│   │   │   └── RecipeSearch/
│   │   ├── user/                         # 사용자 관련 컴포넌트
│   │   │   ├── UserProfile/
│   │   │   ├── UserAvatar/
│   │   │   ├── FollowButton/
│   │   │   └── UserStats/
│   │   └── layout/                       # 레이아웃 컴포넌트
│   │       ├── MainLayout/
│   │       ├── AuthLayout/
│   │       └── Sidebar/
│   │
│   ├── features/                         # 기능별 모듈
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   └── services/
│   │   │       └── authService.ts
│   │   ├── recipes/
│   │   │   ├── hooks/
│   │   │   │   ├── useRecipes.ts
│   │   │   │   └── useRecipeDetail.ts
│   │   │   ├── components/
│   │   │   └── services/
│   │   └── users/
│   │       ├── hooks/
│   │       ├── components/
│   │       └── services/
│   │
│   ├── lib/                              # 라이브러리 설정
│   │   ├── api/                          # API 클라이언트
│   │   │   ├── client.ts
│   │   │   └── endpoints.ts
│   │   ├── utils/                        # 유틸리티 함수
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   └── constants/                    # 상수
│   │       ├── routes.ts
│   │       └── config.ts
│   │
│   ├── hooks/                            # 전역 커스텀 훅
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── stores/                           # 상태 관리 (Zustand)
│   │   ├── authStore.ts
│   │   ├── recipeStore.ts
│   │   └── uiStore.ts
│   │
│   ├── styles/                           # 전역 스타일
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   └── types/                            # TypeScript 타입 정의
│       ├── api.types.ts
│       ├── recipe.types.ts
│       └── user.types.ts
│
├── public/                                # 정적 파일
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── tests/                                 # 테스트 파일
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                             # 환경 변수
├── .eslintrc.json                         # ESLint 설정
├── .prettierrc                            # Prettier 설정
├── next.config.js                         # Next.js 설정
├── tailwind.config.js                     # Tailwind CSS 설정
├── tsconfig.json                          # TypeScript 설정
└── package.json                           # 프로젝트 의존성
```

## 3. Backend 구조 (NestJS)

```
backend/
├── src/
│   ├── app.module.ts                     # 루트 모듈
│   ├── main.ts                           # 애플리케이션 엔트리포인트
│   │
│   ├── modules/                          # 기능 모듈
│   │   ├── auth/                         # 인증 모듈
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   │
│   │   ├── users/                        # 사용자 모듈
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── recipes/                      # 레시피 모듈
│   │   │   ├── recipes.module.ts
│   │   │   ├── recipes.controller.ts
│   │   │   ├── recipes.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── recipe.entity.ts
│   │   │   │   ├── ingredient.entity.ts
│   │   │   │   └── recipe-step.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-recipe.dto.ts
│   │   │       ├── update-recipe.dto.ts
│   │   │       └── search-recipe.dto.ts
│   │   │
│   │   ├── reviews/                      # 리뷰 모듈
│   │   │   ├── reviews.module.ts
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.service.ts
│   │   │   ├── entities/
│   │   │   │   └── review.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── bookmarks/                    # 북마크 모듈
│   │   │   ├── bookmarks.module.ts
│   │   │   ├── bookmarks.controller.ts
│   │   │   ├── bookmarks.service.ts
│   │   │   └── entities/
│   │   │
│   │   ├── follows/                      # 팔로우 모듈
│   │   │   ├── follows.module.ts
│   │   │   ├── follows.controller.ts
│   │   │   ├── follows.service.ts
│   │   │   └── entities/
│   │   │
│   │   ├── uploads/                      # 파일 업로드 모듈
│   │   │   ├── uploads.module.ts
│   │   │   ├── uploads.controller.ts
│   │   │   ├── uploads.service.ts
│   │   │   └── interceptors/
│   │   │       └── file-upload.interceptor.ts
│   │   │
│   │   └── notifications/                # 알림 모듈
│   │       ├── notifications.module.ts
│   │       ├── notifications.gateway.ts
│   │       ├── notifications.service.ts
│   │       └── entities/
│   │
│   ├── common/                           # 공통 모듈
│   │   ├── database/                     # 데이터베이스 설정
│   │   │   ├── database.module.ts
│   │   │   └── database.providers.ts
│   │   ├── filters/                      # 예외 필터
│   │   │   ├── http-exception.filter.ts
│   │   │   └── validation.filter.ts
│   │   ├── interceptors/                 # 인터셉터
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/                        # 파이프
│   │   │   └── validation.pipe.ts
│   │   ├── decorators/                   # 커스텀 데코레이터
│   │   ├── utils/                        # 유틸리티
│   │   │   ├── bcrypt.util.ts
│   │   │   └── pagination.util.ts
│   │   └── constants/                    # 상수
│   │       └── app.constants.ts
│   │
│   ├── config/                           # 설정
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── redis.config.ts
│   │
│   └── migrations/                       # 데이터베이스 마이그레이션
│       └── *.migration.ts
│
├── test/                                 # 테스트
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env                                  # 환경 변수
├── .env.example                          # 환경 변수 예시
├── .eslintrc.js                          # ESLint 설정
├── .prettierrc                           # Prettier 설정
├── nest-cli.json                         # NestJS CLI 설정
├── tsconfig.json                         # TypeScript 설정
├── tsconfig.build.json                   # 빌드용 TypeScript 설정
├── ormconfig.js                          # TypeORM 설정
└── package.json                          # 프로젝트 의존성
```

## 4. Shared 구조 (공유 타입 및 유틸리티)

```
shared/
├── types/                                # 공유 타입 정의
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── recipe.model.ts
│   │   └── review.model.ts
│   ├── api/
│   │   ├── request.types.ts
│   │   └── response.types.ts
│   └── enums/
│       ├── recipe-category.enum.ts
│       ├── difficulty.enum.ts
│       └── user-role.enum.ts
│
├── utils/                                # 공유 유틸리티
│   ├── validators/
│   │   ├── email.validator.ts
│   │   └── password.validator.ts
│   └── formatters/
│       ├── date.formatter.ts
│       └── number.formatter.ts
│
├── constants/                            # 공유 상수
│   ├── error-codes.ts
│   └── regex-patterns.ts
│
└── package.json
```

## 5. Infrastructure 구조

```
infrastructure/
├── docker/                               # Docker 설정
│   ├── frontend/
│   │   └── Dockerfile
│   ├── backend/
│   │   └── Dockerfile
│   └── nginx/
│       ├── Dockerfile
│       └── nginx.conf
│
├── kubernetes/                           # Kubernetes 매니페스트
│   ├── namespace.yaml
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── configmap.yaml
│   └── database/
│       ├── postgres-deployment.yaml
│       ├── postgres-service.yaml
│       └── postgres-pvc.yaml
│
├── terraform/                            # Terraform 설정
│   ├── modules/
│   │   ├── vpc/
│   │   ├── eks/
│   │   ├── rds/
│   │   └── s3/
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── production/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
└── scripts/                              # 인프라 관리 스크립트
    ├── deploy.sh
    ├── rollback.sh
    └── health-check.sh
```

## 6. 개발 환경 설정 파일

### 루트 디렉토리 설정 파일

```
cookshare/
├── .gitignore                            # Git 무시 파일
├── .dockerignore                         # Docker 무시 파일
├── docker-compose.yml                    # 로컬 개발 환경
├── docker-compose.prod.yml               # 프로덕션 환경
├── Makefile                              # 프로젝트 명령어
├── lerna.json                            # Monorepo 관리 (선택사항)
├── package.json                          # 루트 package.json
├── pnpm-workspace.yaml                   # pnpm workspace 설정
└── turbo.json                            # Turborepo 설정 (선택사항)
```

### Docker Compose 구성

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: cookshare
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://admin:password@postgres:5432/cookshare
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

## 7. CI/CD 구조 (GitHub Actions)

```
.github/
├── workflows/
│   ├── ci.yml                           # CI 파이프라인
│   ├── cd-dev.yml                       # 개발 환경 배포
│   ├── cd-staging.yml                   # 스테이징 환경 배포
│   ├── cd-production.yml                # 프로덕션 환경 배포
│   └── code-quality.yml                 # 코드 품질 검사
│
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
│
└── pull_request_template.md
```

## 8. 문서 구조

```
docs/
├── api/                                  # API 문서
│   ├── swagger/
│   └── postman/
├── architecture/                         # 아키텍처 문서
│   ├── system-design.md
│   ├── database-schema.md
│   └── deployment.md
├── guides/                               # 개발 가이드
│   ├── frontend-guide.md
│   ├── backend-guide.md
│   └── contribution-guide.md
└── meetings/                             # 회의록
    └── *.md
```

## 9. 명명 규칙 및 코딩 컨벤션

### 파일 명명 규칙
- **컴포넌트**: PascalCase (예: `RecipeCard.tsx`)
- **유틸리티/훅**: camelCase (예: `useRecipes.ts`)
- **상수**: UPPER_SNAKE_CASE 파일명은 kebab-case (예: `api-endpoints.ts`)
- **타입/인터페이스**: PascalCase (예: `Recipe.types.ts`)

### 폴더 명명 규칙
- kebab-case 사용 (예: `recipe-detail/`)
- 복수형 사용 (예: `components/`, `utils/`)

### 코드 스타일
- **들여쓰기**: 2 spaces
- **세미콜론**: 사용
- **따옴표**: Single quotes for imports, double quotes for strings
- **줄 길이**: 최대 100자

### Git 커밋 메시지 규칙
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 추가/수정
- chore: 빌드 프로세스 또는 도구 변경

## 10. 환경 변수 관리

### Frontend (.env.local)
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# AWS S3
NEXT_PUBLIC_S3_BUCKET=cookshare-images
NEXT_PUBLIC_CLOUDFRONT_URL=https://cdn.cookshare.com

# Analytics
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX

# Social Login
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx
NEXT_PUBLIC_KAKAO_APP_KEY=xxxxx
```

### Backend (.env)
```bash
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://admin:password@localhost:5432/cookshare
DATABASE_LOGGING=true

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# AWS
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=cookshare-images

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# OAuth
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
KAKAO_CLIENT_ID=xxxxx
KAKAO_CLIENT_SECRET=xxxxx
```

## 11. 테스트 전략

### 테스트 구조
```
tests/
├── unit/                     # 단위 테스트
│   ├── frontend/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   └── backend/
│       ├── services/
│       └── utils/
├── integration/              # 통합 테스트
│   ├── api/
│   └── database/
└── e2e/                      # E2E 테스트
    ├── auth.spec.ts
    ├── recipe-crud.spec.ts
    └── search.spec.ts
```

### 테스트 도구
- **Frontend**: Jest, React Testing Library, Cypress
- **Backend**: Jest, Supertest
- **E2E**: Playwright or Cypress

---

작성일: 2025-08-23
버전: 1.0.0