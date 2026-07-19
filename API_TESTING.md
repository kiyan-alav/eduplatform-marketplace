# API Testing Guide

Base URL: `http://localhost:5000/api`

> Tokens are set as httpOnly cookies on login. If your client doesn't handle cookies,
> extract `accessToken` from the response `Set-Cookie` header and send it as:
> `Authorization: Bearer <accessToken>`

---

## Phase 0 — Setup

### 0.1 Register 3 users

**Student**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@test.com",
  "phone": "09121111111",
  "fullName": "Test Student",
  "password": "123456",
  "confirm": "123456"
}
```

**Instructor (to be)**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "instructor@test.com",
  "phone": "09122222222",
  "fullName": "Test Instructor",
  "password": "123456",
  "confirm": "123456"
}
```

**Admin (to be)**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@test.com",
  "phone": "09123333333",
  "fullName": "Test Admin",
  "password": "123456",
  "confirm": "123456"
}
```

### 0.2 Promote admin via SQL

There is no API to create admins. Run this in your PostgreSQL console:

```sql
UPDATE "User"
SET roles = ARRAY['ADMIN']::\"UserRole\"[]
WHERE email = 'admin@test.com';
```

### 0.3 Login all 3

```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "student@test.com",
  "password": "123456"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "instructor@test.com",
  "password": "123456"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "admin@test.com",
  "password": "123456"
}
```

Save the token from each login as `{{studentToken}}`, `{{instructorToken}}`, `{{adminToken}}`.

### 0.4 Verify profiles exist

Every registration automatically creates a `StudentProfile`. The instructor and admin also have student profiles by default.

---

## Phase 1 — User Profile

### 1.1 Update student profile

```http
PATCH /api/user/profile
Authorization: Bearer {{studentToken}}
Content-Type: application/json

{
  "fullName": "Ali Alavi",
  "studentProfile": {
    "interests": ["programming", "math"]
  }
}
```

### 1.2 Get own profile (any user)

```http
GET /api/auth/me
Authorization: Bearer {{studentToken}}
```

### 1.3 Apply to become instructor

```http
POST /api/user/apply-to-instructor
Authorization: Bearer {{instructorToken}}
```

> This creates an `InstructorProfile` with `status: PENDING` and sends a notification.

### 1.4 Admin lists instructor requests

```http
GET /api/admin/user/instructor/request/list
Authorization: Bearer {{adminToken}}
```

> Save the instructor user id from the response as `{{instructorUserId}}`.

### 1.5 Admin approves instructor

```http
PATCH /api/admin/user/instructor/request/{{instructorUserId}}/apply
Authorization: Bearer {{adminToken}}
```

> After approval the instructor's `isVerified` becomes `true` and they gain `INSTRUCTOR` role.

---

## Phase 2 — Categories (Admin only)

### 2.1 Create categories

```http
POST /api/admin/category
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Web Development"
}
```

```http
POST /api/admin/category
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Data Science"
}
```

```http
POST /api/admin/category
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Mobile Development"
}
```

> Save category ids as `{{catId1}}`, `{{catId2}}`, `{{catId3}}`.

### 2.2 List categories (public — no auth)

```http
GET /api/category/list
```

### 2.3 Update category

```http
PATCH /api/admin/category/{{catId1}}
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Frontend Development"
}
```

### 2.4 Delete category

```http
DELETE /api/admin/category/{{catId3}}
Authorization: Bearer {{adminToken}}
```

---

## Phase 3 — Courses

### 3.1 Instructor creates a course

```http
POST /api/instructor/course
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "Node.js Masterclass",
  "description": "Learn Node.js from scratch",
  "price": 299000,
  "level": "BEGINNER",
  "categoryId": {{catId1}}
}
```

> Save the returned course id as `{{courseId1}}`.

### 3.2 Instructor creates a second course

```http
POST /api/instructor/course
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "Advanced TypeScript",
  "description": "Deep dive into TypeScript",
  "price": 199000,
  "level": "ADVANCED",
  "categoryId": {{catId1}}
}
```

> Save as `{{courseId2}}`.

### 3.3 Admin creates a course (assigned to instructor)

```http
POST /api/admin/course
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "title": "Python for Data Science",
  "description": "Learn Python for data analysis",
  "price": 349000,
  "level": "BEGINNER",
  "categoryId": {{catId2}},
  "instructorId": {{instructorUserId}}
}
```

> Save as `{{courseId3}}`.

### 3.4 Publish courses

```http
PATCH /api/admin/course/{{courseId1}}/publish
Authorization: Bearer {{adminToken}}
```

```http
PATCH /api/admin/course/{{courseId2}}/publish
Authorization: Bearer {{adminToken}}
```

```http
PATCH /api/admin/course/{{courseId3}}/publish
Authorization: Bearer {{adminToken}}
```

### 3.5 List courses (public)

```http
GET /api/course/list
```

### 3.6 Get single course (public)

```http
GET /api/course/{{courseId1}}
```

### 3.7 Instructor lists own courses

```http
GET /api/instructor/course/list
Authorization: Bearer {{instructorToken}}
```

### 3.8 Admin lists all courses

```http
GET /api/admin/course/list
Authorization: Bearer {{adminToken}}
```

### 3.9 Update course

```http
PUT /api/instructor/course/{{courseId1}}
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "Node.js Masterclass Updated",
  "price": 399000
}
```

---

## Phase 4 — Chapters

### 4.1 Instructor creates chapters for courseId1

```http
POST /api/instructor/chapter
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "Getting Started",
  "course": {{courseId1}},
  "order": 1
}
```

> Save as `{{chapterId1}}`.

```http
POST /api/instructor/chapter
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "Routing & Middleware",
  "course": {{courseId1}},
  "order": 2
}
```

> Save as `{{chapterId2}}`.

### 4.2 Admin creates chapter for courseId3

```http
POST /api/admin/chapter
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "title": "Python Basics",
  "course": {{courseId3}},
  "order": 1
}
```

> Save as `{{chapterId3}}`.

### 4.3 List chapters (public)

```http
GET /api/chapter/list
```

### 4.4 Get single chapter (public)

```http
GET /api/chapter/{{chapterId1}}
```

### 4.5 Instructor lists own chapters

```http
GET /api/instructor/chapter/list
Authorization: Bearer {{instructorToken}}
```

### 4.6 Update chapter

```http
PUT /api/instructor/chapter/{{chapterId1}}
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "Introduction to Node.js"
}
```

---

## Phase 5 — Lessons (with chapter duration auto-recalculation)

### 5.1 Instructor creates lessons for chapterId1

```http
POST /api/instructor/lesson
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "What is Node.js",
  "chapterId": {{chapterId1}},
  "duration": 300,
  "order": 1
}
```

> Save as `{{lessonId1}}`. Duration 300 = 5 min.

```http
POST /api/instructor/lesson
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "Installing Node.js",
  "chapterId": {{chapterId1}},
  "duration": 420,
  "order": 2
}
```

> Save as `{{lessonId2}}`. Duration 420 = 7 min.

### 5.2 Instructor creates lessons for chapterId2

```http
POST /api/instructor/lesson
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "Express Router",
  "chapterId": {{chapterId2}},
  "duration": 600,
  "order": 1
}
```

> Save as `{{lessonId3}}`.

```http
POST /api/instructor/lesson
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "title": "Middleware Deep Dive",
  "chapterId": {{chapterId2}},
  "duration": 540,
  "order": 2
}
```

> Save as `{{lessonId4}}`.

### 5.3 Admin creates lessons for chapterId3

```http
POST /api/admin/lesson
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "title": "Variables & Types",
  "chapterId": {{chapterId3}},
  "duration": 480,
  "order": 1
}
```

> Save as `{{lessonId5}}`.

```http
POST /api/admin/lesson
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "title": "Control Flow",
  "chapterId": {{chapterId3}},
  "duration": 360,
  "order": 2
}
```

> Save as `{{lessonId6}}`.

### 5.4 Verify chapter totalDuration auto-updated

```http
GET /api/chapter/{{chapterId1}}
```

> `totalDuration` should be `720` (300 + 420).

```http
GET /api/chapter/{{chapterId2}}
```

> `totalDuration` should be `1140` (600 + 540).

### 5.5 List lessons (public)

```http
GET /api/lesson/list
```

### 5.6 Get single lesson (public)

```http
GET /api/lesson/{{lessonId1}}
```

### 5.7 Update lesson (verify duration recalculates)

```http
PUT /api/instructor/lesson/{{lessonId1}}
Authorization: Bearer {{instructorToken}}
Content-Type: application/json

{
  "duration": 600
}
```

> chapterId1 totalDuration should now be `1020` (600 + 420).

### 5.8 Delete lesson (verify duration recalculates)

```http
DELETE /api/instructor/lesson/{{lessonId4}}
Authorization: Bearer {{instructorToken}}
```

> chapterId2 totalDuration should now be `600` (only lessonId3 remains).

### 5.9 Instructor lists own lessons

```http
GET /api/instructor/lesson/list
Authorization: Bearer {{instructorToken}}
```

---

## Phase 6 — Ratings (with course rating auto-recalculation)

### 6.1 Student rates courseId1

```http
POST /api/user/rating/create
Authorization: Bearer {{studentToken}}
Content-Type: application/json

{
  "courseId": {{courseId1}},
  "score": 4,
  "description": "Great course!"
}
```

> Save rating id from response as `{{ratingId1}}`.

### 6.2 Verify course avgRating updated

```http
GET /api/course/{{courseId1}}
```

> `avgRating` should be `4.00`, `ratingCount` should be `1`.

### 6.3 Student tries to rate same course again (should fail 409)

```http
POST /api/user/rating/create
Authorization: Bearer {{studentToken}}
Content-Type: application/json

{
  "courseId": {{courseId1}},
  "score": 5,
  "description": "Changed my mind"
}
```

> Expected: `409 You have already rated this course!`

### 6.4 Student rates courseId2

```http
POST /api/user/rating/create
Authorization: Bearer {{studentToken}}
Content-Type: application/json

{
  "courseId": {{courseId2}},
  "score": 5,
  "description": "Excellent!"
}
```

### 6.5 List approved ratings (public)

```http
GET /api/rating/list
```

> Returns only `isApproved: true` ratings. Currently empty because admin hasn't approved.

### 6.6 Admin lists all ratings

```http
GET /api/admin/rating/list
Authorization: Bearer {{adminToken}}
```

> Save rating id as `{{ratingId1}}`.

### 6.7 Admin approves rating (toggle visibility)

```http
PATCH /api/admin/rating/{{ratingId1}}/toggle-visibility
Authorization: Bearer {{adminToken}}
```

### 6.8 Public can now see the approved rating

```http
GET /api/rating/list?courseId={{courseId1}}
```

### 6.9 Admin deletes a rating (verify avgRating recalculates)

```http
DELETE /api/admin/rating/{{ratingId1}}
Authorization: Bearer {{adminToken}}
```

> courseId1 `ratingCount` should be `0`, `avgRating` should be `0.00`.

### 6.10 Student deletes own rating

```http
DELETE /api/user/rating/{{ratingId1}}/delete
Authorization: Bearer {{studentToken}}
```

> (If not already deleted by admin in 6.9.)

---

## Phase 7 — Enrollment

### 7.1 Student enrolls in courseId2

```http
POST /api/student/enrollment
Authorization: Bearer {{studentToken}}
Content-Type: application/json

{
  "courseId": {{courseId2}},
  "paid": 199000,
  "paidAt": "2026-07-19T12:00:00.000Z"
}
```

### 7.2 Student tries to enroll again (should fail 409)

```http
POST /api/student/enrollment
Authorization: Bearer {{studentToken}}
Content-Type: application/json

{
  "courseId": {{courseId2}},
  "paid": 199000,
  "paidAt": "2026-07-19T12:00:00.000Z"
}
```

> Expected: `409 You are already enrolled in this course`.

### 7.3 Student enrolls in courseId3

```http
POST /api/student/enrollment
Authorization: Bearer {{studentToken}}
Content-Type: application/json

{
  "courseId": {{courseId3}},
  "paid": 0,
  "paidAt": "2026-07-19T12:00:00.000Z"
}
```

### 7.4 Student lists own enrollments

```http
GET /api/student/enrollment/list
Authorization: Bearer {{studentToken}}
```

### 7.5 Student gets single enrollment

```http
GET /api/student/enrollment/{{courseId2}}
Authorization: Bearer {{studentToken}}
```

### 7.6 Admin lists all enrollments

```http
GET /api/admin/enrollment/list
Authorization: Bearer {{adminToken}}
```

### 7.7 Admin gets single enrollment by compound key

```http
GET /api/admin/enrollment/{{studentId}}/{{courseId2}}
Authorization: Bearer {{adminToken}}
```

> Replace `{{studentId}}` with the student's profile id (check the enrollment list response).

---

## Phase 8 — Notifications

### 8.1 Student lists notifications

> The instructor application (Phase 1.3) triggered a notification for the instructor user.

```http
GET /api/user/notification/list
Authorization: Bearer {{instructorToken}}
```

### 8.2 Get unread count

```http
GET /api/user/notification/unread-count
Authorization: Bearer {{instructorToken}}
```

### 8.3 Mark notification as read

```http
PATCH /api/user/notification/1/mark-as-read
Authorization: Bearer {{instructorToken}}
```

### 8.4 Mark all as read

```http
PATCH /api/user/notification/mark-all-as-read
Authorization: Bearer {{instructorToken}}
```

---

## Phase 9 — Admin User Management

### 9.1 Admin lists all users

```http
GET /api/admin/user/list
Authorization: Bearer {{adminToken}}
```

### 9.2 Admin gets single user

```http
GET /api/admin/user/1
Authorization: Bearer {{adminToken}}
```

### 9.3 Admin rejects an instructor request (register a 4th user to test)

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "reject@test.com",
  "phone": "09124444444",
  "fullName": "Rejected User",
  "password": "123456",
  "confirm": "123456"
}
```

Login as `reject@test.com`, apply to instructor, then:

```http
PATCH /api/admin/user/instructor/request/{{rejectUserId}}/reject
Authorization: Bearer {{adminToken}}
```

---

## Phase 10 — Cleanup (optional)

### Delete a lesson

```http
DELETE /api/admin/lesson/{{lessonId6}}
Authorization: Bearer {{adminToken}}
```

### Delete a chapter

```http
DELETE /api/admin/chapter/{{chapterId3}}
Authorization: Bearer {{adminToken}}
```

### Delete a course

```http
DELETE /api/admin/course/{{courseId3}}
Authorization: Bearer {{adminToken}}
```

> Lesson, chapter, and course deletions cascade via `onDelete: Cascade` in the Prisma schema.

---

## Test Data Summary

| Entity                | Variable                                      | Suggested ID |
| --------------------- | --------------------------------------------- | ------------ |
| Student user          | `{{studentToken}}`                            | user id 1    |
| Instructor user       | `{{instructorToken}}`, `{{instructorUserId}}` | user id 2    |
| Admin user            | `{{adminToken}}`                              | user id 3    |
| Category 1            | `{{catId1}}`                                  | 1            |
| Category 2            | `{{catId2}}`                                  | 2            |
| Course 1 (instructor) | `{{courseId1}}`                               | 1            |
| Course 2 (instructor) | `{{courseId2}}`                               | 2            |
| Course 3 (admin)      | `{{courseId3}}`                               | 3            |
| Chapter 1             | `{{chapterId1}}`                              | 1            |
| Chapter 2             | `{{chapterId2}}`                              | 2            |
| Chapter 3             | `{{chapterId3}}`                              | 3            |
| Lesson 1              | `{{lessonId1}}`                               | 1            |
| Lesson 2              | `{{lessonId2}}`                               | 2            |
| Lesson 3              | `{{lessonId3}}`                               | 3            |
| Lesson 5              | `{{lessonId5}}`                               | 5            |
| Lesson 6              | `{{lessonId6}}`                               | 6            |

## Expected Auto-Calculated Values

| After this step                | Chapter    | Expected `totalDuration` |
| ------------------------------ | ---------- | ------------------------ |
| Phase 5.2 (2 lessons in ch1)   | chapterId1 | 720                      |
| Phase 5.2 (2 lessons in ch2)   | chapterId2 | 1140                     |
| Phase 5.3 (2 lessons in ch3)   | chapterId3 | 840                      |
| Phase 5.7 (update lesson1 dur) | chapterId1 | 1020                     |
| Phase 5.8 (delete lesson4)     | chapterId2 | 600                      |

| After this step                   | Course    | Expected `avgRating` | Expected `ratingCount` |
| --------------------------------- | --------- | -------------------- | ---------------------- |
| Phase 6.1 (rate 4)                | courseId1 | 4.00                 | 1                      |
| Phase 6.2 (rate 5)                | courseId2 | 5.00                 | 1                      |
| Phase 6.7 (admin approve rating1) | courseId1 | 4.00                 | 1                      |
| Phase 6.9 (admin deletes rating1) | courseId1 | 0.00                 | 0                      |
