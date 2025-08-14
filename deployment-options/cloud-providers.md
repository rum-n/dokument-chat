# Cloud Provider Deployments

## AWS Options:

### 1. **AWS ECS Fargate** (Recommended)
```bash
# Use AWS CLI or Terraform
# Deploy qdrant/qdrant container
# Cost: ~$15-30/month
```

### 2. **AWS EC2**
```bash
# Launch t3.small instance
# Install Docker and run Qdrant
# Cost: ~$15-20/month + storage
```

## Google Cloud:

### **Cloud Run**
```bash
# Deploy from container registry
# gcr.io/google-containers/qdrant:latest
# Cost: Pay per use (~$10-20/month)
```

## Azure:

### **Container Instances**
```bash
# Deploy Qdrant container
# Cost: ~$15-25/month
```

## Environment Configuration:
```bash
# For cloud deployments, usually you'll get:
QDRANT_URL="https://your-cloud-instance.com:6333"
# Some may require API keys or authentication
```
