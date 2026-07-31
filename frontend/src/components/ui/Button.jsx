export function Button({ className = "", children, ...props }) {
    return (
        <button className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...props}>
            {children}
        </button>
    );
}
