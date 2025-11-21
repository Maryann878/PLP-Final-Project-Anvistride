# Deployment Guide

This guide will help you deploy Anvistride to production.

## Prerequisites

- MongoDB Atlas account (or MongoDB instance)
- Render account (for backend)
- Vercel account (for frontend)
- GitHub repository

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for Render)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/anvistride?retryWrites=true&w=majority`

## Step 2: Deploy Backend to Render

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**
   - **Name**: `anvistride-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or paid for better performance)

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anvistride?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://anvistride-api.onrender.com`

## Step 3: Deploy Frontend to Vercel

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://anvistride-api.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL: `https://your-project.vercel.app`

## Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Update the `CLIENT_URL` environment variable with your Vercel URL
3. Redeploy the backend service

## Step 5: Test Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Test login functionality
4. Verify real-time features (chat, sync)

## Troubleshooting

### Backend Issues

- **MongoDB Connection Failed**: Check your `MONGODB_URI` and ensure IP is whitelisted
- **CORS Errors**: Verify `CLIENT_URL` matches your frontend domain exactly
- **Socket.IO Not Working**: Ensure WebSocket is enabled on Render (paid plans)

### Frontend Issues

- **API Calls Failing**: Check `VITE_API_BASE_URL` is set correctly
- **Build Errors**: Check build logs in Vercel dashboard
- **Routing Issues**: Verify `vercel.json` rewrite rules

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

## Post-Deployment Checklist

- [ ] Backend health check works: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Real-time features work (Socket.IO)
- [ ] Chat functionality works
- [ ] All CRUD operations work
- [ ] Mobile responsive design works
- [ ] Error handling works correctly
- [ ] Console has no errors

## Monitoring

- **Render**: Check logs in Render dashboard
- **Vercel**: Check logs in Vercel dashboard
- **MongoDB Atlas**: Monitor database usage

## Scaling

- Upgrade Render plan for better performance
- Enable MongoDB Atlas auto-scaling
- Use Vercel Pro for better analytics
- Consider CDN for static assets
