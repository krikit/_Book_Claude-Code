# 📚 CookShare 프로젝트 문서

이 디렉토리는 CookShare MVP 프로젝트의 모든 기획, 설계, 관리 문서를 포함합니다.

## 📋 문서 구조

### 기획 문서
- **[PLANNING.md](PLANNING.md)** - 전체 서비스 기획, 기능 명세, 기술 스택 상세 정보
- **[MVP.md](MVP.md)** - 10일 MVP 개발 범위, 우선순위, 일정 계획  
- **[MVP_USER_STORIES.md](MVP_USER_STORIES.md)** - 사용자 중심의 기능 요구사항 정의

### 설계 문서
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - 시스템 아키텍처, 구성 요소, 데이터 플로우
- **[STRUCTURE.md](STRUCTURE.md)** - 프로젝트 구조 설계 (MVP → Production 확장)
- **[ADR.md](ADR.md)** - 주요 기술적 의사결정 기록 (Architecture Decision Records)

### 관리 문서  
- **[WBS.md](WBS.md)** - 작업 분해 구조, 상세 일정, GitHub 이슈 연동
- **[RISK.md](RISK.md)** - 프로젝트 위험 요소 분석 및 완화 방안
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - 새로운 개발자를 위한 시작 가이드

## 🎯 문서 활용 가이드

### 프로젝트 이해를 위한 추천 순서

1. **시작하기** 
   - [GETTING_STARTED.md](GETTING_STARTED.md) - 프로젝트 개요 및 설정
   - [MVP.md](MVP.md) - 현재 개발 범위 이해

2. **기능 이해**
   - [MVP_USER_STORIES.md](MVP_USER_STORIES.md) - 사용자 관점의 기능
   - [PLANNING.md](PLANNING.md) - 전체 비전 및 상세 기능

3. **기술적 이해**
   - [ARCHITECTURE.md](ARCHITECTURE.md) - 시스템 구조
   - [ADR.md](ADR.md) - 기술 선택 배경
   - [STRUCTURE.md](STRUCTURE.md) - 코드 구조

4. **개발 관리**
   - [WBS.md](WBS.md) - 작업 계획
   - [RISK.md](RISK.md) - 위험 요소 대응

### 역할별 주요 참고 문서

#### 📊 **프로젝트 매니저**
- [MVP.md](MVP.md) - 개발 일정 및 우선순위
- [WBS.md](WBS.md) - 작업 분해 및 일정 관리
- [RISK.md](RISK.md) - 리스크 관리

#### 🏗️ **시스템 아키텍트** 
- [ARCHITECTURE.md](ARCHITECTURE.md) - 시스템 설계
- [STRUCTURE.md](STRUCTURE.md) - 프로젝트 구조
- [ADR.md](ADR.md) - 기술적 의사결정

#### 💻 **개발자**
- [GETTING_STARTED.md](GETTING_STARTED.md) - 개발 환경 설정
- [MVP_USER_STORIES.md](MVP_USER_STORIES.md) - 기능 요구사항
- [PLANNING.md](PLANNING.md) - 상세 기능 명세

#### 🎨 **UI/UX 디자이너**
- [MVP_USER_STORIES.md](MVP_USER_STORIES.md) - 사용자 경험 요구사항
- [PLANNING.md](PLANNING.md) - UI 컴포넌트 및 플로우

## 📝 문서 업데이트 가이드

### 업데이트 원칙
- 기능 추가/변경 시 관련 문서 동시 업데이트
- 의사결정 발생 시 ADR.md에 기록
- 새로운 위험 요소 발견 시 RISK.md 업데이트

### 문서 버전 관리
- Git을 통한 변경 이력 관리
- 주요 마일스톤마다 문서 상태 스냅샷
- 문서 간 일관성 유지

## 🔗 연관 파일

### 루트 디렉토리
- **[../README.md](../README.md)** - 프로젝트 메인 가이드
- **[../CLAUDE.md](../CLAUDE.md)** - Claude Code 작업 가이드

### 개발 환경
- **[../package.json](../package.json)** - 프로젝트 의존성
- **[../docker-compose.yml](../docker-compose.yml)** - 개발 환경 설정
- **[../prisma/schema.prisma](../prisma/schema.prisma)** - 데이터베이스 스키마

---

**📌 참고**: 이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다. 최신 정보는 각 문서의 수정일자를 확인해주세요.