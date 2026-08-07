export function Select({ label, options, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">{label}</label>}
      <div className="relative">
        <select 
          className={`w-full bg-[#0F172A] border border-[#273449] text-white rounded-[12px] h-[48px] px-[16px] appearance-none focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors ${error ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]" : ""} ${className}`}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value} disabled={opt.disabled} className="bg-[#0F172A] text-white">{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-[16px] pointer-events-none text-[#94A3B8]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
          </svg>
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm text-[var(--color-app-danger)]">{error}</p>}
    </div>
  );
}
