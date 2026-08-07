import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { PlusCircle, ChevronLeft } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

function AddResource() {
  const [resource, setResource] = useState({
    name: "",
    type: "",
    quantity: "",
    location: "",
    capacity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setResource({
      ...resource,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/resources",
        resource,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Resource Added Successfully!");
      navigate("/admin/resources");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add resource."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resourceTypes = [
    { value: "Lecture Hall", label: "Lecture Hall" },
    { value: "SAC", label: "SAC" },
    { value: "Music Room", label: "Music Room" },
    { value: "Camera", label: "Camera" },
    { value: "Projector", label: "Projector" },
    { value: "Computer Lab", label: "Computer Lab" }, 
    { value: "Equipment", label: "Equipment" }, 
    { value: "Other", label: "Other" },   
  ];

  return (
    <div className="max-w-2xl mx-auto w-full relative" style={{ paddingBottom: '40px' }}>
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#3B82F6]/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/15 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <button 
        onClick={() => navigate("/admin/resources")}
        className="flex items-center gap-[8px] h-[40px] rounded-[12px] text-[#E2E8F0] text-[14px] font-[600] border border-[#273449] bg-[#0F172A] hover:bg-[#1e293b] hover:text-white transition-all duration-300 w-fit"
        style={{ padding: '0 20px', marginBottom: '48px' }}
      >
        <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={2.5} />
        Back to Resources
      </button>

      <div style={{ marginBottom: '40px' }}>
        <PageHeader 
          title="Add New Resource"
          icon={PlusCircle}
          description="Create a new resource to make it available for booking."
        />
      </div>

      <Card noPadding className="border border-[#273449]/50 bg-[#111827] shadow-[0_8px_30px_rgba(0,0,0,0.12)]" style={{ padding: '40px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <Input
            label="Resource Name"
            name="name"
            value={resource.name}
            onChange={handleChange}
            required
            placeholder="e.g., Main Auditorium"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '24px' }}>
            <Select
              label="Category"
              name="type"
              value={resource.type}
              onChange={handleChange}
              required
              options={[
                { value: "", label: "Select Category", disabled: true },
                ...resourceTypes
              ]}
            />

            <Input
              label="Quantity"
              type="number"
              name="quantity"
              value={resource.quantity}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g., 1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '24px' }}>
            <Input
              label="Location"
              name="location"
              value={resource.location}
              onChange={handleChange}
              required
              placeholder="e.g., Building A, Floor 2"
            />

            <Input
              label="Capacity (Optional)"
              type="number"
              name="capacity"
              value={resource.capacity}
              onChange={handleChange}
              min="1"
              placeholder="e.g., 100"
            />
          </div>

          <div className="flex justify-end pt-[16px] mt-[8px] border-t border-[#273449]/50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[48px] px-[32px] rounded-[16px] text-white text-[15px] font-[600] flex items-center justify-center gap-[8px] transition-all duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.5)] hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              style={{ background: 'linear-gradient(90deg, #154CC7, #215FD1)' }}
            >
              {isSubmitting ? "Adding Resource..." : "Add Resource"}
            </button>
          </div>

        </form>
      </Card>

    </div>
  );
}

export default AddResource;