from django.urls import path

from .views import (
    ApplicationCreateView,
    CompanyDetailView,
    CompanyJobsView,
    CompanyListCreateView,
    EmployerJobListView,
    JobApplicantsView,
    JobDetailView,
    JobListCreateView,
)

urlpatterns = [
    path("jobs/", JobListCreateView.as_view(), name="job-list-create"),
    path("jobs/<int:pk>/", JobDetailView.as_view(), name="job-detail"),
    path("jobs/<int:pk>/apply/", ApplicationCreateView.as_view(), name="job-apply"),
    path("companies/", CompanyListCreateView.as_view(), name="company-list-create"),
    path("companies/<int:pk>/", CompanyDetailView.as_view(), name="company-detail"),
    path("companies/<int:pk>/jobs/", CompanyJobsView.as_view(), name="company-jobs"),
    path("dashboard/jobs/", EmployerJobListView.as_view(), name="dashboard-jobs"),
    path("dashboard/jobs/<int:pk>/applicants/", JobApplicantsView.as_view(), name="job-applicants"),
]
