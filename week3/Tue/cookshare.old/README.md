# 🍳 CookShare

> **맛있는 레시피를 공유하고 발견하세요!**

CookShare는 사용자들이 레시피를 공유하고 발견할 수 있는 커뮤니티 플랫폼의 MVP입니다. 직관적인 인터페이스와 강력한 기능으로 요리 애호가들이 소통할 수 있는 공간을 제공합니다.

## ✨ 주요 기능

### 🔐 **사용자 인증**
- NextAuth.js 기반 간편 로그인
- 이메일과 이름만으로 빠른 가입
- 세션 관리 및 보안

### 📝 **레시피 관리** 
- 직관적인 레시피 등록 폼
- 재료와 조리 단계별 관리
- 이미지 업로드 (파일, 클립보드, URL 지원)
- 레시피 수정 및 삭제

### 🔍 **검색 및 탐색**
- 제목과 설명 기반 검색
- 카테고리별 필터링
- 반응형 카드 레이아웃

### 👤 **개인화**
- 내 레시피 전용 페이지
- 개인 레시피 관리
- 사용자별 프로필

### 🎨 **현대적 UI/UX**
- 미니멀한 디자인
- 아이콘 기반 네비게이션
- 모바일 최적화
- 다크 모드 지원 예정

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** - React 기반 풀스택 프레임워크 (App Router)
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크
- **shadcn/ui** - 재사용 가능한 컴포넌트 라이브러리

### Backend & Database
- **PostgreSQL** - 관계형 데이터베이스
- **Prisma** - 차세대 ORM
- **NextAuth.js** - 인증 솔루션

### Development & Testing
- **ESLint + Prettier** - 코드 품질
- **Playwright** - E2E 테스트
- **Docker** - 컨테이너화

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone <repository-url>
cd receipe
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp .env.example .env.local
```

`.env.local` 파일을 편집하여 필요한 환경 변수를 설정하세요:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/cookshare"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 4. 데이터베이스 설정
```bash
# Prisma 클라이언트 생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate deploy

# 샘플 데이터 추가 (선택사항)
npx prisma db seed
```

### 5. 개발 서버 시작
```bash
npm run dev
```

🎉 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다!

## 🔑 테스트 계정

개발 및 테스트를 위해 다음 계정들을 사용할 수 있습니다:

### 👤 일반 사용자 계정
다음 이메일로 로그인하면 기존 레시피들을 확인하고 편집할 수 있습니다:

- `test@cookshare.com` - 요리왕 김치
- `chef@cookshare.com` - 셰프 박파스타  
- `baker@cookshare.com` - 베이킹마스터

### 👑 관리자 계정
**모든 레시피 삭제 권한**을 가진 관리자 계정:

- `admin@cookshare.com` - 관리자

> **관리자 기능**: 홈페이지에서 모든 레시피 카드에 🗑️ 삭제 버튼이 표시되며, 어떤 레시피든 삭제할 수 있습니다.

### 로그인 방법
1. `/auth/signin` 페이지로 이동
2. 위의 테스트 이메일 중 하나를 입력
3. 이름 필드는 비워두거나 임의로 입력
4. "로그인" 버튼 클릭

> 💡 **새 계정 생성**: 새로운 이메일로 로그인하면 자동으로 계정이 생성됩니다.

## 📋 사용 가능한 스크립트

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 타입 체크
npm run type-check

# 린팅
npm run lint

# E2E 테스트
npm run test:e2e

# Prisma 스튜디오 (데이터베이스 GUI)
npx prisma studio

# Claude 대화 백업
npm run save-chat

# Claude 대화 실시간 모니터링
npm run monitor-chat
```

## 🤖 Claude Code 대화 자동 저장

Claude Code와의 모든 대화를 자동으로 백업하여 중요한 개발 과정을 보존합니다.

### 🔧 설정
```bash
# 자동 저장 시스템 설정 (최초 1회)
bash scripts/setup-auto-save.sh
```

### 💾 백업 방식
- **자동 백업**: Git 커밋/푸시 시 자동 실행
- **수동 백업**: `npm run save-chat` 명령어
- **실시간 모니터링**: `npm run monitor-chat` (백그라운드 실행)

### 📁 저장 위치
- **메인 로그**: `CLAUDE.log` (프로젝트 루트)
- **형식**: 최신 대화가 맨 위, 타임스탬프 포함
- **내용**: 완전한 질문-답변 쌍

### 💡 사용 팁
```bash
# 중요한 작업 전후 백업
npm run save-chat

# 장시간 작업 시 실시간 모니터링
npm run monitor-chat &

# 백업된 대화 확인
head -50 CLAUDE.log
```

> 🎯 **자동 트리거**: 매 커밋과 푸시 시 자동으로 대화가 백업됩니다.

## 🐳 Docker로 실행

### 개발 환경
```bash
# Docker Compose로 실행
docker-compose up -d

# 데이터베이스 마이그레이션
docker-compose exec app npx prisma migrate deploy
```

### 프로덕션 환경
```bash
# 프로덕션 이미지 빌드
docker build -t cookshare .

# 컨테이너 실행
docker run -p 3000:3000 cookshare
```

## 📚 프로젝트 문서

### 📋 기획 문서
- [**PLANNING.md**](docs/PLANNING.md) - 전체 서비스 기획 및 요구사항
- [**MVP.md**](docs/MVP.md) - MVP 개발 범위 및 일정
- [**MVP_USER_STORIES.md**](docs/MVP_USER_STORIES.md) - 사용자 스토리

### 🏗️ 설계 문서
- [**ARCHITECTURE.md**](docs/ARCHITECTURE.md) - 시스템 아키텍처
- [**STRUCTURE.md**](docs/STRUCTURE.md) - 프로젝트 구조 설계
- [**ADR.md**](docs/ADR.md) - 기술적 의사결정 기록

### 📊 관리 문서
- [**WBS.md**](docs/WBS.md) - 작업 분해 구조
- [**RISK.md**](docs/RISK.md) - 위험 요소 분석
- [**GETTING_STARTED.md**](docs/GETTING_STARTED.md) - 시작 가이드

### 🔧 개발 가이드
- [**CLAUDE.md**](CLAUDE.md) - Claude Code 작업 가이드

## 🎯 개발 진행 상황

### ✅ 완료된 기능
- [x] 프로젝트 기본 설정 (Next.js 14, TypeScript, Tailwind)
- [x] 데이터베이스 스키마 설계 (Prisma + PostgreSQL)
- [x] 사용자 인증 시스템 (NextAuth.js)
- [x] 레시피 CRUD 기능
- [x] 이미지 업로드 (다중 방식 지원)
- [x] 검색 및 필터링
- [x] 내 레시피 관리 페이지
- [x] 반응형 네비게이션 UI
- [x] 관리자 시스템 (모든 레시피 삭제 권한)
- [x] E2E 테스트 환경

### 🔄 진행 예정
- [ ] 좋아요 기능
- [ ] 댓글 시스템
- [ ] 성능 최적화
- [ ] 배포 환경 구축

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안이 있으시면 언제든 연락주세요!

---

**CookShare** - *맛있는 레시피 공유의 시작* 🍳✨