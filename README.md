This is a [Next.js](https://nextjs.org) project that allows users to upload PDF documents and chat with them using AI.

## Prerequisites

- Node.js 18+
- Docker (for local Qdrant development)
- Mistral AI API key
- PostgreSQL database

## Vector Database Setup

This application requires Qdrant vector database. You have two options:

### 🔧 **Local Development (Current Setup)**
```bash
# Start local Qdrant with Docker
./qdrant.sh start
```

### ☁️ **Production/Cloud (Recommended)**
For production deployment, see **[QDRANT_DEPLOYMENT.md](./QDRANT_DEPLOYMENT.md)** for cloud options including:
- Qdrant Cloud (managed service)
- Railway, DigitalOcean, AWS, etc.

## Getting Started

1. **Start Qdrant Vector Database:**
   ```bash
   # Using the provided script
   ./qdrant.sh start
   
   # Or using Docker directly
   docker run -d --name qdrant -p 6333:6333 -p 6334:6334 -v "$(pwd)/qdrant_storage:/qdrant/storage" qdrant/qdrant
   ```

2. **Configure Environment Variables:**
   Make sure your `.env.local` file contains:
   ```bash
   QDRANT_URL="http://localhost:6333"
   QDRANT_COLLECTION_NAME="pdf_chunks_mistral"
   MISTRAL_API_KEY="your-mistral-api-key"
   JWT_SECRET="your-jwt-secret"
   ```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
