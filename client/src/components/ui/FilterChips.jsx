
export function FilterChips({ options, activeFilter, onFilterChange }) {
  const getActiveBackground = (value) => {
    switch(value) {
      case 'confirmed': return 'linear-gradient(90deg, #059669, #10B981)'; // Emerald green
      case 'completed': return 'linear-gradient(90deg, #2563EB, #3B82F6)'; // Blue
      case 'cancelled': return 'linear-gradient(90deg, #DC2626, #EF4444)'; // Red
      default: return 'linear-gradient(90deg, #475569, #64748B)'; // Slate for All
    }
  };

  const getActiveShadow = (value) => {
    switch(value) {
      case 'confirmed': return '0 4px 16px rgba(16, 185, 129, 0.4)';
      case 'completed': return '0 4px 16px rgba(59, 130, 246, 0.4)';
      case 'cancelled': return '0 4px 16px rgba(239, 68, 68, 0.4)';
      default: return '0 4px 16px rgba(100, 116, 139, 0.4)';
    }
  };

  return (
    <div className="flex flex-wrap" style={{ gap: '14px', marginBottom: '28px', maxWidth: '500px' }}>
      {options.map((option) => {
        const isActive = activeFilter === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`transition-all duration-300 font-[600] flex items-center justify-center ${
              isActive
                ? "text-white border-transparent"
                : "text-[#94A3B8] bg-[#0F172A]/50 border border-[#273449] hover:bg-[#1e293b] hover:text-[#F8FAFC]"
            }`}
            style={{
              height: '42px',
              padding: '0 24px',
              borderRadius: '21px',
              fontSize: '14.5px',
              letterSpacing: '0.3px',
              background: isActive ? getActiveBackground(option.value) : undefined,
              boxShadow: isActive ? getActiveShadow(option.value) : undefined
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
