# CookShare MVP - 로컬 개발 환경 명세

## 1. MVP 개요

### 1.1 목표
- **개발 기간**: 2주 (10 영업일)
- **개발 인원**: 1-2명
- **목적**: 로컬 환경에서 완전히 동작하는 레시피 공유 서비스의 핵심 기능 구현
- **특징**: 외부 서비스 의존성 최소화, 빠른 프로토타이핑

### 1.2 MVP 핵심 가치
- 레시피를 작성하고 조회할 수 있는 기본 기능
- 간단한 사용자 인증 시스템
- 로컬 파일 시스템 기반 이미지 저장
- SQLite를 활용한 간단한 데이터 저장

## 2. 기술 스택 (단순화)

### 2.1 Frontend
```
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + shadcn/ui
- State: React State (useState, useContext)
- HTTP Client: Fetch API
```

### 2.2 Backend
```
- Runtime: Next.js API Routes (단일 프로젝트로 통합)
- Database: SQLite (Prisma ORM)
- Authentication: NextAuth.js (Credentials Provider)
- File Storage: Local file system
- Validation: Zod
```

### 2.3 개발 도구
```
- Package Manager: pnpm
- Code Formatter: Prettier
- Linter: ESLint
- Database GUI: Prisma Studio
```

## 3. MVP 기능 명세

### 3.1 사용자 관리 (최소화)
- ✅ 이메일/비밀번호 회원가입
- ✅ 로그인/로그아웃
- ✅ 기본 프로필 (닉네임, 자기소개)
- ❌ ~~소셜 로그인~~
- ❌ ~~비밀번호 찾기~~
- ❌ ~~이메일 인증~~

### 3.2 레시피 기능 (핵심)
- ✅ 레시피 작성 (제목, 설명, 재료, 조리과정)
- ✅ 레시피 목록 조회
- ✅ 레시피 상세 조회
- ✅ 레시피 수정/삭제 (작성자만)
- ✅ 이미지 업로드 (메인 이미지 1개)
- ✅ 카테고리 분류 (한식, 중식, 일식, 양식, 기타)
- ❌ ~~단계별 이미지~~
- ❌ ~~영양정보~~
- ❌ ~~동영상~~

### 3.3 검색 기능 (기본)
- ✅ 제목으로 검색
- ✅ 카테고리별 필터
- ✅ 최신순/오래된순 정렬
- ❌ ~~재료로 검색~~
- ❌ ~~고급 필터링~~
- ❌ ~~추천 시스템~~

### 3.4 상호작용 (간단)
- ✅ 좋아요 기능
- ✅ 조회수 카운트
- ❌ ~~댓글~~
- ❌ ~~리뷰/평점~~
- ❌ ~~팔로우~~
- ❌ ~~공유~~
- ❌ ~~북마크~~

## 4. 데이터베이스 스키마 (SQLite)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  nickname    String
  bio         String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  recipes     Recipe[]
  likes       Like[]
}

model Recipe {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String
  difficulty  String   @default("EASY")
  cookingTime Int      // minutes
  servings    Int
  imageUrl    String?
  viewCount   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  
  ingredients Ingredient[]
  steps       Step[]
  likes       Like[]
}

model Ingredient {
  id       String @id @default(cuid())
  name     String
  amount   String
  order    Int
  
  recipeId String
  recipe   Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)
}

model Step {
  id          String @id @default(cuid())
  description String
  order       Int
  
  recipeId    String
  recipe      Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)
}

model Like {
  userId    String
  recipeId  String
  createdAt DateTime @default(now())
  
  user      User   @relation(fields: [userId], references: [id])
  recipe    Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  @@id([userId, recipeId])
}
```

## 5. 프로젝트 구조 (단일 Next.js 프로젝트)

```
cookshare-mvp/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── recipes/
│   │   ├── page.tsx                 # 레시피 목록
│   │   ├── [id]/
│   │   │   ├── page.tsx            # 레시피 상세
│   │   │   └── edit/
│   │   │       └── page.tsx        # 레시피 수정
│   │   └── create/
│   │       └── page.tsx            # 레시피 작성
│   ├── profile/
│   │   └── page.tsx                # 내 프로필
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── recipes/
│   │   │   ├── route.ts            # GET(목록), POST(생성)
│   │   │   └── [id]/
│   │   │       ├── route.ts        # GET(상세), PUT(수정), DELETE(삭제)
│   │   │       └── like/
│   │   │           └── route.ts    # POST(좋아요)
│   │   └── upload/
│   │       └── route.ts            # POST(이미지 업로드)
│   ├── layout.tsx
│   └── page.tsx                    # 홈페이지
│
├── components/
│   ├── ui/                        # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── recipe/
│       ├── RecipeCard.tsx
│       ├── RecipeForm.tsx
│       └── RecipeList.tsx
│
├── lib/
│   ├── auth.ts                    # NextAuth 설정
│   ├── prisma.ts                  # Prisma 클라이언트
│   └── utils.ts                   # 유틸리티 함수
│
├── prisma/
│   ├── schema.prisma
│   ├── dev.db                     # SQLite 데이터베이스
│   └── seed.ts                    # 시드 데이터
│
├── public/
│   ├── uploads/                   # 업로드된 이미지 저장
│   └── images/                    # 정적 이미지
│
├── .env.local                      # 환경 변수
├── next.config.js
├── tailwind.config.ts
├── package.json
└── README.md
```

## 6. 로컬 개발 환경 설정

### 6.1 필요한 소프트웨어
```bash
# 필수
- Node.js 18+ 
- pnpm 8+
- Git

# 선택 (권장)
- VSCode
- TablePlus or DBeaver (SQLite GUI)
```

### 6.2 프로젝트 초기 설정

```bash
# 1. 프로젝트 생성
npx create-next-app@latest cookshare-mvp --typescript --tailwind --app

# 2. 디렉토리 이동
cd cookshare-mvp

# 3. 필수 패키지 설치
pnpm add prisma @prisma/client next-auth bcryptjs zod
pnpm add -D @types/bcryptjs

# 4. shadcn/ui 설정
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label textarea select

# 5. Prisma 초기화
npx prisma init --datasource-provider sqlite

# 6. 환경 변수 설정 (.env.local)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 6.3 데이터베이스 설정

```bash
# 1. Prisma 스키마 작성 (위의 스키마 복사)

# 2. 마이그레이션 실행
npx prisma migrate dev --name init

# 3. Prisma Studio 실행 (데이터 확인용)
npx prisma studio

# 4. 시드 데이터 생성 (선택사항)
npx prisma db seed
```

## 7. API 엔드포인트 명세

### 7.1 인증
```
POST   /api/auth/register    - 회원가입
POST   /api/auth/login       - 로그인 (NextAuth)
GET    /api/auth/session     - 세션 확인
POST   /api/auth/signout     - 로그아웃
```

### 7.2 레시피
```
GET    /api/recipes          - 레시피 목록
POST   /api/recipes          - 레시피 생성
GET    /api/recipes/[id]     - 레시피 상세
PUT    /api/recipes/[id]     - 레시피 수정
DELETE /api/recipes/[id]     - 레시피 삭제
POST   /api/recipes/[id]/like - 좋아요 토글
```

### 7.3 파일 업로드
```
POST   /api/upload           - 이미지 업로드
```

## 8. 핵심 기능 구현 순서

### Week 1 (5일)
```
Day 1: 프로젝트 설정 및 데이터베이스 구성
- Next.js 프로젝트 생성
- Prisma 설정 및 스키마 작성
- 기본 레이아웃 구성

Day 2: 인증 시스템
- NextAuth 설정
- 회원가입/로그인 페이지
- 세션 관리

Day 3: 레시피 CRUD API
- API Routes 구현
- 데이터 검증 (Zod)
- 에러 처리

Day 4: 레시피 작성/수정 UI
- 레시피 폼 컴포넌트
- 이미지 업로드
- 폼 검증

Day 5: 레시피 목록/상세 UI
- 레시피 카드 컴포넌트
- 목록 페이지
- 상세 페이지
```

### Week 2 (5일)
```
Day 6: 검색 및 필터
- 검색 기능
- 카테고리 필터
- 정렬 기능

Day 7: 좋아요 기능
- 좋아요 API
- UI 통합
- 실시간 업데이트

Day 8: 프로필 페이지
- 내 레시피 목록
- 프로필 수정
- 통계 표시

Day 9: UI/UX 개선
- 반응형 디자인
- 로딩 상태
- 에러 처리

Day 10: 테스트 및 최적화
- 기능 테스트
- 성능 최적화
- 버그 수정
```

## 9. 샘플 코드

### 9.1 레시피 API Route 예시

```typescript
// app/api/recipes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createRecipeSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: z.enum(['korean', 'chinese', 'japanese', 'western', 'other']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  cookingTime: z.number().min(1),
  servings: z.number().min(1),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.string()
  })),
  steps: z.array(z.object({
    description: z.string()
  }))
});

// GET: 레시피 목록 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'latest';

  const where = {
    ...(category && { category }),
    ...(search && { 
      title: { contains: search } 
    })
  };

  const orderBy = sort === 'latest' 
    ? { createdAt: 'desc' as const }
    : { createdAt: 'asc' as const };

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy,
    include: {
      author: {
        select: { nickname: true }
      },
      _count: {
        select: { likes: true }
      }
    }
  });

  return NextResponse.json(recipes);
}

// POST: 레시피 생성
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    );
  }

  const body = await request.json();
  const validation = createRecipeSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors }, 
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  const recipe = await prisma.recipe.create({
    data: {
      ...validation.data,
      authorId: user!.id,
      ingredients: {
        create: validation.data.ingredients.map((ing, idx) => ({
          ...ing,
          order: idx
        }))
      },
      steps: {
        create: validation.data.steps.map((step, idx) => ({
          ...step,
          order: idx
        }))
      }
    }
  });

  return NextResponse.json(recipe, { status: 201 });
}
```

### 9.2 레시피 폼 컴포넌트 예시

```tsx
// components/recipe/RecipeForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

export default function RecipeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'korean',
    difficulty: 'EASY',
    cookingTime: 30,
    servings: 2,
    ingredients: [{ name: '', amount: '' }],
    steps: [{ description: '' }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const recipe = await response.json();
        router.push(`/recipes/${recipe.id}`);
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="레시피 제목"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <Textarea
        placeholder="레시피 설명"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />

      {/* 나머지 폼 필드들... */}

      <Button type="submit" disabled={loading}>
        {loading ? '저장 중...' : '레시피 등록'}
      </Button>
    </form>
  );
}
```

## 10. 환경 변수 (.env.local)

```bash
# NextAuth
NEXTAUTH_SECRET=development-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Database (SQLite는 별도 설정 불필요)
DATABASE_URL="file:./dev.db"

# Upload Directory
UPLOAD_DIR=./public/uploads
```

## 11. 실행 명령어

```bash
# 개발 서버 실행
pnpm dev

# 데이터베이스 마이그레이션
pnpm prisma migrate dev

# Prisma Studio (DB 관리)
pnpm prisma studio

# 빌드
pnpm build

# 프로덕션 실행
pnpm start

# 린트
pnpm lint

# 포맷팅
pnpm format
```

## 12. 테스트 데이터

### 12.1 시드 스크립트 (prisma/seed.ts)

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 테스트 사용자 생성
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      nickname: '테스트유저',
      bio: '요리를 좋아하는 개발자입니다.'
    }
  });

  // 샘플 레시피 생성
  const recipes = [
    {
      title: '김치찌개',
      description: '간단하고 맛있는 김치찌개 레시피',
      category: 'korean',
      difficulty: 'EASY',
      cookingTime: 30,
      servings: 2,
      ingredients: [
        { name: '김치', amount: '200g' },
        { name: '돼지고기', amount: '150g' },
        { name: '두부', amount: '1/2모' }
      ],
      steps: [
        { description: '돼지고기를 볶는다' },
        { description: '김치를 넣고 같이 볶는다' },
        { description: '물을 붓고 끓인다' },
        { description: '두부를 넣고 5분 더 끓인다' }
      ]
    },
    {
      title: '카르보나라',
      description: '크리미한 이탈리안 파스타',
      category: 'western',
      difficulty: 'MEDIUM',
      cookingTime: 20,
      servings: 1,
      ingredients: [
        { name: '스파게티', amount: '100g' },
        { name: '베이컨', amount: '50g' },
        { name: '계란', amount: '2개' },
        { name: '파르메산 치즈', amount: '30g' }
      ],
      steps: [
        { description: '파스타를 삶는다' },
        { description: '베이컨을 바삭하게 굽는다' },
        { description: '계란과 치즈를 섞는다' },
        { description: '모든 재료를 섞는다' }
      ]
    }
  ];

  for (const recipeData of recipes) {
    await prisma.recipe.create({
      data: {
        ...recipeData,
        authorId: user.id,
        ingredients: {
          create: recipeData.ingredients.map((ing, idx) => ({
            ...ing,
            order: idx
          }))
        },
        steps: {
          create: recipeData.steps.map((step, idx) => ({
            ...step,
            order: idx
          }))
        }
      }
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## 13. 주의사항 및 제한사항

### 13.1 로컬 환경 제한
- 이미지는 public/uploads 폴더에 저장 (Git에는 포함하지 않음)
- SQLite 파일 크기 제한 고려
- 동시 접속자 처리 제한
- 이메일 발송 기능 없음

### 13.2 보안 고려사항
- NEXTAUTH_SECRET 반드시 변경
- 업로드 파일 크기 제한 (10MB)
- 파일 확장자 검증 (jpg, png, webp만 허용)
- SQL Injection 방지 (Prisma ORM 사용)
- XSS 방지 (React 기본 제공)

### 13.3 성능 최적화
- 이미지 최적화 (next/image 사용)
- 페이지네이션 구현 (10개씩)
- 캐싱 전략 (React Query 추가 고려)
- Lazy Loading 적용

## 14. 다음 단계 (MVP 이후)

### 14.1 기능 확장
- 댓글 시스템
- 레시피 검색 고도화
- 사용자 팔로우
- 북마크 기능
- 영양정보 자동 계산

### 14.2 기술 업그레이드
- PostgreSQL로 마이그레이션
- Redis 캐싱 도입
- S3 이미지 저장소
- Docker 컨테이너화
- CI/CD 파이프라인

### 14.3 상용화 준비
- 도메인 연결
- HTTPS 설정
- 모니터링 도구
- 백업 전략
- 사용자 분석 도구

---

작성일: 2025-08-23
버전: 1.0.0 (MVP)