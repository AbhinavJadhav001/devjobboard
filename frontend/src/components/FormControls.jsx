export function Field({ label, children }) {
  return (
    <label className="grid gap-1 text-sm font-medium text-ink">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "focus-ring w-full rounded border border-line bg-white px-3 py-2 text-sm text-ink";

export function SelectField({ label, value, onChange, options, placeholder = "Any" }) {
  return (
    <Field label={label}>
      <select className={inputClass} value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Alert({ children, tone = "error" }) {
  const color = tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-teal/20 bg-teal/10 text-teal";
  return <p className={`rounded border px-3 py-2 text-sm ${color}`}>{children}</p>;
}
