import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { GraduationCap, ArrowRight, Lock } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email });
      toast.success(res.data.message);
      navigate("/verify", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center font-sans text-white p-6 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Slightly increased opacity for radial glows */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#3B82F6] rounded-full blur-[150px] opacity-[0.25] -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#10B981] rounded-full blur-[160px] opacity-[0.20] translate-x-1/4 translate-y-1/4"></div>
        
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] border border-[#3B82F6] rounded-full opacity-[0.20]">
          <div className="absolute top-[70%] right-0 w-2 h-2 bg-[#3B82F6] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute bottom-[-20%] right-[-5%] w-[700px] h-[700px] border border-[#10B981] rounded-full opacity-[0.15]">
          <div className="absolute top-[30%] left-0 w-2 h-2 bg-[#10B981] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="absolute top-12 right-12 w-[180px] h-[180px] opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute bottom-12 left-12 w-[180px] h-[180px] opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center w-full my-10 gap-[48px]" style={{ maxWidth: '540px' }}>
        
        {/* Branding Section */}
        <div className="flex flex-col items-center w-full text-center">
          <div className="w-[72px] h-[72px] bg-[#111827] border border-[#1e293b] rounded-[20px] flex items-center justify-center shadow-xl shadow-black/40 relative mb-[32px]">
            <GraduationCap className="w-10 h-10 text-[#3B82F6]" strokeWidth={2} />
            <div className="absolute inset-0 rounded-[20px] border border-[#3B82F6] opacity-30 blur-[2px]"></div>
          </div>
          
          <h1 className="text-[48px] font-[800] tracking-tight text-white leading-tight mb-[16px]">
            CampusDesk
          </h1>
          
          <p className="text-[20px] font-[500] text-[#CBD5E1] tracking-wide">
            Campus Resource Booking System
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-[#111827] border border-[#273449]/50 rounded-[20px] flex flex-col" style={{ padding: '48px', gap: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
          <div className="flex flex-col items-center" style={{ gap: '16px' }}>
            <h2 className="text-[40px] font-[700] tracking-tight text-white leading-tight text-center">
              Sign In
            </h2>
            <p className="text-[#94A3B8] text-[17px] text-center">
              Access CampusDesk using your institute email.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col w-full" style={{ gap: '24px' }}>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <label className="text-[15px] font-medium text-[#94A3B8]">
                College Email
              </label>
              
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[56px] pl-[24px] pr-[16px] bg-[#0F172A] border border-[#273449] text-[16px] text-white placeholder:text-[#94A3B8]/70 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-[14px] transition-colors shadow-inner flex items-center"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] rounded-[14px] text-white text-[17px] font-[600] flex items-center justify-center gap-[12px] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:brightness-110 active:scale-[0.99]"
              style={{ background: 'linear-gradient(90deg, #1A56F6, #2A7AF6)' }}
            >
              <span>{loading ? "Sending OTP..." : "Send OTP"}</span>
              {!loading && <ArrowRight className="w-[18px] h-[18px]" />}
            </button>
            
            <div className="flex items-center justify-center gap-[8px] pt-[8px]">
              <Lock className="w-[16px] h-[16px] text-[#10B981]" />
              <p className="text-[#94A3B8] text-[14px] font-[500]">
                Secure OTP Verification
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-auto pt-[60px] pb-[40px] text-[#94A3B8] text-[14px] font-[500] z-10">
        © 2026 CampusDesk. All rights reserved.
      </div>
    </div>
  );
}

export default Login;