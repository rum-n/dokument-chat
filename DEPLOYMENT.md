# Deployment Guide for Dokument Chat

This guide covers deploying your Dokument Chat application to various platforms.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Set build settings:
     - Framework Preset: `Create React App`
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Add environment variable: `REACT_APP_API_URL` (you'll get this from Railway)

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-backend-url.railway.app`

#### Backend Deployment (Railway)

1. **Deploy to Railway**

   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`

2. **Configure Environment Variables**

   - In Railway dashboard, go to Variables tab
   - Add all variables from your `.env` file:
     ```
     MISTRAL_API_KEY=your_mistral_api_key
     JWT_SECRET=your_jwt_secret
     QDRANT_URL=your_qdrant_url
     QDRANT_API_KEY=your_qdrant_api_key
     PORT=3001
     ```

3. **Get your backend URL**
   - Railway will provide a URL like: `https://your-app-name.railway.app`
   - Use this URL in your Vercel `REACT_APP_API_URL` environment variable

## 🗄️ Database Setup

### Qdrant Vector Database

You have several options for Qdrant:

1. **Qdrant Cloud** (Recommended)

   - Go to [cloud.qdrant.io](https://cloud.qdrant.io)
   - Create free account
   - Create new cluster
   - Get connection URL and API key

2. **Self-hosted Qdrant**

   - Deploy to any VPS (DigitalOcean, AWS EC2, etc.)
   - Use Docker:
     ```bash
     docker run -p 6333:6333 qdrant/qdrant
     ```

3. **Local Qdrant** (for development)
   - Install locally for testing

## 🔧 Environment Variables

### Backend (.env)

```env
MISTRAL_API_KEY=your_mistral_api_key
JWT_SECRET=your_secure_jwt_secret
QDRANT_URL=https://your-qdrant-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key
PORT=3001
NODE_ENV=production
```

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## 📁 File Storage

For production, consider:

1. **AWS S3** (Recommended)

   - Create S3 bucket
   - Configure CORS
   - Add AWS credentials to backend

2. **DigitalOcean Spaces**

   - Similar to S3, cheaper

3. **Local Storage** (Current setup)
   - Works for small scale
   - Files are lost on server restart

## 🔒 Security Considerations

1. **Environment Variables**

   - Never commit `.env` files
   - Use platform-specific secret management

2. **CORS Configuration**

   - Update CORS settings in backend for production domains

3. **Rate Limiting**

   - Consider adding rate limiting for API endpoints

4. **File Upload Limits**
   - Configure proper file size limits

## 🚀 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] Database (Qdrant) set up
- [ ] File storage configured
- [ ] CORS settings updated
- [ ] Health check endpoint working
- [ ] Frontend and backend URLs configured
- [ ] SSL certificates enabled
- [ ] Domain configured (optional)

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**

   - Update CORS origin in backend to include your frontend URL

2. **Environment Variables Not Loading**

   - Check platform-specific environment variable syntax
   - Ensure variables are set in the correct environment

3. **Build Failures**

   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json

4. **Database Connection Issues**
   - Verify Qdrant URL and API key
   - Check network connectivity

## 📊 Monitoring

Consider adding:

- Application performance monitoring (APM)
- Error tracking (Sentry)
- Log aggregation
- Health check monitoring

## 💰 Cost Estimation

### Free Tier Options:

- **Vercel**: Free for personal projects
- **Railway**: $5/month credit (free tier)
- **Render**: Free tier available
- **Qdrant Cloud**: Free tier available

### Paid Options:

- **DigitalOcean**: $5-20/month
- **AWS**: Pay-as-you-go
- **Google Cloud**: Pay-as-you-go

## 🎯 Next Steps

1. Choose your deployment platform
2. Set up Qdrant database
3. Configure environment variables
4. Deploy backend first
5. Deploy frontend
6. Test the complete application
7. Set up monitoring and logging
8. Configure custom domain (optional)
