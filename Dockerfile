# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base
WORKDIR /app

# Build
FROM base AS builder
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Run
FROM base AS runner
ENV NODE_ENV=production
# Ensure Node.js can resolve modules from both locations
ENV NODE_PATH=/app/node_modules:/app/.output/server/node_modules

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
# Run bun directly to avoid node shim compatibility issues
CMD ["bun", ".output/server/index.mjs"]
