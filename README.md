# MarketNest Backend

Backend API for MarketNest, built with Express and MongoDB. It handles authentication, role-based access control, product lifecycle operations, image upload integration, and brand dashboard data.

## Features

- User signup, login, refresh, and logout endpoints
- JWT access token and refresh token based authentication model
- Role-aware authorization for brand-only operations
- Product CRUD workflows with publish and draft states
- Soft delete behavior for product archival
- Product browsing with pagination, category filter, and search
- Cloudinary-ready upload pipeline for product images
- Seed script to load realistic sample users and products

## Tech Stack

- Node.js
- Express
- MongoDB and Mongoose
- JWT and bcrypt
- express-validator
- Multer and Cloudinary
- Helmet, CORS, cookie-parser, morgan

## 1. Architecture Explanation

The backend uses a clean layered architecture:

- Route layer: Declares endpoint paths and middleware composition.
- Middleware layer: Handles auth, role checks, upload handling, validation, and errors.
- Controller layer: Manages request-response concerns and delegates business logic.
- Service layer: Contains core domain logic for auth, product operations, uploads, and dashboard summaries.
- Model layer: Defines MongoDB schemas and indexes.
- Utility layer: Shared primitives such as AppError, JWT helpers, and validators.

Request lifecycle:

1. Request enters an Express route.
2. Validation, authentication, and role middleware run.
3. Controller calls service methods.
4. Service interacts with Mongoose models and returns sanitized data.
5. Controller returns structured JSON response.

## 2. Authentication Flow Explanation

Auth is implemented using short-lived access tokens and long-lived refresh tokens.

1. Signup endpoint creates a user with a bcrypt-hashed password.
2. Login endpoint validates credentials, returns access token, and stores refresh token in both DB and HTTP-only cookie.
3. Protected endpoints require Authorization header with Bearer access token.
4. Refresh endpoint validates cookie refresh token and returns a new access token.
5. Logout endpoint clears stored refresh token and clears refresh cookie.

Token behavior:

- Access token expiry: 15 minutes
- Refresh token expiry: 7 days

## 3. Folder Structure Overview

```text
backend/
  config/                 # DB and Cloudinary configuration
  controllers/            # Route handlers
  middleware/             # Auth, role, validation, upload, error middleware
  models/                 # Mongoose models
  routes/                 # Endpoint definitions
  scripts/                # Utility scripts (including seed)
  services/               # Business logic
  utils/                  # Shared helpers, errors, JWT, validators
  app.js                  # Express app setup
  server.js               # Startup and graceful shutdown
```

## 4. Security Decisions

- Passwords are stored only as bcrypt hashes.
- Refresh tokens are delivered in HTTP-only cookies to reduce JavaScript access.
- Cookie policy is environment-aware with secure and sameSite controls in production.
- Access tokens are short-lived to reduce replay window.
- Refresh token rotation logic is backed by DB token matching checks.
- express-validator enforces request payload validation for auth and product routes.
- Role middleware restricts sensitive endpoints to brand users.
- Helmet sets secure HTTP headers.
- Centralized error handler prevents inconsistent error output and limits stack exposure in production.
- Product deletion is soft delete, reducing accidental permanent data loss.

## 5. AI Tool Usage

AI tools were used as implementation support with human review before merging.

Where AI support was used:

- Drafting and polishing seed data script content
- Boilerplate and documentation acceleration
- Small refactoring suggestions in non-critical paths

Where manual engineering was used:

- Data model and API behavior decisions
- Security and middleware strategy
- Final testing and verification of route behavior

## API Surface

- GET /api/health
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- GET /api/brand/dashboard

## Environment Variables

Create a .env file in backend with values similar to:

```env
MONGO_URI=your-mongodb-connection-string
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-secret
PORT=5000
NODE_ENV=development
```

## Setup and Run

1. Install dependencies.

```bash
npm install
```

2. Start development server.

```bash
npm run dev
```

3. Seed sample data.

```bash
npm run seed
```

4. Start production mode.

```bash
npm start
```
