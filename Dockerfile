# Base Bun image
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bun run build 

FROM oven/bun:1 AS production

WORKDIR /app

COPY package.json ./
COPY drizzle.config.ts ./
COPY wait-for-db.sh ./

RUN chmod +x wait-for-db.sh
RUN bun install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/drizzle/migrations ./src/drizzle/migrations
COPY --from=builder /app/src/drizzle/schema ./src/drizzle/schema
COPY --from=builder /app/src/env.ts ./src/env.ts

EXPOSE 3000

ENV POSTGRES_URL=postgresql://docker:docker@service-pg:5432/backend-developer-test
ENV PORT=3000

CMD ["./wait-for-db.sh"]