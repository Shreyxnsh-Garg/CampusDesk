import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Search, MapPin, Box, Layers, ArrowRight, ChevronLeft } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import ResourceCard from "../../components/ResourceCard";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/resources", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResources(data.resources || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = [...new Set(resources.map((r) => r.type))];
  const locations = [...new Set(resources.map((r) => r.location))];

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchSearch = resource.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category ? resource.type === category : true;
      const matchLocation = location ? resource.location === location : true;
      return matchSearch && matchCategory && matchLocation;
    });
  }, [resources, search, category, location]);

  const displayedResources = showAll ? filteredResources : filteredResources.slice(0, 3);

  const totalResources = resources.length;
  const totalCategories = categories.length;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <button 
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-[8px] h-[40px] rounded-[12px] text-[#E2E8F0] text-[14px] font-[600] border border-[#273449] bg-[#0F172A] hover:bg-[#1e293b] hover:text-white transition-all duration-300 w-fit"
        style={{ padding: '0 20px', marginBottom: '40px' }}
      >
        <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={2.5} />
        Back to Dashboard
      </button>

      <div className="flex flex-col" style={{ marginBottom: '32px' }}>
        <h1 className="text-[32px] font-[800] text-white flex items-center gap-3">
          Campus Resources
        </h1>
        <p className="text-[17px] font-[500] text-[#94A3B8]" style={{ marginTop: '12px' }}>
          Browse, reserve and manage all campus resources in one place.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '24px', marginBottom: '32px' }}>
        <StatCard 
          title="Total Resources" 
          value={totalResources} 
          icon={Box} 
          color="primary"
          loading={loading}
        />
        <StatCard 
          title="Categories" 
          value={totalCategories} 
          icon={Layers} 
          color="accent"
          loading={loading}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row" style={{ gap: '20px', marginBottom: '28px' }}>
        <div className="relative flex-grow h-[52px]">
          <div className="absolute inset-y-0 flex items-center pointer-events-none" style={{ left: '24px' }}>
            <Search className="h-[20px] w-[20px] text-[#94A3B8]" />
          </div>
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full h-full bg-[#111827] border border-[#273449] rounded-[16px] text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors placeholder:text-[#475569] text-[15px] shadow-sm"
            style={{ paddingLeft: '56px', paddingRight: '24px' }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto h-[52px]" style={{ gap: '20px' }}>
          <div className="w-full sm:w-[200px] h-full relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full h-full px-5 bg-[#111827] border border-[#273449] rounded-[16px] text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors appearance-none text-[15px] shadow-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="w-full sm:w-[200px] h-full relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full h-full px-5 bg-[#111827] border border-[#273449] rounded-[16px] text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors appearance-none text-[15px] shadow-sm"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc.charAt(0).toUpperCase() + loc.slice(1)}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
        <p className="text-[15px] text-[#94A3B8] font-[500]">
          Showing {filteredResources.length} of {resources.length} resources
        </p>
      </div>

      {loading ? (
        <div className="text-center py-[80px] text-[#94A3B8]">Loading resources...</div>
      ) : filteredResources.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
            {displayedResources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
          
          {!showAll && filteredResources.length > 3 && (
            <div className="flex justify-center" style={{ marginTop: '40px' }}>
              <button 
                onClick={() => setShowAll(true)}
                className="h-[52px] px-[32px] rounded-[14px] text-white text-[16px] font-[600] flex items-center justify-center gap-[10px] transition-all duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.2)] hover:shadow-[0_6px_24px_rgba(59,130,246,0.4)] hover:brightness-110 active:scale-[0.99] group/btn" 
                style={{ background: 'linear-gradient(90deg, #1A56F6, #2A7AF6)' }}
              >
                <span>View All Resources</span>
                <ArrowRight className="w-[18px] h-[18px] transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center text-center py-[80px] border border-[#273449]/50 w-full">
          <div className="w-[64px] h-[64px] rounded-[16px] bg-[#0F172A] border border-[#273449] flex items-center justify-center mb-[20px]">
            <Search className="w-[32px] h-[32px] text-[#475569]" strokeWidth={1.5} />
          </div>
          <h3 className="text-[22px] font-[700] text-white mb-[12px]">No resources found</h3>
          <p className="text-[#94A3B8] text-[16px] max-w-md">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </Card>
      )}
    </div>
  );
}