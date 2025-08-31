# Architecture Decision Record (ADR)

## CookShare MVP - 아키텍처 결정 기록

> 작성일: 2024-08-24
> 상태: 승인됨 (Accepted)
> 결정자: Development Team

---

## 개요

CookShare는 사용자들이 레시피를 공유하고 발견할 수 있는 커뮤니티 플랫폼입니다. 이 ADR은 MVP 개발을 위한 기술 스택 선택과 아키텍처 패턴 결정에 대한 배경, 고려사항, 그리고 예상되는 결과를 문서화합니다.

---

## 1. 전체 아키텍처 패턴

### 결정: Full-Stack Next.js 애플리케이션

**선택된 아키텍처**: Next.js 14 App Router 기반 단일 애플리케이션

**결정 이유**:
- **빠른 MVP 개발**: 프론트엔드와 백엔드를 하나의 프레임워크로 통합
- **개발자 생산성**: TypeScript 전체 스택에서 일관된 개발 경험
- **배포 간소화**: 단일 애플리케이션으로 배포 복잡성 최소화
- **SEO 최적화**: 서버사이드 렌더링 기본 지원

**고려했던 대안**:

1. **분리된 Frontend/Backend 아키텍처**
   - 장점: 확장성, 기술 스택 유연성
   - 단점: 개발 복잡성 증가, MVP 개발 속도 저하
   - 거부 이유: MVP 단계에서 불필요한 복잡성

2. **Serverless Functions (Vercel Functions + Static Frontend)**
   - 장점: 자동 스케일링, 비용 효율성
   - 단점: 복잡한 비즈니스 로직 처리 제한
   - 거부 이유: 레시피 관리의 복잡한 관계형 데이터 처리에 부적합

3. **Traditional LAMP/MEAN Stack**
   - 장점: 성숙한 생태계, 많은 참고 자료
   - 단점: 모던 개발 경험 부족, TypeScript 지원 제한
   - 거부 이유: 현대적인 개발 경험과 생산성을 위해 배제

**예상되는 결과**:
- ✅ **MVP 개발 속도**: 2주 내 완성 가능
- ✅ **개발자 경험**: 통합된 개발 환경
- ⚠️ **확장성 제약**: 트래픽 증가 시 아키텍처 재설계 필요
- ⚠️ **기술 종속성**: Next.js 생태계에 의존

---

## 2. Frontend 기술 스택

### 2.1 UI 프레임워크: React 18 + Next.js 14

**결정 이유**:
- **App Router**: 최신 Next.js 라우팅 시스템으로 향후 호환성 보장
- **Server Components**: 성능 최적화와 SEO 개선
- **Built-in 최적화**: 이미지, 폰트, 번들링 자동 최적화

**고려했던 대안**:
- **Vue.js + Nuxt.js**: 학습 곡선은 낮지만 생태계 규모 부족
- **SvelteKit**: 성능은 우수하지만 컴포넌트 라이브러리 부족
- **React with Vite**: 빠른 개발 경험이지만 SSR 설정 복잡

**트레이드오프**:
- ✅ 풍부한 생태계와 컴포넌트 라이브러리
- ⚠️ 번들 크기와 초기 로딩 시간 (RSC로 완화)

### 2.2 스타일링: Tailwind CSS + shadcn/ui

**결정 이유**:
- **개발 속도**: 유틸리티 클래스로 빠른 스타일링
- **일관성**: 디자인 시스템 기반 컴포넌트
- **접근성**: shadcn/ui의 내장 접근성 지원
- **커스터마이징**: 필요시 컴포넌트 수정 가능

**고려했던 대안**:

1. **Styled Components**
   - 장점: CSS-in-JS, 동적 스타일링
   - 단점: 런타임 오버헤드, 번들 크기 증가
   - 거부 이유: MVP에서 성능보다 개발 속도 우선

2. **Material-UI (MUI)**
   - 장점: 완성도 높은 컴포넌트
   - 단점: 커스터마이징 복잡, 번들 크기
   - 거부 이유: 디자인 차별화 어려움

3. **CSS Modules + SCSS**
   - 장점: 전통적인 CSS 개발 방식
   - 단점: 개발 속도 저하, 일관성 부족
   - 거부 이유: MVP 개발 속도에 부적합

**예상되는 결과**:
- ✅ 빠른 UI 개발과 일관된 디자인
- ✅ 좋은 접근성 기본 지원
- ⚠️ HTML 클래스 복잡성 증가

### 2.3 상태 관리: Zustand

**결정 이유**:
- **경량성**: Redux 대비 보일러플레이트 코드 최소화
- **TypeScript 친화성**: 뛰어난 타입 추론과 안전성
- **학습 곡선**: 단순한 API로 빠른 적용 가능
- **MVP 적합성**: 복잡한 상태 관리 불필요

**고려했던 대안**:

1. **Redux Toolkit**
   - 장점: 성숙한 생태계, 강력한 DevTools
   - 단점: 복잡한 보일러플레이트, 학습 곡선
   - 거부 이유: MVP의 단순한 상태 관리에 과도함

2. **React Context + useReducer**
   - 장점: 내장 API, 추가 의존성 없음
   - 단점: 성능 이슈, 복잡한 상태 관리 어려움
   - 거부 이유: 사용자 세션, 레시피 상태 관리에 부적합

3. **Jotai/Recoil**
   - 장점: 원자적 상태 관리, 세밀한 최적화
   - 단점: 상대적으로 신생 라이브러리
   - 거부 이유: MVP에서 안정성 우선

**트레이드오프**:
- ✅ 간단한 API와 뛰어난 TypeScript 지원
- ⚠️ 복잡한 상태 로직에서는 Redux 대비 구조화 부족

---

## 3. Backend 및 데이터 레이어

### 3.1 데이터베이스: SQLite → PostgreSQL 마이그레이션 전략

**결정: 단계별 데이터베이스 전환**

**Phase 1 (MVP)**: SQLite
- **이유**: 설정 간소화, 로컬 개발 용이성
- **파일 기반**: `./dev.db`로 간단한 데이터 관리
- **제약사항**: 동시 접속 제한, 프로덕션 부적합

**Phase 2 (Production)**: PostgreSQL
- **이유**: 동시성 지원, 고급 기능, 확장성
- **Docker 통합**: 개발 환경 표준화
- **관리 도구**: pgAdmin, Prisma Studio 제공

**고려했던 대안**:

1. **MongoDB**
   - 장점: 스키마 유연성, 빠른 프로토타이핑
   - 단점: 복잡한 관계형 데이터 처리, 트랜잭션 제약
   - 거부 이유: 레시피-재료-단계의 강한 관계성에 부적합

2. **MySQL**
   - 장점: 널리 사용됨, 많은 호스팅 지원
   - 단점: JSON 지원 제한, 고급 기능 부족
   - 거부 이유: PostgreSQL 대비 기능적 이점 부족

3. **PlanetScale (MySQL)**
   - 장점: 서버리스, 브랜치 기반 스키마 관리
   - 단점: 외래키 제약 부족, 비용
   - 거부 이유: 데이터 무결성 우려

**마이그레이션 전략**:
```sql
-- Prisma schema.prisma에서 provider 전환
// SQLite (개발)
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// PostgreSQL (프로덕션)
datasource db {
  provider = "postgresql" 
  url      = env("DATABASE_URL")
}
```

**예상되는 결과**:
- ✅ MVP 단계에서 빠른 개발과 배포
- ✅ 프로덕션에서 안정적인 성능과 확장성
- ⚠️ 데이터베이스별 특화 기능 사용 제한

### 3.2 ORM: Prisma

**결정 이유**:
- **TypeScript 우선**: 타입 안전한 데이터베이스 접근
- **개발자 경험**: 뛰어난 개발 도구 (Prisma Studio)
- **마이그레이션**: 스키마 변경 관리 용이
- **Next.js 통합**: 공식 지원과 최적화

**고려했던 대안**:

1. **TypeORM**
   - 장점: 데코레이터 기반, Active Record 패턴
   - 단점: 복잡한 설정, 타입 안전성 부족
   - 거부 이유: Prisma 대비 개발자 경험 부족

2. **Sequelize**
   - 장점: 성숙한 ORM, 많은 데이터베이스 지원
   - 단점: TypeScript 지원 부족, 복잡한 API
   - 거부 이유: 현대적인 TypeScript 개발에 부적합

3. **Raw SQL + Query Builder (Kysely)**
   - 장점: 성능 최적화, 복잡한 쿼리 지원
   - 단점: 개발 복잡성, 타입 안전성 설정 복잡
   - 거부 이유: MVP 개발 속도에 부적합

**데이터베이스 스키마 설계**:
```prisma
model Recipe {
  id          String   @id @default(cuid())
  title       String
  description String?
  image       String?
  servings    Int      @default(4)
  prepTime    Int?     // minutes
  cookTime    Int?     // minutes
  difficulty  String   @default("Medium")
  category    String   @default("Main")
  published   Boolean  @default(false)
  
  // Relations
  author      User         @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId    String
  ingredients Ingredient[]
  steps       Step[]
  likes       Like[]
  comments    Comment[]
}
```

**트레이드오프**:
- ✅ 뛰어난 TypeScript 지원과 개발 도구
- ✅ 자동 마이그레이션과 스키마 관리
- ⚠️ 복잡한 쿼리 최적화에서 Raw SQL 대비 제약

---

## 4. 인증 및 보안

### 4.1 인증: NextAuth.js

**결정 이유**:
- **Next.js 통합**: 네이티브 지원과 최적화
- **다양한 Provider**: 소셜 로그인 확장 가능
- **보안 표준**: JWT, 세션 관리 기본 제공
- **TypeScript 지원**: 타입 안전한 인증 로직

**고려했던 대안**:

1. **Auth0**
   - 장점: 엔터프라이즈 기능, 관리형 서비스
   - 단점: 비용, 외부 의존성
   - 거부 이유: MVP 단계에서 과도한 기능

2. **Firebase Auth**
   - 장점: Google 생태계, 실시간 기능
   - 단점: 벤더 종속성, 데이터베이스 통합 복잡
   - 거부 이유: PostgreSQL과 중복 투자

3. **Custom JWT Implementation**
   - 장점: 완전한 제어, 경량
   - 단점: 보안 리스크, 개발 복잡성
   - 거부 이유: 보안 전문성 부족, 개발 시간 부족

**보안 설정**:
```typescript
// next-auth.config.ts
export default {
  providers: [
    CredentialsProvider({
      // Email/Password 인증
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    signUp: '/register'
  }
}
```

**예상되는 결과**:
- ✅ 빠른 인증 시스템 구축
- ✅ 확장 가능한 소셜 로그인 지원
- ⚠️ NextAuth.js 업데이트에 따른 종속성

---

## 5. 폼 처리 및 검증

### 5.1 폼 라이브러리: React Hook Form + Zod

**결정 이유**:
- **성능**: 언컨트롤드 컴포넌트로 리렌더링 최소화
- **TypeScript 통합**: Zod를 통한 런타임 + 컴파일타임 검증
- **개발자 경험**: `@hookform/resolvers`로 원활한 통합
- **번들 크기**: Formik 대비 경량

**폼 처리 패턴**:
```typescript
// 레시피 생성 폼 예시
const recipeSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  description: z.string().optional(),
  servings: z.number().min(1).max(20),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  category: z.enum(["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"]),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z.array(stepSchema).min(1)
});

const form = useForm<RecipeFormData>({
  resolver: zodResolver(recipeSchema),
  defaultValues: {
    servings: 4,
    difficulty: "Medium",
    category: "Main"
  }
});
```

**고려했던 대안**:

1. **Formik + Yup**
   - 장점: 성숙한 생태계, 많은 예제
   - 단점: 성능 이슈 (controlled components), 큰 번들 크기
   - 거부 이유: React Hook Form 대비 성능과 DX 부족

2. **React Final Form**
   - 장점: 유연한 구독 시스템, 성능 최적화
   - 단점: 복잡한 API, TypeScript 지원 부족
   - 거부 이유: TypeScript 우선 개발에 부적합

**예상되는 결과**:
- ✅ 높은 성능과 뛰어난 사용자 경험
- ✅ 강력한 타입 안전성과 검증
- ⚠️ 복잡한 폼 로직에서 학습 곡선

---

## 6. 테스팅 전략

### 6.1 테스트 스택: Jest + React Testing Library + Playwright

**Unit/Integration 테스트**: Jest + React Testing Library
- **이유**: React 생태계 표준, 뛰어난 Next.js 통합
- **컴포넌트 테스트**: 사용자 중심 테스트 작성
- **API 테스트**: Supertest 통합

**E2E 테스트**: Playwright
- **이유**: 크로스 브라우저 지원, 빠른 실행 속도
- **시나리오**: 핵심 사용자 플로우 검증
- **CI/CD 통합**: GitHub Actions 지원

**테스트 구조**:
```
tests/
├── unit/           # 컴포넌트, 유틸리티 단위 테스트
├── integration/    # API, 데이터베이스 통합 테스트  
├── e2e/           # 사용자 플로우 E2E 테스트
└── fixtures/      # 테스트 데이터 및 목업
```

**고려했던 대안**:
- **Cypress**: 개발자 경험은 좋지만 실행 속도가 느림
- **Vitest**: 빠른 실행이지만 Next.js 통합 성숙도 부족

**예상되는 결과**:
- ✅ 안정적인 코드 품질과 리팩토링 안전성
- ⚠️ 테스트 작성 초기 투자 시간 필요

---

## 7. 배포 및 인프라

### 7.1 호스팅: Vercel

**결정 이유**:
- **Next.js 네이티브**: 최적화된 성능과 기능 지원
- **배포 자동화**: Git 연동 자동 배포
- **Edge Functions**: 전 세계 CDN 지원
- **개발자 경험**: 프리뷰 배포, 분석 도구

**인프라 구성**:
- **Frontend/Backend**: Vercel (Edge Runtime)
- **Database**: 
  - 개발: SQLite (로컬)
  - 스테이징: PostgreSQL (Neon/Supabase)
  - 프로덕션: PostgreSQL (AWS RDS/Neon)
- **파일 저장**: Vercel Blob / Cloudinary
- **모니터링**: Vercel Analytics

**고려했던 대안**:

1. **AWS (ECS/Lambda)**
   - 장점: 완전한 제어, 확장성
   - 단점: 설정 복잡, 관리 부담
   - 거부 이유: MVP에서 불필요한 복잡성

2. **Netlify**
   - 장점: 정적 사이트에 최적화
   - 단점: 서버리스 함수 제한, Next.js 지원 부족
   - 거부 이유: Full-stack 애플리케이션에 부적합

3. **Railway/Render**
   - 장점: 간단한 배포, 저렴한 비용
   - 단점: 성능, 확장성 제약
   - 거부 이유: 프로덕션 안정성 우려

### 7.2 개발환경: Docker

**결정 이유**:
- **환경 일치**: 개발/스테이징/프로덕션 환경 통일
- **의존성 관리**: PostgreSQL, Redis 등 서비스 통합
- **팀 협업**: 일관된 개발 환경 제공

**Docker 구성**:
```yaml
services:
  app:
    build: 
      target: dev
    ports: ["3000:3000"]
    volumes: [".:/app", "/app/node_modules"]
    
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: cookshare_dev
    
  prisma-studio:
    command: npx prisma studio
    ports: ["5555:5555"]
    
  redis:
    image: redis:7-alpine
    profiles: ["cache"]
```

**예상되는 결과**:
- ✅ 일관된 개발 환경과 쉬운 온보딩
- ✅ 프로덕션 환경과의 패리티
- ⚠️ 로컬 개발 리소스 사용량 증가

---

## 8. 성능 최적화 전략

### 8.1 Next.js 최적화 기능 활용

**Image Optimization**:
```jsx
import Image from 'next/image'

<Image
  src="/recipes/recipe-1.jpg"
  alt="Recipe"
  width={400}
  height={300}
  priority={isAboveTheFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**Font Optimization**:
```jsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
```

**Code Splitting**:
```jsx
import dynamic from 'next/dynamic'

const RecipeEditor = dynamic(() => import('./RecipeEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false
})
```

### 8.2 데이터베이스 최적화

**인덱싱 전략**:
```sql
-- 자주 조회되는 필드에 인덱스 추가
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_author_published ON recipes(author_id, published);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
```

**쿼리 최적화**:
```typescript
// N+1 문제 해결을 위한 include 사용
const recipes = await prisma.recipe.findMany({
  include: {
    author: { select: { name: true, image: true } },
    ingredients: true,
    _count: { select: { likes: true, comments: true } }
  }
})
```

**예상되는 성능 결과**:
- ✅ LCP < 2.5초, FID < 100ms 목표
- ✅ 이미지 lazy loading으로 초기 로드 최적화
- ⚠️ 복잡한 레시피 목록에서 추가 최적화 필요

---

## 9. 확장성 및 미래 고려사항

### 9.1 단계별 확장 계획

**Phase 1 (MVP - 현재)**:
- 단일 Next.js 애플리케이션
- SQLite 데이터베이스
- Vercel 배포

**Phase 2 (Growth)**:
- PostgreSQL 마이그레이션
- Redis 캐싱 도입
- CDN을 통한 이미지 최적화

**Phase 3 (Scale)**:
- 마이크로서비스 분리 고려
- Database sharding
- 검색 엔진 (Elasticsearch) 도입

### 9.2 기술 부채 관리

**예상되는 기술 부채**:
1. **Database Migration**: SQLite → PostgreSQL 데이터 이전
2. **File Upload**: 로컬 저장 → 클라우드 저장소 이전
3. **Authentication**: 소셜 로그인 확장
4. **Search**: 단순 텍스트 검색 → 전문 검색 엔진

**완화 전략**:
- Prisma 스키마 호환성 유지
- 환경변수 기반 설정 분리
- 점진적 마이그레이션 계획

---

## 10. 리스크 및 완화 방안

### 10.1 기술적 리스크

**High Risk**:
1. **Next.js App Router 안정성**
   - 위험: 새로운 기능으로 인한 버그 가능성
   - 완화: Pages Router로의 fallback 계획 수립

2. **Vercel 종속성**
   - 위험: 플랫폼 종속으로 인한 제약
   - 완화: Docker 기반 배포 옵션 준비

**Medium Risk**:
1. **데이터베이스 마이그레이션**
   - 위험: SQLite → PostgreSQL 이전 과정에서 데이터 손실
   - 완화: 단계별 마이그레이션 스크립트와 백업 전략

2. **이미지 업로드 확장성**
   - 위험: 로컬 파일 시스템 용량 제한
   - 완화: 초기부터 클라우드 저장소 설계 준비

### 10.2 비즈니스 리스크

**사용자 확장성**: 
- 위험: 트래픽 급증 시 성능 저하
- 완화: Vercel의 자동 스케일링과 CDN 활용

**데이터 보안**:
- 위험: 사용자 데이터 유출
- 완화: NextAuth.js 보안 모범사례 준수, HTTPS 강제

---

## 11. 모니터링 및 관찰성

### 11.1 성능 모니터링

**Vercel Analytics**:
- Core Web Vitals 추적
- 사용자 경험 메트릭
- 실시간 성능 대시보드

**Custom Metrics**:
```typescript
// 레시피 생성 성공률 추적
export function trackRecipeCreation(success: boolean, duration: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'recipe_creation', {
      success,
      duration,
      timestamp: Date.now()
    })
  }
}
```

### 11.2 에러 추적

**Next.js 내장 에러 처리**:
```typescript
// error.tsx
'use client'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로그 전송
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="error-fallback">
      <h2>문제가 발생했습니다</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}
```

---

## 12. 결론 및 다음 단계

### 12.1 결정 요약

이 아키텍처 결정은 **10일 MVP 개발**이라는 제약 조건 하에서 최적의 개발자 생산성과 사용자 경험을 제공하기 위해 설계되었습니다.

**핵심 원칙**:
1. **개발 속도 우선**: 빠른 MVP 출시를 위한 기술 선택
2. **TypeScript 전체 스택**: 타입 안전성과 개발자 경험 최적화
3. **점진적 확장**: MVP → Growth → Scale 단계별 진화
4. **표준 준수**: 널리 사용되는 기술과 패턴 채택

### 12.2 성공 지표

**기술적 목표**:
- [ ] 10일 내 MVP 배포 완료
- [ ] Core Web Vitals 기준 충족 (LCP < 2.5s)
- [ ] 90% 이상 TypeScript 타입 커버리지
- [ ] 80% 이상 테스트 코드 커버리지

**비즈니스 목표**:
- [ ] 사용자 회원가입 → 레시피 작성 플로우 완성
- [ ] 반응형 디자인으로 모바일 지원
- [ ] SEO 최적화로 검색 엔진 노출

### 12.3 향후 재검토 일정

**단기 (1개월)**:
- Next.js App Router 안정성 평가
- 성능 메트릭 분석 및 최적화
- 사용자 피드백 기반 UX 개선

**중기 (3개월)**:
- PostgreSQL 마이그레이션 계획 실행
- 검색 기능 고도화 (전문 검색)
- 소셜 로그인 추가 (Google, GitHub)

**장기 (6개월)**:
- 마이크로서비스 아키텍처 전환 검토
- 모바일 앱 개발 계획
- 국제화 (i18n) 지원

---

**이 ADR은 CookShare MVP 개발의 기술적 근거를 제공하며, 프로젝트 진행에 따라 지속적으로 업데이트될 예정입니다.**

---

## 변경 이력

| 일자 | 버전 | 변경 사항 | 작성자 |
|------|------|-----------|---------|
| 2024-08-24 | 1.0 | 초기 ADR 작성 - MVP 아키텍처 결정 | Development Team |

---

**다음 문서**: [WBS.md](./WBS.md) - 상세 개발 일정과 태스크 분해  
**관련 문서**: [PLANNING.md](./PLANNING.md) - 전체 서비스 기획, [MVP.md](./MVP.md) - MVP 명세