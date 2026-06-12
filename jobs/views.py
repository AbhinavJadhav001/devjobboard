from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Application, Company, Job
from .serializers import ApplicationSerializer, CompanySerializer, JobSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow public reads, but only owners can change their own records."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Job.objects.select_related("owner", "company_profile").all()
        search = self.request.query_params.get("search")
        location = self.request.query_params.get("location")
        job_type = self.request.query_params.get("job_type")
        experience_level = self.request.query_params.get("experience_level")
        work_mode = self.request.query_params.get("work_mode")

        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(
                company__icontains=search
            ) | queryset.filter(tech_stack__icontains=search)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)
        if work_mode:
            queryset = queryset.filter(work_mode=work_mode)
        return queryset

    def perform_create(self, serializer):
        company_profile = getattr(self.request.user, "company_profile", None)
        serializer.save(owner=self.request.user, company_profile=company_profile)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.select_related("owner", "company_profile").all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.select_related("owner").all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if hasattr(self.request.user, "company_profile"):
            raise PermissionDenied("You already have a company profile.")
        serializer.save(owner=self.request.user)


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.select_related("owner").all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class CompanyJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Job.objects.filter(company_profile_id=self.kwargs["pk"]).select_related(
            "owner",
            "company_profile",
        )


class EmployerJobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(owner=self.request.user).select_related("company_profile")


class JobApplicantsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job = generics.get_object_or_404(Job, pk=self.kwargs["pk"])
        if job.owner != self.request.user:
            raise PermissionDenied("You can only view applicants for your own jobs.")
        return job.applications.select_related("applicant", "job")


class ApplicationCreateView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)
