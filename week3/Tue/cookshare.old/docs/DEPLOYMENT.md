# 🚀 CookShare MVP 배포 가이드

이 문서는 CookShare MVP 프로젝트의 완전한 배포 가이드를 제공합니다.

## 📋 목차

1. [배포 환경 개요](#배포-환경-개요)
2. [사전 요구사항](#사전-요구사항)
3. [환경 변수 설정](#환경-변수-설정)
4. [개발 환경 배포](#개발-환경-배포)
5. [스테이징 환경 배포](#스테이징-환경-배포)
6. [프로덕션 환경 배포](#프로덕션-환경-배포)
7. [CI/CD 파이프라인](#cicd-파이프라인)
8. [사전 체크리스트](#사전-체크리스트)
9. [배포 후 검증](#배포-후-검증)
10. [롤백 방법](#롤백-방법)
11. [모니터링 및 로그](#모니터링-및-로그)
12. [트러블슈팅](#트러블슈팅)

## 📊 배포 환경 개요

### 환경별 특성

| 환경 | 목적 | 플랫폼 | 데이터베이스 | 자동 배포 |
|------|------|---------|-------------|-----------|
| **Development** | 로컬 개발 | Docker Compose | PostgreSQL | ❌ |
| **Staging** | 테스트/검증 | GitHub Actions | PostgreSQL | ✅ |
| **Production** | 실서비스 | Vercel + GitHub Actions | PostgreSQL | ✅ |
| **Local K8s** | 로컬 테스트 | Kubernetes | PostgreSQL | ❌ |

## 🔧 사전 요구사항

### 공통 요구사항
- Node.js 18+ 
- npm 또는 pnpm
- Git
- 환경 변수 설정

### 개발 환경
- Docker & Docker Compose
- PostgreSQL (선택적)

### 스테이징/프로덕션
- GitHub 계정 및 리포지토리
- Vercel 계정
- PostgreSQL 데이터베이스 (외부)

### 로컬 K8s
- Kubernetes 클러스터 (minikube, kind, 등)
- kubectl
- Ingress Controller (nginx)

## 🔐 환경 변수 설정

### 개발 환경 (.env.local)
```bash
# Database
DATABASE_URL="postgresql://cookshare:cookshare123@localhost:5432/cookshare_dev?schema=public"
# 또는 SQLite (Docker 없이)
# DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-this"

# Upload
UPLOAD_DIR="./public/uploads"

# Optional: Redis Cache
# REDIS_URL="redis://localhost:6379"
```

### 스테이징 환경
```bash
# Database (외부 PostgreSQL)
DATABASE_URL="postgresql://user:password@staging-db-host:5432/cookshare_staging?schema=public"

# NextAuth.js
NEXTAUTH_URL="https://cookshare-staging.vercel.app"
NEXTAUTH_SECRET="staging-super-secret-key"

# Upload (Vercel에서 제공)
UPLOAD_DIR="./public/uploads"
```

### 프로덕션 환경
```bash
# Database (외부 PostgreSQL - 예: Neon, Supabase, AWS RDS)
DATABASE_URL="postgresql://user:password@prod-db-host:5432/cookshare_prod?schema=public"

# NextAuth.js
NEXTAUTH_URL="https://cookshare.vercel.app"
NEXTAUTH_SECRET="production-super-secret-key-very-secure"

# Upload
UPLOAD_DIR="./public/uploads"

# Optional: Monitoring
# SENTRY_DSN="https://..."
# ANALYTICS_ID="GA-XXXXXXXX"
```

## 🏠 개발 환경 배포

### 방법 1: Docker Compose (권장)

#### 1. 기본 서비스 시작
```bash
# 전체 서비스 시작 (앱 + 데이터베이스)
docker-compose up -d

# 로그 확인
docker-compose logs -f app
```

#### 2. 개발 도구 포함 시작
```bash
# Prisma Studio와 pgAdmin 포함
docker-compose --profile tools up -d

# 캐시 서버(Redis) 포함
docker-compose --profile tools --profile cache up -d
```

#### 3. 접속 확인
- **메인 애플리케이션**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (tools 프로필)
- **pgAdmin**: http://localhost:5050 (tools 프로필)
  - Email: admin@cookshare.com
  - Password: admin123

### 방법 2: 로컬 실행

#### 1. 데이터베이스 설정
```bash
# PostgreSQL 시작 (별도 설치 필요)
# 또는 Docker로 PostgreSQL만 실행
docker run --name postgres \
  -e POSTGRES_USER=cookshare \
  -e POSTGRES_PASSWORD=cookshare123 \
  -e POSTGRES_DB=cookshare_dev \
  -p 5432:5432 -d postgres:15-alpine
```

#### 2. 애플리케이션 실행
```bash
# 의존성 설치
npm install

# Prisma 설정
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 개발 서버 시작
npm run dev
```

### 방법 3: 로컬 Kubernetes

#### 1. K8s 배포 실행
```bash
cd k8s
chmod +x deploy.sh
./deploy.sh
```

#### 2. 접속 방법
```bash
# Option 1: Ingress (nginx ingress controller 필요)
echo "127.0.0.1 cookshare.local" | sudo tee -a /etc/hosts
# 브라우저: http://cookshare.local

# Option 2: NodePort 직접 접근
# 브라우저: http://localhost:30000

# 상태 확인
kubectl get all -n cookshare-local
kubectl logs -f deployment/cookshare-app -n cookshare-local
```

#### 3. 정리
```bash
kubectl delete namespace cookshare-local
```

## 🌟 스테이징 환경 배포

### 자동 배포 (CI/CD)

스테이징 배포는 GitHub Actions를 통해 자동으로 실행됩니다.

#### 트리거 조건
- `main` 브랜치에 푸시 시 자동 실행
- 수동 실행 (workflow_dispatch)

#### 배포 플로우
1. **보안 검사**: 의존성 감사, 코드 품질 체크
2. **빌드 & 테스트**: 단위 테스트, E2E 테스트 실행  
3. **Docker 이미지 빌드**: GHCR에 푸시
4. **스테이징 배포**: 검증 후 스테이징 환경 배포

### 수동 배포

#### 1. GitHub Secrets 설정
```bash
# Vercel 설정
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>

# Database
DATABASE_URL=<staging-database-url>

# NextAuth
NEXTAUTH_SECRET=<staging-secret>
```

#### 2. 수동 트리거
1. GitHub Actions 탭으로 이동
2. "🚀 Deploy to Production" 워크플로 선택  
3. "Run workflow" 클릭
4. Environment: `staging` 선택
5. 배포 실행

## 🎯 프로덕션 환경 배포

### 자동 배포 (권장)

#### 배포 프로세스
1. **사전 검사**
   - 보안 감사 (`npm audit`)
   - 코드 품질 검사 (`npm run lint`)
   - 테스트 실행 (`npm run test`)

2. **빌드 단계**  
   - 애플리케이션 빌드 (`npm run build`)
   - Docker 이미지 생성 및 GHCR 푸시
   - 빌드 캐시 저장

3. **배포 단계**
   - 스테이징 환경 검증
   - Vercel 프로덕션 배포
   - 헬스 체크 실행

4. **사후 작업**
   - 릴리즈 태그 생성
   - Slack 알림 (설정 시)
   - 배포 메트릭 수집

### 배포 사전 체크리스트

#### 코드 품질
- [ ] 모든 테스트 통과 확인
- [ ] ESLint/Prettier 규칙 준수
- [ ] TypeScript 타입 에러 없음
- [ ] 보안 취약점 없음 (`npm audit`)

#### 데이터베이스
- [ ] 마이그레이션 파일 검토
- [ ] 프로덕션 DB 백업 완료
- [ ] 마이그레이션 테스트 (스테이징)

#### 환경 설정
- [ ] 환경 변수 확인 (Vercel)
- [ ] API 키 및 시크릿 검증
- [ ] 도메인 설정 확인

#### 성능 및 모니터링
- [ ] 이미지 최적화 확인
- [ ] 번들 사이즈 검토
- [ ] 모니터링 도구 설정

### 수동 배포

#### 1. 사전 체크
```bash
# 코드 품질 검사
npm run lint
npm run type-check
npm run test
npm audit

# 빌드 테스트
npm run build
```

#### 2. 환경 변수 설정 (Vercel)
```bash
# Vercel CLI 사용
npx vercel env add DATABASE_URL production
npx vercel env add NEXTAUTH_SECRET production
npx vercel env add NEXTAUTH_URL production
```

#### 3. 수동 배포 실행
```bash
# Vercel 배포
npx vercel --prod

# 또는 GitHub Actions 수동 트리거
# GitHub UI에서 workflow_dispatch로 실행
```

## 🔄 CI/CD 파이프라인

### PR 체크 파이프라인 (.github/workflows/pr-check.yml)

```mermaid
graph LR
    A[PR 생성/업데이트] --> B[변경 사항 감지]
    B --> C[코드 변경 있음?]
    C -->|Yes| D[Lint & Format]
    C -->|Yes| E[Type Check]  
    C -->|Yes| F[Unit Tests]
    C -->|Yes| G[Build Test]
    C -->|Yes| H[E2E Tests]
    C -->|Yes| I[Docker Build]
    C -->|Yes| J[Security Scan]
    D --> K[PR Summary]
    E --> K
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K
```

### 배포 파이프라인 (.github/workflows/deploy.yml)

```mermaid
graph TD
    A[Push to main/수동 트리거] --> B[Security Gate]
    B --> C[Build & Test]
    C --> D[Deploy Staging]
    D --> E[Deploy Production]
    E --> F[Post Deploy Tasks]
    
    B --> G[보안 감사]
    B --> H[코드 품질 검사]
    
    C --> I[테스트 실행]
    C --> J[Docker 이미지 빌드]
    
    E --> K[Vercel 배포]
    E --> L[헬스 체크]
    
    F --> M[릴리즈 태그 생성]
    F --> N[Slack 알림]
```

### GitHub Secrets 설정

#### Vercel 관련
```
VERCEL_TOKEN=<vercel-deployment-token>
VERCEL_ORG_ID=<organization-id>
VERCEL_PROJECT_ID=<project-id>
```

#### 데이터베이스
```
DATABASE_URL=<production-postgresql-url>
```

#### 인증
```
NEXTAUTH_SECRET=<production-auth-secret>
```

#### 모니터링 (선택적)
```
CODECOV_TOKEN=<codecov-token>
SLACK_WEBHOOK=<slack-webhook-url>
```

## ✅ 사전 체크리스트

### 배포 전 필수 검사

#### 코드 준비
```bash
# 1. 코드 품질 검사
npm run lint                    # ESLint 검사
npm run type-check             # TypeScript 검사
npm run test                   # 단위 테스트
npm run test:e2e               # E2E 테스트

# 2. 보안 검사
npm audit --audit-level high   # 보안 취약점 검사

# 3. 빌드 테스트
npm run build                  # 프로덕션 빌드

# 4. 데이터베이스 검사
npx prisma validate           # 스키마 검증
npx prisma generate           # 클라이언트 생성
```

#### 환경 설정 확인
```bash
# 환경 변수 확인 스크립트 예시
node -e "
const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
requiredVars.forEach(v => {
  if (!process.env[v]) {
    console.error(\`❌ Missing: \${v}\`);
    process.exit(1);
  } else {
    console.log(\`✅ Found: \${v}\`);
  }
});
"
```

### 프로덕션 배포 전 추가 검사

#### 데이터베이스 준비
- [ ] 프로덕션 DB 백업 완료
- [ ] 마이그레이션 파일 스테이징에서 테스트
- [ ] 인덱스 성능 검토  
- [ ] 데이터 정합성 검증

#### 성능 및 보안
- [ ] 이미지 최적화 (`next/image` 활용)
- [ ] 번들 분석 (`npm run analyze`)
- [ ] 보안 헤더 설정 확인
- [ ] HTTPS 인증서 유효성

#### 모니터링 준비
- [ ] 로그 수집 설정
- [ ] 에러 추적 도구 (Sentry 등)
- [ ] 성능 모니터링 (Vercel Analytics)
- [ ] 알림 채널 설정

## 🔍 배포 후 검증

### 자동 검증 (CI/CD)

#### 헬스 체크
```bash
# GitHub Actions에서 자동 실행
curl -f https://cookshare.vercel.app/api/health || exit 1

# 커스텀 헬스 체크 API 구현 예시 (src/app/api/health/route.ts)
export async function GET() {
  // DB 연결 확인
  // 필수 서비스 상태 확인
  return Response.json({ status: 'OK', timestamp: new Date() });
}
```

### 수동 검증 체크리스트

#### 기능 테스트
- [ ] 메인 페이지 로딩 확인
- [ ] 사용자 로그인/회원가입
- [ ] 레시피 생성/조회/수정/삭제
- [ ] 이미지 업로드
- [ ] 검색 기능
- [ ] 반응형 디자인 (모바일/태블릿)

#### 성능 확인
- [ ] 페이지 로딩 속도 (< 3초)
- [ ] Core Web Vitals 점수
- [ ] 이미지 최적화 확인
- [ ] API 응답 시간 (< 1초)

#### 보안 확인
- [ ] HTTPS 강제 리다이렉트
- [ ] 보안 헤더 설정
- [ ] 인증 토큰 만료 처리
- [ ] 파일 업로드 검증

### 모니터링 대시보드

#### Vercel 대시보드
- 배포 상태 및 로그
- 성능 메트릭
- 에러율 모니터링

#### 커스텀 모니터링
```bash
# 간단한 업타임 체크 스크립트
#!/bin/bash
URL="https://cookshare.vercel.app"
while true; do
  if curl -f $URL > /dev/null 2>&1; then
    echo "✅ $(date): Site is UP"
  else
    echo "❌ $(date): Site is DOWN"
    # 알림 발송 (Slack, email 등)
  fi
  sleep 300  # 5분 간격
done
```

## 🔄 롤백 방법

### 1. Vercel 롤백 (즉시)

#### 웹 대시보드
1. Vercel 대시보드 접속
2. 프로젝트 → Deployments 탭
3. 이전 안정 버전 선택
4. "Promote to Production" 클릭

#### CLI 롤백
```bash
# Vercel CLI 설치
npm i -g vercel

# 이전 배포 목록 확인
vercel ls

# 특정 배포로 롤백
vercel promote <deployment-url> --scope=<team-slug>
```

### 2. GitHub Actions 롤백

#### 자동 롤백 (실패 시)
GitHub Actions 워크플로에 롤백 job이 포함되어 있습니다:

```yaml
rollback:
  name: 🔄 Rollback (Manual)  
  runs-on: ubuntu-latest
  if: failure() && github.event_name == 'workflow_dispatch'
  steps:
    - name: 🔍 Find previous release
      run: |
        PREV_TAG=$(git tag --sort=-version:refname | head -2 | tail -1)
        echo "Previous release: $PREV_TAG"
    - name: 🔄 Rollback deployment  
      run: |
        # Vercel API 호출로 이전 버전 활성화
```

#### 수동 롤백 트리거
1. GitHub Actions → Deploy workflow
2. "Run workflow" 선택
3. 실패한 배포가 있을 경우 롤백 job 자동 실행

### 3. 데이터베이스 롤백

#### 마이그레이션 롤백
```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 특정 마이그레이션으로 롤백 (주의!)
# 프로덕션에서는 신중히 실행
npx prisma migrate reset --force

# 백업에서 복원 (PostgreSQL 예시)
pg_restore -d cookshare_prod backup_before_deploy.sql
```

#### 데이터베이스 백업 전략
```bash
# 배포 전 자동 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backups/backup_${DATE}.sql"
echo "Backup created: backup_${DATE}.sql"
```

### 4. 긴급 롤백 절차

#### 심각한 버그 발견 시
1. **즉시 조치** (< 5분)
   ```bash
   # Vercel 대시보드에서 이전 버전으로 즉시 롤백
   vercel promote <previous-deployment-id>
   ```

2. **원인 파악** (< 30분)
   - 에러 로그 확인
   - 버그 재현 및 분석
   - 영향 범위 파악

3. **수정 및 재배포** (< 2시간)
   - 핫픽스 브랜치 생성
   - 버그 수정 및 테스트
   - 긴급 배포 실행

### 5. 롤백 검증

#### 롤백 후 체크리스트
- [ ] 애플리케이션 정상 동작 확인
- [ ] 데이터 정합성 검증
- [ ] 사용자 기능 테스트
- [ ] 모니터링 지표 정상화 확인
- [ ] 팀 내 상황 공유

## 📊 모니터링 및 로그

### 로그 수집 전략

#### 애플리케이션 로그
```typescript
// src/lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
    // 프로덕션에서는 Sentry 등으로 전송
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta);
  }
};
```

#### Next.js 로그 설정
```javascript
// next.config.js
module.exports = {
  experimental: {
    logging: {
      level: 'info',
      fullUrl: true
    }
  },
  // 프로덕션에서 상세 로그 비활성화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};
```

### 모니터링 도구

#### Vercel Analytics
```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### 성능 모니터링
```typescript
// src/lib/monitoring.ts
export function trackPerformance(name: string, fn: Function) {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  if (duration > 1000) { // 1초 초과 시 로그
    logger.warn(`Slow operation: ${name} took ${duration}ms`);
  }
  
  return result;
}
```

### 주요 모니터링 지표

#### 서비스 가용성
- **업타임**: > 99.9%
- **응답 시간**: < 2초 (평균)
- **에러율**: < 1%

#### 성능 지표
- **Core Web Vitals**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms  
  - CLS (Cumulative Layout Shift): < 0.1

#### 비즈니스 지표
- 일일 활성 사용자 (DAU)
- 레시피 생성/조회 수
- 이미지 업로드 성공률

### 알림 설정

#### Vercel 알림
- 배포 실패 시 이메일 알림
- 성능 저하 감지 시 알림

#### 커스텀 알림 (Slack)
```javascript
// 에러 발생 시 Slack 알림
async function sendSlackAlert(error, context) {
  if (process.env.NODE_ENV === 'production') {
    await fetch(process.env.SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 CookShare Error: ${error.message}`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'Context', value: context, short: true },
            { title: 'Timestamp', value: new Date().toISOString(), short: true }
          ]
        }]
      })
    });
  }
}
```

## 🔧 트러블슈팅

### 일반적인 배포 문제

#### 1. 빌드 실패

**증상**: `npm run build` 실패
```bash
Error: Page "/api/recipes" has an invalid export
```

**해결책**:
```bash
# 타입스크립트 에러 확인
npm run type-check

# 라우트 핸들러 확인
# app/api/routes.ts에서 export 구문 검토
export async function GET() { ... }  # 올바름
export const GET = async () => { ... } # 가능하지만 권장하지 않음
```

#### 2. 데이터베이스 연결 실패

**증상**: `PrismaClientInitializationError`

**해결책**:
```bash
# 1. 환경 변수 확인
echo $DATABASE_URL

# 2. 네트워크 연결 테스트
pg_isready -h your-db-host -p 5432

# 3. Prisma 클라이언트 재생성
npx prisma generate

# 4. 연결 테스트
npx prisma db push --preview-feature
```

#### 3. 환경 변수 누락

**증상**: `Error: NEXTAUTH_SECRET is not defined`

**해결책**:
```bash
# Vercel에서 환경 변수 설정
vercel env add NEXTAUTH_SECRET production

# 또는 대시보드에서 설정
# Settings → Environment Variables
```

### Docker 관련 문제

#### 1. 컨테이너 시작 실패

**증상**: 컨테이너가 계속 재시작됨

**해결책**:
```bash
# 로그 확인
docker-compose logs app

# 일반적인 원인들:
# - 데이터베이스 연결 실패
# - 포트 충돌 (3000번 포트 이미 사용 중)
# - 환경 변수 누락

# 포트 변경
docker-compose.yml에서:
ports:
  - "3001:3000"  # 외부 포트 변경
```

#### 2. 볼륨 마운트 문제

**증상**: 파일 업로드가 저장되지 않음

**해결책**:
```bash
# 볼륨 상태 확인
docker volume ls
docker volume inspect cookshare_upload_data

# 권한 문제 해결
docker-compose exec app chown -R nextjs:nodejs /app/public/uploads
```

### K8s 배포 문제

#### 1. Pod 시작 실패

**증상**: Pod가 `Pending` 또는 `CrashLoopBackOff` 상태

**해결책**:
```bash
# Pod 상태 상세 확인
kubectl describe pod -l app=cookshare-app -n cookshare-local

# 로그 확인  
kubectl logs -f deployment/cookshare-app -n cookshare-local

# 일반적인 해결책:
# - 이미지 빌드 및 태그 확인
# - 리소스 제한 조정
# - PVC 마운트 문제 해결
```

#### 2. Ingress 접근 불가

**증상**: `cookshare.local` 접근 안됨

**해결책**:
```bash
# Ingress Controller 설치 확인
kubectl get pods -n ingress-nginx

# /etc/hosts 설정 확인
cat /etc/hosts | grep cookshare

# NodePort로 직접 접근 테스트
kubectl get svc cookshare-app -n cookshare-local
```

### 성능 최적화

#### 1. 느린 페이지 로딩

**진단**:
```bash
# Next.js 번들 분석
npm run analyze

# Core Web Vitals 확인
# Chrome DevTools → Lighthouse
```

**최적화**:
```typescript
// 1. 이미지 최적화
import Image from 'next/image';
<Image 
  src="/recipe.jpg" 
  width={500} 
  height={300}
  alt="Recipe"
  priority  // LCP 개선
/>

// 2. 컴포넌트 레이지 로딩
const RecipeModal = dynamic(() => import('./RecipeModal'), {
  loading: () => <Spinner />
});

// 3. API 라우트 캐싱
export async function GET() {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
```

#### 2. 데이터베이스 성능

**진단**:
```sql
-- 느린 쿼리 확인 (PostgreSQL)
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

**최적화**:
```prisma
// Prisma 스키마에 인덱스 추가
model Recipe {
  id          String @id @default(cuid())
  title       String
  description String
  authorId    String
  createdAt   DateTime @default(now())
  
  @@index([authorId])
  @@index([createdAt])
  @@index([title])
}
```

## 📞 지원 및 문의

### 문제 신고
- **GitHub Issues**: 버그 리포트 및 기능 요청
- **이메일**: tech-support@cookshare.com
- **Slack**: #dev-support 채널

### 응급 연락처
- **인프라 장애**: on-call-engineer@company.com
- **보안 이슈**: security@company.com

---

## 📝 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0.0 | 2024-XX-XX | 초기 배포 가이드 작성 | Claude Code |

---

**📚 관련 문서**
- [프로젝트 구조 가이드](./STRUCTURE.md)
- [개발 환경 설정](./GETTING_STARTED.md)
- [API 문서](./API.md)
- [보안 가이드](./SECURITY.md)