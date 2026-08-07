import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { 
  CalendarRange, 
  MapPin, 
  Clock, 
  Tag, 
  CalendarX2, 
  Box, 
  Users, 
  FileText, 
  Loader2, 
  ArrowRight
} from "lucide-react";
import { Card } from "../../components/ui/Card";

import { FilterChips } from "../../components/ui/FilterChips";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Cancellation states
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [fadingOutId, setFadingOutId] = useState(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/bookings/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data.bookings);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmCancel = async () => {
    setCancellingId(bookingToCancel);
    setModalOpen(false);

    // 1-second loading spinner
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/bookings/${bookingToCancel}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Trigger fade out
      setFadingOutId(bookingToCancel);
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Booking cancelled successfully.");
      fetchBookings(); // re-fetch data
    } catch (error) {
      toast.error("Unable to cancel booking.");
    } finally {
      setCancellingId(null);
      setFadingOutId(null);
      setBookingToCancel(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === 'confirmed') {
      return (
        <div className="inline-flex items-center px-[14px] py-[6px] rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[13px] font-[700] uppercase tracking-wide">
          Confirmed
        </div>
      );
    }
    if (s === 'upcoming') {
      return (
        <div className="inline-flex items-center px-[14px] py-[6px] rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-[13px] font-[700] uppercase tracking-wide">
          Upcoming
        </div>
      );
    }
    if (s === 'today') {
      return (
        <div className="inline-flex items-center px-[14px] py-[6px] rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-[13px] font-[700] uppercase tracking-wide">
          Today
        </div>
      );
    }
    if (s === 'cancelled') {
      return (
        <div className="inline-flex items-center px-[14px] py-[6px] rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-[13px] font-[700] uppercase tracking-wide">
          Cancelled
        </div>
      );
    }
    return (
      <div className="inline-flex items-center px-[14px] py-[6px] rounded-full bg-[#64748B]/10 border border-[#64748B]/20 text-[#94A3B8] text-[13px] font-[700] uppercase tracking-wide">
        {status}
      </div>
    );
  };

  // Helper to calculate duration in hours/mins
  const getDuration = (start, end) => {
    if (!start || !end) return "—";
    try {
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const diffMins = (endH * 60 + endM) - (startH * 60 + startM);
      if (diffMins <= 0) return "—";
      const h = Math.floor(diffMins / 60);
      const m = diffMins % 60;
      if (h > 0 && m > 0) return `${h}h ${m}m`;
      if (h > 0) return `${h}h`;
      return `${m}m`;
    } catch {
      return "—";
    }
  };

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" }
  ];

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "all") return true;
    return booking.status.toLowerCase() === activeFilter;
  });

  return (
    <div className="w-full mx-auto relative" style={{ maxWidth: '1000px' }}>
      
      {/* Background Gradients (10% increased visibility) */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#3B82F6]/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#10B981]/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-[40px] font-[800] text-white tracking-tight flex items-center gap-[16px]">
          <CalendarRange className="w-[40px] h-[40px] text-[#3B82F6]" />
          My Bookings
        </h1>
        <p className="text-[#94A3B8] text-[17px] font-[500] mt-[8px]">
          View and manage your campus resource reservations.
        </p>
      </div>

      <FilterChips 
        options={filterOptions} 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />

      {/* Content */}
      <div className="transition-opacity duration-300" style={{ opacity: loading ? 0.5 : 1 }}>
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#94A3B8]">
            <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
          </div>
        ) : bookings.length === 0 ? (
          /* Global Empty State */
          <Card noPadding className="border border-[#273449]/50 bg-[#111827] shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-center flex flex-col items-center justify-center" style={{ minHeight: '400px', padding: '48px' }}>
            <div className="w-[100px] h-[100px] bg-[#0F172A] rounded-full flex items-center justify-center border border-[#273449] mb-[24px]">
              <CalendarX2 className="w-[48px] h-[48px] text-[#3B82F6]/50" />
            </div>
            <h2 className="text-[28px] font-[800] text-white mb-[12px]">No Bookings Yet</h2>
            <p className="text-[#94A3B8] text-[16px] mb-[32px] max-w-md mx-auto">
              Reserve a campus resource to see your bookings here.
            </p>
            <button 
              onClick={() => navigate('/resources')}
              className="h-[52px] px-[36px] rounded-[16px] text-white text-[16px] font-[600] flex items-center justify-center gap-[10px] transition-all duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.5)] hover:brightness-110 active:scale-[0.98]"
              style={{ background: 'linear-gradient(90deg, #154CC7, #215FD1)' }}
            >
              Browse Resources
            </button>
          </Card>
        ) : filteredBookings.length === 0 ? (
          /* Filtered Empty State */
          <Card noPadding className="border border-[#273449]/50 bg-[#111827] shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-center flex flex-col items-center justify-center animate-in fade-in duration-300" style={{ minHeight: '300px', padding: '48px' }}>
            <div className="w-[80px] h-[80px] bg-[#0F172A] rounded-full flex items-center justify-center border border-[#273449] mb-[24px]">
              <CalendarX2 className="w-[36px] h-[36px] text-[#3B82F6]/50" />
            </div>
            <h2 className="text-[24px] font-[800] text-white mb-[12px]">No {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings</h2>
            <p className="text-[#94A3B8] text-[16px] mb-[24px] max-w-md mx-auto">
              Bookings with this status will appear here.
            </p>
            <button 
              onClick={() => setActiveFilter('all')}
              className="h-[44px] px-[24px] rounded-[14px] text-white text-[15px] font-[600] transition-colors border border-[#273449] hover:bg-[#1e293b]"
            >
              Clear Filter
            </button>
          </Card>
      ) : (
        /* Bookings List */
        <div className="flex flex-col gap-[24px]">
          {filteredBookings.map((booking) => (
            <Card
              key={booking._id}
              noPadding
              className={`flex flex-col border border-[#273449]/50 bg-[#111827] transition-all duration-500 hover:border-[#3B82F6]/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:-translate-y-1 ${
                fadingOutId === booking._id ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
              }`}
              style={{ padding: '32px' }}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-[24px] mb-[32px]">
                {/* Top Left: Resource Info */}
                <div className="flex flex-col gap-[8px]">
                  <h2 className="text-[32px] font-[800] text-white leading-tight">
                    {booking.resource?.name || "Deleted Resource"}
                  </h2>
                  <div className="flex items-center text-[#94A3B8] text-[15px] font-[500] gap-[12px]">
                    <div className="flex items-center gap-[6px]">
                      <Tag className="w-[16px] h-[16px] text-[#475569]" />
                      <span className="capitalize">{booking.resource?.type || "Unknown"}</span>
                    </div>
                    <span className="w-[4px] h-[4px] rounded-full bg-[#475569]"></span>
                    <div className="flex items-center gap-[6px]">
                      <MapPin className="w-[16px] h-[16px] text-[#475569]" />
                      <span>{booking.resource?.location || "Unknown"}</span>
                    </div>
                  </div>
                </div>

                {/* Top Right: Status */}
                <div className="shrink-0">
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px] bg-[#0F172A] border border-[#273449]/50 rounded-[16px]" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[8px] text-[#64748B] text-[13px] font-[600] uppercase tracking-wider">
                    <CalendarRange className="w-[16px] h-[16px]" /> Date
                  </div>
                  <span className="text-white text-[16px] font-[500]">
                    {new Date(booking.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[8px] text-[#64748B] text-[13px] font-[600] uppercase tracking-wider">
                    <Clock className="w-[16px] h-[16px]" /> Time
                  </div>
                  <span className="text-white text-[16px] font-[500]">
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[8px] text-[#64748B] text-[13px] font-[600] uppercase tracking-wider">
                    <Clock className="w-[16px] h-[16px]" /> Duration
                  </div>
                  <span className="text-white text-[16px] font-[500]">
                    {getDuration(booking.startTime, booking.endTime)}
                  </span>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[8px] text-[#64748B] text-[13px] font-[600] uppercase tracking-wider">
                    <Users className="w-[16px] h-[16px]" /> Capacity
                  </div>
                  <span className="text-white text-[16px] font-[500]">
                    {booking.resource?.capacity ? `${booking.resource.capacity} people` : '—'}
                  </span>
                </div>
              </div>

              {/* Purpose */}
              {booking.purpose && (
                <div className="flex flex-col gap-[8px] mb-[32px] px-[8px]">
                  <div className="flex items-center gap-[8px] text-[#64748B] text-[13px] font-[600] uppercase tracking-wider">
                    <FileText className="w-[16px] h-[16px]" /> Purpose
                  </div>
                  <p className="text-[#94A3B8] text-[16px] leading-relaxed">
                    {booking.purpose}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-[16px] pt-[24px] border-t border-[#273449]/50">
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => {
                      setBookingToCancel(booking._id);
                      setModalOpen(true);
                    }}
                    disabled={cancellingId === booking._id}
                    className="w-full sm:w-auto h-[48px] px-[24px] rounded-[16px] text-[#EF4444] text-[15px] font-[600] transition-colors border border-[#EF4444]/30 hover:bg-[#EF4444]/10 flex items-center justify-center gap-[8px]"
                  >
                    {cancellingId === booking._id ? (
                      <>
                        <Loader2 className="w-[18px] h-[18px] animate-spin" /> Cancelling...
                      </>
                    ) : (
                      "Cancel Booking"
                    )}
                  </button>
                )}
                
                {booking.resource && (
                  <button
                    onClick={() => navigate(`/resources/${booking.resource._id}`)}
                    className="w-full sm:w-auto sm:min-w-[200px] h-[48px] px-[24px] rounded-[16px] text-white text-[15px] font-[600] flex items-center justify-center gap-[8px] transition-all duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.5)] hover:brightness-110 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(90deg, #154CC7, #215FD1)' }}
                  >
                    View Details <ArrowRight className="w-[18px] h-[18px]" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" style={{ padding: '24px' }}>
          <div 
            className="bg-[#0F172A] border border-[#273449] rounded-[24px] w-full max-w-[420px] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            style={{ padding: '32px' }}
          >
            <h3 className="text-[22px] font-[800] text-white" style={{ marginBottom: '12px' }}>Cancel this booking?</h3>
            <p className="text-[#94A3B8] text-[15px] leading-relaxed" style={{ marginBottom: '40px' }}>
              This action cannot be undone. Are you sure you want to proceed?
            </p>
            
            <div className="flex flex-col sm:flex-row justify-end" style={{ gap: '20px' }}>
              <button 
                onClick={() => {
                  setModalOpen(false);
                  setBookingToCancel(null);
                }} 
                className="rounded-[16px] text-white text-[15px] font-[600] transition-colors border border-[#273449] hover:bg-[#1e293b]"
                style={{ height: '48px', padding: '0 24px' }}
              >
                Keep Booking
              </button>
              <button 
                onClick={confirmCancel} 
                className="rounded-[16px] text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[15px] font-[700] transition-colors border border-[#EF4444]/20"
                style={{ height: '48px', padding: '0 24px' }}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MyBookings;