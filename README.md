# EduPlatform Marketplace

A production-grade RESTful API for an educational course marketplace — built with **TypeScript**, **Express 5**, **Prisma**, and **PostgreSQL**.

Instructors create and manage courses. Students discover, enroll, and rate them. Admins oversee the entire platform.

---

## Tech Stack

| Layer       | Technology                                     |
| ----------- | ---------------------------------------------- |
| Runtime     | Node.js + TypeScript (ES2023)                  |
| Framework   | Express 5                                      |
| ORM         | Prisma 7 (PostgreSQL)                          |
| Validation  | Zod (env) + express-openapi-validator (routes) |
| Auth        | JWT (httpOnly cookies) + bcryptjs              |
| Docs        | Swagger UI (OpenAPI 3.0)                       |
| Logging     | Pino + pino-http                               |
| Security    | Helmet + CORS + cookie-parser                  |
| File Upload | Multer                                         |

---

## Features

- **Role-Based Access Control** — `STUDENT`, `INSTRUCTOR`, `ADMIN` with guarded routes
- **Auth Flow** — Register, login (email or phone), token refresh, secure httpOnly cookies
- **Instructor Application** — Students apply → admin approves/rejects → instructor role granted
- **Course Marketplace** — Full CRUD with categories, chapters, lessons, and publishing workflow
- **Auto-Calculated Aggregates** — Chapter `totalDuration` and course `avgRating` / `ratingCount` update automatically
- **Rating Moderation** — Student ratings require admin approval before going public
- **Enrollment System** — Enroll in courses with duplicate prevention
- **Notifications** — In-app notifications with read/unread tracking and bulk mark-as-read
- **Swagger Documentation** — Interactive API docs served at `/api/docs`
- **Structured Error Handling** — Consistent `ApiError` / `ApiResponse` format across all endpoints

---

## Project Structure

```
src/
 ├─ configs/           # Environment, DB, JWT, logger setup
 ├─ middlewares/        # Auth, role guard, error handler, request validation
 ├─ modules/
 │   ├─ auth/          # Register, login, refresh, me
 │   ├─ user/          # Profile management + admin user mgmt
 │   ├─ category/      # Course categories
 │   ├─ course/        # Course CRUD (public / instructor / admin)
 │   ├─ chapter/       # Chapter CRUD (public / instructor / admin)
 │   ├─ lesson/        # Lesson CRUD (public / instructor / admin)
 │   ├─ enrollment/    # Student enrollments + admin view
 │   ├─ rating/        # Ratings with moderation
 │   └─ notification/  # In-app notifications
 ├─ swagger/           # OpenAPI spec + Swagger UI setup
 ├─ types/             # Shared TypeScript types
 ├─ utils/             # ApiError, ApiResponse, catchAsync, logger
 ├─ app.ts             # Express app configuration
 └─ server.ts          # Server entry point

prisma/
 ├─ schema.prisma      # Prisma client config
 ├─ enums.prisma       # UserRole, LevelType, etc.
 ├─ models/            # User, Course, Chapter, Lesson, Rating, Enrollment, etc.
 └─ migrations/        # Database migrations
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- npm or pnpm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/eduplatform
ACCESS_SECRET_KEY=your-access-secret-min-10-chars
REFRESH_SECRET_KEY=your-refresh-secret-min-10-chars
BCRYPT_SALT=12
ACCESS_EXPIRES=8h
REFRESH_EXPIRES=7d
LOG_LEVEL=info
NODE_ENV=development
BASE_URL=http://localhost:5000
```

### 3. Run migrations

```bash
npx prisma migrate dev
```

### 4. Start the dev server

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Swagger docs at `http://localhost:5000/api/docs`.

---

## Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start dev server with hot-reload  |
| `npm run build` | Compile TypeScript + copy Swagger |
| `npm start`     | Run compiled production build     |

---

## API Overview

All routes are prefixed with `/api`.

| Route Prefix          | Access        | Description                         |
| --------------------- | ------------- | ----------------------------------- |
| `/auth`               | Public        | Register, login, refresh, me        |
| `/user/profile`       | Authenticated | Update own profile                  |
| `/user/notification`  | Authenticated | Notifications list/read             |
| `/user/rating`        | Authenticated | Create/delete own ratings           |
| `/category`           | Public        | List categories                     |
| `/course`             | Public        | List & view published courses       |
| `/chapter`            | Public        | List & view chapters                |
| `/lesson`             | Public        | List & view lessons                 |
| `/rating`             | Public        | List approved ratings               |
| `/student/enrollment` | Student       | Enroll, list own enrollments        |
| `/instructor/*`       | Instructor    | Manage own courses/chapters/lessons |
| `/admin/*`            | Admin         | Full platform management            |

---

## Data Model

```
User ─┬─ StudentProfile ──── Enrollment ──── Course
      ├─ InstructorProfile ── Course ─┬─── Chapter ──── Lesson
      └─ AdminProfile                 ├─── Rating
                                      └─── Category
```

Key entities:

- **User** — Single account with role array (`STUDENT`, `INSTRUCTOR`, `ADMIN`)
- **Course** — Belongs to instructor + category, auto-calculated `avgRating` & `ratingCount`
- **Chapter** — Ordered within a course, auto-calculated `totalDuration`
- **Lesson** — Ordered within a chapter, `duration` in seconds
- **Enrollment** — Composite key (`studentId`, `courseId`), tracks payment
- **Rating** — One per user per course, admin-moderated (`isApproved`)

---

## Authentication

Tokens are set as **httpOnly cookies** on login. For clients that don't handle cookies, extract `accessToken` from the `Set-Cookie` header and send it as:

```
Authorization: Bearer <accessToken>
```

Admin accounts are created by directly updating the `roles` column in the database — there is no admin registration endpoint.

---

## License

ISC
