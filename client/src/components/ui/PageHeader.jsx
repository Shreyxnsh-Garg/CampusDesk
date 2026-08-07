export function PageHeader({ title, description, icon: Icon, children }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-app-text)] tracking-tight flex items-center gap-3">
          {Icon && <Icon className="w-7 h-7 text-[var(--color-app-accent)]" />}
          {title}
        </h1>
        {description && (
          <p className="text-[var(--color-app-muted)] mt-2">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="shrink-0 flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
