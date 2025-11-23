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

# Copy application code
COPY --from=builder /app ./

# Install curl for healthcheck (must be before USER switch)
RUN apk add --no-cache curl

# Switch to non-root user
USER nodejs

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the server
CMD ["node", "src/server.js"]
