# Dev Job Board

A full-stack job board for developers and employers. Developers can browse and apply to jobs, while employers can create company profiles, post jobs, manage listings, and view applicants.

## Features

- User registration and login with JWT authentication
- User profile endpoint
- Job listing, detail, create, update, and delete APIs
- Job search and filtering by location, job type, experience level, and work mode
- Company profiles with logo, description, website, and location
- Company job listings
- Employer dashboard for posted jobs
- Applicant tracking for employer-owned jobs
- React frontend with routing, forms, filters, and dashboard views
- Deployment-ready config for Render, Vercel, and Neon PostgreSQL

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- SimpleJWT
- SQLite for local development
- PostgreSQL for production
- django-cors-headers
- WhiteNoise
- Gunicorn

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React icons

## Project Structure

```text
devjobboard/
├── accounts/
├── backend/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── jobs/
├── manage.py
├── requirements.txt
├── build.sh
├── render.yaml
├── DEPLOYMENT.md
└── README.md
```

## Local Setup

Clone the repository:

```bash
git clone https://github.com/AbhinavJadhav001/devjobboard.git
cd devjobboard
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Apply migrations:

```bash
python manage.py migrate
```

Run the Django API:

```bash
python manage.py runserver
```

The backend runs at:

```text
http://127.0.0.1:8000/
```

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://127.0.0.1:5173/
```

By default, the frontend calls:

```text
http://127.0.0.1:8000/api
```

For production, set this in Vercel:

```text
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

## API Endpoints

### Auth

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/profile/
PUT  /api/auth/profile/
```

### Jobs

```text
GET    /api/jobs/
POST   /api/jobs/
GET    /api/jobs/<id>/
PUT    /api/jobs/<id>/
DELETE /api/jobs/<id>/
POST   /api/jobs/<id>/apply/
```

### Companies

```text
GET    /api/companies/
POST   /api/companies/
GET    /api/companies/<id>/
PUT    /api/companies/<id>/
DELETE /api/companies/<id>/
GET    /api/companies/<id>/jobs/
```

### Employer Dashboard

```text
GET /api/dashboard/jobs/
GET /api/dashboard/jobs/<id>/applicants/
```

## Search And Filters

Jobs can be filtered with query parameters:

```text
/api/jobs/?search=react&location=remote&job_type=full_time&experience_level=mid&work_mode=remote
```

Supported values:

- `job_type`: `full_time`, `part_time`, `contract`, `internship`
- `experience_level`: `entry`, `mid`, `senior`, `lead`
- `work_mode`: `remote`, `onsite`, `hybrid`

## Deployment

Recommended free deployment:

- Backend: Render
- Frontend: Vercel
- Database: Neon PostgreSQL

Use Render for the Django API, Vercel for the React frontend, and Neon PostgreSQL for the production database.

### Vercel frontend deployment

This repository includes a root `vercel.json`, so it can be imported directly
into Vercel without changing the project root. Set `VITE_API_BASE_URL` to the
public URL of the deployed Django API followed by `/api`, then deploy.

Vercel deploys the React frontend only; the Django API needs a persistent host
and database (the included Render and Neon setup is one option). On that
backend's first deployment, set `SEED_DEMO_DATA=true`. The build seeds six
safe demo listings adapted from legitimate records in `job_train.csv`. Change
the value back to `false` after the initial deployment; the command is
idempotent, so repeated runs do not duplicate jobs.

## Useful Commands

Run backend checks:

```bash
python manage.py check
```

Run backend tests:

```bash
python manage.py test
```

Build frontend:

```bash
cd frontend
npm run build
```

## Future Improvements

- Save jobs
- Resume upload storage with Cloudinary or S3
- AI resume matching
- AI job recommendations
- Email notifications
- Better employer/developer role separation

## Author

Abhinav Jadhav
