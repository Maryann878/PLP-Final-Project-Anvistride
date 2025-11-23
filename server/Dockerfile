# Use Node.js LTS version
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS dev
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS builder
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .

# Production stage
FROM base AS runner

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy dependencies from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "src/server.js"]

