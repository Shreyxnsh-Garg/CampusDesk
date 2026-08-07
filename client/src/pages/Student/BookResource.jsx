import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Calendar, Clock, ArrowLeft, CalendarX2, Box, MapPin } from "lucide-react";
import { Card } from "../../components/ui/Card";

function BookResource() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [existingBookings, setExistingBookings] = useState([]);
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/resources/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResource(res.data.resource);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResource();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/bookings",
        {
          resource: id,
          date,
          startTime,
          endTime,
          purpose,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      navigate("/my-bookings");
    }  catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Booking Failed");
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(
        `/resources/${id}/bookings?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExistingBookings(res.data.bookings);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (date) {
      fetchBookings();
    }
  }, [date]);

  return (
    <div className="w-full mx-auto" style={{ maxWidth: '1000px' }}>
      <div className="w-full" style={{ marginBottom: '32px' }}>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[15px] font-[500] text-[#94A3B8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
      </div>

      {resource && (
        <Card noPadding className="overflow-hidden border border-[#273449]/50" style={{ marginBottom: '32px' }}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#10B981]/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-[32px]" style={{ padding: '48px 40px' }}>
            <div className="w-[100px] h-[100px] shrink-0 bg-[#0F172A] rounded-[24px] shadow-lg border border-[#273449] flex items-center justify-center text-[#3B82F6]">
              <Box className="w-[48px] h-[48px]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[40px] font-[800] text-white tracking-tight leading-tight" style={{ marginBottom: '16px' }}>
                {resource.name}
              </h1>
              <div className="flex flex-wrap items-center gap-[16px] text-[#94A3B8] text-[17px] font-[500]">
                <span className="capitalize">{resource.type}</span>
                <span className="w-[4px] h-[4px] rounded-full bg-[#475569]"></span>
                <span className="flex items-center">
                  <MapPin className="w-[18px] h-[18px] mr-2" /> {resource.location}
                </span>
                <span className="w-[4px] h-[4px] rounded-full bg-[#475569]"></span>
                <div className="inline-flex items-center px-[14px] py-[6px] rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[14px] font-[700] uppercase tracking-wide">
                  Available
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <Card noPadding className="w-full border border-[#273449]/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div style={{ padding: '40px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 className="text-[24px] font-[700] text-white tracking-tight" style={{ marginBottom: '8px' }}>
              Booking Details
            </h2>
            <p className="text-[#94A3B8] text-[16px] font-[500]">
              Select a date and time to reserve this resource.
            </p>
          </div>

          {/* Existing Bookings Widget */}
          {date && (
            <div className="bg-[#111827] rounded-[16px] border border-[#273449]/50" style={{ padding: '24px', marginBottom: '32px' }}>
              <h3 className="font-[600] text-white flex items-center gap-[8px]" style={{ marginBottom: '16px' }}>
                <CalendarX2 className="w-[20px] h-[20px] text-[#3B82F6]" />
                Existing Bookings on {new Date(date).toLocaleDateString()}
              </h3>
              {existingBookings.length === 0 ? (
                <div className="inline-flex items-center px-[16px] py-[8px] rounded-[12px] bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[14px] font-[600]">
                  No bookings yet. Resource is available all day!
                </div>
              ) : (
                <div className="flex flex-wrap gap-[12px]">
                  {existingBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center bg-[#0F172A] border border-[#EF4444]/30 text-[14px] rounded-[12px]"
                      style={{ padding: '10px 16px', gap: '8px' }}
                    >
                      <Clock className="w-[16px] h-[16px] text-[#EF4444]" />
                      <span className="font-[500] text-white">
                        {booking.startTime} - {booking.endTime}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider font-[700] text-[#EF4444]" style={{ marginLeft: '4px' }}>
                        Booked
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleBooking} className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]" style={{ marginBottom: '24px' }}>
              {/* Date Input */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-[15px] font-[500] text-white" style={{ marginBottom: '12px' }}>
                  Select Date
                </label>
                <div className="relative h-[56px]">
                  <div className="absolute inset-y-0 flex items-center pointer-events-none" style={{ left: '20px' }}>
                    <Calendar className="h-[20px] w-[20px] text-[#94A3B8]" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full h-full bg-[#0F172A] border border-[#273449] rounded-[16px] text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors shadow-sm"
                    style={{ paddingLeft: '56px', paddingRight: '20px', fontSize: '16px', colorScheme: 'dark' }}
                    required
                  />
                </div>
              </div>

              {/* Start Time Input */}
              <div className="flex flex-col">
                <label className="text-[15px] font-[500] text-white" style={{ marginBottom: '12px' }}>
                  Start Time
                </label>
                <div className="relative h-[56px]">
                  <div className="absolute inset-y-0 flex items-center pointer-events-none" style={{ left: '20px' }}>
                    <Clock className="h-[20px] w-[20px] text-[#94A3B8]" />
                  </div>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="block w-full h-full bg-[#0F172A] border border-[#273449] rounded-[16px] text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors shadow-sm"
                    style={{ paddingLeft: '56px', paddingRight: '20px', fontSize: '16px', colorScheme: 'dark' }}
                    required
                  />
                </div>
              </div>

              {/* End Time Input */}
              <div className="flex flex-col">
                <label className="text-[15px] font-[500] text-white" style={{ marginBottom: '12px' }}>
                  End Time
                </label>
                <div className="relative h-[56px]">
                  <div className="absolute inset-y-0 flex items-center pointer-events-none" style={{ left: '20px' }}>
                    <Clock className="h-[20px] w-[20px] text-[#94A3B8]" />
                  </div>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="block w-full h-full bg-[#0F172A] border border-[#273449] rounded-[16px] text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors shadow-sm"
                    style={{ paddingLeft: '56px', paddingRight: '20px', fontSize: '16px', colorScheme: 'dark' }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div className="flex flex-col" style={{ marginBottom: '40px' }}>
              <label className="text-[15px] font-[500] text-white" style={{ marginBottom: '12px' }}>
                Purpose of Booking
              </label>
              <textarea
                placeholder="e.g. Study group session, Club meeting"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="block w-full bg-[#0F172A] border border-[#273449] rounded-[16px] text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors placeholder:text-[#475569] shadow-sm resize-none"
                style={{ padding: '20px', fontSize: '16px', minHeight: '140px' }}
                required
              />
            </div>

            {/* Booking Summary */}
            {resource && (
              <div className="bg-[#172033] border border-[#273449]/50 rounded-[16px]" style={{ padding: '24px', marginBottom: '40px' }}>
                <h3 className="text-[16px] font-[700] text-white" style={{ marginBottom: '16px' }}>Booking Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-[16px] text-[14px]">
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[#475569] font-[600] uppercase tracking-wider text-[11px]">Resource</span>
                    <span className="text-white font-[500]">{resource.name}</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[#475569] font-[600] uppercase tracking-wider text-[11px]">Location</span>
                    <span className="text-white font-[500]">{resource.location}</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[#475569] font-[600] uppercase tracking-wider text-[11px]">Date</span>
                    <span className="text-white font-[500]">{date ? new Date(date).toLocaleDateString() : '—'}</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[#475569] font-[600] uppercase tracking-wider text-[11px]">Duration</span>
                    <span className="text-white font-[500]">
                      {startTime && endTime ? `${startTime} to ${endTime}` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-[16px]">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto h-[52px] px-[32px] rounded-[16px] text-white text-[16px] font-[600] transition-colors border border-[#273449] hover:bg-[#1e293b]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto sm:min-w-[240px] h-[52px] px-[32px] rounded-[16px] text-white text-[16px] font-[600] transition-all duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.5)] hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'linear-gradient(90deg, #1A56F6, #2A7AF6)' }}
              >
                Confirm Reservation
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default BookResource;