# Qdrant Deployment Guide

This guide helps you deploy Qdrant vector database to the cloud so you don't need to run it locally.

## 🚀 **Quick Start: Qdrant Cloud (Recommended)**

**Best for: Beginners, production use**
**Cost: Free tier available, then ~$25/month**

### Steps:
1. Go to [cloud.qdrant.io](https://cloud.qdrant.io)
2. Sign up and create a new cluster
3. Choose your region (pick closest to your users)
4. Get your cluster URL and API key
5. Update your `.env.local`:

```bash
# Replace with your actual values from Qdrant Cloud
QDRANT_URL="https://xyz-abc-123.us-east-1-0.aws.cloud.qdrant.io:6333"
QDRANT_API_KEY="your-api-key-from-dashboard"
QDRANT_COLLECTION_NAME="pdf_chunks_mistral"
```

### ✅ **Advantages:**
- Managed service (no maintenance)
- Automatic backups
- High availability
- Free tier available
- Official support

---

## 🔧 **Alternative Options:**

### 1. **Railway** - Simple & Affordable
**Cost: ~$5-10/month**

1. Visit [railway.app](https://railway.app)
2. Deploy Qdrant from Docker Hub: `qdrant/qdrant`
3. Get your service URL from Railway dashboard
4. Update `.env.local`:
```bash
QDRANT_URL="https://your-service.railway.app"
```

### 2. **DigitalOcean App Platform**
**Cost: ~$12/month**

1. Create DigitalOcean account
2. Create new App from Docker Hub: `qdrant/qdrant`
3. Set HTTP port to 6333
4. Update environment variables

### 3. **Self-hosted on VPS**
**Cost: ~$5-20/month**

Deploy on any VPS (DigitalOcean Droplet, Linode, etc.):

```bash
# SSH into your server
docker run -d --name qdrant \
  -p 6333:6333 \
  -v /opt/qdrant:/qdrant/storage \
  --restart unless-stopped \
  qdrant/qdrant
```

---

## 🔄 **Migration from Local to Cloud**

### Before switching:
1. **Backup your local data** (if you have important vectors):
```bash
# Your local data is in ./qdrant_storage/
# You can export/import collections if needed
```

2. **Test the cloud connection**:
```bash
# Update .env.local with cloud credentials
# Restart your Next.js app
npm run dev
```

3. **Verify it works**:
   - Try uploading a PDF
   - Check that vectors are stored in cloud

### After switching:
- Your local Qdrant container can be stopped:
```bash
./qdrant.sh stop
```

---

## 🏷️ **Environment Variables Reference**

```bash
# For Qdrant Cloud or services with API keys:
QDRANT_URL="https://your-cluster.cloud.qdrant.io:6333"
QDRANT_API_KEY="your-api-key"
QDRANT_COLLECTION_NAME="pdf_chunks_mistral"

# For self-hosted without authentication:
QDRANT_URL="https://your-server.com:6333"
# QDRANT_API_KEY not needed
QDRANT_COLLECTION_NAME="pdf_chunks_mistral"

# For local development:
QDRANT_URL="http://localhost:6333"
# QDRANT_API_KEY not needed
QDRANT_COLLECTION_NAME="pdf_chunks_mistral"
```

---

## 🎯 **Recommendation**

For most users, **Qdrant Cloud** is the best choice because:
- ✅ Zero maintenance
- ✅ Professional support
- ✅ Automatic scaling
- ✅ Built-in security
- ✅ Free tier for testing

**Start with the free tier and upgrade as needed!**
