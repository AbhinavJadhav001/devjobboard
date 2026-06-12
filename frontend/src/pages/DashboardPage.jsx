import { Edit, Plus, Save, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api, endpoints } from "../api/client";
import { Alert, Field, inputClass, SelectField } from "../components/FormControls.jsx";
import { experienceOptions, jobTypeOptions, workModeOptions } from "../data/options";

const emptyJob = {
  title: "",
  company: "",
  location: "",
  description: "",
  salary: "",
  job_type: "full_time",
  experience_level: "mid",
  work_mode: "remote",
  tech_stack: "",
};

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [editingId, setEditingId] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  function loadJobs() {
    api
      .get(endpoints.dashboardJobs)
      .then((response) => setJobs(response.data))
      .catch(() => setError("Could not load dashboard jobs."));
  }

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(endpoints.job(editingId), form);
        setMessage("Job updated.");
      } else {
        await api.post(endpoints.jobs, form);
        setMessage("Job posted.");
      }
      setForm(emptyJob);
      setEditingId(null);
      loadJobs();
    } catch {
      setError("Could not save job. Check every required field.");
    }
  }

  function startEdit(job) {
    setEditingId(job.id);
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      salary: job.salary || "",
      job_type: job.job_type,
      experience_level: job.experience_level,
      work_mode: job.work_mode,
      tech_stack: job.tech_stack || "",
    });
  }

  async function removeJob(id) {
    await api.delete(endpoints.job(id));
    loadJobs();
  }

  async function loadApplicants(id) {
    const response = await api.get(endpoints.applicants(id));
    setApplicants((current) => ({ ...current, [id]: response.data }));
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[380px_1fr]">
      <section className="h-fit rounded border border-line bg-white p-4">
        <h1 className="text-xl font-semibold">{editingId ? "Edit Job" : "Post Job"}</h1>
        <form className="mt-4 grid gap-3" onSubmit={submit}>
          {message && <Alert tone="success">{message}</Alert>}
          {error && <Alert>{error}</Alert>}
          <Field label="Title"><input className={inputClass} value={form.title} onChange={(event) => update("title", event.target.value)} required /></Field>
          <Field label="Company"><input className={inputClass} value={form.company} onChange={(event) => update("company", event.target.value)} required /></Field>
          <Field label="Location"><input className={inputClass} value={form.location} onChange={(event) => update("location", event.target.value)} required /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField label="Job type" value={form.job_type} onChange={(event) => update("job_type", event.target.value)} options={jobTypeOptions} placeholder="Select" />
            <SelectField label="Work mode" value={form.work_mode} onChange={(event) => update("work_mode", event.target.value)} options={workModeOptions} placeholder="Select" />
          </div>
          <SelectField label="Experience" value={form.experience_level} onChange={(event) => update("experience_level", event.target.value)} options={experienceOptions} placeholder="Select" />
          <Field label="Salary"><input className={inputClass} value={form.salary} onChange={(event) => update("salary", event.target.value)} /></Field>
          <Field label="Tech stack"><input className={inputClass} value={form.tech_stack} onChange={(event) => update("tech_stack", event.target.value)} /></Field>
          <Field label="Description"><textarea className={inputClass} rows="6" value={form.description} onChange={(event) => update("description", event.target.value)} required /></Field>
          <button className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
            {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Update" : "Post"}
          </button>
        </form>
      </section>
      <section className="grid h-fit gap-3">
        <h2 className="text-xl font-semibold">Posted Jobs</h2>
        {jobs.map((job) => (
          <article className="rounded border border-line bg-white p-4" key={job.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-slate-600">{job.company} · {job.location}</p>
              </div>
              <div className="flex gap-2">
                <button className="focus-ring rounded border border-line p-2 hover:bg-mist" onClick={() => startEdit(job)} title="Edit job"><Edit className="h-4 w-4" /></button>
                <button className="focus-ring rounded border border-line p-2 hover:bg-mist" onClick={() => loadApplicants(job.id)} title="View applicants"><Users className="h-4 w-4" /></button>
                <button className="focus-ring rounded border border-line p-2 text-red-600 hover:bg-red-50" onClick={() => removeJob(job.id)} title="Delete job"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            {applicants[job.id] && (
              <div className="mt-4 rounded bg-mist p-3">
                <p className="text-sm font-semibold">Applicants</p>
                {applicants[job.id].map((applicant) => (
                  <p className="mt-2 text-sm" key={applicant.id}>{applicant.applicant} · {applicant.applicant_email || "No email"}</p>
                ))}
                {!applicants[job.id].length && <p className="mt-2 text-sm text-slate-600">No applicants yet.</p>}
              </div>
            )}
          </article>
        ))}
        {!jobs.length && <p className="rounded border border-line bg-white p-4 text-sm text-slate-600">No jobs posted yet.</p>}
      </section>
    </main>
  );
}
