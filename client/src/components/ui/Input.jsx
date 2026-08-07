export function Input({ label, error, icon: Icon, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-[#94A3B8]" />
          </div>
        )}
        <input 
          className={`w-full bg-[#0F172A] border border-[#273449] text-white rounded-[12px] h-[48px] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors placeholder:text-[#94A3B8] ${Icon ? 'pl-[44px] pr-[16px]' : 'px-[16px]'} ${error ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-[var(--color-app-danger)]">{error}</p>}
    </div>
  );
}
