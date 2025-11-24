# ======================
# Base image
# ======================
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# ======================
# Dependencies stage
# ======================
FROM base AS deps

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN if [ -f package-lock.json ]; then npm ci --omit=dev && npm cache clean --force; \
    else npm install --omit=dev && npm cache clean --force; fi

# ======================
# Development stage
# ======================
FROM base AS dev

# Copy package files
COPY package*.json ./

# Install all dependencies for dev
RUN npm install

# Copy code (assumes this Dockerfile is inside server/)
COPY . .

# Default dev command
CMD ["npm", "run", "dev"]

# ======================
# Production build stage
# ======================
FROM base AS builder

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN if [ -f package-lock.json ]; then npm ci && npm cache clean --force; \
    else npm install && npm cache clean --force; fi

# Copy application code
COPY . .

# ======================
# Production runner stage
# ======================
FROM node:20-alpine AS runner

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Set working directory
WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application code from builder stage
# Copy everything except node_modules (which we already copied from deps)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src

# Install curl for healthcheck (must be before USER switch)
RUN apk add --no-cache curl

# Switch to non-root user
USER nodejs

# Expose backend port (Railway will map their PORT to this)
EXPOSE 5000

# Health check
# Uses PORT env var if set (Railway provides this), otherwise defaults to 5000
# The server listens on 0.0.0.0:PORT, so healthcheck must use 0.0.0.0 or 127.0.0.1
# Using 127.0.0.1 is safer than localhost (avoids DNS resolution issues)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD sh -c 'curl -f http://127.0.0.1:${PORT:-5000}/health || exit 1'

# Start the server
CMD ["node", "src/server.js"]
