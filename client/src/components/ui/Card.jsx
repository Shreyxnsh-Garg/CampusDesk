export function Card({ children, className = "", noPadding = false, ...props }) {
  return (
    <div 
      className={`bg-[#172033] border border-[#273449]/50 rounded-[20px] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] animate-in fade-in slide-in-from-bottom-2 duration-500 ${noPadding ? "" : "p-[28px]"} ${className}`}
      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
      {...props}
    >
      {children}
    </div>
  );
}
