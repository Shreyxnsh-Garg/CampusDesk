
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Box, CalendarRange, Users, Settings, LayoutList, ChevronRight } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalResources: 0,
    totalBookings: 0,
    totalStudents: 0,
    pendingReturns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Admin Dashboard"
        description="Overview of campus resources, bookings, and student activity."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '24px', marginBottom: '40px' }}>
        <StatCard 
          title="Resources" 
          value={stats.totalResources} 
          icon={Box} 
          color="primary"
          loading={loading}
        />
        <StatCard 
          title="Bookings" 
          value={stats.totalBookings} 
          icon={CalendarRange} 
          color="success"
          loading={loading}
        />
        <StatCard 
          title="Students" 
          value={stats.totalStudents} 
          icon={Users} 
          color="accent"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="text-[15px] font-[600] text-white uppercase tracking-wider" style={{ marginBottom: '24px' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px' }}>
          
          <button onClick={() => navigate("/admin/resources")} className="text-left w-full block">
            <Card className="hover:border-[#3B82F6]/50 transition-all duration-300 cursor-pointer group flex items-center justify-between hover:-translate-y-[4px] hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)]" style={{ padding: '40px 32px', minHeight: '160px' }}>
              <div className="flex items-center gap-[24px]">
                <div className="w-[64px] h-[64px] rounded-[16px] bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Settings className="w-[32px] h-[32px]" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <h3 className="text-[20px] font-[700] text-white tracking-wide">Manage Resources</h3>
                  <p className="text-[16px] text-[#94A3B8]">Add, edit, or remove resources</p>
                </div>
              </div>
              <ChevronRight className="w-[28px] h-[28px] text-[#94A3B8] group-hover:text-[#3B82F6] group-hover:translate-x-2 transition-all duration-300" />
            </Card>
          </button>

          <button onClick={() => navigate("/admin/bookings")} className="text-left w-full block">
            <Card className="hover:border-[#8B5CF6]/50 transition-all duration-300 cursor-pointer group flex items-center justify-between hover:-translate-y-[4px] hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)]" style={{ padding: '40px 32px', minHeight: '160px' }}>
              <div className="flex items-center gap-[24px]">
                <div className="w-[64px] h-[64px] rounded-[16px] bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <LayoutList className="w-[32px] h-[32px]" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <h3 className="text-[20px] font-[700] text-white tracking-wide">All Bookings</h3>
                  <p className="text-[16px] text-[#94A3B8]">View and manage reservations</p>
                </div>
              </div>
              <ChevronRight className="w-[28px] h-[28px] text-[#94A3B8] group-hover:text-[#8B5CF6] group-hover:translate-x-2 transition-all duration-300" />
            </Card>
          </button>

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;