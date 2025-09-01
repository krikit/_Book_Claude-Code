# Express REST API Server

간단하고 빠른 Express 기반 REST API 서버입니다.

## 기능

- ✅ 사용자 CRUD API (생성, 조회, 수정, 삭제)
- ✅ CORS 지원
- ✅ 보안 헤더 (Helmet)
- ✅ 요청 로깅 (Morgan)
- ✅ JSON 파싱
- ✅ 에러 핸들링
- ✅ 헬스 체크 엔드포인트

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 모드로 실행 (nodemon)
npm run dev

# 프로덕션 모드로 실행
npm start
```

## API 엔드포인트

### 기본 정보
- `GET /` - API 정보 및 사용 가능한 엔드포인트
- `GET /health` - 서버 상태 체크

### 사용자 관리
- `GET /api/users` - 모든 사용자 조회
- `GET /api/users/:id` - 특정 사용자 조회
- `POST /api/users` - 새 사용자 생성
- `PUT /api/users/:id` - 사용자 정보 수정
- `DELETE /api/users/:id` - 사용자 삭제

## API 사용 예시

### 사용자 생성
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "홍길동", "email": "hong@example.com"}'
```

### 모든 사용자 조회
```bash
curl http://localhost:3000/api/users
```

### 특정 사용자 조회
```bash
curl http://localhost:3000/api/users/1
```

### 사용자 정보 수정
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "홍길동 수정", "email": "hong.updated@example.com"}'
```

### 사용자 삭제
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": {...},
  "message": "작업 완료 메시지"
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "에러 메시지"
}
```

## 환경 변수

`.env` 파일에서 다음 변수들을 설정할 수 있습니다:

- `PORT`: 서버 포트 (기본값: 3000)
- `NODE_ENV`: 실행 환경 (development/production)

## 개발 도구

- **Express**: 웹 프레임워크
- **CORS**: Cross-Origin Resource Sharing
- **Helmet**: 보안 헤더 설정
- **Morgan**: HTTP 요청 로거
- **Nodemon**: 개발 시 자동 재시작