const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(cors()); // CORS 활성화
app.use(morgan('combined')); // 로깅
app.use(express.json({ limit: '10mb' })); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩 파싱

// 임시 데이터베이스 (메모리 저장)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

let nextId = 3;

// 루트 엔드포인트
app.get('/', (req, res) => {
  res.json({
    message: 'Express REST API Server',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      health: '/health'
    }
  });
});

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 사용자 관련 API 엔드포인트
// GET /api/users - 모든 사용자 조회
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length
  });
});

// GET /api/users/:id - 특정 사용자 조회
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// POST /api/users - 새 사용자 생성
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // 간단한 유효성 검증
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
  }
  
  // 이메일 중복 체크
  if (users.find(u => u.email === email)) {
    return res.status(409).json({
      success: false,
      message: 'Email already exists'
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully'
  });
});

// PUT /api/users/:id - 사용자 정보 수정
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // 이메일 중복 체크 (자기 자신 제외)
  if (email && users.find(u => u.email === email && u.id !== id)) {
    return res.status(409).json({
      success: false,
      message: 'Email already exists'
    });
  }
  
  // 사용자 정보 업데이트
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  
  res.json({
    success: true,
    data: users[userIndex],
    message: 'User updated successfully'
  });
});

// DELETE /api/users/:id - 사용자 삭제
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedUser,
    message: 'User deleted successfully'
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;