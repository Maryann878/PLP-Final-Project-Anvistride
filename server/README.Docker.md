# Docker Setup for Anvistride Backend

This guide explains how to run the Anvistride backend using Docker.

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (comes with Docker Desktop)

## Quick Start

### 1. Build and Run with Docker Compose (Recommended)

This will start both MongoDB and the backend server:

```bash
cd server
docker-compose up -d
```

The backend will be available at `http://localhost:5000`

### 2. Build Docker Image Only

If you only want to build the Docker image:

```bash
cd server
docker build -t anvistride-backend .
```

### 3. Run Docker Container

```bash
docker run -d \
  --name anvistride-backend \
  -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e JWT_SECRET=your_jwt_secret \
  -e CLIENT_URL=https://anvistride.pages.dev \
  anvistride-backend
```

## Environment Variables

Create a `.env` file in the `server` directory or set environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password@mongodb:27017/anvistride?authSource=admin
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=https://anvistride.pages.dev
```

## Docker Compose Services

### MongoDB
- **Port**: 27017
- **Default credentials**: admin/password (change in production!)
- **Data persistence**: Stored in `mongodb_data` volume

### Backend
- **Port**: 5000
- **Health check**: `/health` endpoint
- **Depends on**: MongoDB service

## Useful Commands

### View logs
```bash
docker-compose logs -f backend
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes data)
```bash
docker-compose down -v
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Access MongoDB shell
```bash
docker exec -it anvistride-mongodb mongosh -u admin -p password
```

### Check container status
```bash
docker-compose ps
```

## Production Deployment

### For Railway/Render/Other Platforms

1. Build the Docker image:
```bash
docker build -t anvistride-backend .
```

2. Push to a container registry (Docker Hub, GitHub Container Registry, etc.)

3. Deploy using the Dockerfile

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong random secret (use `openssl rand -base64 32`)
- `CLIENT_URL` - Your frontend URL
- `NODE_ENV=production`
- `PORT` - Usually set automatically by the platform

## Troubleshooting

### Container won't start
- Check logs: `docker-compose logs backend`
- Verify environment variables are set
- Ensure MongoDB is healthy: `docker-compose ps`

### Connection refused
- Verify ports are not in use: `netstat -an | grep 5000`
- Check firewall settings

### MongoDB connection errors
- Verify MongoDB container is running: `docker-compose ps mongodb`
- Check MongoDB logs: `docker-compose logs mongodb`
- Verify connection string format

## Development Mode

For development with hot reload, use:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Or run locally without Docker:
```bash
npm run dev
```

