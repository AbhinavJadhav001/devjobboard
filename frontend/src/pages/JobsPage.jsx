import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { api, endpoints } from "../api/client";
import { Alert, inputClass, SelectField } from "../components/FormControls.jsx";
import JobCard from "../components/JobCard.jsx";
import { experienceOptions, jobTypeOptions, workModeOptions } from "../data/options";

const initialFilters = { search: "", location: "", job_type: "", experience_level: "", work_mode: "" };

export default function JobsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    api
      .get(endpoints.jobs, { params })
      .then((response) => {
        setJobs(response.data);
        setError("");
      })
      .catch(() => setError("Could not load jobs. Check that the Django server is running."));
  }, [filters]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded border border-line bg-white p-4">
        <h1 className="text-xl font-semibold">Find Developer Jobs</h1>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm font-medium">
            Search
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input className={`${inputClass} pl-9`} value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="React, Django, Acme" />
            </div>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Location
            <input className={inputClass} value={filters.location} onChange={(event) => updateFilter("location", event.target.value)} placeholder="Remote, Pune, Berlin" />
          </label>
          <SelectField label="Job type" value={filters.job_type} onChange={(event) => updateFilter("job_type", event.target.value)} options={jobTypeOptions} />
          <SelectField label="Experience" value={filters.experience_level} onChange={(event) => updateFilter("experience_level", event.target.value)} options={experienceOptions} />
          <SelectField label="Work mode" value={filters.work_mode} onChange={(event) => updateFilter("work_mode", event.target.value)} options={workModeOptions} />
        </div>
      </aside>
      <section className="grid gap-3">
        {error && <Alert>{error}</Alert>}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">{jobs.length} jobs found</p>
        </div>
        <div className="grid gap-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {!jobs.length && !error && <p className="rounded border border-line bg-white p-4 text-sm text-slate-600">No matching jobs yet.</p>}
        </div>
      </section>
    </main>
  );
}
