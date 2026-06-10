# DevJobBoard

A full-stack job board platform for developers and companies.

## Features

### Authentication

* User registration
* JWT authentication
* Developer and Company roles

### Developer Features

* Create developer profile
* Add skills and experience
* Save jobs
* Apply to jobs

### Company Features

* Create company profile
* Post jobs
* Manage job listings

### Job Features

* Full-time, part-time, contract, and internship listings
* Remote and on-site jobs
* Salary range support
* Experience level filtering
* Tech stack filtering

## Tech Stack

### Backend

* Django
* Django REST Framework
* JWT Authentication
* SQLite (development)

### Frontend (Planned)

* React
* Vite

## Project Structure

```text
devjobboard/
├── backend/
├── accounts/
├── jobs/
├── manage.py
└── README.md
```

## Setup

### Clone Repository

```bash
git clone https://github.com/AbhinavJadhav001/devjobboard.git
cd devjobboard
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Server

```bash
python manage.py runserver
```

## Roadmap

* [x] Initial Django setup
* [ ] Custom User Model
* [ ] JWT Login API
* [ ] Developer Profiles
* [ ] Company Profiles
* [ ] Job CRUD APIs
* [ ] Save Jobs Feature
* [ ] Job Applications
* [ ] React Frontend
* [ ] Deployment

## Author

Abhinav Jadhav
