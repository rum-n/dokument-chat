# DigitalOcean Deployment for Qdrant

## Setup Steps:

1. **Create a DigitalOcean account**
2. **Create a new App**
3. **Use Docker Hub source: `qdrant/qdrant`**
4. **Configure:**
   - HTTP Port: 6333
   - Environment: Production
   - Instance size: Basic ($12/month)

5. **Update your environment:**
   ```bash
   QDRANT_URL="https://your-app-name.ondigitalocean.app"
   ```

## Cost: ~$12-25/month
