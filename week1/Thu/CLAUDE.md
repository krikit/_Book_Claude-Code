# Project Context

고양이 댄싱 애니메이션 웹페이지 개발 프로젝트
- 고양이 이미지가 춤추는 애니메이션을 구현하는 React 웹페이지
- CSS 애니메이션 또는 JavaScript 기반 움직임 효과 적용

## Current Tasks

- [ ] React 프로젝트 초기 설정 (Create React App 또는 Vite)
- [ ] 고양이 이미지 리소스 준비 및 최적화
- [ ] 춤추는 애니메이션 컴포넌트 개발
  - CSS keyframes 또는 JavaScript 애니메이션
  - 회전, 이동, 크기 변화 등 다양한 춤 동작 구현
- [ ] 반응형 웹 디자인 적용
- [ ] 애니메이션 성능 최적화

## Tech Stack

- **Frontend**: React 18+
- **언어**: JavaScript/TypeScript
- **스타일링**: CSS3 (keyframes), Styled-components, 또는 CSS Modules
- **빌드 도구**: Vite 또는 Create React App
- **이미지 최적화**: WebP, SVG 지원

## Development Commands

```bash
# 프로젝트 생성
npx create-react-app cat-dancing-page
# 또는
npm create vite@latest cat-dancing-page -- --template react

# 개발 서버 실행
npm run dev
# 또는
npm start

# 빌드
npm run build

# 테스트
npm test

# 타입 체크 (TypeScript 사용 시)
npm run typecheck
```

## Project Structure

```
src/
├── components/
│   ├── DancingCat.jsx        # 메인 고양이 댄싱 컴포넌트
│   ├── AnimationControls.jsx # 애니메이션 제어 UI
│   └── Layout.jsx            # 페이지 레이아웃
├── assets/
│   └── images/
│       └── cat.png           # 고양이 이미지 파일
├── styles/
│   ├── animations.css        # CSS 애니메이션 정의
│   └── global.css           # 전역 스타일
├── hooks/
│   └── useAnimation.js       # 애니메이션 관련 커스텀 훅
└── App.jsx                   # 메인 앱 컴포넌트
```

## Implementation Details

- **애니메이션 타입**: CSS keyframes를 사용한 연속적인 춤 동작
- **고양이 동작**: 좌우 흔들기, 점프, 회전, 크기 변화 조합
- **사용자 인터랙션**: 클릭으로 애니메이션 시작/정지 기능
- **반응형**: 모바일, 태블릿, 데스크탑 대응