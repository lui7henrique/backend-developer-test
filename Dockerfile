# Base Bun image
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bun run build && \
  bun run db:generate

FROM oven/bun:1 AS production

WORKDIR /app

COPY package.json ./

RUN bun install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/drizzle/migrations ./src/drizzle/migrations
COPY --from=builder /app/src/drizzle/schema ./src/drizzle/schema
COPY --from=builder /app/src/env.ts ./src/env.ts

COPY .env* ./
COPY drizzle.config.ts ./

EXPOSE 3000

RUN bun run db:migrate
CMD bun run start