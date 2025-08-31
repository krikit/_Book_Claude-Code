# CLAUDE.md

이 파일은 CookShare MVP 프로젝트에서 Claude Code와 함께 작업할 때 참고할 지침을 제공합니다.

## 프로젝트 개요

**CookShare**는 사용자들이 레시피를 공유하고 발견할 수 있는 커뮤니티 플랫폼의 MVP입니다.

> 📖 **상세 정보**: docs/PLANNING.md에서 전체 서비스 기획과 요구사항을 확인하세요.

### 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (프로덕션 환경 적용 완료)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (구현 완료)
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Testing**: Playwright (E2E)

> 💡 **의사결정 배경**: docs/ADR.md에서 각 기술 선택의 상세한 이유와 대안 검토 내용을 확인하세요.

## 개발 환경 설정

### 필수 명령어
```bash
# 개발 서버 시작
npm run dev

# 빌드 및 타입 체크
npm run build
npm run type-check

# 린팅
npm run lint

# 데이터베이스 관리
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npx prisma studio

# 테스트
npm run test
npm run test:e2e
```

## 코딩 가이드라인

### 파일 구조 컨벤션

**MVP 개발 단계 (현재)**:
- `src/app/` - Next.js App Router 페이지
- `src/components/` - 재사용 가능한 컴포넌트
- `src/lib/` - 유틸리티 함수 및 설정
- `src/types/` - TypeScript 타입 정의

> 📁 **구조 선택 가이드**: 
> - **MVP 개발**: 위의 단일 Next.js 프로젝트 구조 사용
> - **Production 확장**: docs/STRUCTURE.md의 Monorepo 구조로 마이그레이션
> - 현재는 MVP 구조를 따르고, 향후 확장 시 docs/STRUCTURE.md 참고

### 네이밍 컨벤션
- **컴포넌트**: PascalCase (`RecipeCard.tsx`)
- **파일명**: kebab-case (`recipe-form.tsx`)
- **함수/변수**: camelCase (`getUserRecipes`)
- **상수**: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)

### 코드 스타일
- TypeScript 엄격 모드 사용
- ESLint + Prettier 설정 준수
- 컴포넌트는 함수형 컴포넌트 사용
- React Hook Form을 활용한 폼 처리
- Zod를 통한 스키마 검증

## 데이터베이스 작업

### Prisma 작업 플로우
1. `prisma/schema.prisma` 스키마 수정
2. `npx prisma migrate dev --name <migration-name>` 마이그레이션 생성
3. `npx prisma generate` 클라이언트 재생성

### 주요 모델
- **User**: 사용자 정보
- **Recipe**: 레시피 기본 정보
- **Ingredient**: 레시피 재료
- **Step**: 조리 단계
- **Like**: 좋아요 기록
- **Comment**: 댓글

## API 개발 가이드

### API Routes 구조
```
src/app/api/
├── auth/          # 인증 관련
├── recipes/       # 레시피 CRUD
├── upload/        # 파일 업로드
└── users/         # 사용자 관리
```

### API 응답 형식
```typescript
// 성공 응답
{
  success: true,
  data: T,
  message?: string
}

// 에러 응답
{
  success: false,
  error: string,
  details?: any
}
```

## 컴포넌트 개발

### shadcn/ui 사용
- 필요한 컴포넌트는 `npx shadcn-ui@latest add <component>` 로 추가
- 커스터마이징이 필요한 경우 `src/components/ui/` 에서 수정

### 폼 컴포넌트 패턴
```typescript
// React Hook Form + Zod 패턴
const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional()
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema)
});
```

## 테스트 가이드

### 테스트 구조
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **API Tests**: Supertest

### 테스트 실행
```bash
npm run test          # 유닛 테스트
npm run test:e2e      # E2E 테스트
npm run test:coverage # 커버리지 리포트
```

## 배포 가이드

### 환경 변수
```env
# .env.local
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
UPLOAD_DIR="./public/uploads"
```

### Vercel 배포
1. GitHub 연동
2. 환경 변수 설정
3. 자동 배포 확인

## 문제 해결

### 자주 발생하는 문제
1. **Prisma 클라이언트 에러**: `npx prisma generate` 실행
2. **타입 에러**: `npm run type-check` 로 확인
3. **스타일링 이슈**: Tailwind 클래스 충돌 확인
4. **이미지 업로드**: `public/uploads` 디렉토리 존재 확인

### 개발 서버 재시작이 필요한 경우
- Prisma 스키마 변경 시
- 환경 변수 변경 시
- TypeScript 설정 변경 시

## MVP 개발 현황

### ✅ Phase 1: 기본 설정 (완료)
- [x] 프로젝트 초기화 (Next.js 14, TypeScript, Tailwind)
- [x] 데이터베이스 스키마 (Prisma + PostgreSQL)
- [x] 인증 시스템 (NextAuth.js)

### ✅ Phase 2: 핵심 기능 (완료)
- [x] 레시피 CRUD (생성, 조회, 수정, 삭제)
- [x] 검색 기능 (제목, 설명 기반)
- [x] 이미지 업로드 (파일, 클립보드, URL)
- [x] 내 레시피 관리 페이지

### 🔄 Phase 3: 사용자 상호작용 (진행중/예정)
- [ ] 좋아요 기능
- [ ] 댓글 시스템

### 📋 Phase 4: 완성도 향상 (예정)
- [x] UI/UX 개선 (네비게이션 디자인 완료)
- [ ] 성능 최적화
- [ ] 배포

> 📅 **상세 일정**: docs/MVP.md와 docs/WBS.md에서 일별 작업 계획과 상세 태스크를 확인하세요.  
> ⚠️ **위험 관리**: docs/RISK.md에서 각 단계별 위험 요소와 대응 방안을 확인하세요.

## 코드 리뷰 체크리스트

- [ ] TypeScript 타입 안전성 확보
- [ ] 에러 핸들링 적절성
- [ ] 성능 최적화 고려
- [ ] 접근성 (a11y) 준수
- [ ] 반응형 디자인 적용
- [ ] 테스트 코드 작성

## 프로젝트 문서 참조

이 프로젝트의 상세한 기획 및 설계 문서들을 참고하세요:

### 📋 기획 문서
- **docs/PLANNING.md**: 서비스 전체 기획, 기능 명세, 기술 스택 상세 정보 (최종 목표)
- **docs/MVP.md**: 10일 개발 가능한 최소 기능 명세 및 개발 일정
- **docs/MVP_USER_STORIES.md**: 사용자 스토리 기반 요구사항 정의

### 🏗️ 설계 문서  
- **docs/STRUCTURE.md**: 전체 프로젝트 구조 설계 (향후 Monorepo 확장 시 참조)
- **docs/ADR.md**: 주요 기술 선택에 대한 의사결정 기록 (Architecture Decision Records)
- **docs/ARCHITECTURE.md**: 시스템 아키텍처 및 구성 요소 설명

> 💡 **개발 단계별 참조 가이드**:
> - **현재 (MVP 개발)**: docs/MVP.md 중심, CLAUDE.md의 MVP 구조 사용
> - **향후 (Production 확장)**: docs/PLANNING.md + docs/STRUCTURE.md 기반 마이그레이션

### 📊 관리 문서
- **docs/WBS.md**: 작업 분해 구조, 상세 일정, 깃헙 이슈 연동 정보
- **docs/RISK.md**: 프로젝트 위험 요소 분석 및 대응 방안
- **docs/GETTING_STARTED.md**: 프로젝트 시작 가이드

### 🔧 개발 도구
- **create-github-issues.js**: GitHub 이슈 자동 생성 스크립트 (WBS 기반)

### 💡 GitHub 이슈 생성 방법
```bash
# GitHub 이슈 자동 생성 (GitHub Personal Access Token 필요)
node create-github-issues.js

# 프로젝트 설정 후 WBS의 모든 태스크가 GitHub 이슈로 자동 생성됩니다
```

## 기술 참고 자료

- [Next.js 14 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [NextAuth.js 가이드](https://next-auth.js.org)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)
- [React Hook Form 문서](https://react-hook-form.com)
- [Zod 문서](https://zod.dev)

---

**프로젝트**: CookShare MVP  
**개발 기간**: 10일 (80시간)  
**목표**: 실행 가능한 레시피 공유 플랫폼 구축