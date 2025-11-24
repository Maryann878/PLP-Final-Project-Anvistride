# 🐳 Docker + MongoDB Atlas Setup Explained

## Understanding the Architecture

### MongoDB Atlas (Cloud Service)
- ✅ **Runs on MongoDB's cloud servers** (not in Docker)
- ✅ **Accessible over the internet** via connection string
- ✅ **No Docker container needed** - it's a managed service

### Your Backend (Docker Container)
- ✅ **Runs in Docker** on your local machine
- ✅ **Connects to MongoDB Atlas** over the internet
- ✅ **Uses the connection string** to reach Atlas

---

## How It Works

```
┌─────────────────────────────────────┐
│   Your Local Machine                │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  Docker Container           │  │
│   │  (Backend Server)           │  │
│   │                             │  │
│   │  Connects via:              │  │
│   │  mongodb+srv://...          │  │
│   └───────────┬─────────────────┘  │
│               │                     │
└───────────────┼─────────────────────┘
                │
                │ Internet Connection
                │
┌───────────────┼─────────────────────┐
│               │                     │
│   ┌───────────▼─────────────────┐  │
│   │  MongoDB Atlas              │  │
│   │  (Cloud Service)            │  │
│   │  cluster0.bukbrs7.mongodb.net│  │
│   └─────────────────────────────┘  │
│                                     │
│   MongoDB's Cloud Servers          │
└─────────────────────────────────────┘
```

---

## Setup Steps

### Step 1: Create `.env` file in project root

```env
MONGODB_URI=mongodb+srv://maryannnwagor_db_user:YOUR_PASSWORD@cluster0.bukbrs7.mongodb.net/anvistride?retryWrites=true&w=majority
JWT_SECRET=your-local-dev-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 2: Run backend in Docker (connects to Atlas)

```bash
docker-compose -f docker-compose.atlas.yml up -d
```

**What happens:**
- ✅ Backend container starts
- ✅ Backend reads `MONGODB_URI` from `.env`
- ✅ Backend connects to MongoDB Atlas (cloud)
- ✅ No local MongoDB container needed

### Step 3: Verify connection

```bash
docker-compose -f docker-compose.atlas.yml logs backend
```

Should see:
```
✅ MongoDB Connected
🚀 Server running on 0.0.0.0:5000
```

---

## Two Options

### Option 1: Use MongoDB Atlas (Recommended)

**File:** `docker-compose.atlas.yml`
- ✅ Backend runs in Docker
- ✅ Connects to MongoDB Atlas (cloud)
- ✅ No local MongoDB container

**Command:**
```bash
docker-compose -f docker-compose.atlas.yml up -d
```

### Option 2: Use Local Docker MongoDB

**File:** `docker-compose.yml`
- ✅ Backend runs in Docker
- ✅ Local MongoDB runs in Docker
- ✅ Both containers on same network

**Command:**
```bash
docker-compose up -d
```

---

## Summary

**MongoDB Atlas:**
- ❌ Does NOT run in Docker
- ✅ Runs on MongoDB's cloud servers
- ✅ Accessible via connection string

**Your Backend:**
- ✅ CAN run in Docker
- ✅ Connects to Atlas over internet
- ✅ Uses `MONGODB_URI` environment variable

**Result:**
- Backend container → Internet → MongoDB Atlas (cloud)

---

## Quick Start with Atlas

1. **Create `.env`** with your Atlas connection string
2. **Run:** `docker-compose -f docker-compose.atlas.yml up -d`
3. **Check logs:** `docker-compose -f docker-compose.atlas.yml logs -f backend`

That's it! Your backend runs in Docker and connects to Atlas! 🎉

