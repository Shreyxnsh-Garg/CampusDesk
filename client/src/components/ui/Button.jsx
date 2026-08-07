export function Button({ children, variant = "primary", className = "", fullWidth = false, ...props }) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-app-bg)] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[var(--color-app-primary)] hover:bg-[var(--color-app-primary-hover)] text-white focus:ring-[var(--color-app-primary)] shadow-sm",
    secondary: "bg-[var(--color-app-border)] hover:bg-[#2A3B52] text-white focus:ring-[var(--color-app-border)]",
    outline: "border border-[var(--color-app-border)] text-white hover:bg-[var(--color-app-border)] focus:ring-[var(--color-app-border)]",
    danger: "bg-[var(--color-app-danger)] hover:bg-[var(--color-app-danger-hover)] text-white focus:ring-[var(--color-app-danger)]",
    ghost: "text-[var(--color-app-muted)] hover:text-white hover:bg-[var(--color-app-border)]",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const paddingStyle = variant === "ghost" ? "p-2" : "px-5 py-2.5 text-sm";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${paddingStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
