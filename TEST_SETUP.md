# 🧪 Testing Your Setup

## What We'll Test

1. ✅ Backend connects to MongoDB Atlas
2. ✅ Backend health endpoint works
3. ✅ Frontend can start
4. ✅ `npm run dev` starts everything

---

## Pre-Test Checklist

Before running tests, make sure:

- [ ] `server/.env` exists and has:
  ```env
  MONGODB_URI=mongodb+srv://maryannnwagor_db_user:YOUR_PASSWORD@cluster0.bukbrs7.mongodb.net/anvistride?retryWrites=true&w=majority
  JWT_SECRET=your-secret-key
  CLIENT_URL=http://localhost:5173
  NODE_ENV=development
  ```

- [ ] Docker Desktop is running
- [ ] MongoDB Atlas cluster is running and accessible
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0` (all IPs)

---

## Test 1: Backend with Docker + MongoDB Atlas

### Step 1: Start Backend in Docker

```bash
docker-compose -f docker-compose.atlas.yml up -d
```

### Step 2: Check Logs

```bash
docker-compose -f docker-compose.atlas.yml logs -f backend
```

**Expected output:**
```
✅ MongoDB Connected
🚀 Server running on 0.0.0.0:5000
```

### Step 3: Test Health Endpoint

```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"...","uptime":...}
```

### Step 4: Test API Health (with DB status)

```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"...","database":"connected","uptime":...}
```

---

## Test 2: Full Stack with `npm run dev`

### Step 1: Run from Root

```bash
npm run dev
```

**What it does:**
1. Starts Docker backend (using MongoDB Atlas)
2. Waits for backend to be ready
3. Starts frontend dev server

**Expected output:**
```
🎯 Starting development environment...
   Backend: Docker (localhost:5000)
   Frontend: Local (localhost:5173)

🐳 Starting Docker containers (using MongoDB Atlas)...
✅ Docker containers started
⏳ Waiting for backend to be ready...
✅ Backend is ready!

🚀 Starting frontend dev server...

✨ Development environment is ready!
   Frontend: http://localhost:5173
   Backend:  http://localhost:5000

Press Ctrl+C to stop all services
```

### Step 2: Verify Services

1. **Backend:** http://localhost:5000/health
2. **Frontend:** http://localhost:5173

---

## Test 3: Individual Component Tests

### Test Backend Only (No Docker)

```bash
cd server
npm start
```

**Expected:**
- Connects to MongoDB Atlas
- Server runs on port 5000

### Test Frontend Only

```bash
cd client
npm run dev
```

**Expected:**
- Frontend runs on port 5173
- Can make API calls to backend

---

## Troubleshooting

### Issue: Backend can't connect to MongoDB Atlas

**Check:**
1. MongoDB Atlas cluster is running
2. Network Access allows `0.0.0.0/0`
3. Connection string in `server/.env` is correct
4. Password in connection string is correct

**Fix:**
- Go to MongoDB Atlas → Network Access
- Add IP: `0.0.0.0/0`
- Verify connection string format

### Issue: Docker container fails to start

**Check:**
```bash
docker-compose -f docker-compose.atlas.yml logs backend
```

**Common issues:**
- Missing `MONGODB_URI` in `server/.env`
- Invalid connection string format
- MongoDB Atlas not accessible

### Issue: Frontend can't connect to backend

**Check:**
1. Backend is running: `curl http://localhost:5000/health`
2. Frontend API URL is correct in `client/.env` or `client/src/lib/axios.ts`

---

## Success Criteria

✅ **Backend:**
- Docker container starts successfully
- Connects to MongoDB Atlas
- Health endpoint returns 200 OK
- API health shows `"database": "connected"`

✅ **Frontend:**
- Dev server starts on port 5173
- Can access http://localhost:5173
- Can make API calls to backend

✅ **Full Stack:**
- `npm run dev` starts both services
- All services are accessible
- No errors in logs

---

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:5000/health

# Test backend API health (with DB status)
curl http://localhost:5000/api/health

# Check Docker containers
docker ps

# Check backend logs
docker-compose -f docker-compose.atlas.yml logs backend

# Stop everything
docker-compose -f docker-compose.atlas.yml down
```

---

**Ready to test!** Run `npm run dev` from the root folder and verify everything works! 🚀

