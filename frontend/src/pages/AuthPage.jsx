import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Field, inputClass } from "../components/FormControls.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", first_name: "", last_name: "", password: "" });
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ username: form.username, password: form.password });
      }
      navigate("/dashboard");
    } catch {
      setError("Authentication failed. Check your details and try again.");
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <form className="grid gap-4 rounded border border-line bg-white p-5" onSubmit={submit}>
        <h1 className="text-xl font-semibold">{isRegister ? "Create Account" : "Login"}</h1>
        {error && <Alert>{error}</Alert>}
        <Field label="Username">
          <input className={inputClass} value={form.username} onChange={(event) => update("username", event.target.value)} required />
        </Field>
        {isRegister && (
          <>
            <Field label="Email">
              <input className={inputClass} type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="First name">
                <input className={inputClass} value={form.first_name} onChange={(event) => update("first_name", event.target.value)} />
              </Field>
              <Field label="Last name">
                <input className={inputClass} value={form.last_name} onChange={(event) => update("last_name", event.target.value)} />
              </Field>
            </div>
          </>
        )}
        <Field label="Password">
          <input className={inputClass} type="password" value={form.password} onChange={(event) => update("password", event.target.value)} required />
        </Field>
        <button className="focus-ring rounded bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
    </main>
  );
}
