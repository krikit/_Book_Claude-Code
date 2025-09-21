# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains educational materials and code examples for the Korean book "한 걸음 앞선 개발자가 지금 꼭 알아야 할 클로드 코드" (Claude Code Practical Guide for Advanced Developers). The project is structured as a 4-week learning curriculum covering Claude Code fundamentals, configuration, workflow strategies, and advanced optimization techniques.

## Repository Structure

The repository is organized by learning weeks:

- `week1/` - Claude Code basics (installation, built-in commands, local analysis, directory handling, web deployment)
- `week2/` - Configuration and setup (CLAUDE.md files, prompting, execution modes, tools, MCP integration)
- `week3/` - Workflow strategies (project design, bootstrapping, TDD, refactoring, documentation)
- `week4/` - Advanced optimization (LLM optimization, custom commands, extensions, MCP strategies, multi-agent systems)

Each week contains daily folders (Mon-Fri) with practical examples and weekend reading materials.

## Common Development Patterns

### React/Node.js Projects
Most example projects use standard patterns:
- React applications: `npm start`, `npm test`, `npm run build`
- Express APIs: `npm start` or `node server.js`
- Full-stack projects: Often have separate `client/` and `server/` directories

### Testing Commands
Projects typically include:
- `npm test` - Run unit tests
- `npm run test:e2e` - End-to-end tests (when available)
- `npm run test:integration` - Integration tests (when available)

### Build and Linting
Standard commands across projects:
- `npm run build` - Production build
- `npm run lint` - ESLint checks
- `npm run typecheck` - TypeScript type checking (for TS projects)

## Key Project Examples

### Full-Stack Applications
- `week2/Wed/cafe_reservation_service/` - Monorepo cafe booking system with Prisma
- `week3/Mon/online-shopping-mall/` - E-commerce platform (both monorepo and microservices versions)
- `week3/Tue/cookshare/` - Recipe sharing platform

### Specialized Examples
- `week2/Thu/terminal_tools/webpack_optimization/` - Webpack performance optimization
- `week3/Wed/tdd/` - Test-driven development examples
- `week3/Thu/performance_optimization/` - Various performance optimization techniques
- `week4/Mon/memory_system/` - LLM memory and context management

## Architecture Patterns

### Monorepo Structure
Several projects use monorepo patterns with:
- `packages/` - Shared libraries and components
- `apps/` - Individual applications
- Root `package.json` with workspaces configuration

### Microservices Architecture
Some examples demonstrate microservices with:
- `services/` - Individual service directories
- `gateway/` - API gateway implementation
- Docker configurations for containerization

### Database Integration
Projects often include:
- Prisma for ORM (with `prisma/` directories)
- PostgreSQL databases
- Migration files in `prisma/migrations/`

## MCP (Model Context Protocol) Integration

The repository includes MCP examples in:
- `week2/Fri/` - GitHub MCP server integration
- `week4/Thu/mcp/` - Custom MCP server development
- Various projects demonstrate database and API integrations via MCP

## Educational Context

This is a learning repository focused on:
- Practical Claude Code usage patterns
- Korean language documentation and comments
- Progressive skill building from basic to advanced concepts
- Real-world project examples and best practices

When working with this codebase, maintain the educational clarity and practical focus of the examples.