# TypeScript Express Server

A modern TypeScript Express server with health monitoring, authentication, and containerization support.

## Features

- 🚀 **TypeScript** - Full type safety and modern JavaScript features
- 🏥 **Health Endpoint** - Built-in health check at `/health`
- 🔐 **JWT Authentication** - Ready for JWT-based authentication
- 🐳 **Docker Support** - Containerized with multi-stage builds
- 🧪 **Testing** - Vitest for unit and integration testing
- 📦 **Database** - Better SQLite3 for local development
- 🔒 **Security** - bcryptjs for password hashing, Zod for validation

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The server will be available at http://localhost:3000
```

### Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker

```bash
# Build Docker image
docker build -t express-server .

# Run container
docker run -p 3000:3000 express-server
```

## API Endpoints

- `GET /health` - Health check endpoint returns `{ ok: true }`

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests

## CI/CD

This project includes GitHub Actions workflow for:

- ✅ **Automated Testing** - Runs tests on every push and PR
- 🏗️ **TypeScript Build** - Validates TypeScript compilation
- 🐳 **Docker Build** - Builds and pushes Docker images to GitHub Container Registry
- 📦 **Multi-Platform** - Supports multiple architectures

## Status Badges

![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)
![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)
![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)
![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)
![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)
![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)
![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)

## Project Structure

```
├── src/
│   └── server.ts          # Main server file
├── dist/                  # Compiled JavaScript (generated)
├── tests/                 # Test files
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions workflow
├── Dockerfile             # Docker configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── .env                   # Environment variables
```

## Dependencies

### Production
- `express` - Web framework
- `jsonwebtoken` - JWT token handling
- `dotenv` - Environment variable loading
- `zod` - Schema validation
- `bcryptjs` - Password hashing
- `better-sqlite3` - SQLite database

### Development
- `typescript` - TypeScript compiler
- `@types/*` - TypeScript type definitions
- `ts-node` - TypeScript execution
- `nodemon` - Development hot reload
- `vitest` - Testing framework
- `supertest` - HTTP testing

## License

ISC