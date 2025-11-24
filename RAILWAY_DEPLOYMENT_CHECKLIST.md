# ✅ Railway Deployment - Final Verification Checklist

## 🔍 Pre-Deployment Verification

### ✅ 1. Dockerfile Configuration

**File:** `server/Dockerfile`

**Status:** ✅ **CORRECT**

- ✅ Uses multi-stage build (deps, builder, runner)
- ✅ Copies `src` directory explicitly: `COPY --from=builder /app/src ./src`
- ✅ CMD is correct: `CMD ["node", "src/server.js"]`
- ✅ Exposes port 5000: `EXPOSE 5000`
- ✅ Healthcheck configured: `HEALTHCHECK ... /health`
- ✅ Uses non-root user: `USER nodejs`

**Potential Issue:** ⚠️ Dockerfile expects build context to be `server/` directory

---

### ✅ 2. Railway Configuration

**File:** `railway.json`

**Status:** ⚠️ **NEEDS VERIFICATION**

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "server/Dockerfile",
    "buildContext": "server"  // ⚠️ Railway might not support this field
  }
}
```

**Action Required:**
- Railway might not support `buildContext` in JSON
- **Must set Root Directory in Railway Dashboard:**
  1. Go to Railway Dashboard → Your Service → Settings
  2. Under "Build & Deploy"
  3. Set **Root Directory** to: `server`
  4. Set **Dockerfile Path** to: `Dockerfile` (or `server/Dockerfile`)

---

### ✅ 3. Server Code

**File:** `server/src/server.js`

**Status:** ✅ **CORRECT**

- ✅ Uses `process.env.PORT` with fallback to 5000
- ✅ Binds to `0.0.0.0` (required for Railway)
- ✅ Health endpoint exists: `GET /health`
- ✅ API health endpoint exists: `GET /api/health`
- ✅ Environment variable validation
- ✅ Express 5 compatible (removed `app.options("*")`)

---

### ✅ 4. Package.json

**File:** `server/package.json`

**Status:** ✅ **CORRECT**

- ✅ Start script: `"start": "node src/server.js"`
- ✅ Type: `"type": "module"` (ES modules)
- ✅ All dependencies listed

---

### ✅ 5. Environment Variables

**Required in Railway:**

- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Secure random string
- [ ] `CLIENT_URL` - Your frontend URL (optional but recommended)
- [ ] `NODE_ENV` - Set to `production` (optional but recommended)

**DO NOT SET:**
- ❌ `PORT` - Railway sets this automatically

---

## 🚨 Critical Issue: Build Context

### The Problem

Railway is building from the **root directory**, but the Dockerfile expects the **server directory** as build context.

**Error you're seeing:**
```
ERROR: "/app/src": not found
```

This happens because:
1. Railway builds from root (`/`)
2. Dockerfile does `COPY . .` in builder stage
3. This copies from root, not `server/`
4. So `src/` directory doesn't exist in builder
5. Runner stage can't copy `/app/src` because it doesn't exist

### The Solution

**Option 1: Set Root Directory in Railway Dashboard (RECOMMENDED)**

1. Go to Railway Dashboard
2. Your Project → Your Service → Settings
3. Under "Build & Deploy":
   - **Root Directory:** `server`
   - **Dockerfile Path:** `Dockerfile`
4. Save and redeploy

**Option 2: Update Dockerfile for Root Context (If Option 1 doesn't work)**

If Railway doesn't allow setting root directory, we need to update the Dockerfile:

```dockerfile
# In builder stage, copy from server subdirectory
COPY server/package*.json ./
COPY server/src ./src
```

But this is less ideal.

---

## ✅ Final Checklist Before Deploying

### Railway Dashboard Settings

- [ ] **Root Directory** set to `server`
- [ ] **Dockerfile Path** set to `Dockerfile` (or `server/Dockerfile`)
- [ ] **Build Command** - Leave empty (Dockerfile handles it)
- [ ] **Start Command** - Leave empty (Dockerfile CMD handles it)

### Environment Variables

- [ ] `MONGODB_URI` = `mongodb+srv://maryannnwagor_db_user:YOUR_PASSWORD@cluster0.bukbrs7.mongodb.net/anvistride?retryWrites=true&w=majority`
- [ ] `JWT_SECRET` = [secure random string]
- [ ] `CLIENT_URL` = `https://anvistride.pages.dev` (optional)
- [ ] `NODE_ENV` = `production` (optional)

### MongoDB Atlas

- [ ] Network Access allows `0.0.0.0/0` (all IPs)
- [ ] Connection string is correct
- [ ] Database name is included in connection string

---

## 🧪 Testing After Deployment

1. **Check Railway Logs:**
   ```
   🚀 Server running on 0.0.0.0:PORT
   ✅ MongoDB Connected
   ```

2. **Test Health Endpoint:**
   ```
   https://your-app.railway.app/health
   ```
   Should return: `{"status":"ok",...}`

3. **Test API Health:**
   ```
   https://your-app.railway.app/api/health
   ```
   Should return: `{"status":"ok","database":"connected",...}`

---

## ⚠️ If Build Still Fails

If Railway still can't find `/app/src`, it means Railway is still building from root. In that case:

1. **Check Railway Dashboard** - Ensure Root Directory is set to `server`
2. **If that's not possible**, we need to update the Dockerfile to work from root context
3. **Contact me** and I'll update the Dockerfile accordingly

---

## 📋 Summary

**Current Status:**
- ✅ Dockerfile is correct
- ✅ Server code is correct
- ✅ Package.json is correct
- ⚠️ **Railway needs Root Directory set to `server`**

**Action Required:**
1. Set Root Directory to `server` in Railway Dashboard
2. Set environment variables
3. Redeploy

**Expected Result:**
- ✅ Build succeeds
- ✅ Server starts
- ✅ Connects to MongoDB Atlas
- ✅ Health endpoints work

---

**Ready to deploy once Railway Root Directory is set!** 🚀

