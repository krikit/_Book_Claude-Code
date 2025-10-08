# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BiznestHub is a small business management platform targeting Korean small business owners (5 employees or less). The system handles inventory management, sales tracking, and customer management through a unified web application with mobile-first design.

**Target Users**: Cafes, restaurants, retail shops
**Key Features**: QR-based inventory, sales dashboard with charts, customer loyalty points, Excel export for tax filing

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS (port 3000)
- **Backend**: Express + TypeScript (port 5000)
- **Database**: PostgreSQL via Prisma ORM
- **Hosting**: Supabase (DB + Auth), Vercel (frontend), Railway (backend)
- **State Management**: React Query (server state) + Zustand (client state)

## Development Commands

### Frontend (client/)

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format with Prettier
npm run format:check     # Check Prettier formatting
npm test                 # Run all tests with Vitest
npm run test:ui          # Open Vitest UI
```

### Backend (server/)

```bash
npm run dev              # Start dev server (localhost:5000) with hot reload
npm run build            # Compile TypeScript to dist/
npm start                # Run production build
npm run prisma:generate  # Generate Prisma Client (run after schema changes)
npm run prisma:migrate   # Create and run migrations
npm run prisma:studio    # Open Prisma Studio GUI (localhost:5555)
```

### Critical Workflows

**After changing Prisma schema**:
```bash
cd server
npm run prisma:migrate      # Creates migration + updates DB
npm run prisma:generate     # Regenerates Prisma Client
```

**Before committing**:
```bash
cd client
npm run typecheck && npm run lint && npm run format:check
```

## Architecture

### Monorepo Structure

This is a **dual-workspace monorepo** with separate frontend and backend:

```
/client/     # React SPA, proxies /api to backend
/server/     # Express API server
```

### Database Schema

**Core models** (see `server/prisma/schema.prisma`):

- **User** → owns Products, Sales, Customers (multi-tenant by userId)
- **Product** → has stock tracking, barcode, cost/sale prices
- **Sale** → aggregates SaleItems, records totalAmount
- **SaleItem** → links Sale ↔ Product with quantity/price snapshot
- **Customer** → tracks points, visitCount, birthday for reminders
- **StockLog** → immutable audit trail of stock changes (IN/OUT)

**Key relationships**:
- All user data cascades on User deletion
- Sales don't cascade-delete Products (historical integrity)
- StockLog provides append-only inventory history

### Frontend Architecture

**Path aliasing**: Use `@/` prefix for src imports (configured in vite.config.ts)

```typescript
import Button from '@/components/Button'  // resolves to src/components/Button
```

**State management strategy**:
- **Server data** (products, sales): React Query with auto-caching/refetch
- **UI state** (auth, theme): Zustand stores
- **Form state**: Local component state or React Hook Form

**Directory roles**:
- `src/services/` - API client functions (fetch wrappers)
- `src/hooks/` - Custom hooks (useProducts, useSales)
- `src/store/` - Zustand stores
- `src/types/` - Shared TypeScript interfaces

### Backend Architecture

**Express server** (`server/src/index.ts`):
- CORS enabled for localhost:3000
- JSON body parser
- `/health` endpoint for monitoring

**Layer separation** (to be implemented):
```
Routes → Controllers → Services → Prisma Client
```

**Prisma Client usage**:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

## Environment Setup

### Required Environment Variables

**server/.env**:
```env
DATABASE_URL="postgresql://..."          # Supabase connection string
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="eyJ..."
PORT=5000
JWT_SECRET="random-secret-key"
```

Use `.env.example` as template (never commit `.env`).

### First-Time Setup

```bash
# 1. Install dependencies
cd client && npm install
cd ../server && npm install

# 2. Configure environment
cd server
cp .env.example .env
# Edit .env with Supabase credentials

# 3. Initialize database
npm run prisma:migrate
npm run prisma:generate

# 4. Start both servers (separate terminals)
cd server && npm run dev
cd client && npm run dev
```

## Code Style & Conventions

### Commit Messages

Follow conventional commits:
```
feat: add QR scanner component
fix: correct stock calculation bug
docs: update setup guide
refactor: extract sale service logic
```

### TypeScript Patterns

- Use explicit return types for functions
- Prefer `interface` over `type` for object shapes
- Enable all strict mode flags (already configured)

### React Patterns

- Functional components only
- Custom hooks for reusable logic
- React Query for data fetching (not useEffect)

## Testing

**Frontend tests** use Vitest + Testing Library:
- Setup file: `client/src/test/setup.ts`
- Run single test: `npm test -- <filename>`

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to main/develop:

**Frontend checks**:
1. TypeScript compilation
2. ESLint
3. Prettier formatting
4. Vitest tests
5. Production build

**Backend checks**:
1. Prisma migrations (with test PostgreSQL)
2. TypeScript compilation

## Common Pitfalls

1. **Prisma Client not found**: Run `npm run prisma:generate` after `git pull`
2. **Port conflicts**: Backend defaults to 5000, frontend to 3000 (kill existing processes)
3. **Database connection**: Ensure `.env` has valid `DATABASE_URL`
4. **CORS errors**: Frontend must use `/api` prefix to hit proxy (configured in vite.config.ts)
5. **Hot reload not working**: Restart `npm run dev` in both client and server

## Deployment

- **Frontend**: Vercel (auto-deploy from main branch)
- **Backend**: Railway (configure `server/` as root directory)
- **Database**: Supabase (connection pooling recommended for production)

Set environment variables in platform dashboards (never in code).
