# docker/dev.Dockerfile

FROM oven/bun:1.2.5-slim as base

WORKDIR /app/

# Copy only package files first to leverage Docker caching
COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./

FROM base as db-build
COPY ./packages/db ./packages/db
RUN bun install
RUN bun run db build


FROM base 
COPY --from=db-build /app/packages/db/dist /app/packages/db/dist
COPY --from=db-build /app/packages/db/package.json /app/packages/db/package.json


# Copy application code after dependencies
COPY ./apps/api-gateway ./apps/api-gateway

# Install dependencies
RUN bun install

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN bun run api build

# Start the application
CMD bun run api start
