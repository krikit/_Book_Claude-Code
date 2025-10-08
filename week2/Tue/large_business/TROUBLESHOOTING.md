# 트러블슈팅 가이드

BiznestHub 개발 중 발생할 수 있는 일반적인 문제와 해결 방법을 정리한 문서입니다.

## 목차

1. [패키지 설치 문제](#패키지-설치-문제)
2. [TypeScript 오류](#typescript-오류)
3. [Prisma 관련 문제](#prisma-관련-문제)
4. [데이터베이스 연결 문제](#데이터베이스-연결-문제)
5. [포트 충돌](#포트-충돌)
6. [빌드 및 실행 문제](#빌드-및-실행-문제)
7. [Git 및 CI/CD 문제](#git-및-cicd-문제)
8. [ESLint/Prettier 문제](#eslintprettier-문제)

---

## 패키지 설치 문제

### 문제: `npm install` 실패

**증상**:
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**해결 방법**:

1. **캐시 삭제 후 재설치**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

2. **Legacy Peer Dependencies 사용**
```bash
npm install --legacy-peer-deps
```

3. **Node.js 버전 확인**
```bash
node -v  # 20.x 이상이어야 함
```

### 문제: 특정 패키지 버전 충돌

**증상**:
```bash
npm ERR! peer dep missing: react@^18.0.0
```

**해결 방법**:

```bash
# 특정 버전 명시하여 설치
npm install react@18.3.1 react-dom@18.3.1

# 또는 package.json에서 버전 수정 후
npm install
```

---

## TypeScript 오류

### 문제: `Cannot find module` 오류

**증상**:
```typescript
Cannot find module '@/components/Button' or its corresponding type declarations.
```

**해결 방법**:

1. **tsconfig.json 경로 별칭 확인**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. **vite.config.ts에도 별칭 추가**
```typescript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

3. **VS Code TypeScript 서버 재시작**
- `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### 문제: `Prisma Client` 타입 오류

**증상**:
```typescript
Cannot find module '@prisma/client' or its corresponding type declarations.
```

**해결 방법**:

```bash
cd server
npm run prisma:generate
```

### 문제: 암묵적 `any` 타입 오류

**증상**:
```typescript
Parameter 'req' implicitly has an 'any' type.
```

**해결 방법**:

```typescript
// 타입 명시
import { Request, Response } from 'express';

app.get('/api', (req: Request, res: Response) => {
  // ...
});
```

---

## Prisma 관련 문제

### 문제: Prisma Client 생성 안 됨

**증상**:
```bash
Error: @prisma/client did not initialize yet.
```

**해결 방법**:

```bash
cd server

# Prisma Client 재생성
npx prisma generate

# 또는 npm 스크립트 사용
npm run prisma:generate
```

### 문제: 마이그레이션 실패

**증상**:
```bash
Error: P1017: Server has closed the connection.
```

**해결 방법**:

1. **데이터베이스 연결 확인**
```bash
# .env 파일 확인
cat .env | grep DATABASE_URL
```

2. **마이그레이션 리셋**
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

3. **수동 마이그레이션**
```bash
# 마이그레이션 파일만 생성
npx prisma migrate dev --create-only

# SQL 파일 수정 후
npx prisma migrate dev
```

### 문제: Prisma Studio 접속 안 됨

**증상**:
```bash
Error: listen EADDRINUSE: address already in use :::5555
```

**해결 방법**:

```bash
# 포트를 사용 중인 프로세스 종료
lsof -ti:5555 | xargs kill -9

# 또는 다른 포트 사용
npx prisma studio --port 5556
```

---

## 데이터베이스 연결 문제

### 문제: PostgreSQL 연결 실패

**증상**:
```bash
Error: P1001: Can't reach database server at `localhost:5432`
```

**해결 방법**:

1. **PostgreSQL 서버 상태 확인**
```bash
# macOS
brew services list

# PostgreSQL 실행
brew services start postgresql@15
```

2. **데이터베이스 생성 확인**
```bash
psql -U postgres -c "CREATE DATABASE biznest;"
```

3. **연결 문자열 확인**
```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/biznest?schema=public"
```

### 문제: Supabase 연결 오류

**증상**:
```bash
Error: Invalid Supabase URL
```

**해결 방법**:

1. **Supabase 프로젝트 설정 확인**
   - https://supabase.com/dashboard
   - Settings → API
   - URL과 anon key 복사

2. **.env 파일 업데이트**
```env
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGc..."
```

3. **Connection Pooling 사용 (프로덕션)**
```env
# Direct connection
DATABASE_URL="postgresql://..."

# Pooled connection (권장)
DATABASE_URL="postgresql://...?pgbouncer=true"
```

---

## 포트 충돌

### 문제: 포트 이미 사용 중

**증상**:
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**해결 방법**:

**macOS/Linux**:
```bash
# 3000번 포트 사용 프로세스 확인 및 종료
lsof -ti:3000 | xargs kill -9

# 5000번 포트 (백엔드)
lsof -ti:5000 | xargs kill -9
```

**Windows**:
```bash
# 포트 사용 프로세스 확인
netstat -ano | findstr :3000

# PID 확인 후 종료
taskkill /PID <PID> /F
```

**또는 다른 포트 사용**:

```bash
# Frontend
PORT=3001 npm run dev

# Backend (.env 수정)
PORT=5001
```

---

## 빌드 및 실행 문제

### 문제: Frontend 빌드 실패

**증상**:
```bash
vite build failed
```

**해결 방법**:

1. **타입 체크**
```bash
npm run typecheck
```

2. **Lint 오류 확인**
```bash
npm run lint
```

3. **의존성 재설치**
```bash
rm -rf node_modules .vite
npm install
npm run build
```

### 문제: Backend 빌드 실패

**증상**:
```bash
error TS2307: Cannot find module './config'
```

**해결 방법**:

1. **tsconfig.json 확인**
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

2. **Prisma Client 생성**
```bash
npm run prisma:generate
```

3. **빌드 재실행**
```bash
rm -rf dist
npm run build
```

### 문제: Hot Reload 작동 안 함

**증상**: 코드 수정 후 브라우저가 자동으로 새로고침되지 않음

**해결 방법**:

1. **Vite 설정 확인** (client/vite.config.ts)
```typescript
export default defineConfig({
  server: {
    watch: {
      usePolling: true, // WSL/Docker 환경에서 필요
    },
  },
})
```

2. **개발 서버 재시작**
```bash
# Frontend
npm run dev

# Backend
npm run dev
```

---

## Git 및 CI/CD 문제

### 문제: GitHub Actions CI 실패

**증상**: GitHub에서 CI 파이프라인이 실패함

**해결 방법**:

1. **로컬에서 테스트**
```bash
# Frontend
cd client
npm run typecheck
npm run lint
npm run format:check
npm test -- --run
npm run build

# Backend
cd server
npm run build
```

2. **환경 변수 설정**
   - GitHub → Settings → Secrets and variables → Actions
   - `DATABASE_URL` 등 필수 환경 변수 추가

3. **워크플로우 로그 확인**
   - GitHub → Actions 탭 → 실패한 워크플로우 클릭
   - 오류 메시지 확인

### 문제: Git push 시 오류

**증상**:
```bash
error: failed to push some refs
```

**해결 방법**:

```bash
# 원격 저장소 변경사항 가져오기
git pull origin main --rebase

# 충돌 해결 후
git add .
git rebase --continue

# Push
git push origin main
```

---

## ESLint/Prettier 문제

### 문제: ESLint 오류 너무 많음

**증상**: 수십 개의 ESLint 경고/오류

**해결 방법**:

1. **자동 수정**
```bash
npm run lint:fix
```

2. **Prettier 포맷팅**
```bash
npm run format
```

3. **특정 규칙 비활성화** (eslint.config.js)
```javascript
export default defineConfig([
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn', // error → warn
      '@typescript-eslint/no-explicit-any': 'off',  // 비활성화
    },
  },
])
```

### 문제: Prettier와 ESLint 충돌

**증상**: Prettier가 포맷팅한 코드를 ESLint가 오류로 표시

**해결 방법**:

```bash
# eslint-config-prettier 설치 확인
npm install -D eslint-config-prettier

# ESLint 설정에 prettier 추가 (extends 배열의 마지막에)
```

```javascript
export default defineConfig([
  {
    extends: [
      // ... 다른 설정
      'prettier', // 반드시 마지막에
    ],
  },
])
```

---

## 자주 묻는 질문 (FAQ)

### Q: `npm install` vs `npm ci`의 차이는?

**A**:
- `npm install`: package.json 기반으로 최신 버전 설치
- `npm ci`: package-lock.json 기반으로 정확한 버전 설치 (CI/CD에서 권장)

### Q: 개발 서버를 백그라운드에서 실행하려면?

**A**:
```bash
# macOS/Linux
npm run dev &

# 또는 tmux/screen 사용
tmux new -s biznest
npm run dev
# Ctrl+B, D로 detach
```

### Q: 프로덕션 환경에서 환경 변수를 설정하려면?

**A**:
- **Vercel**: Settings → Environment Variables
- **Railway**: Variables 탭에서 추가
- **.env 파일은 절대 커밋하지 말 것**

### Q: Prisma Schema 변경 후 해야 할 일은?

**A**:
```bash
# 1. 마이그레이션 생성
npm run prisma:migrate

# 2. Prisma Client 재생성
npm run prisma:generate

# 3. 서버 재시작
npm run dev
```

---

## 추가 도움이 필요하신가요?

### 디버깅 팁

1. **개발자 도구 활용**
   - Chrome DevTools (F12)
   - Network 탭에서 API 호출 확인
   - Console에서 에러 메시지 확인

2. **로그 추가**
```typescript
console.log('Debug:', { variable });
```

3. **VS Code 디버거 사용**
   - `.vscode/launch.json` 설정
   - F5로 디버깅 시작

### 도움 요청 시 포함할 정보

- 오류 메시지 전문
- 실행한 명령어
- Node.js/npm 버전
- OS 및 버전
- 관련 코드 스니펫

### 유용한 링크

- [Vite 공식 문서](https://vitejs.dev/)
- [React 공식 문서](https://react.dev/)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Express 공식 문서](https://expressjs.com/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)

---

## 문제가 해결되지 않았나요?

GitHub Issues에 질문을 올려주세요:
1. Issue 생성
2. 문제 상황 설명
3. 시도한 해결 방법 기재
4. 오류 로그 첨부
