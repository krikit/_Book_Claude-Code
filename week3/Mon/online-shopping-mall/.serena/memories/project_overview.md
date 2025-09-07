# Project Overview

## Purpose
Online Shopping Mall Microservices - A comprehensive e-commerce platform built with microservice architecture using PNPM workspace monorepo structure.

## Tech Stack
- **Runtime**: Node.js 18+
- **Package Manager**: PNPM 8+
- **Language**: TypeScript with strict configuration
- **Frontend**: React + Vite (Web), React + Ant Design (Admin), React Native (Mobile)
- **Backend**: Express.js for all microservices
- **Databases**: PostgreSQL, MongoDB, Redis
- **Message Queue**: RabbitMQ
- **Containerization**: Docker & Docker Compose
- **Development Tools**: ESLint, Prettier, Husky, lint-staged

## Architecture
- **Monorepo Structure**: PNPM workspace with services, apps, and shared packages
- **8 Microservices**: User, Product, Order, Payment, Shipping, Cart, Review, Notification
- **3 Frontend Apps**: Web App (port 3100), Admin Panel (port 3200), Mobile App
- **API Gateway**: Unified entry point (port 3000)
- **Shared Packages**: Types, Config, Utils, Shared utilities

## Service Port Allocation
- API Gateway: 3000
- User Service: 3001 (PostgreSQL)
- Product Service: 3002 (MongoDB) 
- Order Service: 3003 (PostgreSQL + RabbitMQ)
- Payment Service: 3004 (PostgreSQL + RabbitMQ + Stripe)
- Shipping Service: 3005 (PostgreSQL + RabbitMQ)
- Cart Service: 3006 (Redis)
- Review Service: 3007 (MongoDB)
- Notification Service: 3008 (RabbitMQ + SendGrid + Twilio)