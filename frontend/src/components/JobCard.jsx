import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <article className="rounded border border-line bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link className="focus-ring rounded text-lg font-semibold hover:text-teal" to={`/jobs/${job.id}`}>
            {job.title}
          </Link>
          <p className="mt-1 text-sm text-slate-600">{job.company}</p>
        </div>
        <span className="rounded bg-mist px-2 py-1 text-xs font-semibold text-teal">{job.work_mode_display || job.work_mode}</span>
      </div>
      <p className="mt-3 flex items-center gap-1 text-sm text-slate-600">
        <MapPin className="h-4 w-4" />
        {job.location}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded border border-line px-2 py-1">{job.job_type_display || job.job_type}</span>
        <span className="rounded border border-line px-2 py-1">{job.experience_level_display || job.experience_level}</span>
        {job.salary && <span className="rounded border border-line px-2 py-1">{job.salary}</span>}
      </div>
    </article>
  );
}
