import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A] pb-12 relative overflow-hidden font-sans text-white">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#3B82F6] rounded-full blur-[150px] opacity-[0.35] -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#10B981] rounded-full blur-[160px] opacity-[0.35] translate-x-1/4 translate-y-1/4"></div>
        
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] border border-[#3B82F6] rounded-full opacity-[0.20]">
          <div className="absolute top-[70%] right-0 w-2 h-2 bg-[#3B82F6] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute bottom-[-20%] right-[-5%] w-[700px] h-[700px] border border-[#10B981] rounded-full opacity-[0.15]">
          <div className="absolute top-[30%] left-0 w-2 h-2 bg-[#10B981] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="absolute top-12 right-12 w-[180px] h-[180px] opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute bottom-12 left-12 w-[180px] h-[180px] opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <div className="relative z-10 flex flex-col">
        <Navbar />
        
        <main className="content-wrapper flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
