import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { LayoutList, X } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

import { FilterChips } from "../../components/ui/FilterChips";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Cancellation states
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/bookings/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data.bookings);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const triggerCancel = (id) => {
    setBookingToCancel(id);
    setModalOpen(true);
  };

  const confirmCancel = async () => {
    setCancellingId(bookingToCancel);
    setModalOpen(false);

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/bookings/${bookingToCancel}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || "Booking cancelled successfully.");
      fetchBookings();
    } catch (error) {
      toast.error("Unable to cancel booking.");
    } finally {
      setCancellingId(null);
      setBookingToCancel(null);
    }
  };

  const getStatusVariant = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'danger';
      case 'completed': return 'accent';
      default: return 'warning';
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
    <>
      <div style={{ marginBottom: '24px' }}>
        <PageHeader 
          title="All Bookings"
          icon={LayoutList}
          description="Manage and oversee every booking in CampusDesk."
        />
      </div>

      <FilterChips 
        options={filterOptions} 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />

      {/* Table Container */}
      <Card noPadding className="overflow-hidden transition-opacity duration-300" style={{ opacity: loading ? 0.5 : 1 }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#1e293b] text-[#94A3B8] text-[13px] uppercase tracking-wider font-[600]">
                <th style={{ padding: '20px 24px' }}>Student</th>
                <th style={{ padding: '20px 24px' }}>Resource</th>
                <th style={{ padding: '20px 24px' }}>Date & Time</th>
                <th style={{ padding: '20px 24px' }}>Purpose</th>
                <th style={{ padding: '20px 24px' }}>Status</th>
                <th className="text-center" style={{ padding: '20px 24px' }}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center text-[#CBD5E1]" style={{ padding: '48px 24px' }}>
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-[#CBD5E1]" style={{ padding: '48px 24px' }}>
                    No bookings found in the system.
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '48px 24px' }}>
                    <div className="flex flex-col items-center justify-center animate-in fade-in duration-300">
                      <p className="text-[#F8FAFC] text-[16px] font-[600] mb-[8px]">
                        No {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings
                      </p>
                      <p className="text-[#94A3B8] text-[14px]">
                        There are currently no bookings matching this status.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-[#1e293b]/40 transition-colors">
                    <td style={{ padding: '20px 24px' }}>
                      <div className="font-[600] text-white text-[15px]">
                        {booking.user?.name}
                      </div>
                      <div className="text-[14px] text-[#CBD5E1] mt-[4px]">
                        {booking.user?.email}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span className="font-[600] text-white text-[15px]">{booking.resource?.name}</span>
                      <div className="text-[13px] text-[#CBD5E1] capitalize mt-[4px]">{booking.resource?.type}</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div className="text-white text-[15px] font-[500]">
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="text-[14px] text-[#CBD5E1] mt-[4px]">
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <p className="text-[14px] text-[#CBD5E1] line-clamp-2 max-w-xs" title={booking.purpose}>
                        {booking.purpose}
                      </p>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div className="flex justify-center">
                        {booking.status === "confirmed" ? (
                          <button
                            onClick={() => triggerCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="flex items-center justify-center gap-[6px] h-[36px] px-[16px] rounded-[10px] text-[#EF4444] font-[600] text-[14px] border border-[#EF4444]/40 hover:bg-[#EF4444]/10 hover:border-[#EF4444]/80 transition-all duration-300 disabled:opacity-50"
                          >
                            {cancellingId === booking._id ? "..." : <><X className="w-[16px] h-[16px]" /> Cancel</>}
                          </button>
                        ) : (
                          <span className="text-[#94A3B8] text-[14px] opacity-50">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

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
    </>
  );
}

export default AdminBookings;