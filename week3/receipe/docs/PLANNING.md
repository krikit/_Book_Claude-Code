# 레시피 공유 서비스 - 기획 및 명세서

## 1. 서비스 개요

### 1.1 서비스명
**CookShare** (쿡쉐어)

### 1.2 서비스 목적
- 사용자들이 자신만의 레시피를 공유하고 다른 사람들의 레시피를 발견할 수 있는 플랫폼
- 요리 초보자부터 전문가까지 모든 수준의 사용자가 활용 가능한 레시피 커뮤니티
- 재료 기반 레시피 검색으로 효율적인 요리 계획 지원

### 1.3 타겟 사용자
- **주 타겟**: 20-40대 요리에 관심있는 일반인
- **서브 타겟**: 
  - 자취생, 신혼부부 등 요리를 배우고 싶은 초보자
  - 자신의 레시피를 공유하고 싶은 요리 애호가
  - 새로운 레시피를 찾는 주부/주부

## 2. 핵심 기능 명세

### 2.1 사용자 관리
#### 2.1.1 회원가입/로그인
- 이메일 회원가입
- 소셜 로그인 (Google, Kakao, Naver)
- 프로필 관리 (닉네임, 프로필 사진, 자기소개)
- 비밀번호 찾기/변경

#### 2.1.2 사용자 프로필
- 작성한 레시피 목록
- 북마크한 레시피
- 팔로워/팔로잉 목록
- 활동 통계 (레시피 수, 받은 좋아요 등)

### 2.2 레시피 관리
#### 2.2.1 레시피 작성
- 제목, 설명, 카테고리 설정
- 재료 목록 (이름, 수량, 단위)
- 조리 단계별 설명 및 이미지
- 조리 시간, 난이도, 인분 설정
- 태그 추가
- 임시 저장 기능

#### 2.2.2 레시피 조회
- 상세 페이지 (재료, 조리과정, 이미지)
- 조회수 카운트
- 인쇄 친화적 뷰
- 재료 체크리스트

#### 2.2.3 레시피 수정/삭제
- 작성자만 수정/삭제 가능
- 수정 이력 관리

### 2.3 검색 및 필터링
#### 2.3.1 검색 기능
- 레시피명 검색
- 재료 기반 검색
- 태그 검색
- 작성자 검색

#### 2.3.2 필터링
- 카테고리별 (한식, 중식, 일식, 양식, 디저트 등)
- 난이도별 (초급, 중급, 고급)
- 조리시간별 (15분 이하, 30분, 1시간, 1시간 이상)
- 인기순, 최신순, 평점순 정렬

### 2.4 소셜 기능
#### 2.4.1 평가 시스템
- 별점 평가 (1-5점)
- 리뷰 작성
- 댓글 기능

#### 2.4.2 상호작용
- 좋아요/북마크
- 레시피 공유 (SNS 연동)
- 팔로우/언팔로우
- 알림 시스템

### 2.5 추천 시스템
- 인기 레시피
- 오늘의 추천 레시피
- 사용자 맞춤 추천 (선호 카테고리 기반)
- 계절별 추천

## 3. 기술 스택

### 3.1 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **API Client**: Axios / TanStack Query

### 3.2 백엔드
- **Framework**: NestJS
- **Language**: TypeScript
- **API**: RESTful API / GraphQL
- **Authentication**: JWT + Refresh Token
- **Validation**: class-validator

### 3.3 데이터베이스
- **Main DB**: PostgreSQL
- **Cache**: Redis
- **ORM**: Prisma / TypeORM
- **Search Engine**: Elasticsearch (옵션)

### 3.4 인프라
- **Image Storage**: AWS S3 / Cloudinary
- **CDN**: CloudFront
- **Hosting**: Vercel (Frontend) / AWS EC2 or ECS (Backend)
- **Container**: Docker
- **CI/CD**: GitHub Actions

## 4. 데이터 모델

### 4.1 주요 엔티티

#### User (사용자)
```typescript
{
  id: UUID,
  email: string,
  password: string (hashed),
  nickname: string,
  profileImage: string,
  bio: string,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### Recipe (레시피)
```typescript
{
  id: UUID,
  userId: UUID,
  title: string,
  description: string,
  category: string,
  difficulty: enum('EASY', 'MEDIUM', 'HARD'),
  cookingTime: number, // minutes
  servings: number,
  mainImage: string,
  viewCount: number,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### Ingredient (재료)
```typescript
{
  id: UUID,
  recipeId: UUID,
  name: string,
  amount: string,
  unit: string,
  order: number
}
```

#### RecipeStep (조리 단계)
```typescript
{
  id: UUID,
  recipeId: UUID,
  stepNumber: number,
  description: string,
  image: string (optional),
  duration: number (optional)
}
```

#### Review (리뷰)
```typescript
{
  id: UUID,
  recipeId: UUID,
  userId: UUID,
  rating: number (1-5),
  comment: string,
  createdAt: DateTime
}
```

#### Bookmark (북마크)
```typescript
{
  userId: UUID,
  recipeId: UUID,
  createdAt: DateTime
}
```

#### Follow (팔로우)
```typescript
{
  followerId: UUID,
  followingId: UUID,
  createdAt: DateTime
}
```

## 5. API 명세 (주요 엔드포인트)

### 5.1 인증
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신
- `POST /auth/logout` - 로그아웃

### 5.2 사용자
- `GET /users/:id` - 사용자 정보 조회
- `PUT /users/:id` - 사용자 정보 수정
- `GET /users/:id/recipes` - 사용자의 레시피 목록
- `GET /users/:id/bookmarks` - 북마크한 레시피

### 5.3 레시피
- `GET /recipes` - 레시피 목록 (검색, 필터링)
- `GET /recipes/:id` - 레시피 상세
- `POST /recipes` - 레시피 작성
- `PUT /recipes/:id` - 레시피 수정
- `DELETE /recipes/:id` - 레시피 삭제

### 5.4 리뷰
- `GET /recipes/:id/reviews` - 리뷰 목록
- `POST /recipes/:id/reviews` - 리뷰 작성
- `PUT /reviews/:id` - 리뷰 수정
- `DELETE /reviews/:id` - 리뷰 삭제

### 5.5 소셜
- `POST /recipes/:id/like` - 좋아요
- `DELETE /recipes/:id/like` - 좋아요 취소
- `POST /recipes/:id/bookmark` - 북마크
- `DELETE /recipes/:id/bookmark` - 북마크 취소
- `POST /users/:id/follow` - 팔로우
- `DELETE /users/:id/follow` - 언팔로우

## 6. 비기능적 요구사항

### 6.1 성능
- 페이지 로딩 시간 3초 이내
- 이미지 최적화 (WebP 포맷, lazy loading)
- 검색 응답 시간 1초 이내
- 동시 접속자 1000명 처리 가능

### 6.2 보안
- HTTPS 적용
- SQL Injection 방지
- XSS 방지
- CSRF 토큰 사용
- Rate Limiting 적용
- 민감 정보 암호화

### 6.3 사용성
- 반응형 웹 디자인 (모바일, 태블릿, 데스크톱)
- 웹 접근성 준수 (WCAG 2.1)
- 다국어 지원 준비 (i18n)
- 오프라인 모드 지원 (PWA)

### 6.4 확장성
- 마이크로서비스 아키텍처 고려
- 수평적 확장 가능한 구조
- 캐싱 전략 수립
- CDN 활용

## 7. 개발 단계별 계획

### Phase 1: MVP (4주)
**Week 1-2: 백엔드 개발**
- 데이터베이스 설계 및 구축
- 인증 시스템 구현
- 레시피 CRUD API
- 이미지 업로드 기능

**Week 3-4: 프론트엔드 개발**
- 회원가입/로그인 UI
- 레시피 작성/조회 UI
- 기본 검색 기능
- 반응형 디자인 적용

### Phase 2: 핵심 기능 확장 (4주)
- 고급 검색 및 필터링
- 리뷰/평점 시스템
- 북마크/좋아요 기능
- 사용자 프로필 페이지

### Phase 3: 소셜 기능 (3주)
- 팔로우 시스템
- 알림 기능
- 공유 기능
- 댓글 시스템

### Phase 4: 고도화 (3주)
- 추천 시스템
- 영양정보 자동 계산
- 레시피 수정 이력
- 관리자 페이지

### Phase 5: 최적화 및 배포 (2주)
- 성능 최적화
- 보안 점검
- 테스트 및 버그 수정
- 배포 및 모니터링 설정

## 8. 테스트 계획

### 8.1 단위 테스트
- Jest를 활용한 유닛 테스트
- 테스트 커버리지 80% 이상

### 8.2 통합 테스트
- API 엔드포인트 테스트
- 데이터베이스 연동 테스트

### 8.3 E2E 테스트
- Cypress/Playwright 활용
- 주요 사용자 시나리오 테스트

### 8.4 성능 테스트
- 부하 테스트 (K6, JMeter)
- 응답 시간 측정

## 9. 모니터링 및 분석

### 9.1 애플리케이션 모니터링
- Error tracking (Sentry)
- Performance monitoring
- 로그 수집 및 분석

### 9.2 사용자 분석
- Google Analytics
- 사용자 행동 패턴 분석
- A/B 테스팅

### 9.3 인프라 모니터링
- 서버 리소스 모니터링
- 데이터베이스 성능 모니터링
- 알림 설정

## 10. 예상 비용

### 10.1 개발 비용
- 개발자 2명 × 4개월
- 디자이너 1명 × 2개월

### 10.2 운영 비용 (월간)
- 서버 호스팅: $50-100
- 데이터베이스: $30-50
- 이미지 스토리지: $20-30
- CDN: $10-20
- 도메인: $15/년

### 10.3 마케팅 비용
- 초기 홍보: $500-1000
- 월간 광고: $100-200

## 11. 리스크 관리

### 11.1 기술적 리스크
- **리스크**: 트래픽 급증 시 서버 다운
- **대응**: Auto-scaling 설정, 로드 밸런서 구성

### 11.2 보안 리스크
- **리스크**: 개인정보 유출
- **대응**: 정기적인 보안 감사, 암호화 강화

### 11.3 사업적 리스크
- **리스크**: 사용자 확보 실패
- **대응**: 초기 사용자 유치 이벤트, 인플루언서 마케팅

## 12. 성공 지표 (KPI)

### 12.1 사용자 지표
- MAU (Monthly Active Users): 1만명 (6개월 내)
- DAU (Daily Active Users): 1천명 (6개월 내)
- 회원가입 전환율: 10%

### 12.2 콘텐츠 지표
- 월간 레시피 등록 수: 500개
- 레시피당 평균 조회수: 100회
- 리뷰 작성률: 20%

### 12.3 비즈니스 지표
- 사용자 리텐션: 40% (30일)
- 평균 세션 시간: 5분
- 재방문율: 30%

## 13. 향후 확장 계획

### 13.1 기능 확장
- AI 기반 레시피 추천
- 동영상 레시피 지원
- 라이브 쿠킹 클래스
- 재료 구매 연동

### 13.2 플랫폼 확장
- iOS/Android 네이티브 앱
- 스마트 TV 앱
- 음성 인터페이스 (Alexa, Google Home)

### 13.3 비즈니스 확장
- 프리미엄 멤버십
- 레시피북 출판
- 브랜드 제휴
- 쿠킹 클래스 매칭

---

작성일: 2025-08-23
버전: 1.0.0