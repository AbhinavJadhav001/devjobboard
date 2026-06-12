import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, endpoints } from "../api/client";
import { Alert, inputClass } from "../components/FormControls.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function JobDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(endpoints.job(id))
      .then((response) => setJob(response.data))
      .catch(() => setError("Job not found."));
  }, [id]);

  async function apply(event) {
    event.preventDefault();
    try {
      await api.post(endpoints.apply(id), { job: id, cover_letter: coverLetter });
      setMessage("Application submitted.");
      setCoverLetter("");
    } catch {
      setError("Could not submit application. You may have already applied.");
    }
  }

  if (!job && !error) return <main className="mx-auto max-w-4xl px-4 py-6">Loading...</main>;

  return (
    <main className="mx-auto grid max-w-4xl gap-5 px-4 py-6">
      {error && <Alert>{error}</Alert>}
      {job && (
        <>
          <section className="rounded border border-line bg-white p-5">
            <p className="text-sm font-semibold text-teal">{job.company}</p>
            <h1 className="mt-1 text-2xl font-semibold">{job.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{job.location} · {job.work_mode_display} · {job.job_type_display} · {job.experience_level_display}</p>
            {job.salary && <p className="mt-2 text-sm font-medium">{job.salary}</p>}
            {job.tech_stack && <p className="mt-3 text-sm text-slate-600">Stack: {job.tech_stack}</p>}
            <p className="mt-5 whitespace-pre-wrap text-sm leading-6">{job.description}</p>
          </section>
          <section className="rounded border border-line bg-white p-5">
            <h2 className="text-lg font-semibold">Apply</h2>
            {!isAuthenticated ? (
              <p className="mt-2 text-sm text-slate-600">
                <Link className="font-medium text-teal" to="/login">Login</Link> to apply for this job.
              </p>
            ) : (
              <form className="mt-3 grid gap-3" onSubmit={apply}>
                {message && <Alert tone="success">{message}</Alert>}
                <textarea className={inputClass} rows="5" value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} placeholder="Short cover letter" />
                <button className="focus-ring inline-flex w-fit items-center gap-2 rounded bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
                  <Send className="h-4 w-4" />
                  Submit
                </button>
              </form>
            )}
          </section>
        </>
      )}
    </main>
  );
}
