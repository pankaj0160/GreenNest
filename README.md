# 🌱 GreenNest

> AI-powered gardening ecosystem — plant marketplace, gardener booking, and intelligent plant care.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com)

---

## 📐 Architecture

```
greennest/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/greennest.git
cd greennest

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Environment Setup

```bash
# Backend
cp server/.env.example server/.env
# Fill in your MongoDB URI, JWT secret, etc.

# Frontend
cp client/.env.example client/.env
# VITE_API_URL is pre-configured for local dev
```

### 3. Run

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client && npm run dev
```

### 4. Verify
- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/api/health

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| State | Redux Toolkit, TanStack Query |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + HTTP-only cookies |
| File Storage | Cloudinary |
| AI | OpenAI / Gemini + LangChain |
| Deployment | Vercel (FE) + Render (BE) |

---

## 📦 Project Phases

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Foundation Setup | ✅ Done |
| 2 | Auth & RBAC | 🔄 Next |
| 3 | Marketplace | ⏳ Pending |
| 4 | Cart & Orders | ⏳ Pending |
| 5 | Gardener Services | ⏳ Pending |
| 6 | Admin Dashboard | ⏳ Pending |
| 7 | Background Jobs | ⏳ Pending |
| 8 | AI Chatbot (RAG) | ⏳ Pending |
| 9 | Plant Diagnosis AI | ⏳ Pending |
| 10-14 | Agentic AI Features | ⏳ Pending |
| 15 | Security & Optimization | ⏳ Pending |
| 16 | Deployment | ⏳ Pending |

---

## 🗂️ Backend Structure

```
server/src/
├── config/          # DB, env, cloudinary config
├── controllers/     # Route handlers (thin layer)
├── models/          # Mongoose schemas
├── routes/          # Express routers
├── middleware/      # Auth, error handling, validation
├── services/        # Business logic layer
├── utils/           # Helpers (AppError, apiResponse, asyncHandler)
├── constants/       # HTTP status codes, messages
├── validators/      # express-validator schemas
├── ai/              # LangChain, RAG, embeddings
├── agents/          # LangGraph agentic workflows
├── jobs/            # BullMQ queues & workers
├── app.js           # Express app config
└── server.js        # Entry point
```

## 🗂️ Frontend Structure

```
client/src/
├── assets/          # Images, fonts, SVGs
├── components/      # Reusable UI components
├── pages/           # Route-level page components
├── layouts/         # Shell layouts (Main, Auth, Dashboard)
├── routes/          # AppRouter, ProtectedRoute, RoleRoute
├── services/        # Axios instance + API service files
├── store/           # Redux store + slices
├── hooks/           # Custom React hooks
├── utils/           # cn(), formatters, validators
├── constants/       # Route paths, query keys
└── ai/              # AI chat widgets, streaming hooks
```

---

## 📡 API Reference

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/products` | List products |
| GET | `/api/categories` | List categories |
| ... | ... | More in each phase |

---

## 🤝 Contributing

This is a portfolio project. PRs and feedback welcome!

---

## 📄 License

MIT
