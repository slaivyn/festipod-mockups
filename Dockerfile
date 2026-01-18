# Use the official Bun image
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code and build assets
FROM base AS release
COPY --from=install /app/node_modules node_modules
COPY . .

# Run the app
ENV NODE_ENV=production
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
