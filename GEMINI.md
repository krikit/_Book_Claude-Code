# GEMINI.md

## Directory Overview

This repository contains educational materials and code examples for the Korean book "한 걸음 앞선 개발자가 지금 꼭 알아야 할 클로드 코드" (Claude Code Practical Guide for Advanced Developers). The project is structured as a 4-week learning curriculum covering Claude Code fundamentals, configuration, workflow strategies, and advanced optimization techniques.

The repository is organized by learning weeks:

- `week1/` - Claude Code basics (installation, built-in commands, local analysis, directory handling, web deployment)
- `week2/` - Configuration and setup (CLAUDE.md files, prompting, execution modes, tools, MCP integration)
- `week3/` - Workflow strategies (project design, bootstrapping, TDD, refactoring, documentation)
- `week4/` - Advanced optimization (LLM optimization, custom commands, extensions, MCP strategies, multi-agent systems)

Each week contains daily folders (Mon-Fri) with practical examples and weekend reading materials.

## Key Files

- `README.md`: The main README file for the repository, providing an overview of the book and the repository's structure.
- `CLAUDE.md`: Provides guidance to Claude Code (claude.ai/code) when working with code in this repository. It contains a detailed overview of the project, its structure, and common development patterns.
- `week*/*/README.md`: Each week and day has its own README file with more specific information about the topics covered.

## Usage

This repository is intended to be used as a companion to the book "한 걸음 앞선 개발자가 지금 꼭 알아야 할 클로드 코드". The code examples and exercises can be used to follow along with the book's content.

## Code Project Examples

The repository contains various code project examples, mostly using React/Node.js.

### Common Development Patterns

- **React applications**: `npm start`, `npm test`, `npm run build`
- **Express APIs**: `npm start` or `node server.js`
- **Full-stack projects**: Often have separate `client/` and `server/` directories

### Testing Commands

- `npm test`: Run unit tests
- `npm run test:e2e`: End-to-end tests (when available)
- `npm run test:integration`: Integration tests (when available)

### Build and Linting

- `npm run build`: Production build
- `npm run lint`: ESLint checks
- `npm run typecheck`: TypeScript type checking (for TS projects)

### Key Project Examples

- `week2/Wed/cafe_reservation_service/`: Monorepo cafe booking system with Prisma
- `week3/Mon/online-shopping-mall/`: E-commerce platform (both monorepo and microservices versions)
- `week3/Tue/cookshare/`: Recipe sharing platform
