# docker/dev.Dockerfile
FROM oven/bun:1.2.5

WORKDIR /app/

# Copy only package files first to leverage Docker caching
COPY package.json ./
COPY bun.lockb ./

# Copy application code after dependencies
COPY ./packages/db ./packages/db
COPY tsconfig.json ./

# Install dependencies
RUN bun install

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Start the application
CMD bun run db typeorm migration:run
