import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Settings2, ChevronLeft } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

function ManageResources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/resources", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResources(res.data.resources);
    } catch (error) {
      console.error(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/resources/${resourceToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Resource Deleted Successfully!");
      fetchResources();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete resource."
      );
    } finally {
      setResourceToDelete(null);
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <button 
        onClick={() => navigate("/admin")}
        className="flex items-center gap-[8px] h-[40px] rounded-[12px] text-[#E2E8F0] text-[14px] font-[600] border border-[#273449] bg-[#0F172A] hover:bg-[#1e293b] hover:text-white transition-all duration-300 w-fit"
        style={{ padding: '0 20px', marginBottom: '40px' }}
      >
        <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={2.5} />
        Back to Dashboard
      </button>

      <div style={{ marginBottom: '40px' }}>
        <PageHeader 
          title="Manage Resources"
          icon={Settings2}
          description="Add, edit, and remove campus resources from the system."
        >
          <button
            onClick={() => navigate("/admin/add-resource")}
            className="flex items-center justify-center gap-[8px] h-[44px] px-[20px] rounded-[12px] text-white text-[15px] font-[600] transition-all duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_24px_rgba(59,130,246,0.4)] hover:brightness-110 active:scale-[0.98]"
            style={{ background: 'linear-gradient(90deg, #1A56F6, #2A7AF6)' }}
          >
            <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
            <span>Add Resource</span>
          </button>
        </PageHeader>
      </div>

      {/* Table Container */}
      <Card noPadding className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#1e293b] text-[#94A3B8] text-[13px] uppercase tracking-wider font-[600]">
                <th style={{ padding: '20px 24px' }}>Resource</th>
                <th style={{ padding: '20px 24px' }}>Category</th>
                <th style={{ padding: '20px 24px' }}>Quantity</th>
                <th style={{ padding: '20px 24px' }}>Status</th>
                <th className="text-center" style={{ padding: '20px 24px' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center text-[#94A3B8]" style={{ padding: '48px 24px' }}>
                    Loading resources...
                  </td>
                </tr>
              ) : resources.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-[#94A3B8]" style={{ padding: '48px 24px' }}>
                    No resources found. Add one to get started.
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource._id} className="hover:bg-[#1e293b]/40 transition-colors">
                    <td style={{ padding: '20px 24px' }}>
                      <span className="font-[600] text-white text-[15px]">{resource.name}</span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span className="text-[#F1F5F9] text-[15px] capitalize font-[500]">{resource.type}</span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span className="text-[#F1F5F9] text-[15px] font-[500]">{resource.quantity || "N/A"}</span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      {resource.available !== false ? (
                        <Badge variant="success">Available</Badge>
                      ) : (
                        <Badge variant="danger">Unavailable</Badge>
                      )}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div className="flex items-center justify-center gap-[12px]">
                        <button
                          onClick={() => navigate(`/admin/edit-resource/${resource._id}`)}
                          className="w-[36px] h-[36px] rounded-[10px] bg-[#334155] text-white flex items-center justify-center hover:bg-[#3B82F6] hover:text-white transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Edit2 className="w-[18px] h-[18px]" strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => setResourceToDelete(resource._id)}
                          className="w-[36px] h-[36px] rounded-[10px] bg-[#334155] text-white flex items-center justify-center hover:bg-[#EF4444] hover:text-white transition-colors shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="w-[18px] h-[18px]" strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {resourceToDelete && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div 
            className="bg-[#0F172A] border border-[#273449] shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
            style={{ 
              padding: '32px', 
              borderRadius: '24px',
              maxWidth: '400px', 
              width: '90%', 
              margin: '0 16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            }}
          >
            <div className="rounded-full bg-[#EF4444]/10 flex items-center justify-center" style={{ width: '64px', height: '64px', marginBottom: '20px' }}>
              <Trash2 className="text-[#EF4444]" style={{ width: '32px', height: '32px' }} strokeWidth={1.5} />
            </div>
            <h3 className="font-[700] text-white" style={{ fontSize: '24px', marginBottom: '12px' }}>Delete Resource?</h3>
            <p className="text-[#94A3B8] leading-relaxed" style={{ fontSize: '16px', marginBottom: '32px' }}>
              Are you sure you want to delete this resource? This action cannot be undone.
            </p>
            <div className="flex w-full" style={{ gap: '16px' }}>
              <button
                onClick={() => setResourceToDelete(null)}
                className="flex-1 bg-[#1e293b] text-white font-[600] hover:bg-[#334155] transition-colors"
                style={{ height: '48px', borderRadius: '14px', fontSize: '15px' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-[#EF4444] text-white font-[600] hover:bg-[#DC2626] transition-colors shadow-[0_4px_16px_rgba(239,68,68,0.3)]"
                style={{ height: '48px', borderRadius: '14px', fontSize: '15px' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default ManageResources;