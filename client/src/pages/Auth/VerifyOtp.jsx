import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { GraduationCap, ArrowRight, Lock, ShieldCheck } from "lucide-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Auto-focus prev input on Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/login", { email });
      setTimer(60);
      toast.success("OTP sent again.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend");
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (loading) return;

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp: otpString,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Verified successfully!");

      const role = res.data.user.role;
      if (role === "student") {
        navigate("/dashboard");
      } else if (role === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center font-sans text-white p-6 relative overflow-hidden">
      
      {/* Background Elements (Exact Match to Login + slight visibility boost) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
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
      <div className="relative z-10 flex flex-col items-center w-full my-6" style={{ maxWidth: '540px', gap: '32px' }}>
        
        {/* Branding Section */}
        <div className="flex flex-col items-center w-full text-center">
          <div className="w-[72px] h-[72px] bg-[#111827] border border-[#1e293b] rounded-[20px] flex items-center justify-center shadow-xl shadow-black/40 relative" style={{ marginBottom: '24px' }}>
            <GraduationCap className="w-10 h-10 text-[#3B82F6]" strokeWidth={2} />
            <div className="absolute inset-0 rounded-[20px] border border-[#3B82F6] opacity-30 blur-[2px]"></div>
          </div>
          
          <h1 className="text-[44px] font-[800] tracking-tight text-white leading-tight" style={{ marginBottom: '12px' }}>
            CampusDesk
          </h1>
          
          <p className="text-[18px] font-[500] text-[#CBD5E1] tracking-wide">
            Campus Resource Booking System
          </p>
        </div>

        {/* OTP Card */}
        <div className="w-full bg-[#111827] border border-[#273449]/50 rounded-[20px] flex flex-col items-center" style={{ padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
          
          {/* Shield */}
          <div className="relative flex justify-center items-center" style={{ marginBottom: '20px' }}>
            <div className="absolute inset-0 bg-[#3B82F6] blur-[24px] opacity-20 rounded-full"></div>
            <ShieldCheck className="w-[48px] h-[48px] text-[#3B82F6] relative z-10 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <h2 className="text-[36px] font-[700] tracking-tight text-white leading-tight text-center" style={{ marginBottom: '12px' }}>
            Verify OTP
          </h2>
          
          {/* Instructions */}
          <p className="text-[#94A3B8] text-[16px] text-center" style={{ marginBottom: '12px' }}>
            Enter the 6-digit verification code sent to your email.
          </p>
          
          {/* Email */}
          <p className="text-[#3B82F6] text-[15px] font-[500] text-center" style={{ marginBottom: '24px' }}>
            {email}
          </p>

          <form onSubmit={handleVerify} className="flex flex-col items-center w-full">
            
            {/* OTP Boxes */}
            <div className="flex justify-center w-full" style={{ gap: '12px', marginBottom: '24px' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-[52px] h-[52px] text-center text-[22px] font-[600] bg-[#0F172A] border border-[#273449] text-white rounded-[14px] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] transition-all shadow-inner"
                />
              ))}
            </div>

            {/* Resend Section */}
            <p className="text-[#94A3B8] text-[15px] font-[500]" style={{ marginBottom: '8px' }}>
              Didn't receive the code?
            </p>
            {timer > 0 ? (
              <p className="text-[#3B82F6] font-[600] text-[15px]" style={{ marginBottom: '24px' }}>
                Resend OTP in <span className="opacity-80">00:{timer.toString().padStart(2, '0')}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors text-[15px] font-[600]"
                style={{ marginBottom: '24px' }}
              >
                Resend OTP
              </button>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full h-[52px] rounded-[14px] text-white text-[16px] font-[600] flex items-center justify-center gap-[12px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_32px_rgba(59,130,246,0.5)] hover:brightness-110 active:scale-[0.99]"
              style={{ background: 'linear-gradient(90deg, #1A56F6, #2A7AF6)', marginBottom: '20px' }}
            >
              <span>{loading ? "Verifying..." : "Verify OTP"}</span>
              {!loading && <ArrowRight className="w-[18px] h-[18px]" />}
            </button>
            
            {/* Secure Footer */}
            <div className="flex items-center justify-center w-full" style={{ gap: '12px' }}>
              <div className="h-px bg-[#1e293b] flex-1"></div>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <Lock className="w-[14px] h-[14px] text-[#10B981]" />
                <p className="text-[#475569] text-[13px] font-[500] tracking-wide uppercase">
                  Secure OTP Verification
                </p>
              </div>
              <div className="h-px bg-[#1e293b] flex-1"></div>
            </div>
          </form>
        </div>
      </div>

      {/* Page Footer */}
      <div className="mt-auto pt-[40px] pb-[32px] text-[#94A3B8] text-[14px] font-[500] z-10">
        © 2026 CampusDesk. All rights reserved.
      </div>
    </div>
  );
}
