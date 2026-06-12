from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Job


class JobApiTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username="owner", password="password123")
        self.other_user = User.objects.create_user(username="other", password="password123")
        self.job = Job.objects.create(
            owner=self.owner,
            title="Backend Developer",
            company="Acme",
            location="Remote",
            description="Build APIs",
            job_type="full_time",
            experience_level="mid",
            work_mode="remote",
        )

    def test_public_can_list_jobs(self):
        response = self.client.get("/api/jobs/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["title"], "Backend Developer")

    def test_authenticated_user_can_create_job(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(
            "/api/jobs/",
            {
                "title": "Frontend Developer",
                "company": "Acme",
                "location": "Pune",
                "description": "Build React apps",
                "job_type": "full_time",
                "experience_level": "entry",
                "work_mode": "hybrid",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["owner"], "owner")

    def test_only_owner_can_update_job(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.patch(
            f"/api/jobs/{self.job.id}/",
            {"title": "Changed"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
