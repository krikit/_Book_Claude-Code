# CookShare - Getting Started Guide

## 🍽️ 프로젝트 소개

**CookShare**는 사용자들이 레시피를 공유하고 발견할 수 있는 커뮤니티 플랫폼입니다. 이 가이드를 통해 로컬 개발 환경을 설정하고 프로젝트를 실행할 수 있습니다.

## 📋 시스템 요구사항

### 필수 소프트웨어

- **Node.js**: 18.x 이상 ([다운로드](https://nodejs.org/))
- **npm**: 8.x 이상 (Node.js와 함께 설치됨)
- **Git**: 최신 버전 ([다운로드](https://git-scm.com/))

### 선택 사항 (권장)

- **Docker & Docker Compose**: 컨테이너 기반 개발을 위해 ([다운로드](https://www.docker.com/))
- **VS Code**: 개발 환경 ([다운로드](https://code.visualstudio.com/))
- **TablePlus** 또는 **DBeaver**: 데이터베이스 GUI 도구

### 시스템 검증

터미널에서 다음 명령어들을 실행하여 시스템 요구사항을 확인하세요:

```bash
node --version    # v18.0.0 이상
npm --version     # 8.0.0 이상
git --version     # 아무 버전
docker --version  # 선택사항
```

## 🚀 프로젝트 설치

### 1. 저장소 클론

```bash
# 프로젝트 클론
git clone [REPOSITORY_URL]
cd cookshare

# 또는 이미 클론된 경우 해당 디렉터리로 이동
cd /path/to/cookshare
```

### 2. 의존성 설치

```bash
# 패키지 설치
npm install

# 또는 패키지 매니저가 다른 경우
# yarn install
# pnpm install
```

## 🔧 환경 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
# .env.example 파일을 복사하여 시작
cp .env.example .env.local
```

`.env.local` 파일을 편집하여 환경에 맞게 설정하세요:

```env
# 로컬 개발용 SQLite 설정
DATABASE_URL="file:./dev.db"

# 또는 Docker PostgreSQL 사용 시
# DATABASE_URL="postgresql://cookshare:cookshare123@localhost:5432/cookshare_dev?schema=public"

# NextAuth.js 설정
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# 파일 업로드 디렉터리
UPLOAD_DIR="./public/uploads"
```

### 2. 업로드 디렉터리 생성

```bash
# 이미지 업로드용 디렉터리 생성
mkdir -p public/uploads
```

## 🗄️ 데이터베이스 설정

### 방법 1: SQLite (간단한 로컬 개발)

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션 실행
npx prisma migrate dev

# 시드 데이터 생성 (선택사항)
npx prisma db seed
```

### 방법 2: Docker PostgreSQL (권장)

```bash
# Docker 컨테이너 시작 (PostgreSQL만)
docker-compose up -d db

# 데이터베이스가 준비될 때까지 잠시 대기 (10-20초)
sleep 15

# .env.local에서 PostgreSQL DATABASE_URL 설정 후
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 데이터베이스 관리

```bash
# Prisma Studio 실행 (브라우저에서 DB 관리)
npx prisma studio
# -> http://localhost:5555에서 접속

# 스키마 변경 후 마이그레이션
npx prisma migrate dev --name "변경사항-설명"

# 데이터베이스 리셋 (개발용)
npx prisma migrate reset
```

## 🏃‍♀️ 첫 실행

### 로컬 개발 서버 시작

```bash
# 개발 서버 시작
npm run dev

# 포트 3002에서 실행 (package.json 설정)
# 브라우저에서 http://localhost:3002 접속
```

### Docker로 전체 환경 실행

```bash
# 모든 서비스 시작 (앱 + 데이터베이스)
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 개발용 도구들도 함께 시작 (Prisma Studio, pgAdmin)
docker-compose --profile tools up

# 서비스 종료
docker-compose down
```

### 접속 정보

실행 후 다음 주소들로 접속할 수 있습니다:

- **메인 애플리케이션**: http://localhost:3000 (Docker) 또는 http://localhost:3002 (로컬)
- **Prisma Studio**: http://localhost:5555
- **pgAdmin** (Docker only): http://localhost:5050
  - 이메일: admin@cookshare.com
  - 비밀번호: admin123

## 💡 기본 사용 예제

### 1. 회원가입 및 로그인

1. 브라우저에서 애플리케이션 접속
2. "회원가입" 버튼 클릭
3. 이메일과 비밀번호로 계정 생성
4. 로그인하여 메인 페이지 접속

### 2. 첫 번째 레시피 작성

1. 로그인 후 "레시피 작성" 버튼 클릭
2. 다음 정보 입력:
   - **제목**: "김치찌개"
   - **설명**: "간단하고 맛있는 김치찌개"
   - **카테고리**: "Main"
   - **난이도**: "Easy"
   - **조리시간**: 30분
   - **인분**: 2인분

3. **재료 추가**:
   - 김치: 200g
   - 돼지고기: 150g
   - 두부: 1/2모

4. **조리과정 추가**:
   1. 돼지고기를 볶는다
   2. 김치를 넣고 같이 볶는다
   3. 물을 붓고 끓인다
   4. 두부를 넣고 5분 더 끓인다

5. "등록" 버튼 클릭하여 저장

### 3. 레시피 조회 및 상호작용

1. 메인 페이지에서 작성한 레시피 확인
2. 레시피 카드 클릭하여 상세 페이지 이동
3. "좋아요" 버튼으로 레시피에 반응
4. 카테고리별 필터링 테스트
5. 검색 기능으로 레시피 찾기

## 🛠️ 개발 명령어

### 일반 개발 명령어

```bash
# 개발 서버 시작 (포트 3002)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm run start

# 타입 체크
npm run type-check

# 린팅
npm run lint
```

### 데이터베이스 명령어

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 마이그레이션 실행
npm run db:migrate

# 시드 데이터 생성
npm run db:seed

# Prisma Studio 실행
npm run db:studio
```

### 테스트 명령어

```bash
# 유닛 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:coverage
```

### Docker 명령어

```bash
# 기본 서비스 시작 (앱 + DB)
docker-compose up

# 개발 도구 포함 시작
docker-compose --profile tools up

# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f app

# 컨테이너 재빌드
docker-compose up --build

# 전체 정리
docker-compose down -v --rmi all
```

## 🚨 자주 발생하는 문제와 해결방법

### 1. 포트 충돌 문제

**문제**: `Error: listen EADDRINUSE: address already in use :::3000`

**해결방법**:
```bash
# 포트 3000을 사용하는 프로세스 찾기 (macOS/Linux)
lsof -i :3000

# Windows에서
netstat -ano | findstr :3000

# 프로세스 종료 후 다시 시도
kill -9 [PID]

# 또는 다른 포트 사용
npm run dev -- -p 3001
```

### 2. 데이터베이스 연결 오류

**문제**: `Error: P1001 - Can't reach database server`

**해결방법**:
```bash
# SQLite 사용 시 - 파일 권한 확인
ls -la prisma/dev.db

# PostgreSQL 사용 시 - Docker 컨테이너 상태 확인
docker-compose ps
docker-compose logs db

# 데이터베이스 재시작
docker-compose restart db

# 환경변수 확인
echo $DATABASE_URL
```

### 3. Prisma 스키마 동기화 문제

**문제**: `Error: Schema is out of sync`

**해결방법**:
```bash
# 클라이언트 재생성
npx prisma generate

# 마이그레이션 상태 확인
npx prisma migrate status

# 강제 마이그레이션 (개발환경만)
npx prisma migrate reset

# 마이그레이션 재실행
npx prisma migrate dev
```

### 4. 패키지 설치 문제

**문제**: `npm ERR! peer dep missing`

**해결방법**:
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 정리
npm cache clean --force

# Node.js 버전 확인
node --version  # 18.x 이상 필요
```

### 5. 이미지 업로드 실패

**문제**: 이미지 업로드가 되지 않음

**해결방법**:
```bash
# 업로드 디렉터리 권한 확인
ls -la public/
mkdir -p public/uploads
chmod 755 public/uploads

# Docker 볼륨 확인
docker-compose down
docker volume ls
docker-compose up
```

### 6. TypeScript 타입 에러

**문제**: `Type error: Cannot find module`

**해결방법**:
```bash
# 타입 체크 실행
npm run type-check

# 프로젝트 재빌드
rm -rf .next
npm run build

# TypeScript 설정 확인
cat tsconfig.json
```

### 7. 환경변수 인식 문제

**문제**: 환경변수가 인식되지 않음

**해결방법**:
```bash
# 파일명 확인 (.env.local이어야 함)
ls -la .env*

# 파일 내용 확인
cat .env.local

# 개발 서버 재시작 필수
npm run dev
```

### 8. Docker 관련 문제

**문제**: Docker 컨테이너 시작 실패

**해결방법**:
```bash
# Docker 데몬 상태 확인
docker ps

# 컨테이너 로그 확인
docker-compose logs app
docker-compose logs db

# 네트워크 문제 해결
docker network prune

# 볼륨 문제 해결
docker volume prune

# 전체 재시작
docker-compose down
docker-compose up --build
```

## 📚 추가 리소스

### 프로젝트 문서
- [PLANNING.md](./PLANNING.md) - 전체 서비스 기획서
- [MVP.md](./MVP.md) - 최소 기능 명세
- [CLAUDE.md](./CLAUDE.md) - 개발 가이드라인
- [STRUCTURE.md](./STRUCTURE.md) - 프로젝트 구조 설계

### 기술 문서
- [Next.js 14 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [NextAuth.js 가이드](https://next-auth.js.org)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)

### 개발 도구
- [Prisma Studio](https://www.prisma.io/studio) - 데이터베이스 GUI
- [React Developer Tools](https://react.dev/learn/react-developer-tools) - 브라우저 확장
- [VS Code Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) - VS Code 확장

## 🤝 기여하기

1. 이슈 리포트: 버그나 개선사항이 있으면 이슈를 등록해주세요
2. Pull Request: 기능 개발이나 버그 수정을 위한 PR을 환영합니다
3. 문서 개선: 가이드나 문서 개선도 큰 도움이 됩니다

## 📞 도움이 필요할 때

1. **문서 먼저 확인**: 이 가이드와 프로젝트 내 다른 문서들을 확인해보세요
2. **로그 확인**: 콘솔이나 터미널의 에러 메시지를 자세히 읽어보세요
3. **GitHub Issues**: 해결되지 않는 문제는 이슈로 등록해주세요
4. **개발자 도구**: 브라우저 개발자 도구의 Network, Console 탭을 활용하세요

---

🎉 **축하합니다!** 이제 CookShare 프로젝트를 로컬에서 실행할 수 있습니다. 맛있는 레시피들을 공유해보세요!