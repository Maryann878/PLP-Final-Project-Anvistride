#!/bin/bash

# Development script that starts Docker backend and local frontend
# Handles cleanup on exit

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down...${NC}"
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo -e "${BLUE}🐳 Stopping Docker containers...${NC}"
    cd server
    docker-compose down
    cd ..
    echo -e "${GREEN}✅ Cleanup complete${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

echo -e "${BLUE}🎯 Starting development environment...${NC}"
echo -e "   ${BLUE}Backend:${NC} Docker (localhost:5000)"
echo -e "   ${BLUE}Frontend:${NC} Local (localhost:5173)"
echo ""

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop first.${NC}"
    exit 1
fi

# Start Docker containers
echo -e "${BLUE}🐳 Starting Docker containers...${NC}"
cd server
docker-compose up -d
cd ..

# Wait for backend
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
node scripts/wait-for-backend.js

# Start frontend
echo ""
echo -e "${BLUE}🚀 Starting frontend dev server...${NC}"
npm run dev -w client &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✨ Development environment is ready!${NC}"
echo -e "   ${GREEN}Frontend:${NC} http://localhost:5173"
echo -e "   ${GREEN}Backend:${NC}  http://localhost:5000"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for frontend to finish
wait $FRONTEND_PID

