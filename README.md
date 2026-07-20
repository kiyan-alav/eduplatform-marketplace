# EduPlatform Marketplace

A production-grade RESTful API for an educational course marketplace — built with **TypeScript**, **Express 5**, **Mongoose**, and **MongoDB**.

Instructors create and manage courses. Students discover, enroll, and rate them. Admins oversee the entire platform.

---

## Tech Stack

| Layer       | Technology                         |
| ----------- | ---------------------------------- |
| Runtime     | Node.js + TypeScript (CommonJS)    |
| Framework   | Express 5                          |
| ODM         | Mongoose 9 + mongoose-paginate-v2  |
| Database    | MongoDB                            |
| Validation  | Zod (env & request) + OpenAPI spec |
| Auth        | JWT (httpOnly cookies) + bcryptjs  |
| Docs        | Swagger UI (OpenAPI 3.0)           |
| Logging     | Pino + pino-http + pino-pretty     |
| Security    | Helmet + CORS + cookie-parser      |
| File Upload | Multer                             |

---

## Features

- **Role-Based Access Control** — `STUDENT`, `INSTRUCTOR`, `ADMIN` with guarded routes and admin bypass
- **Auth Flow** — Register, login (email or phone), token refresh with TTL-based auto-cleanup, secure httpOnly cookies
- **Instructor Application** — Students apply -> admin approves/rejects -> instructor role granted with notifications
- **Course Marketplace** — Full CRUD with categories, chapters, lessons, and publishing workflow
- **Auto-Calculated Aggregates** — Chapter `totalDuration` and course `avgRating` / `ratingCount` update via Mongoose post-hooks and MongoDB aggregation
- **Rating Moderation** — Student ratings require admin approval before going public
- **Enrollment System** — Enroll in courses with duplicate prevention
- **Notifications** — In-app notifications with read/unread tracking and bulk mark-as-read
- **Swagger Documentation** — Interactive API docs served at `/docs`, with OpenAPI request validation
- **Pagination** — Built-in pagination via `mongoose-paginate-v2` with a reusable query builder
- **File Uploads** — Configurable Multer uploaders for avatars, course covers, videos, and instructor documents
- **Structured Error Handling** — Consistent `ApiResponse` format across all endpoints with Zod-powered request validation

---

## Project Structure

```
src/
 ├─ configs/               # Environment (Zod-validated), DB connection, JWT, logger
 ├─ middlewares/            # Auth guard, role guard, error handler, Zod request validation
 ├─ modules/
 │   ├─ auth/              # Register, login, refresh tokens
 │   ├─ user/
 │   │   ├─ me/            # Profile management
 │   │   ├─ admin/         # Admin user management
 │   │   └─ profiles/
 │   │       ├─ student/   # StudentProfile model
 │   │       ├─ instructor/ # InstructorProfile model
 │   │       └─ admin/     # AdminProfile model
 │   ├─ category/          # Course categories (admin / public)
 │   ├─ course/            # Course CRUD (admin / instructor / public)
 │   ├─ chapter/           # Chapter CRUD (admin / instructor / public)
 │   ├─ lesson/            # Lesson CRUD (admin / instructor / public)
 │   ├─ enrollment/        # Student enrollments + admin view
 │   ├─ rating/            # Ratings with moderation (admin / user / public)
 │   └─ notification/      # In-app notifications
 ├─ swagger/               # OpenAPI YAML specs + Swagger UI setup + request validation
 ├─ types/                 # Shared ApiResponse builder
 ├─ utils/                 # Query builder, pagination schema, multer uploaders, token helpers
 │   ├─ query-builder.ts   # Generic MongoDB filter/pagination builder
 │   ├─ multer.ts          # Configurable file upload factories
 │   ├─ token.ts           # SHA-256 token hashing for refresh tokens
 │   ├─ updateChapterDuration.ts  # Aggregation-based chapter duration recalculation
 │   └─ updateCourseRating.ts     # Aggregation-based course rating recalculation
 ├─ app.ts                 # Express app configuration
 └─ server.ts              # Server entry point with graceful shutdown
```

---

## Data Model

```
User ─┬─ StudentProfile (enrolledCourses[], interests[])
      │     └── Enrollment ──── Course
      ├─ InstructorProfile (verification, socialLinks, payoutInfo, createdCourses[])
      │                        └── Course ─┬─── Chapter ──── Lesson
      │                                    ├─── Rating
      └─ AdminProfile                      └─── Category
```

| Model                 | Key Features                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| **User**              | Multi-role array, linked to all three profile types via ObjectId                                              |
| **StudentProfile**    | Embedded `enrolledCourses` array, `interests` tags                                                            |
| **InstructorProfile** | Nested `verification` (status, documents, isVerified), `socialLinks`, `payoutInfo`, embedded `createdCourses` |
| **Course**            | Auto-calculated `avgRating` & `ratingCount` via Mongoose hooks                                                |
| **Chapter**           | Auto-calculated `totalDuration` via post-save/update hooks                                                    |
| **Lesson**            | Triggers chapter duration recalculation on save, update, delete                                               |
| **Enrollment**        | Compound unique index on `(student, course)`                                                                  |
| **Rating**            | Compound unique index on `(course, user)`, admin-moderated `isApproved`                                       |
| **Notification**      | Indexed on `(user, isRead, createdAt)`                                                                        |
| **RefreshToken**      | TTL index on `expiresAt` for automatic expired token cleanup                                                  |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eduplatform
ACCESS_SECRET_KEY=your-access-secret-min-10-chars
REFRESH_SECRET_KEY=your-refresh-secret-min-10-chars
BCRYPT_SALT=12
ACCESS_EXPIRES=8h
REFRESH_EXPIRES=7d
LOG_LEVEL=info
NODE_ENV=development
BASE_URL=http://localhost:5000
```

### 3. Start the dev server

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Swagger docs at `http://localhost:5000/docs`.

> No migration step needed — MongoDB collections are created automatically by Mongoose on first write.

---

## Scripts

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start dev server with hot-reload (tsx)  |
| `npm run build` | Compile TypeScript + copy Swagger files |
| `npm start`     | Run compiled production build           |

---

## API Overview

All routes are prefixed with `/api`.

| Route Prefix          | Access        | Description                             |
| --------------------- | ------------- | --------------------------------------- |
| `/auth`               | Public        | Register, login, refresh, me            |
| `/user/profile`       | Authenticated | Update own profile, avatar upload       |
| `/user/notification`  | Authenticated | Notifications list / read / unread      |
| `/user/rating`        | Authenticated | Create / delete own ratings             |
| `/category`           | Public        | List categories                         |
| `/course`             | Public        | List & view published courses           |
| `/chapter`            | Public        | List & view chapters                    |
| `/lesson`             | Public        | List & view lessons                     |
| `/rating`             | Public        | List approved ratings                   |
| `/student/enrollment` | Student       | Enroll, list own enrollments            |
| `/instructor/*`       | Instructor    | Manage own courses / chapters / lessons |
| `/admin/*`            | Admin         | Full platform management                |

---

## Authentication

Tokens are set as **httpOnly cookies** on login. For clients that don't handle cookies, extract `accessToken` from the `Set-Cookie` header and send it as:

```
Authorization: Bearer <accessToken>
```

Refresh tokens are stored as SHA-256 hashes in MongoDB with a **TTL index** that automatically deletes expired tokens.

Admin accounts are created by directly setting the `roles` array in the database — there is no admin registration endpoint.

---

## Key Implementation Details

### Auto-calculated aggregates

- **Chapter `totalDuration`**: Recalculated via Mongoose post-hooks (`save`, `findOneAndDelete`, `findOneAndUpdate`) on the Lesson model, using a `$group` aggregation pipeline.
- **Course `avgRating` / `ratingCount`**: Recalculated via Mongoose post-hooks (`save`, `findOneAndDelete`) on the Rating model, using a `$group` aggregation pipeline.

### Query builder

A generic `buildQueryFilters<T>()` utility (`src/utils/query-builder.ts`) supports:

- **Text search** across configurable fields using `$regex`
- **Exact match** filters
- **Enum list** filters using `$in`
- **Pagination** with `page`, `limit`, `sort`

### Refresh token cleanup

The `RefreshToken` model uses a MongoDB TTL index on `expiresAt` (`expireAfterSeconds: 0`), so the database automatically removes expired tokens without manual cron jobs.

---

## License

ISC
