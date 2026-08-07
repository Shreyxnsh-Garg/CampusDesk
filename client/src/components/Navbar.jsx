import { useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-[12px] py-[8px] transition-colors text-[15px] font-[600] flex items-center justify-center ${
      isActive
        ? "text-[#3B82F6]"
        : "text-[#94A3B8] hover:text-white"
    }`;

  const renderIndicator = ({ isActive }) =>
    isActive && (
      <div className="absolute bottom-[-24px] w-[24px] h-[4px] bg-[#3B82F6] rounded-t-full shadow-[0_-2px_12px_rgba(59,130,246,0.8)]"></div>
    );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#273449]/50 h-[72px] flex items-center justify-center w-full">
        <div className="content-wrapper !pt-0 flex justify-between items-center relative h-full">
        
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <div className="flex items-center gap-[12px]">
            <div className="w-[36px] h-[36px] rounded-[10px] bg-gradient-to-br from-[#1A56F6] to-[#2A7AF6] flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
              <GraduationCap className="w-[20px] h-[20px] text-white" strokeWidth={2.5} />
            </div>
            <span className="font-[700] text-[18px] text-white hidden sm:block tracking-tight">
              CampusDesk
            </span>
          </div>
        </div>

        {/* Center: Navigation */}
        <div className="flex-shrink-0 flex items-center gap-[32px]">
          {user?.role === "admin" ? (
            <>
              <NavLink to="/admin" end className={navLinkClass}>
                {(props) => (
                  <>
                    Admin
                    {renderIndicator(props)}
                  </>
                )}
              </NavLink>
              <NavLink to="/admin/resources" className={navLinkClass}>
                {(props) => (
                  <>
                    Resources
                    {renderIndicator(props)}
                  </>
                )}
              </NavLink>
              <NavLink to="/admin/bookings" className={navLinkClass}>
                {(props) => (
                  <>
                    Bookings
                    {renderIndicator(props)}
                  </>
                )}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                {(props) => (
                  <>
                    Dashboard
                    {renderIndicator(props)}
                  </>
                )}
              </NavLink>
              <NavLink to="/resources" className={navLinkClass}>
                {(props) => (
                  <>
                    Resources
                    {renderIndicator(props)}
                  </>
                )}
              </NavLink>
              <NavLink to="/my-bookings" className={navLinkClass}>
                {(props) => (
                  <>
                    My Bookings
                    {renderIndicator(props)}
                  </>
                )}
              </NavLink>
            </>
          )}
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex-1 flex items-center justify-end gap-[12px]">
          <div className="flex items-center gap-[12px] mr-[4px]">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[14px] font-[600] text-white leading-tight">{user?.name}</span>
              <span className="text-[12px] text-[#94A3B8] font-[500] capitalize mt-[2px]">{user?.role}</span>
            </div>
            
            {/* Avatar */}
            <div className="w-[40px] h-[40px] rounded-full bg-[#1e293b] border border-[#273449] flex items-center justify-center text-white font-[600] text-[15px]">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          
          <div className="h-[20px] w-[1px] bg-[#273449] mx-[4px] hidden sm:block"></div>
          
          {/* Logout Button */}
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-[8px] h-[40px] px-[16px] rounded-[12px] text-[#EF4444] font-[500] text-[14px] border border-[#EF4444]/40 hover:bg-[#EF4444]/10 hover:border-[#EF4444]/80 hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all duration-300"
            title="Logout"
          >
            <LogOut className="w-[16px] h-[16px]" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" style={{ padding: '24px' }}>
          <div 
            className="bg-[#0F172A] border border-[#273449] rounded-[24px] w-full max-w-[420px] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            style={{ padding: '32px' }}
          >
            <h3 className="text-[22px] font-[800] text-white" style={{ marginBottom: '12px' }}>Confirm Logout</h3>
            <p className="text-[#94A3B8] text-[15px] leading-relaxed" style={{ marginBottom: '40px' }}>
              Are you sure you want to sign out of CampusDesk?
            </p>
            
            <div className="flex flex-col sm:flex-row justify-end" style={{ gap: '20px' }}>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="rounded-[16px] text-white text-[15px] font-[600] transition-colors border border-[#273449] hover:bg-[#1e293b]"
                style={{ height: '48px', padding: '0 24px' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout} 
                className="rounded-[16px] text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[15px] font-[700] transition-colors border border-[#EF4444]/20"
                style={{ height: '48px', padding: '0 24px' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default Navbar;