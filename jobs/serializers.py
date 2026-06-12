from rest_framework import serializers
from .models import Application, Company, Job


class CompanySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Company
        fields = [
            "id",
            "owner",
            "name",
            "logo",
            "description",
            "website",
            "location",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]


class JobSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    applications_count = serializers.IntegerField(source="applications.count", read_only=True)
    job_type_display = serializers.CharField(source="get_job_type_display", read_only=True)
    experience_level_display = serializers.CharField(
        source="get_experience_level_display",
        read_only=True,
    )
    work_mode_display = serializers.CharField(source="get_work_mode_display", read_only=True)

    class Meta:
        model = Job
        fields = [
            "id",
            "owner",
            "company_profile",
            "title",
            "company",
            "location",
            "description",
            "salary",
            "job_type",
            "job_type_display",
            "experience_level",
            "experience_level_display",
            "work_mode",
            "work_mode_display",
            "tech_stack",
            "applications_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]


class ApplicationSerializer(serializers.ModelSerializer):
    applicant = serializers.ReadOnlyField(source="applicant.username")
    applicant_email = serializers.ReadOnlyField(source="applicant.email")
    job_title = serializers.ReadOnlyField(source="job.title")

    class Meta:
        model = Application
        fields = [
            "id",
            "job",
            "job_title",
            "applicant",
            "applicant_email",
            "cover_letter",
            "resume",
            "created_at",
        ]
        read_only_fields = ["id", "applicant", "applicant_email", "job_title", "created_at"]
