# Free Deployment Guide

This project is split into two deployed apps:

- Django REST API on Render
- React frontend on Vercel
- PostgreSQL database on Neon

SQLite is only for local development. In production, use Neon PostgreSQL because hosted filesystems can be temporary.

## 1. Push To GitHub

Create a GitHub repository and push this project.

```bash
git add .
git commit -m "Prepare project for deployment"
git push origin main
```

## 2. Create Neon Database

1. Go to Neon and create a free project.
2. Create or use the default database.
3. Copy the connection string.
4. Keep it ready as `DATABASE_URL`.

It will look like this:

```text
postgresql://user:password@host/database?sslmode=require
```

## 3. Deploy Backend On Render

1. Go to Render.
2. Create a new Web Service.
3. Connect your GitHub repository.
4. Use the project root as the root directory.
5. Set build command:

```bash
bash build.sh
```

6. Set start command:

```bash
gunicorn backend.wsgi:application
```

7. Add environment variables:

```text
SECRET_KEY=make-a-long-random-secret
DEBUG=False
ALLOWED_HOSTS=your-render-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-vercel-frontend.vercel.app
DATABASE_URL=your-neon-postgres-url
```

After Render deploys, test:

```text
https://your-render-backend.onrender.com/api/jobs/
```

## 4. Deploy Frontend On Vercel

1. Go to Vercel.
2. Import the same GitHub repository.
3. Set root directory:

```text
frontend
```

4. Set build command:

```bash
npm run build
```

5. Set output directory:

```text
dist
```

6. Add environment variable:

```text
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

After Vercel deploys, copy the Vercel URL and update Render:

```text
CORS_ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-vercel-frontend.vercel.app
```

Then redeploy the backend.

## 5. Create Admin User In Production

Render free services do not provide shell access, so the simplest free path is to register through the frontend first.

For local admin work, create a local superuser:

```bash
python manage.py createsuperuser
```

## Important Notes

- Free Render backend may sleep after inactivity. The first request can take around a minute.
- Uploaded media files are not production-safe on free Render. Company logos and resumes should later move to Cloudinary, S3, or another object storage service.
- Neon free database limits are fine for a portfolio project.
- Keep `DEBUG=False` in production.
- Never commit real `.env` secrets.
