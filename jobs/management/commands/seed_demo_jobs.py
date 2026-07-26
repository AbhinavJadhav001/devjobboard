from django.core.management.base import BaseCommand

from jobs.models import Job


# These display-only records are adapted from the legitimate (fraudulent=0)
# entries in job_train.csv.  They deliberately contain no contact details,
# links, or applicant data from the source file.
DEMO_JOBS = [
    {
        "title": "Middleware Architect",
        "company": "Gulf Retail Systems",
        "location": "Kuwait City, Kuwait",
        "description": "Design, operate, and improve the middleware, database, and web-platform services that support a growing retail business.",
        "job_type": "full_time",
        "experience_level": "senior",
        "work_mode": "onsite",
        "tech_stack": "Java, Oracle, JBoss, Tomcat, Apache, SQL",
        "salary": "Competitive",
    },
    {
        "title": "Senior Network Engineer",
        "company": "Northstar Networks",
        "location": "London, United Kingdom",
        "description": "Lead third-level network support and help maintain reliable, secure connectivity for business customers.",
        "job_type": "full_time",
        "experience_level": "senior",
        "work_mode": "onsite",
        "tech_stack": "Juniper, MPLS, BGP, Cisco, Network Security",
        "salary": "£55,000–£70,000",
    },
    {
        "title": "Ruby on Rails Developer",
        "company": "Harbor Financial Tech",
        "location": "Long Beach, CA",
        "description": "Build and improve high-traffic financial web applications with a product-focused engineering team.",
        "job_type": "full_time",
        "experience_level": "mid",
        "work_mode": "hybrid",
        "tech_stack": "Ruby on Rails, PostgreSQL, Redis, HTML, CSS, TDD",
        "salary": "$110,000–$140,000",
    },
    {
        "title": "Salesforce Consultant",
        "company": "CloudPath Consulting",
        "location": "Charlotte, NC",
        "description": "Design Salesforce solutions and integrations that help teams run customer service and sales operations.",
        "job_type": "contract",
        "experience_level": "senior",
        "work_mode": "hybrid",
        "tech_stack": "Salesforce, Apex, Visualforce, JavaScript, SQL, SOAP",
        "salary": "$80–$100/hour",
    },
    {
        "title": "Senior iOS Developer",
        "company": "Clip Studio Labs",
        "location": "Athens, Greece",
        "description": "Own end-to-end development of a customer-facing iOS application, from prototypes to production releases.",
        "job_type": "full_time",
        "experience_level": "senior",
        "work_mode": "hybrid",
        "tech_stack": "Swift, Objective-C, Cocoa, Xcode, REST APIs, Git",
        "salary": "Competitive",
    },
    {
        "title": "Java Backend Developer",
        "company": "Cityline Software",
        "location": "New York, NY",
        "description": "Design and implement reliable server-side services and APIs for complex client applications.",
        "job_type": "full_time",
        "experience_level": "senior",
        "work_mode": "hybrid",
        "tech_stack": "Java, Spring, Hibernate, JDBC, JMS, PostgreSQL",
        "salary": "$125,000–$155,000",
    },
]


class Command(BaseCommand):
    help = "Add deployment-safe demo jobs adapted from job_train.csv."

    def handle(self, *args, **options):
        created = 0
        for job in DEMO_JOBS:
            _, was_created = Job.objects.get_or_create(
                title=job["title"], company=job["company"], defaults=job
            )
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"Created {created} demo job(s)."))
