import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { api, endpoints } from "../api/client";
import { Alert, Field, inputClass } from "../components/FormControls.jsx";
import JobCard from "../components/JobCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function CompanyPage() {
  const { isAuthenticated } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ name: "", website: "", location: "", description: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(endpoints.companies).then((response) => setCompanies(response.data)).catch(() => setError("Could not load companies."));
  }, [message]);

  useEffect(() => {
    if (!selectedId) return;
    api.get(endpoints.companyJobs(selectedId)).then((response) => setJobs(response.data));
  }, [selectedId]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    try {
      await api.post(endpoints.companies, form);
      setMessage("Company profile created.");
      setForm({ name: "", website: "", location: "", description: "" });
    } catch {
      setError("Could not create company profile. Your account may already have one.");
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded border border-line bg-white p-4">
        <h1 className="text-xl font-semibold">Company Profile</h1>
        {message && <div className="mt-3"><Alert tone="success">{message}</Alert></div>}
        {error && <div className="mt-3"><Alert>{error}</Alert></div>}
        {isAuthenticated ? (
          <form className="mt-4 grid gap-3" onSubmit={submit}>
            <Field label="Company name"><input className={inputClass} value={form.name} onChange={(event) => update("name", event.target.value)} required /></Field>
            <Field label="Website"><input className={inputClass} value={form.website} onChange={(event) => update("website", event.target.value)} /></Field>
            <Field label="Location"><input className={inputClass} value={form.location} onChange={(event) => update("location", event.target.value)} /></Field>
            <Field label="Description"><textarea className={inputClass} rows="5" value={form.description} onChange={(event) => update("description", event.target.value)} /></Field>
            <button className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
              <Save className="h-4 w-4" />
              Save
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-slate-600">Login to create a company profile.</p>
        )}
      </section>
      <section className="grid h-fit gap-4">
        <div className="rounded border border-line bg-white p-4">
          <h2 className="text-lg font-semibold">Company Jobs</h2>
          <select className={`${inputClass} mt-3`} value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-3">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          {selectedId && !jobs.length && <p className="rounded border border-line bg-white p-4 text-sm text-slate-600">No jobs posted for this company.</p>}
        </div>
      </section>
    </main>
  );
}
