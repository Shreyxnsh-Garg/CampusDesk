import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "./ui/Card";

function ResourceCard({ resource }) {
  const isAvailable = resource.status !== "maintenance";
  const capacity = resource.capacity || "N/A";

  return (
    <Card className="group relative overflow-hidden min-h-[240px] hover:border-[#3B82F6]/50 hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)] transition-all" noPadding>
      <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#3B82F6]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <div className="flex flex-col h-full w-full relative z-10 text-left" style={{ padding: '24px' }}>
        {/* Status Badge - Top Right */}
        <div className="absolute" style={{ top: '24px', right: '24px' }}>
          {isAvailable ? (
            <div className="inline-flex items-center rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[11px] font-[800] uppercase tracking-wider" style={{ padding: '4px 10px' }}>
              Available
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-[11px] font-[800] uppercase tracking-wider" style={{ padding: '4px 10px' }}>
              Unavailable
            </div>
          )}
        </div>

        <h2 className="text-[20px] font-[700] text-white line-clamp-1 mb-[12px] tracking-tight" style={{ paddingRight: '80px' }}>
          {resource.name}
        </h2>
        
        <div className="flex items-center gap-[10px] text-[15px] text-[#94A3B8] font-[500] capitalize mb-[12px]">
          <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          {resource.type}
        </div>
        
        <div className="flex items-center gap-[10px] text-[15px] text-[#94A3B8] font-[500] mb-[12px]">
          <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          {resource.location}
        </div>
        
        <div className="flex items-center gap-[10px] text-[15px] text-[#94A3B8] font-[500] mb-[20px]">
          <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Capacity: {capacity}
        </div>

        {/* Placeholder to maintain spacing */}
        <div className="mt-auto" style={{ marginBottom: '24px', height: '28px' }}></div>

        <Link to={`/resources/${resource._id}`} className="relative z-10 block w-full mt-auto">
          <button className="w-full h-[40px] rounded-[14px] text-white text-[15px] font-[500] flex items-center justify-center gap-[8px] transition-all duration-300 shadow-sm hover:shadow-md hover:brightness-110 active:scale-[0.99] group/btn bg-[#2563EB]/80 hover:bg-[#2563EB]">
            <span>View Details</span>
            <ArrowRight className="w-[16px] h-[16px] transform group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </Card>
  );
}

export default ResourceCard;