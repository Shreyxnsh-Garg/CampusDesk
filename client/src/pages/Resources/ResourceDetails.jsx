import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { MapPin, Users, Tag, Box, ArrowLeft, CalendarPlus, Info } from "lucide-react";
import { Card } from "../../components/ui/Card";

function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResource();
  }, []);

  const fetchResource = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/resources/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResource(res.data.resource);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#94A3B8] font-medium text-[16px]">Loading resource details...</div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-[16px]">Resource not found</h1>
        <button onClick={() => navigate("/resources")} className="text-[#3B82F6] font-[500] hover:underline">
          Back to resources
        </button>
      </div>
    );
  }

  const isAvailable = resource.status !== "maintenance";

  return (
    <div className="w-full mx-auto" style={{ maxWidth: '1400px' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate("/resources")}
        className="flex items-center text-[15px] font-[500] text-[#94A3B8] hover:text-white transition-colors mb-[32px]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to resources
      </button>

      {/* Hero Section */}
      <Card noPadding className="overflow-hidden border border-[#273449]/50" style={{ marginBottom: '32px' }}>
        {/* Soft Background Glow inside Hero */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#10B981]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-[24px]" style={{ padding: '48px 40px' }}>
          
          <div className="flex flex-col md:flex-row md:items-center gap-[32px]">
            {/* Hero Icon */}
            <div className="w-[100px] h-[100px] shrink-0 bg-[#0F172A] rounded-[24px] shadow-lg border border-[#273449] flex items-center justify-center text-[#3B82F6]">
              <Box className="w-[48px] h-[48px]" />
            </div>
            
            {/* Hero Content */}
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
                {isAvailable ? (
                  <div className="inline-flex items-center px-[14px] py-[6px] rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[14px] font-[700] uppercase tracking-wide">
                    Available
                  </div>
                ) : (
                  <div className="inline-flex items-center px-[14px] py-[6px] rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-[14px] font-[700] uppercase tracking-wide">
                    Unavailable
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="shrink-0 mt-[16px] md:mt-0" style={{ paddingRight: '8px' }}>
            <button
              onClick={() => navigate(`/book-resource/${id}`)}
              className="h-[52px] px-[36px] rounded-[16px] text-white text-[16px] font-[600] flex items-center gap-[10px] transition-all duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.5)] hover:brightness-110 active:scale-[0.98]"
              style={{ background: 'linear-gradient(90deg, #1A56F6, #2A7AF6)' }}
            >
              <CalendarPlus className="w-[20px] h-[20px]" />
              Book Resource
            </button>
          </div>
        </div>
      </Card>

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px]">
        {/* Resource Details Card */}
        <Card noPadding className="border border-[#273449]/50 h-full flex flex-col">
          <div className="flex-grow flex flex-col" style={{ padding: '40px 32px' }}>
            <h3 className="text-[22px] font-[700] text-white flex items-center gap-[10px]" style={{ marginBottom: '32px', paddingLeft: '8px' }}>
              <Box className="w-[24px] h-[24px] text-[#3B82F6]" />
              Resource Details
            </h3>
            
            <div className="flex-grow flex flex-col justify-center w-full">
              <div className="flex items-center justify-between border-b border-[#273449]/50 w-full" style={{ padding: '20px 8px' }}>
                <div className="flex items-center text-[#94A3B8] font-[500] text-[16px]">
                  <Tag className="w-[20px] h-[20px] mr-[12px] text-[#475569]" />
                  <span>Category</span>
                </div>
                <span className="font-[600] text-white capitalize text-[16px] text-right">{resource.type}</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-[#273449]/50 w-full" style={{ padding: '20px 8px' }}>
                <div className="flex items-center text-[#94A3B8] font-[500] text-[16px]">
                  <MapPin className="w-[20px] h-[20px] mr-[12px] text-[#475569]" />
                  <span>Location</span>
                </div>
                <span className="font-[600] text-white text-[16px] text-right">{resource.location}</span>
              </div>

              {resource.capacity && (
                <div className="flex items-center justify-between border-b border-[#273449]/50 w-full" style={{ padding: '20px 8px' }}>
                  <div className="flex items-center text-[#94A3B8] font-[500] text-[16px]">
                    <Users className="w-[20px] h-[20px] mr-[12px] text-[#475569]" />
                    <span>Capacity</span>
                  </div>
                  <span className="font-[600] text-white text-[16px] text-right">{resource.capacity} people</span>
                </div>
              )}
              
              {resource.quantity && (
                <div className="flex items-center justify-between border-b border-[#273449]/50 w-full" style={{ padding: '20px 8px' }}>
                  <div className="flex items-center text-[#94A3B8] font-[500] text-[16px]">
                    <Box className="w-[20px] h-[20px] mr-[12px] text-[#475569]" />
                    <span>Total Quantity</span>
                  </div>
                  <span className="font-[600] text-white text-[16px] text-right">{resource.quantity} units</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Important Information Card */}
        <Card noPadding className="border border-[#273449]/50 h-full flex flex-col">
          <div className="flex-grow flex flex-col" style={{ padding: '40px 32px' }}>
            <h3 className="text-[22px] font-[700] text-white flex items-center gap-[10px]" style={{ marginBottom: '32px', paddingLeft: '8px' }}>
              <Info className="w-[24px] h-[24px] text-[#3B82F6]" />
              Important Information
            </h3>
            
            <div className="text-[#94A3B8] text-[16px] font-[500] flex-grow flex flex-col justify-center" style={{ lineHeight: '1.7', paddingLeft: '8px' }}>
              <p style={{ marginBottom: '20px' }}>
                When booking this resource, please ensure you respect the allocated time slots and leave the resource in good condition.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li className="flex items-start" style={{ marginBottom: '16px' }}>
                  <span className="w-[6px] h-[6px] rounded-full bg-[#3B82F6] shrink-0" style={{ marginTop: '10px', marginRight: '16px' }}></span>
                  <span className="flex-1">Bookings must be made at least 1 hour in advance.</span>
                </li>
                <li className="flex items-start" style={{ marginBottom: '16px' }}>
                  <span className="w-[6px] h-[6px] rounded-full bg-[#3B82F6] shrink-0" style={{ marginTop: '10px', marginRight: '16px' }}></span>
                  <span className="flex-1">Report any issues or damages immediately.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#3B82F6] shrink-0" style={{ marginTop: '10px', marginRight: '16px' }}></span>
                  <span className="flex-1">Cancellations should be done prior to the start time.</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ResourceDetails;