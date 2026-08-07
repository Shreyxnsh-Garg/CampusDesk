import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { BookOpen, CalendarDays, LayoutGrid, ChevronRight, CalendarX2 } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, myBookings: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        const [bookingsRes, resourcesRes] = await Promise.all([
          api.get("/bookings/me", { headers }),
          api.get("/resources", { headers })
        ]);

        const allBookings = bookingsRes.data.bookings;
        const resources = resourcesRes.data.resources || [];
        
        setRecentBookings(allBookings.slice(0, 3));
        
        setStats({
          total: resources.length,
          myBookings: allBookings.filter(b => b.status === 'confirmed').length,
          completed: allBookings.filter(b => b.status === 'completed').length,
        });

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusVariant = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'danger';
      case 'completed': return 'accent';
      default: return 'warning';
    }
  };

  return (
    <>
      {/* Welcome Section */}
      <div className="flex flex-col" style={{ marginBottom: '32px' }}>
        <h1 className="text-[32px] font-[800] text-white flex items-center gap-3">
          Welcome back, {user?.name?.split(" ")[0] || "Student"} <span className="text-3xl">👋</span>
        </h1>
        <p className="text-[17px] font-[500] text-[#94A3B8]" style={{ marginTop: '12px' }}>
          Here's what's happening on campus today.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '24px', marginBottom: '32px' }}>
        <StatCard 
          title="Total Resources" 
          value={stats.total} 
          icon={LayoutGrid} 
          color="primary"
          loading={loading}
        />
        <StatCard 
          title="My Bookings" 
          value={stats.myBookings} 
          icon={CalendarDays} 
          color="accent"
          loading={loading}
        />
        <StatCard 
          title="Completed Bookings" 
          value={stats.completed} 
          icon={BookOpen} 
          color="warning"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <h2 className="text-[15px] font-[600] text-white uppercase tracking-wider" style={{ marginBottom: '24px' }}>Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px', marginBottom: '40px' }}>
        <Link to="/resources" className="block">
          <Card 
            className="hover:border-[#3B82F6]/50 transition-colors cursor-pointer group flex items-center justify-between h-full hover:-translate-y-[4px] hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)]"
            style={{ padding: '32px' }}
          >
            <div className="flex items-center gap-[24px]">
              <div className="w-[64px] h-[64px] rounded-[16px] bg-[#10B981]/10 text-[#10B981] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-[32px] h-[32px]" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-[6px]">
                <h3 className="text-[20px] font-[700] text-white">Browse Resources</h3>
                <p className="text-[16px] text-[#94A3B8]">Explore labs, halls, and equipment</p>
              </div>
            </div>
            <ChevronRight className="w-[28px] h-[28px] text-[#94A3B8] group-hover:text-[#10B981] transition-colors" />
          </Card>
        </Link>

        <Link to="/my-bookings" className="block">
          <Card 
            className="hover:border-[#8B5CF6]/50 transition-colors cursor-pointer group flex items-center justify-between h-full hover:-translate-y-[4px] hover:shadow-[0_12px_40px_rgba(139,92,246,0.12)]"
            style={{ padding: '32px' }}
          >
            <div className="flex items-center gap-[24px]">
              <div className="w-[64px] h-[64px] rounded-[16px] bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CalendarDays className="w-[32px] h-[32px]" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-[6px]">
                <h3 className="text-[20px] font-[700] text-white">My Bookings</h3>
                <p className="text-[16px] text-[#94A3B8]">View and manage your bookings</p>
              </div>
            </div>
            <ChevronRight className="w-[28px] h-[28px] text-[#94A3B8] group-hover:text-[#8B5CF6] transition-colors" />
          </Card>
        </Link>
      </div>

      {/* Recent Bookings Section */}
      <h2 className="text-[15px] font-[600] text-[#94A3B8] uppercase tracking-wider" style={{ marginBottom: '24px' }}>Recent Bookings</h2>
      <Card noPadding className="overflow-hidden">
        <div className="divide-y divide-[#273449]/50">
          {loading ? (
            <div className="p-12 text-center text-[#94A3B8]">Loading bookings...</div>
          ) : recentBookings.length > 0 ? (
            recentBookings.map((booking) => (
              <div key={booking._id} className="p-[28px] hover:bg-[#1e293b]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-[20px]">
                <div className="flex items-center gap-[20px]">
                  <div className="w-[48px] h-[48px] rounded-[14px] bg-[#0F172A] border border-[#273449] flex items-center justify-center text-[#94A3B8]">
                    <CalendarDays className="w-[24px] h-[24px]" />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <h4 className="text-[17px] font-[600] text-white">{booking.resource?.name}</h4>
                    <div className="flex items-center gap-[10px] text-[14px] text-[#94A3B8] font-[500]">
                      <span>{new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#273449]"></span>
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={getStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="min-h-[440px] flex flex-col items-center justify-center text-center p-[48px]">
              <div className="w-[64px] h-[64px] rounded-[16px] bg-[#0F172A] border border-[#273449] flex items-center justify-center mb-[20px]">
                <CalendarX2 className="w-[32px] h-[32px] text-[#475569]" strokeWidth={1.5} />
              </div>
              <h3 className="text-[22px] font-[700] text-white mb-[12px]">No bookings yet</h3>
              <p className="text-[#94A3B8] text-[16px] mb-[24px]">You haven't made any reservations.</p>
              <Button onClick={() => navigate('/resources')} className="px-[32px] h-[52px] rounded-[14px] font-[600] text-[16px] shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:brightness-110" style={{ background: 'linear-gradient(90deg, #1A56F6, #2A7AF6)' }}>
                Browse Resources
              </Button>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}