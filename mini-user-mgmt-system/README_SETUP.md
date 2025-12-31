# Mini User Management System - Setup Guide

A full-stack user management system with authentication, role-based access control, and user lifecycle management.

## Features

### Backend
- User authentication (signup, login, logout)
- Email/password authentication with bcrypt hashing
- Password strength validation
- Role-based access control (admin/user)
- User management endpoints
- Protected routes with authentication verification
- Input validation and error handling
- RESTful API with tRPC

### Frontend
- Login page with form validation
- Signup page with password strength requirements
- Admin dashboard with user management
- User profile management
- Password change functionality
- Responsive design with Tailwind CSS
- Toast notifications for user feedback

### Database
- MySQL database
- User table with roles and status
- Password hashing with bcrypt

## Tech Stack

- **Backend**: Node.js, Express, tRPC
- **Frontend**: React 19, Tailwind CSS 4
- **Database**: MySQL with Drizzle ORM
- **Authentication**: JWT/Session-based
- **Testing**: Vitest
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm)
- MySQL database

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd mini-user-mgmt-system
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file:
```env
DATABASE_URL=mysql://user:password@localhost:3306/user_management_system
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=development
PORT=3000
VITE_APP_TITLE=Mini User Management System
```

4. **Set up database**
```bash
pnpm db:push
```

5. **Start development server**
```bash
pnpm dev
```

Visit `http://localhost:3000`

## Project Structure

```
mini-user-mgmt-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database helpers
│   └── _core/             # Core infrastructure
├── drizzle/               # Database schema
│   └── schema.ts          # Table definitions
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build

# Testing
pnpm test             # Run vitest tests

# Database
pnpm db:push          # Run migrations
pnpm db:studio        # Open database studio

# Code quality
pnpm check            # TypeScript check
pnpm format           # Format code with Prettier
```

## API Endpoints

### Authentication
- `POST /api/trpc/auth.signup` - Create new account
- `POST /api/trpc/auth.login` - Login with email/password
- `POST /api/trpc/auth.logout` - Logout
- `GET /api/trpc/auth.me` - Get current user

### User Management
- `GET /api/trpc/users.profile` - Get user profile
- `POST /api/trpc/users.updateProfile` - Update profile
- `POST /api/trpc/users.changePassword` - Change password
- `GET /api/trpc/users.list` - Get all users (admin only)
- `POST /api/trpc/users.activate` - Activate user (admin only)
- `POST /api/trpc/users.deactivate` - Deactivate user (admin only)

## Testing

The project includes 25 comprehensive vitest tests covering:
- User signup with validation
- User login with password verification
- User management operations
- Role-based access control
- Error handling

Run tests:
```bash
pnpm test
```

## Deployment

### GitHub
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mini-user-mgmt-system.git
git push -u origin main
```

### Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build command: `pnpm build`
4. Set start command: `pnpm start`
5. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Default Admin Account

The system creates an admin account based on the OAuth owner. For local development:
- Email: Configure in environment variables
- Password: Set during signup

## Security Features

- ✅ Password hashing with bcrypt
- ✅ Password strength validation
- ✅ Protected routes with authentication
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ Error handling with appropriate HTTP status codes
- ✅ Secure session management

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | MySQL connection string | Yes |
| JWT_SECRET | Secret key for JWT signing | Yes |
| NODE_ENV | Environment (development/production) | Yes |
| PORT | Server port | No (default: 3000) |
| VITE_APP_TITLE | App title | No |
| VITE_APP_LOGO | App logo path | No |

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Ensure MySQL is running
- Check database credentials

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Commit and push
5. Create a pull request

## License

MIT

## Support

For issues or questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review the code comments
3. Check test files for usage examples

## Next Steps

1. Deploy to Vercel using the deployment guide
2. Set up a production MySQL database
3. Configure custom domain
4. Add email verification
5. Implement password reset functionality
6. Add user activity logging
