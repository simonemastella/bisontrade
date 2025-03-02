# docker/dev.Dockerfile
FROM oven/bun:latest

WORKDIR /app/

# Copy only package files first to leverage Docker caching
COPY package.json bun.lockb ./

# Copy application code after dependencies
COPY ./apps/api-gateway ./apps/api-gateway

# Install dependencies
RUN bun install

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN bun run api build

# Start the application
CMD bun run api start
