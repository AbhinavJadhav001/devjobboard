# Project Explanation

This file explains what was built in the Dev Job Board project, why each part exists, and how the pieces work together.

## What This Project Is

Dev Job Board is a full-stack web application where:

- Developers can register, log in, browse jobs, filter jobs, view job details, and apply.
- Employers can register, create a company profile, post jobs, edit jobs, delete jobs, and view applicants.

The project has two main parts:

- A Django REST API backend
- A React Vite frontend

The backend stores and protects the data. The frontend gives users a clean interface to use that data.

## Why This Tech Stack Was Used

### Django

Django was used because it is reliable for backend applications and includes many important features by default, such as models, migrations, admin, authentication support, and security tools.

### Django REST Framework

Django REST Framework was used to build API endpoints. The frontend needs JSON data, not HTML pages from Django templates, so DRF is the right layer between Django models and the React app.

### SimpleJWT

SimpleJWT was used for authentication. When a user logs in, Django returns an access token and refresh token. The frontend stores the access token and sends it with protected API requests.

### React With Vite

React was used for the frontend because it makes it easy to build interactive screens like job filters, login forms, dashboards, and detail pages. Vite was used because it is fast and simple for modern React projects.

### Axios

Axios was used to call the backend API from React. A shared API client was created so all requests use the same backend base URL and automatically include the JWT token when available.

### Tailwind CSS

Tailwind was used to style the frontend quickly while keeping the design consistent.

### PostgreSQL For Production

SQLite is fine locally, but not safe for production hosting because deployed servers often have temporary filesystems. PostgreSQL is better for real hosted data. The project is prepared to use Neon PostgreSQL through a `DATABASE_URL` environment variable.

## Backend Work

The backend has three main apps/modules:

- `backend`
- `accounts`
- `jobs`

### `backend/settings.py`

This file controls the Django project configuration.

Important changes:

- Added REST Framework configuration.
- Added JWT authentication support.
- Added CORS support so the React frontend can call the Django API.
- Added environment variable support for production.
- Added `DATABASE_URL` support for PostgreSQL.
- Added WhiteNoise for static files in production.

Why this matters:

Local development and production deployment need different settings. Locally, the project can use SQLite and `DEBUG=True`. In production, the project should use PostgreSQL, a secret key from the hosting dashboard, and `DEBUG=False`.

### `backend/urls.py`

This file connects project-level URLs.

Main API routes:

```text
/api/jobs/
/api/companies/
/api/dashboard/
/api/auth/
```

Why this matters:

The frontend needs predictable API URLs. Keeping everything under `/api/` makes the backend easier to understand and deploy.

## Accounts App

The `accounts` app handles authentication and user profile data.

### `accounts/serializers.py`

This file converts Django user data into JSON and validates registration data.

It includes:

- `RegisterSerializer`
- `UserSerializer`

Why this matters:

Passwords cannot be saved directly as plain text. The register serializer uses `set_password()` so Django stores a hashed password safely.

### `accounts/views.py`

This file contains class-based API views:

- Register user
- View/update current user profile

Why this matters:

The frontend needs endpoints for creating accounts and showing user information after login.

### `accounts/urls.py`

This file defines auth routes:

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/profile/
PUT  /api/auth/profile/
```

Why this matters:

SimpleJWT provides login and refresh views. The project adds registration and profile views around them.

## Jobs App

The `jobs` app handles jobs, companies, and applications.

### `jobs/models.py`

This file defines the database structure.

Main models:

- `Company`
- `Job`
- `Application`

#### Company

Stores employer company information:

- owner
- name
- logo
- description
- website
- location

Why this exists:

Employers need more than just a username. A company profile lets jobs be connected to a real company identity.

#### Job

Stores job posts:

- title
- company
- location
- description
- salary
- job type
- experience level
- work mode
- tech stack
- owner
- company profile

Why this exists:

The original job model was simple. It was expanded so the app can support real job board features like filters, dashboard ownership, and company listings.

#### Application

Stores job applications:

- job
- applicant
- cover letter
- resume
- created date

Why this exists:

Employers need to see who applied to their jobs. A uniqueness rule prevents the same user from applying to the same job multiple times.

### `jobs/serializers.py`

This file converts models into JSON for the frontend.

It includes:

- `CompanySerializer`
- `JobSerializer`
- `ApplicationSerializer`

Why this matters:

The frontend does not use Django model objects directly. It receives JSON. Serializers control exactly what data is sent and accepted.

### `jobs/views.py`

This file contains the API logic using DRF generic class-based views.

Main views:

- List/create jobs
- Retrieve/update/delete one job
- List/create companies
- Retrieve/update/delete one company
- List company jobs
- List employer dashboard jobs
- List applicants for an employer-owned job
- Create job applications

Why this matters:

Class-based generic views reduce repeated code. They provide standard behavior for list, create, detail, update, and delete operations.

### Permissions

The project uses an owner-only permission for protected changes.

Why this matters:

Anyone can view public jobs, but only the user who posted a job should be able to edit or delete it. Employers should only see applicants for their own jobs.

### `jobs/urls.py`

This file connects job-related endpoints:

```text
GET    /api/jobs/
POST   /api/jobs/
GET    /api/jobs/<id>/
PUT    /api/jobs/<id>/
DELETE /api/jobs/<id>/
POST   /api/jobs/<id>/apply/
GET    /api/companies/
POST   /api/companies/
GET    /api/companies/<id>/jobs/
GET    /api/dashboard/jobs/
GET    /api/dashboard/jobs/<id>/applicants/
```

## Frontend Work

The frontend is inside the `frontend/` folder.

### `frontend/src/api/client.js`

This file creates the Axios API client.

It uses:

```text
VITE_API_BASE_URL
```

If that variable is not set, it uses:

```text
http://127.0.0.1:8000/api
```

Why this matters:

Local development and production use different backend URLs. Environment variables let the same frontend code work in both places.

### `frontend/src/state/AuthContext.jsx`

This file manages login state.

It:

- Stores JWT tokens in local storage.
- Loads the current user profile.
- Provides login, register, and logout functions.

Why this matters:

Many pages need to know whether a user is logged in. A shared auth context avoids repeating that logic everywhere.

### `frontend/src/App.jsx`

This file defines the main app layout and routes.

Pages include:

- Jobs page
- Job detail page
- Company page
- Login page
- Register page
- Dashboard page

Why this matters:

React Router lets the frontend behave like a real multi-page app while still being a single React application.

### Jobs Page

File:

```text
frontend/src/pages/JobsPage.jsx
```

What it does:

- Loads jobs from the backend.
- Allows searching.
- Allows filtering by location, job type, experience level, and work mode.

Why this matters:

This is the main developer experience. Developers need to quickly find relevant jobs.

### Job Detail Page

File:

```text
frontend/src/pages/JobDetailPage.jsx
```

What it does:

- Shows one job in detail.
- Allows logged-in users to apply.

Why this matters:

The list page gives a summary, but users need a full detail page before applying.

### Dashboard Page

File:

```text
frontend/src/pages/DashboardPage.jsx
```

What it does:

- Lets employers post jobs.
- Lets employers edit jobs.
- Lets employers delete jobs.
- Lets employers view applicants.

Why this matters:

Employers need a management area instead of using the public job list.

### Company Page

File:

```text
frontend/src/pages/CompanyPage.jsx
```

What it does:

- Lets a logged-in user create a company profile.
- Lists jobs for selected companies.

Why this matters:

Company profiles make the job board feel closer to a real hiring platform.

## Deployment Preparation

The project includes deployment files even though the detailed deployment guide was removed from GitHub.

### `requirements.txt`

Lists backend dependencies needed by Render.

### `build.sh`

Render can run this during deployment:

```bash
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
```

Why this matters:

The deployed backend must install dependencies, prepare static files, and apply database migrations before running.

### `Procfile`

Contains:

```text
web: gunicorn backend.wsgi:application
```

Why this matters:

It tells the hosting platform how to start the Django backend in production.

### `render.yaml`

This is an optional Render blueprint.

Why this matters:

It documents the backend service configuration and required environment variables.

### `.env.example`

Shows which backend environment variables are needed:

```text
SECRET_KEY
DEBUG
ALLOWED_HOSTS
CORS_ALLOWED_ORIGINS
CSRF_TRUSTED_ORIGINS
DATABASE_URL
```

Why this matters:

Real secrets should never be committed. `.env.example` shows the names without exposing real values.

### `frontend/.env.example`

Shows the frontend production API variable:

```text
VITE_API_BASE_URL
```

Why this matters:

Vercel needs to know the deployed backend URL.

## How The Frontend And Backend Connect

The connection works like this:

1. The React app calls Axios functions from `frontend/src/api/client.js`.
2. Axios sends requests to the Django API base URL.
3. Django routes the request through `backend/urls.py`.
4. The request reaches either `accounts/urls.py` or `jobs/urls.py`.
5. A DRF view handles the request.
6. A serializer validates or formats the data.
7. Django reads or writes the database.
8. JSON is returned to React.
9. React updates the page.

For protected actions, the flow also includes JWT:

1. User logs in.
2. Backend returns an access token.
3. Frontend stores the token in local storage.
4. Axios sends the token in the `Authorization` header.
5. Django verifies the token before allowing protected actions.

## What Was Verified

The backend was checked with:

```bash
python manage.py check
python manage.py test
python manage.py collectstatic --noinput
```

The frontend was checked with:

```bash
npm run build
```

These commands confirmed that the project could run, test, collect static files, and build the React frontend.

## What Can Be Improved Later

Good future improvements:

- Better role system for developers and employers.
- Saved jobs.
- Resume upload storage using Cloudinary or S3.
- Email notifications.
- Better company logo handling in production.
- Real job importing from public job APIs.
- AI resume matching.
- AI job recommendations.

## Summary

This project started as a basic Django job board idea and was completed into a full-stack application.

The backend handles data, authentication, permissions, and APIs.

The frontend handles the user experience.

The deployment configuration prepares the project for free hosting with a production PostgreSQL database.
