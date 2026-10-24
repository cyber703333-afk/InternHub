# InternHub – Internship Management System (MERN)

A centralized platform where **students** find and apply to internships, **companies** post roles and review applicants, and **admins** manage the whole system.

Stack: React (Vite) · Node.js · Express · MongoDB (Mongoose) · JWT + bcrypt · Postman for API testing.
Methodology: Agile (built and tested module by module).

> To rename the project, change `APP_NAME` in `client/src/config.js` (and the `<title>` in `client/index.html`).

## Features
**Student** – register/login, profile + resume upload, browse with search / filters / sorting / pagination, save internships, apply with cover letter, application tracker (Applied → Under Review → Shortlisted → Selected / Rejected), notifications, dashboard.
**Company** – register with company profile, post / edit / close / delete internships, view applicants with their profiles and resumes, update application status, dashboard.
**Admin** – statistics dashboard with charts, manage users (block / unblock / delete), approve / reject / remove internships, monitor all applications.
**Common** – JWT auth, password hashing, role-based access control (backend + frontend), validation, centralized error handling, rate limiting, helmet, input sanitising, responsive UI.
**Real-time tracking** – status changes reach students through notifications and an auto-refreshing tracker (10-second polling).

## Folder structure
```
internhub/
├── server/   Express API (config, models, controllers, routes, middleware, utils, seed.js)
├── client/   React app (pages, components, context, api.js)
└── docs/     Postman collection
```

## Setup
Requirements: Node.js 18+, MongoDB running locally (or a MongoDB Atlas connection string).

```bash
# 1. Install everything
npm run install:all        # or: cd server && npm install ; cd ../client && npm install

# 2. Environment files (already created for local use – edit if needed)
#    server/.env  -> MONGO_URI, JWT_SECRET, CLIENT_URL
#    client/.env  -> VITE_API_URL, VITE_FILES_URL

# 3. Load demo data
npm run seed

# 4. Start backend (http://localhost:5000)
npm run server

# 5. Start frontend in a second terminal (http://localhost:5173)
npm run client
```

### Demo accounts (created by the seed)
| Role | Email | Password |
|---|---|---|
| Admin | admin@internhub.com | Admin@123 |
| Student | student@demo.com | Student@123 |
| Company | company@demo.com | Company@123 |

Set `REQUIRE_APPROVAL=true` in `server/.env` if new company postings should wait for admin approval.

## REST API
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| GET / PUT | /api/auth/me | Logged in |
| POST | /api/auth/me/resume | Logged in (file) |
| PUT | /api/auth/password | Logged in |
| GET | /api/internships (q, category, mode, location, minStipend, sort, page) | Public |
| GET | /api/internships/:id | Public |
| GET | /api/internships/mine | Company |
| POST | /api/internships | Company |
| PUT / DELETE | /api/internships/:id | Owner company / Admin |
| POST | /api/applications/:internshipId | Student |
| GET | /api/applications/my | Student |
| DELETE | /api/applications/:id | Student (withdraw) |
| GET | /api/applications/internship/:id | Company (owner) |
| PUT | /api/applications/:id/status | Company (owner) |
| POST / GET / DELETE | /api/saved(/:internshipId) | Student |
| GET / PUT | /api/notifications, /api/notifications/read-all | Logged in |
| GET | /api/admin/stats, /users, /internships, /applications | Admin |
| PUT / DELETE | /api/admin/users/:id/block, /api/admin/users/:id | Admin |
| PUT | /api/admin/internships/:id/status | Admin |

## Database collections
`users`, `internships`, `applications`, `saveds` (saved internships), `notifications` – defined with Mongoose in `server/models`.

## Testing with Postman
Import `docs/InternHub.postman_collection.json`. Run **Auth → Login** first (the token is saved automatically), then the other folders. Requests marked "expect 401 / 403" test authentication and role access.

### Testing checklist
- [ ] Register student and company, duplicate email is rejected
- [ ] Wrong password returns 401, missing token returns 401
- [ ] Student cannot call company routes (403), company cannot call admin routes (403)
- [ ] Company posts an internship, it appears in Browse
- [ ] Student applies, duplicate application is rejected (409)
- [ ] Company changes status, student sees it in the tracker and in notifications
- [ ] Admin blocks a user, that user can no longer log in
- [ ] Admin approves / rejects an internship

## Troubleshooting
- **MongoDB connection failed** – start MongoDB or paste your Atlas URI into `MONGO_URI`.
- **CORS error** – `CLIENT_URL` in `server/.env` must match the frontend URL.
- **Cannot reach the server** – check the backend is running and `VITE_API_URL` is correct.
