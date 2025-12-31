# Deployment Guide - Mini User Management System

This guide explains how to deploy the Mini User Management System to GitHub and Vercel.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- GitHub account
- Vercel account
- MySQL database (local or cloud-hosted)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mini-user-mgmt-system
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=mysql://username:password@localhost:3306/user_management_system

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_key_here

# Server Configuration
NODE_ENV=development
PORT=3000

# Frontend Configuration
VITE_APP_TITLE=Mini User Management System
VITE_APP_LOGO=/logo.svg
```

### 4. Set Up Database

If using a local MySQL database:

```bash
# Create database
mysql -u root -p
CREATE DATABASE user_management_system;
EXIT;
```

### 5. Run Database Migrations

```bash
pnpm db:push
```

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## GitHub Deployment

### 1. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Mini User Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mini-user-mgmt-system.git
git push -u origin main
```

### 2. Push to GitHub

```bash
git push
```

## Vercel Deployment

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework: Other (Node.js)
   - Root Directory: ./
   - Build Command: `pnpm build`
   - Start Command: `pnpm start`
5. Add environment variables in Vercel dashboard
6. Click "Deploy"

### Environment Variables on Vercel

In your Vercel project settings, add the following environment variables:

```
DATABASE_URL=your_mysql_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
VITE_APP_TITLE=Mini User Management System
VITE_APP_LOGO=/logo.svg
```

## Production Database Setup

For production, use a cloud-hosted MySQL database:

### Recommended Options:
- **AWS RDS**: https://aws.amazon.com/rds/
- **DigitalOcean Managed Database**: https://www.digitalocean.com/products/managed-databases/
- **PlanetScale**: https://planetscale.com/
- **Supabase**: https://supabase.com/

### Steps:
1. Create a MySQL database on your chosen provider
2. Get the connection string (DATABASE_URL)
3. Add it to your Vercel environment variables
4. Run migrations on production database

## Vercel Configuration

Create a `vercel.json` file in the root directory:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": null,
  "outputDirectory": "dist"
}
```

## Testing Before Deployment

```bash
# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database credentials
- Ensure database is accessible from Vercel's servers
- For cloud databases, whitelist Vercel IP addresses

### Build Failures
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Check Node.js version compatibility
- Review build logs in Vercel dashboard

### Environment Variables Not Loading
- Verify variables are set in Vercel dashboard
- Ensure variable names match exactly
- Redeploy after adding/changing variables

## Monitoring and Maintenance

### View Logs
```bash
vercel logs
```

### View Analytics
- Visit your Vercel project dashboard
- Check deployment history and performance metrics

### Update Deployment
```bash
git push origin main
# Vercel will automatically redeploy
```

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] DATABASE_URL uses secure connection (SSL/TLS)
- [ ] Environment variables are not committed to Git
- [ ] .env files are in .gitignore
- [ ] Use HTTPS only for production
- [ ] Enable password hashing (bcrypt) - already implemented
- [ ] Implement rate limiting for API endpoints
- [ ] Add CORS configuration if needed

## Support

For issues or questions:
1. Check Vercel documentation: https://vercel.com/docs
2. Review application logs
3. Test locally before deploying to production
