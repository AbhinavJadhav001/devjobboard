from django.contrib import admin

from .models import Application, Company, Job


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "location", "created_at")
    search_fields = ("name", "owner__username", "location")


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "location", "job_type", "work_mode", "created_at")
    list_filter = ("job_type", "experience_level", "work_mode")
    search_fields = ("title", "company", "location", "tech_stack")


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("job", "applicant", "created_at")
    search_fields = ("job__title", "applicant__username", "applicant__email")
