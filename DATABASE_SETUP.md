# Database Setup Instructions

## Prerequisites
1. Make sure you have a Vercel account and are logged in
2. Install Vercel CLI: `npm install -g vercel`

## Setup Steps

### 1. Create Vercel Postgres Database
```bash
# Login to Vercel first
vercel login

# Link your project
vercel link

# Create PostgreSQL database
vercel storage create postgres

# Pull environment variables (includes DATABASE_URL)
vercel env pull .env.local
```

### 2. Alternative: Manual Database Setup
If you prefer to use a different provider, update your `.env.local` file with your database URL:

```env
# For Vercel Postgres (auto-generated)
DATABASE_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"

# For Supabase
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# For Neon
DATABASE_URL="postgresql://username:password@xxx.neon.tech/main"

# For Railway
DATABASE_URL="postgresql://postgres:password@xxx.railway.app:5432/railway"
```

### 3. Run Database Migrations
```bash
# Generate Prisma client
npm run db:generate

# Create and run migrations (for development)
npm run db:migrate

# Or push schema directly (for prototyping)
npm run db:push

# Seed the database with demo data
npm run db:seed
```

### 4. Development Commands
```bash
# View your database in the browser
npm run db:studio

# Reset database (development only)
npx prisma migrate reset

# Deploy schema changes (production)
npx prisma migrate deploy
```

## Environment Variables Required

Make sure your `.env.local` contains:
```env
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-super-secret-jwt-key"
MISTRAL_API_KEY="your-mistral-api-key"
QDRANT_URL="your-qdrant-url"
```

## Production Deployment

For Vercel deployment, make sure to:
1. Set environment variables in Vercel dashboard
2. Add to build command: `npx prisma generate && next build`
3. Database migrations will run automatically on deployment

## Testing the Setup

1. Start your development server: `npm run dev`
2. Try signing up with a new account
3. Login with demo account: `demo@example.com` / `demo123`
4. Check database with: `npm run db:studio`

## Troubleshooting

### Common Issues:
1. **"Database does not exist"**: Run `npm run db:push` or `npm run db:migrate`
2. **"Prisma Client not generated"**: Run `npm run db:generate`
3. **Connection issues**: Check your DATABASE_URL format
4. **Migration errors**: Try `npx prisma migrate reset` (development only)

### Database Providers Comparison:
- **Vercel Postgres**: Best for Vercel deployments, simple setup
- **Supabase**: Great free tier, additional features (auth, storage)
- **Neon**: Serverless PostgreSQL, good for variable workloads
- **Railway**: Simple and affordable, good for small projects
