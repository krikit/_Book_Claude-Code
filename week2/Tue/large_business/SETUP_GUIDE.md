# BiznestHub 개발 환경 세팅 가이드

이 문서는 BiznestHub 프로젝트의 개발 환경을 처음부터 세팅하는 완전한 가이드입니다.

## 📋 목차

1. [사전 준비](#사전-준비)
2. [프로젝트 초기화](#프로젝트-초기화)
3. [패키지 설치](#패키지-설치)
4. [설정 파일](#설정-파일)
5. [데이터베이스 설정](#데이터베이스-설정)
6. [개발 서버 실행](#개발-서버-실행)
7. [배포 준비](#배포-준비)

---

## 사전 준비

### 필수 설치 프로그램

1. **Node.js** (20.x 이상)
   ```bash
   # 버전 확인
   node -v
   npm -v
   ```
   - 설치: https://nodejs.org/

2. **Git**
   ```bash
   git --version
   ```
   - 설치: https://git-scm.com/

3. **VS Code** (권장 에디터)
   - 설치: https://code.visualstudio.com/

### 권장 VS Code 확장

프로젝트 루트에서 VS Code 열기 후 설치:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "Prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 프로젝트 초기화

### 1. 디렉터리 생성 및 이동

```bash
mkdir biznest-hub
cd biznest-hub
```

### 2. Frontend 프로젝트 생성

```bash
# Vite로 React + TypeScript 프로젝트 생성
npm create vite@latest client -- --template react-ts

cd client
npm install
```

### 3. Backend 프로젝트 생성

```bash
cd ..
mkdir server
cd server
npm init -y
```

---

## 패키지 설치

### Frontend (client/)

```bash
cd client

# 핵심 라이브러리
npm install react-router-dom
npm install @tanstack/react-query
npm install zustand
npm install chart.js react-chartjs-2
npm install html5-qrcode
npm install date-fns clsx

# 개발 도구
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
npm install -D eslint-plugin-react eslint-plugin-react-hooks
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom
```

### Backend (server/)

```bash
cd ../server

# 핵심 라이브러리
npm install express cors dotenv
npm install @supabase/supabase-js
npm install prisma @prisma/client

# 개발 도구
npm install -D typescript @types/node @types/express @types/cors
npm install -D ts-node-dev nodemon
```

---

## 설정 파일

### 1. Frontend 설정

#### tailwind.config.js

```bash
cd client
```

파일 생성: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
```

#### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

#### package.json 스크립트 추가

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

#### src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

#### src/test/setup.ts

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### 2. Backend 설정

#### tsconfig.json

```bash
cd ../server
npx tsc --init
```

파일 수정: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "rootDir": "./src",
    "outDir": "./dist",
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"],
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

#### package.json 스크립트 추가

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

#### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### .eslintrc.json

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
}
```

---

## 데이터베이스 설정

### 1. Prisma 초기화

```bash
cd server
npx prisma init --datasource-provider postgresql
```

### 2. 환경 변수 설정

파일 생성: `server/.env`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/biznest?schema=public"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-key"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

파일 복사: `.env.example`

```bash
cp .env .env.example
# .env.example에서 실제 값들은 제거하고 플레이스홀더만 남김
```

### 3. Prisma 스키마 정의

파일 수정: `server/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id @default(uuid())
  email     String     @unique
  name      String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  products  Product[]
  sales     Sale[]
  customers Customer[]
}

model Product {
  id          String      @id @default(uuid())
  name        String
  barcode     String?     @unique
  stock       Int
  minStock    Int         @default(10)
  costPrice   Decimal
  salePrice   Decimal
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  stockLogs   StockLog[]
  saleItems   SaleItem[]
}

model Sale {
  id          String     @id @default(uuid())
  totalAmount Decimal
  createdAt   DateTime   @default(now())
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  items       SaleItem[]
}

model SaleItem {
  id        String  @id @default(uuid())
  quantity  Int
  price     Decimal
  saleId    String
  sale      Sale    @relation(fields: [saleId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
}

model Customer {
  id          String    @id @default(uuid())
  name        String
  phone       String    @unique
  birthday    DateTime?
  points      Int       @default(0)
  visitCount  Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model StockLog {
  id        String   @id @default(uuid())
  type      String   // "IN" | "OUT"
  quantity  Int
  createdAt DateTime @default(now())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

### 4. 마이그레이션 실행

```bash
# Prisma Client 생성
npm run prisma:generate

# 마이그레이션 생성 및 실행
npm run prisma:migrate

# Prisma Studio 실행 (선택사항)
npm run prisma:studio
```

---

## 개발 서버 실행

### 1. 디렉터리 구조 생성

```bash
# Frontend
cd client
mkdir -p src/{components,pages,hooks,store,services,utils,types,test}

# Backend
cd ../server
mkdir -p src/{controllers,routes,services,middleware,utils,types,config}
```

### 2. 기본 서버 파일 생성

파일 생성: `server/src/index.ts`

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (_req: Request, res: Response) => {
  res.json({ message: 'BiznestHub API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 3. 서버 실행

#### Backend 실행

```bash
cd server
npm run dev
```

서버: http://localhost:5000

#### Frontend 실행

```bash
cd client
npm run dev
```

프론트엔드: http://localhost:3000

---

## 배포 준비

### 1. Git 설정

#### .gitignore

루트에 파일 생성: `.gitignore`

```gitignore
# Dependencies
node_modules/
**/node_modules/

# Environment variables
.env
.env.local
.env.*.local
**/.env

# Build outputs
dist/
build/
**/dist/
**/build/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/
.nyc_output/

# Prisma
**/prisma/migrations/
!**/prisma/migrations/.gitkeep

# Temporary files
*.tmp
*.temp
.cache/
```

#### Git 초기화

```bash
cd <project-root>
git init
git add .
git commit -m "Initial commit: BiznestHub setup"
```

### 2. GitHub Actions CI/CD

파일 생성: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./client

    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - name: Install dependencies
        run: npm ci
      - name: Type check
        run: npm run typecheck
      - name: Lint
        run: npm run lint
      - name: Format check
        run: npm run format:check
      - name: Test
        run: npm test -- --run
      - name: Build
        run: npm run build

  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./server

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: biznest_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      - name: Install dependencies
        run: npm ci
      - name: Generate Prisma Client
        run: npx prisma generate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/biznest_test
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/biznest_test
      - name: Build
        run: npm run build
```

### 3. Vercel 배포 (Frontend)

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 배포
cd client
vercel --prod
```

### 4. Railway 배포 (Backend)

1. https://railway.app 접속
2. "New Project" → "Deploy from GitHub"
3. Repository 선택
4. `server/` 디렉터리 지정
5. 환경 변수 설정 (DATABASE_URL, JWT_SECRET 등)
6. 배포 완료

---

## ✅ 체크리스트

설정 완료 후 아래 항목들을 확인하세요:

- [ ] Node.js, npm이 설치되어 있다
- [ ] Frontend 프로젝트가 생성되었다
- [ ] Backend 프로젝트가 생성되었다
- [ ] 모든 패키지가 설치되었다
- [ ] ESLint, Prettier가 작동한다
- [ ] TypeScript 타입 체크가 통과한다
- [ ] Prisma 스키마가 정의되었다
- [ ] 데이터베이스 마이그레이션이 완료되었다
- [ ] Frontend 개발 서버가 실행된다 (http://localhost:3000)
- [ ] Backend 개발 서버가 실행된다 (http://localhost:5000)
- [ ] Git이 초기화되었다
- [ ] GitHub Actions CI가 설정되었다

---

## 🎉 완료!

모든 설정이 완료되었습니다. 이제 개발을 시작할 수 있습니다!

다음 단계:
1. `README.md`를 읽고 프로젝트 구조 파악
2. `PLAN.md`에서 요구사항 확인
3. `TECH_STACK.md`에서 기술 스택 상세 정보 확인
4. 첫 번째 기능 개발 시작!
