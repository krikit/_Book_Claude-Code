# BiznestHub - 소상공인 업무 효율화 서비스

소상공인의 재고관리, 매출집계, 고객관리를 하나의 플랫폼에서 간편하게 처리할 수 있는 올인원 솔루션입니다.

## 📋 프로젝트 개요

- **개발 기간**: 2025.10 ~ 2025.12 (3개월)
- **팀 구성**: 풀스택 개발자 1명, 디자이너 1명
- **예산**: 500만원 이내

## 🛠 기술 스택

### Frontend
- **React 18** + **TypeScript** - UI 프레임워크
- **Vite** - 빌드 도구
- **TailwindCSS** - 스타일링
- **React Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Chart.js** - 데이터 시각화
- **html5-qrcode** - QR 코드 스캔

### Backend
- **Node.js** + **Express** - 서버 프레임워크
- **TypeScript** - 타입 안정성
- **Prisma** - ORM
- **PostgreSQL** - 데이터베이스

### Infra & Tools
- **Supabase** - DB 호스팅 + 인증
- **Vercel** - 프론트엔드 배포
- **Railway** - 백엔드 배포
- **GitHub Actions** - CI/CD

## 📁 프로젝트 구조

```
biznest-hub/
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── store/         # Zustand 스토어
│   │   ├── services/      # API 호출 함수
│   │   ├── utils/         # 유틸리티 함수
│   │   ├── types/         # TypeScript 타입 정의
│   │   └── test/          # 테스트 설정 및 유틸
│   ├── public/            # 정적 파일
│   └── package.json
│
├── server/                # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/   # 요청 핸들러
│   │   ├── routes/        # API 라우트
│   │   ├── services/      # 비즈니스 로직
│   │   ├── middleware/    # Express 미들웨어
│   │   ├── utils/         # 유틸리티 함수
│   │   ├── types/         # TypeScript 타입 정의
│   │   └── config/        # 설정 파일
│   ├── prisma/            # Prisma 스키마 및 마이그레이션
│   │   └── schema.prisma  # 데이터베이스 스키마
│   └── package.json
│
├── .github/               # GitHub 설정
│   └── workflows/         # GitHub Actions CI/CD
│       └── ci.yml
│
├── PLAN.md               # 프로젝트 기획서
├── TECH_STACK.md         # 기술 스택 상세 문서
└── README.md             # 이 문서
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 20.x 이상
- npm 또는 yarn
- PostgreSQL (또는 Supabase 계정)

### 환경 설정

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd biznest-hub
```

#### 2. 프론트엔드 설정

```bash
cd client
npm install
npm run dev
```

프론트엔드는 http://localhost:3000 에서 실행됩니다.

#### 3. 백엔드 설정

```bash
cd server
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 DATABASE_URL 등 필수 값 입력

# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate

# 서버 실행
npm run dev
```

백엔드는 http://localhost:5000 에서 실행됩니다.

### 환경 변수 설정

#### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/biznest"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
PORT=5000
NODE_ENV=development
JWT_SECRET="your-secret-key"
```

## 📝 개발 가이드

### 코드 스타일

프로젝트는 ESLint와 Prettier로 코드 스타일을 관리합니다.

```bash
# Frontend
cd client
npm run lint          # ESLint 검사
npm run lint:fix      # ESLint 자동 수정
npm run format        # Prettier 포맷팅
npm run format:check  # Prettier 검사

# Backend
cd server
npm run lint          # ESLint 검사 (추가 예정)
```

### 타입 체크

```bash
cd client
npm run typecheck     # TypeScript 타입 검사
```

### 테스트

```bash
cd client
npm test              # 테스트 실행
npm run test:ui       # 테스트 UI 모드
```

### 데이터베이스 관리

```bash
cd server

# Prisma Studio (데이터베이스 GUI)
npm run prisma:studio

# 마이그레이션 생성
npm run prisma:migrate

# Prisma 클라이언트 재생성
npm run prisma:generate
```

## 🏗 빌드 및 배포

### 프론트엔드 빌드

```bash
cd client
npm run build         # 프로덕션 빌드
npm run preview       # 빌드 결과 미리보기
```

### 백엔드 빌드

```bash
cd server
npm run build         # TypeScript 컴파일
npm start             # 프로덕션 서버 실행
```

### CI/CD

GitHub Actions를 통해 자동으로 테스트와 빌드가 실행됩니다.

- `main` 또는 `develop` 브랜치에 push 또는 PR 생성 시 자동 실행
- Frontend: 타입 체크, Lint, 포맷 검사, 테스트, 빌드
- Backend: Prisma 마이그레이션, 빌드

## 🔧 트러블슈팅

### 1. Prisma 클라이언트 오류

```bash
cd server
npm run prisma:generate
```

### 2. 포트 충돌

다른 프로세스가 3000번(Frontend) 또는 5000번(Backend) 포트를 사용 중인 경우:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 3. 데이터베이스 연결 오류

- `.env` 파일의 `DATABASE_URL` 확인
- PostgreSQL 서버가 실행 중인지 확인
- Supabase 사용 시 프로젝트 설정 확인

### 4. 모듈 설치 오류

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 5. TypeScript 오류

```bash
# tsconfig.json 검증
cd client  # 또는 server
npm run typecheck

# VS Code에서 TypeScript 버전 확인
Cmd+Shift+P → "TypeScript: Select TypeScript Version" → "Use Workspace Version"
```

## 📚 주요 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm test` | 테스트 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 포맷팅 |
| `npm run typecheck` | TypeScript 타입 체크 |

## 🤝 협업 가이드

### Git 브랜치 전략

- `main`: 프로덕션 배포용
- `develop`: 개발용 메인 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 설정, 패키지 업데이트
```

### Pull Request 절차

1. `develop` 브랜치에서 feature 브랜치 생성
2. 작업 완료 후 커밋
3. GitHub에 Push 후 PR 생성
4. CI 통과 확인
5. 리뷰 후 머지

## 📞 문의

프로젝트 관련 문의사항은 이슈를 생성해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
