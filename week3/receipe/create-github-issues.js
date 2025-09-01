#!/usr/bin/env node

/**
 * GitHub Issues Creator for CookShare MVP
 * WBS 기반 GitHub 이슈 자동 생성 스크립트
 * 
 * 사용법:
 * 1. GitHub Personal Access Token 설정: export GITHUB_TOKEN=your_token
 * 2. 저장소 설정: export GITHUB_REPO=username/repository
 * 3. 실행: node create-github-issues.js
 */

import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';

// 환경변수 확인
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'your-username/cookshare-mvp';

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN 환경변수가 설정되지 않았습니다.');
  console.error('   export GITHUB_TOKEN=your_personal_access_token');
  process.exit(1);
}

const [owner, repo] = GITHUB_REPO.split('/');
if (!owner || !repo) {
  console.error('❌ GITHUB_REPO 형식이 잘못되었습니다. (owner/repository 형식으로 설정)');
  process.exit(1);
}

// Octokit 초기화
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// WBS 기반 이슈 데이터 구조
const wbsIssues = [
  // Day 1: 프로젝트 설정 및 환경 구성
  {
    title: '[Day 1] 프로젝트 설정 및 환경 구성',
    body: `## 📋 작업 개요
Day 1의 전체 작업을 관리하는 에픽 이슈입니다.

## ✅ 체크리스트
- [ ] Next.js 프로젝트 생성 및 초기 설정
- [ ] 필수 패키지 설치 및 설정
- [ ] 데이터베이스 스키마 설계 및 마이그레이션
- [ ] 시드 데이터 작성
- [ ] 기본 레이아웃 및 UI 컴포넌트 구성

## ⏱️ 예상 소요시간
8시간

## 🎯 완료 조건
- 로컬 개발 서버 실행 가능
- 데이터베이스 연결 확인
- 기본 레이아웃이 적용된 홈페이지 접근 가능`,
    labels: ['epic', 'day-1', 'setup'],
    milestone: 1
  },
  {
    title: '[Day 1.1] Next.js 프로젝트 초기화',
    body: `## 📋 작업 내용
Next.js 14 프로젝트를 생성하고 기본 설정을 완료합니다.

## ✅ 작업 항목
- [ ] \`npx create-next-app@latest cookshare-mvp --typescript --tailwind --app\` 실행
- [ ] 기본 설정 확인 및 커스터마이징
- [ ] 필수 패키지 설치 (Prisma, NextAuth, shadcn/ui, Zod)
- [ ] ESLint, Prettier 설정

## 📦 필수 패키지
\`\`\`bash
npm install prisma @prisma/client next-auth @next-auth/prisma-adapter
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge
npm install zod react-hook-form @hookform/resolvers
npm install -D @types/bcryptjs bcryptjs
\`\`\`

## ⏱️ 예상 소요시간
2시간

## 🎯 완료 조건
- Next.js 개발 서버 실행 확인 (\`npm run dev\`)
- 모든 필수 패키지 설치 완료
- TypeScript 타입 에러 없음`,
    labels: ['task', 'day-1', 'setup', 'frontend'],
    milestone: 1
  },
  {
    title: '[Day 1.2] 데이터베이스 스키마 설계 및 마이그레이션',
    body: `## 📋 작업 내용
SQLite 데이터베이스를 설정하고 Prisma 스키마를 작성합니다.

## ✅ 작업 항목
- [ ] Prisma 초기화 (\`npx prisma init --datasource-provider sqlite\`)
- [ ] User, Recipe, Ingredient, RecipeStep, Like 모델 정의
- [ ] 관계형 데이터 모델링 완료
- [ ] 초기 마이그레이션 실행
- [ ] Prisma Client 생성

## 🗄️ 주요 모델
- **User**: 사용자 정보
- **Recipe**: 레시피 기본 정보
- **Ingredient**: 재료 목록
- **RecipeStep**: 조리 과정
- **Like**: 좋아요 관계

## ⏱️ 예상 소요시간
3시간

## 🎯 완료 조건
- \`dev.db\` 파일 생성 확인
- Prisma Studio에서 테이블 구조 확인
- 마이그레이션 파일 생성 완료`,
    labels: ['task', 'day-1', 'database', 'backend'],
    milestone: 1
  },
  {
    title: '[Day 1.3] 시드 데이터 작성',
    body: `## 📋 작업 내용
개발 및 테스트용 시드 데이터를 작성합니다.

## ✅ 작업 항목
- [ ] 테스트 사용자 데이터 생성 (5명)
- [ ] 샘플 레시피 데이터 생성 (10개)
- [ ] 재료 및 조리 과정 데이터 생성
- [ ] 시드 스크립트 작성 (\`prisma/seed.ts\`)
- [ ] 시드 데이터 실행 및 확인

## 📝 시드 데이터 구성
- **사용자**: admin, user1~4 (비밀번호: password123)
- **레시피**: 한식, 양식, 중식 등 다양한 카테고리
- **난이도**: 쉬움, 보통, 어려움 균등 분배

## ⏱️ 예상 소요시간
1시간

## 🎯 완료 조건
- \`npm run seed\` 스크립트 실행 성공
- Prisma Studio에서 시드 데이터 확인 가능`,
    labels: ['task', 'day-1', 'database', 'data'],
    milestone: 1
  },
  {
    title: '[Day 1.4] 기본 레이아웃 및 UI 컴포넌트 구성',
    body: `## 📋 작업 내용
shadcn/ui를 활용한 기본 레이아웃과 공통 컴포넌트를 구성합니다.

## ✅ 작업 항목
- [ ] shadcn/ui 초기화 및 기본 컴포넌트 설치
- [ ] Header, Footer, Navigation 컴포넌트 작성
- [ ] MainLayout 컴포넌트 구성
- [ ] 반응형 네비게이션 메뉴 구현
- [ ] Tailwind 커스텀 설정 (색상, 폰트)

## 🎨 UI 컴포넌트
\`\`\`bash
npx shadcn-ui@latest add button card input label
npx shadcn-ui@latest add navigation-menu dropdown-menu
npx shadcn-ui@latest add avatar badge
\`\`\`

## ⏱️ 예상 소요시간
2시간

## 🎯 완료 조건
- 모든 페이지에서 일관된 레이아웃 적용
- 모바일/데스크톱 반응형 확인
- 네비게이션 메뉴 동작 확인`,
    labels: ['task', 'day-1', 'frontend', 'ui'],
    milestone: 1
  },

  // Day 2: 인증 시스템
  {
    title: '[Day 2] 인증 시스템 구현',
    body: `## 📋 작업 개요
NextAuth.js를 활용한 사용자 인증 시스템을 구현합니다.

## ✅ 체크리스트
- [ ] NextAuth.js 설정 및 구성
- [ ] 회원가입 기능 구현
- [ ] 로그인/로그아웃 기능 구현
- [ ] 세션 관리 및 보안 설정

## ⏱️ 예상 소요시간
8시간

## 🎯 완료 조건
- 회원가입/로그인/로그아웃 정상 동작
- 세션 기반 페이지 접근 제어
- 비밀번호 해싱 및 보안 적용`,
    labels: ['epic', 'day-2', 'auth', 'backend'],
    milestone: 1
  },
  {
    title: '[Day 2.1] NextAuth.js 설정 및 구성',
    body: `## 📋 작업 내용
NextAuth.js를 설정하고 Credentials Provider를 구성합니다.

## ✅ 작업 항목
- [ ] NextAuth.js 설정 파일 작성 (\`lib/auth.ts\`)
- [ ] API Route 설정 (\`app/api/auth/[...nextauth]/route.ts\`)
- [ ] Credentials Provider 구현
- [ ] JWT 및 세션 설정
- [ ] 환경변수 설정 (NEXTAUTH_SECRET, NEXTAUTH_URL)

## 🔒 보안 설정
- JWT 토큰 암호화
- CSRF 보호 활성화
- 세션 만료 시간 설정 (24시간)

## ⏱️ 예상 소요시간
3시간

## 🎯 완료 조건
- NextAuth 설정 완료
- 환경변수 올바른 설정
- 기본 인증 플로우 동작 확인`,
    labels: ['task', 'day-2', 'auth', 'backend'],
    milestone: 1
  },
  {
    title: '[Day 2.2] 회원가입 기능 구현',
    body: `## 📋 작업 내용
사용자 등록 API와 회원가입 UI를 구현합니다.

## ✅ 작업 항목
- [ ] 회원가입 API Route (\`api/auth/register/route.ts\`)
- [ ] 비밀번호 해싱 (bcryptjs)
- [ ] 입력값 검증 스키마 (Zod)
- [ ] 회원가입 폼 컴포넌트 (\`app/(auth)/register/page.tsx\`)
- [ ] 폼 검증 및 에러 처리

## 📝 검증 규칙
- 이메일: 유효한 이메일 형식
- 비밀번호: 최소 8자, 영문+숫자 조합
- 닉네임: 2-20자, 한글/영문/숫자

## ⏱️ 예상 소요시간
2.5시간

## 🎯 완료 조건
- 회원가입 폼 정상 동작
- 입력값 검증 및 에러 메시지 표시
- 중복 이메일 체크`,
    labels: ['task', 'day-2', 'auth', 'frontend', 'backend'],
    milestone: 1
  },
  {
    title: '[Day 2.3] 로그인/로그아웃 기능 구현',
    body: `## 📋 작업 내용
로그인 UI와 세션 관리 기능을 구현합니다.

## ✅ 작업 항목
- [ ] 로그인 폼 컴포넌트 (\`app/(auth)/login/page.tsx\`)
- [ ] NextAuth signIn/signOut 연동
- [ ] 세션 상태 기반 UI 변경
- [ ] 로그인 후 리다이렉트 처리
- [ ] 로그아웃 기능 구현

## 🔄 사용자 플로우
1. 로그인 폼 입력
2. 인증 성공 시 메인페이지로 이동
3. 인증 실패 시 에러 메시지 표시
4. 로그아웃 시 로그인 페이지로 이동

## ⏱️ 예상 소요시간
2.5시간

## 🎯 완료 조건
- 로그인/로그아웃 정상 동작
- 세션 상태에 따른 네비게이션 변경
- 보호된 페이지 접근 제어`,
    labels: ['task', 'day-2', 'auth', 'frontend'],
    milestone: 1
  },

  // Day 3: 백엔드 API
  {
    title: '[Day 3] 백엔드 API 개발',
    body: `## 📋 작업 개요
레시피 관련 CRUD API와 파일 업로드 기능을 구현합니다.

## ✅ 체크리스트
- [ ] 레시피 CRUD API 구현
- [ ] 파일 업로드 API 구현
- [ ] API 인증 및 권한 검증
- [ ] 에러 처리 및 응답 표준화

## ⏱️ 예상 소요시간
8시간

## 🎯 완료 조건
- 모든 레시피 API 엔드포인트 동작
- 이미지 업로드 및 최적화 완료
- Postman/Thunder Client로 API 테스트 완료`,
    labels: ['epic', 'day-3', 'api', 'backend'],
    milestone: 1
  },

  // Days 4-10은 비슷한 패턴으로 계속...
  
  // 공통 라벨과 마일스톤
];

// 라벨 정의
const labels = [
  { name: 'epic', color: 'purple', description: '큰 단위의 작업을 관리하는 에픽' },
  { name: 'task', color: 'blue', description: '구체적인 개발 작업' },
  { name: 'bug', color: 'red', description: '버그 수정' },
  { name: 'enhancement', color: 'green', description: '기능 개선' },
  { name: 'day-1', color: 'yellow', description: 'Day 1 작업' },
  { name: 'day-2', color: 'orange', description: 'Day 2 작업' },
  { name: 'day-3', color: 'pink', description: 'Day 3 작업' },
  { name: 'frontend', color: 'cyan', description: '프론트엔드 관련' },
  { name: 'backend', color: 'brown', description: '백엔드 관련' },
  { name: 'database', color: 'gray', description: '데이터베이스 관련' },
  { name: 'auth', color: 'indigo', description: '인증 관련' },
  { name: 'api', color: 'teal', description: 'API 관련' },
  { name: 'ui', color: 'lime', description: 'UI/UX 관련' },
  { name: 'setup', color: 'amber', description: '초기 설정' },
  { name: 'data', color: 'emerald', description: '데이터 관련' },
];

// 마일스톤 정의
const milestones = [
  {
    title: 'Week 1 - MVP 핵심 기능',
    description: '인증, CRUD, 기본 UI 구현',
    due_on: '2024-09-06T23:59:59Z'
  },
  {
    title: 'Week 2 - 추가 기능 및 최적화',
    description: '검색, 프로필, 테스트, 배포',
    due_on: '2024-09-13T23:59:59Z'
  }
];

async function createLabels() {
  console.log('🏷️  라벨 생성 중...');
  
  for (const label of labels) {
    try {
      await octokit.rest.issues.createLabel({
        owner,
        repo,
        name: label.name,
        color: label.color,
        description: label.description,
      });
      console.log(`✅ 라벨 생성: ${label.name}`);
    } catch (error) {
      if (error.status === 422) {
        console.log(`ℹ️  라벨 이미 존재: ${label.name}`);
      } else {
        console.error(`❌ 라벨 생성 실패: ${label.name}`, error.message);
      }
    }
  }
}

async function createMilestones() {
  console.log('🎯 마일스톤 생성 중...');
  
  const createdMilestones = [];
  
  for (const milestone of milestones) {
    try {
      const result = await octokit.rest.issues.createMilestone({
        owner,
        repo,
        title: milestone.title,
        description: milestone.description,
        due_on: milestone.due_on,
      });
      console.log(`✅ 마일스톤 생성: ${milestone.title}`);
      createdMilestones.push(result.data);
    } catch (error) {
      if (error.status === 422) {
        console.log(`ℹ️  마일스톤 이미 존재: ${milestone.title}`);
        // 기존 마일스톤 찾기
        const existingMilestones = await octokit.rest.issues.listMilestones({
          owner,
          repo,
        });
        const existing = existingMilestones.data.find(m => m.title === milestone.title);
        if (existing) {
          createdMilestones.push(existing);
        }
      } else {
        console.error(`❌ 마일스톤 생성 실패: ${milestone.title}`, error.message);
      }
    }
  }
  
  return createdMilestones;
}

async function createIssues(milestones) {
  console.log('📝 이슈 생성 중...');
  
  for (const issue of wbsIssues) {
    try {
      const milestoneNumber = issue.milestone ? milestones[issue.milestone - 1]?.number : undefined;
      
      const result = await octokit.rest.issues.create({
        owner,
        repo,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        milestone: milestoneNumber,
      });
      
      console.log(`✅ 이슈 생성: ${issue.title}`);
      console.log(`   🔗 ${result.data.html_url}`);
    } catch (error) {
      console.error(`❌ 이슈 생성 실패: ${issue.title}`, error.message);
    }
  }
}

async function main() {
  try {
    console.log('🚀 CookShare MVP GitHub 이슈 생성 시작');
    console.log(`📂 저장소: ${GITHUB_REPO}`);
    
    // 순서대로 실행
    await createLabels();
    const milestones = await createMilestones();
    await createIssues(milestones);
    
    console.log('✨ 모든 이슈 생성 완료!');
    console.log('👉 GitHub 저장소에서 Issues 탭을 확인하세요.');
    
  } catch (error) {
    console.error('❌ 스크립트 실행 중 오류:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { wbsIssues, labels, milestones };