export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[var(--color-app-border)] text-[var(--color-app-text)]",
    success: "bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
    danger: "bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]",
    accent: "bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30 shadow-[0_0_8px_rgba(139,92,246,0.2)]",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
