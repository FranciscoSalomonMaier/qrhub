export function PageLoader({ label }) {
    return (
        <main className="grid min-h-screen place-items-center bg-slate-50">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
                <span className="size-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                {label}
            </div>
        </main>
    );
}
