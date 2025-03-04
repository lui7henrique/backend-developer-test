🩺 Doctor Appointment System

API for doctor appointment scheduling, built with Fastify, PostgreSQL and Drizzle ORM.

## 🚀 Tech Stack

- Node.js + TypeScript
- Fastify
- PostgreSQL + Drizzle ORM
- Zod validation
- Docker

## ⚡ Features

- 👨‍⚕️ Doctor profile management
- 📅 Flexible scheduling system with recurring slots
- 🔍 Appointment booking and management
- 📊 Data validation with Zod schemas
- 🔄 Multiple recurrence patterns (daily, weekly, monthly)

## 🏃‍♂️ Quick Start

Prerequisites: Node.js and Docker

```bash
# Clone and install
git clone https://github.com/lui7henrique/backend-developer-test
bun install

# Setup
docker compose up -d
cp .env.example .env

# Run migrations and start
bun run db:migrate
bun run dev
```

Access the API at http://localhost:3000

## 📦 Build

```bash
bun run build
```
