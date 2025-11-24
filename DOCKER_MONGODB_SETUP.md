# 🐳 Docker + MongoDB Atlas Setup Guide

## ✅ Updated Configuration

Your `docker-compose.yml` has been updated to support **both** MongoDB Atlas and local Docker MongoDB.

---

## 🔧 How It Works

The `docker-compose.yml` now uses environment variable override:

```yaml
MONGODB_URI: ${MONGODB_URI:-mongodb://admin:password@mongodb:27017/anvistride?authSource=admin}
```

**This means:**
- ✅ If `MONGODB_URI` is set in `.env` → Uses MongoDB Atlas
- ✅ If `MONGODB_URI` is NOT set → Falls back to local Docker MongoDB

---

## 📋 Setup Options

### Option 1: Use MongoDB Atlas (Recommended)

**For local Docker development with Atlas:**

1. **Create `.env` file in project root:**
   ```env
   MONGODB_URI=mongodb+srv://maryannnwagor_db_user:YOUR_PASSWORD@cluster0.bukbrs7.mongodb.net/anvistride?retryWrites=true&w=majority
   JWT_SECRET=your-local-dev-secret
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

2. **Start Docker:**
   ```bash
   docker-compose up -d
   ```

3. **Result:**
   - Backend connects to MongoDB Atlas ✅
   - Local MongoDB container still starts (but not used)
   - You can stop it to save resources (see below)

---

### Option 2: Use Local Docker MongoDB

**For local development with Docker MongoDB:**

1. **Don't set `MONGODB_URI` in `.env`** (or remove it)

2. **Start Docker:**
   ```bash
   docker-compose up -d
   ```

3. **Result:**
   - Backend connects to local Docker MongoDB ✅
   - Uses: `mongodb://admin:password@mongodb:27017/anvistride?authSource=admin`

---

## 🚀 For Railway Deployment

**Railway doesn't use `docker-compose.yml`** - it uses the `Dockerfile` directly.

**What you need to do:**

1. **Go to Railway Dashboard**
   - Your Project → Your Service → Variables

2. **Add these variables:**
   ```
   MONGODB_URI=mongodb+srv://maryannnwagor_db_user:YOUR_PASSWORD@cluster0.bukbrs7.mongodb.net/anvistride?retryWrites=true&w=majority
   JWT_SECRET=[generate secure random string]
   CLIENT_URL=https://anvistride.pages.dev
   NODE_ENV=production
   ```

3. **That's it!** Railway will use these environment variables.

---

## 💡 Optional: Disable Local MongoDB Service

If you're **only** using MongoDB Atlas and want to save resources:

1. **Comment out the MongoDB service in `docker-compose.yml`:**
   ```yaml
   services:
     # mongodb:
     #   image: mongo:7
     #   ... (comment out entire service)
   
     backend:
       # ... keep as is
       depends_on:
         # mongodb:  # Comment this out too
         #   condition: service_healthy
   ```

2. **Or create `docker-compose.atlas.yml`:**
   ```yaml
   services:
     backend:
       # ... same as docker-compose.yml but without mongodb service
   ```

3. **Run with:**
   ```bash
   docker-compose -f docker-compose.atlas.yml up -d
   ```

---

## 📝 Summary

### What Changed:

✅ **docker-compose.yml** - Now uses `${MONGODB_URI}` environment variable
- If set → Uses MongoDB Atlas
- If not set → Uses local Docker MongoDB

### What You Need to Do:

1. **For Local Docker Development:**
   - Create `.env` file with your MongoDB Atlas connection string
   - Or don't set it to use local Docker MongoDB

2. **For Railway:**
   - Set `MONGODB_URI` in Railway Variables (already documented)
   - Railway doesn't use docker-compose.yml

3. **For Local Development (without Docker):**
   - Create `server/.env` with MongoDB Atlas connection string
   - Run: `cd server && npm start`

---

## ✅ Verification

### Test Local Docker with Atlas:

1. **Create `.env` in project root:**
   ```env
   MONGODB_URI=mongodb+srv://maryannnwagor_db_user:YOUR_PASSWORD@cluster0.bukbrs7.mongodb.net/anvistride?retryWrites=true&w=majority
   ```

2. **Start:**
   ```bash
   docker-compose up -d
   ```

3. **Check logs:**
   ```bash
   docker-compose logs backend
   ```
   Should see: `✅ MongoDB Connected`

4. **Test:**
   ```bash
   curl http://localhost:5000/api/health
   ```

---

## 🎯 Quick Reference

**Local Docker with Atlas:**
- Set `MONGODB_URI` in `.env` (project root)
- Run: `docker-compose up -d`

**Local Docker with Local MongoDB:**
- Don't set `MONGODB_URI` in `.env`
- Run: `docker-compose up -d`

**Railway:**
- Set `MONGODB_URI` in Railway Variables
- Railway auto-deploys

**Local Development (no Docker):**
- Set `MONGODB_URI` in `server/.env`
- Run: `cd server && npm start`

---

**All set!** Your Docker configuration now supports MongoDB Atlas! 🎉

