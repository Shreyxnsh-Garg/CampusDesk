import { Card } from "./Card";

export function StatCard({ title, value, icon: Icon, subtext, color = "accent", loading = false }) {
  const colorMap = {
    primary: "bg-[#3B82F6]/10 text-[#3B82F6]",
    success: "bg-[#10B981]/10 text-[#10B981]",
    danger: "bg-[#EF4444]/10 text-[#EF4444]",
    accent: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
  };

  const iconColors = colorMap[color] || colorMap.accent;

  return (
    <Card className="flex flex-col h-[170px]" style={{ padding: '24px' }}>
      {Icon && (
        <div className={`w-[48px] h-[48px] rounded-[14px] flex items-center justify-center mb-[16px] ${iconColors}`}>
          <Icon className="w-[24px] h-[24px]" strokeWidth={2} />
        </div>
      )}
      
      <h2 className="text-[15px] font-[600] text-[#94A3B8] uppercase tracking-wider mb-[18px]">
        {title}
      </h2>
      
      <div className="mt-auto">
        {loading ? (
          <div className="h-[40px] w-[100px] bg-[#273449] animate-pulse rounded-[10px]"></div>
        ) : (
          <div className="flex items-end gap-3">
            <h1 className="text-[42px] font-[800] text-white tracking-tight leading-none">
              {value}
            </h1>
            {subtext && (
              <span className="text-[14px] font-[500] text-[#94A3B8] mb-[4px]">
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
