export function Input({ label, error, id, ...props }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={id}>{label}</label>
            <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" {...props} />
            {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}
