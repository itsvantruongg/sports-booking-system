"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerCourtsPage() {
  const router = useRouter();
  const [courts, setCourts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [sportTypes, setSportTypes] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    cluster_id: "",
    new_cluster_name: "",
    sport_type_id: "",
    description: "",
    image_url: "",
    status: "ACTIVE"
  });

  const fetchCourts = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/owner/courts", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCourts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuxData = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const [vRes, sRes] = await Promise.all([
        fetch("http://localhost:5000/api/owner/venues", {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch("http://localhost:5000/api/public/sport-types")
      ]);
      if (vRes.ok) setVenues(await vRes.json());
      if (sRes.ok) {
        const sData = await sRes.json();
        setSportTypes(sData.data || sData);
      }
    } catch (err) { }
  };

  useEffect(() => {
    fetchCourts();
    fetchAuxData();
  }, [router]);

  const handleAddCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:5000/api/owner/courts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Thêm sân thành công!");
        setIsAddModalOpen(false);
        setFormData({ name: "", cluster_id: "", new_cluster_name: "", sport_type_id: "", description: "", image_url: "", status: "ACTIVE" });
        fetchCourts();
        if (formData.cluster_id === 'NEW') fetchAuxData();
      } else {
        const errData = await res.json();
        alert(errData.message || "Lỗi khi thêm sân");
      }
    } catch (err) {
      alert("Lỗi kết nối");
    }
  };

  const handleEditCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourtId) return;
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://localhost:5000/api/owner/courts/${editingCourtId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Cập nhật sân thành công!");
        setIsEditModalOpen(false);
        setEditingCourtId(null);
        setFormData({ name: "", cluster_id: "", new_cluster_name: "", sport_type_id: "", description: "", image_url: "", status: "ACTIVE" });
        fetchCourts();
      } else {
        const errData = await res.json();
        alert(errData.message || "Lỗi khi cập nhật sân");
      }
    } catch (err) {
      alert("Lỗi kết nối");
    }
  };

  const openEditModal = (court: any) => {
    setEditingCourtId(court._id);
    setFormData({
      name: court.name,
      cluster_id: court.cluster_id?._id || court.cluster_id,
      new_cluster_name: "",
      sport_type_id: court.sport_type_id?._id || court.sport_type_id,
      description: court.description || "",
      image_url: court.image_url || "",
      status: court.status || "ACTIVE"
    });
    setIsEditModalOpen(true);
  };

  const filteredCourts = courts.filter(court => 
    court.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (court.description && court.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 lg:p-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-2">Quản lý Sân</h1>
          <p className="text-lg text-on-surface-variant font-body">Quản lý các sân con, giá cả và lịch trình hoạt động.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-surface-container border border-outline-variant/30 rounded-xl font-body text-on-surface placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
              placeholder="Tìm kiếm sân con..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setFormData({ name: "", cluster_id: "", new_cluster_name: "", sport_type_id: "", description: "", image_url: "", status: "ACTIVE" });
              setIsAddModalOpen(true);
            }}
            className="bg-primary text-on-primary font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all active:translate-y-0"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Thêm sân con
          </button>
        </div>
      </header>

      {/* Quick Stats (Bento Layout) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-container-low rounded-lg p-8 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-on-surface-variant font-semibold font-body">Tổng số sân con</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
            </div>
          </div>
          <div className="text-5xl font-display font-bold text-on-surface relative z-10">{courts.length}</div>
        </div>
        <div className="bg-surface-container-low rounded-lg p-8 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-on-surface-variant font-semibold font-body">Trạng thái</h3>
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-5xl font-display font-bold text-on-surface">Tốt</span>
          </div>
        </div>
      </section>

      {/* Court List */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-display font-bold text-on-surface">Danh sách Sân</h2>
        </div>

        {loading ? (
          <div className="text-center py-10 text-on-surface-variant">Đang tải danh sách sân...</div>
        ) : filteredCourts.length === 0 ? (
          <div className="text-center py-10 text-on-surface-variant bg-surface-container-low rounded-xl">Không tìm thấy sân con nào.</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredCourts.map((court) => (
              <div key={court._id} className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(25,27,37,0.06)] flex flex-col sm:flex-row gap-6 relative group overflow-hidden">
                <div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden relative flex-shrink-0 bg-surface-container">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={court.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBbrRjGH7s7xAhJU-gynFjpOFA0RnEhv_Dlj9X7f7JXOUnFr9gB0ppEj3SY68ctzATtTLneQRORcI7muqgM2y6HTXEpa8xtABI3DNS1RrNxoehylqdekEq_W9CNJ_cHO5M1uzX9lYCd-EIbd98ewbH-sx7EsZ_-6M6kiu9J6JnxUPDV0OY7EjE8Cw-iOa6ttu5dqlhpTQy0ssYMnJxb_2S1rVfuDFaTRnWwuihLoqpr0OW_YTOitJ3qdix6Fn5zopeYtyyZp0EJkBE"} />
                </div>
                <div className="flex flex-col flex-1 justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-2xl font-display font-bold text-on-surface mb-1">{court.name}</h3>
                        <div className="flex gap-2">
                          <span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-xs font-semibold font-body">{court.sport_type_id?.name || "Thể thao"}</span>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${court.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{court.status === 'ACTIVE' ? '● Hoạt động' : '● Bảo trì'}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant font-body mb-4 line-clamp-2">{court.description || "Sân con thuộc hệ thống."}</p>
                  </div>
                  <div className="flex items-end justify-between border-t border-surface-variant/30 pt-4 gap-3">
                    <button onClick={() => openEditModal(court)} className="flex items-center gap-2 bg-primary text-on-primary font-semibold py-2 px-5 rounded-full hover:shadow-md transition-all text-sm">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Chỉnh sửa
                    </button>
                    <Link href="/owner/pricing"
                      className="flex items-center gap-2 bg-surface-container text-primary font-semibold py-2 px-4 rounded-full hover:bg-surface-container-high transition-colors text-sm">
                      <span className="material-symbols-outlined text-[16px]">price_change</span>
                      Quản lý giá
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Court Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest">
              <div>
                <h3 className="text-2xl font-black text-on-surface tracking-tight">Thêm sân mới</h3>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Thông tin chi tiết sân</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCourt} className="p-8 overflow-y-auto space-y-6 no-scrollbar">
              {/* Tên sân */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Tên sân mới</label>
                <input
                  required
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all font-bold outline-none"
                  placeholder="Ví dụ: Sân 1 - Hoa Lư"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Chọn cụm sân */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Thuộc cụm sân</label>
                <select
                  required
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface focus:ring-2 focus:ring-primary transition-all font-bold outline-none appearance-none"
                  value={formData.cluster_id}
                  onChange={(e) => setFormData({ ...formData, cluster_id: e.target.value })}
                >
                  <option value="">Chọn cụm sân</option>
                  {venues.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                  <option value="NEW" className="font-bold text-primary">+ Thêm cụm sân mới</option>
                </select>
              </div>

              {/* Tên cụm sân mới (hiển thị khi chọn NEW) */}
              {formData.cluster_id === 'NEW' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-black text-on-surface ml-1 text-primary">Tên cụm sân mới</label>
                  <input
                    required
                    autoFocus
                    className="w-full px-5 py-4 bg-primary/5 rounded-2xl border-none text-primary placeholder:text-primary/50 focus:ring-2 focus:ring-primary transition-all font-bold outline-none"
                    placeholder="Ví dụ: Cụm sân Cầu Giấy"
                    value={formData.new_cluster_name}
                    onChange={(e) => setFormData({ ...formData, new_cluster_name: e.target.value })}
                  />
                </div>
              )}

              {/* Chọn môn thể thao */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Môn thể thao</label>
                <select
                  required
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface focus:ring-2 focus:ring-primary transition-all font-bold outline-none appearance-none"
                  value={formData.sport_type_id}
                  onChange={(e) => setFormData({ ...formData, sport_type_id: e.target.value })}
                >
                  <option value="">Chọn môn thể thao</option>
                  {sportTypes.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              {/* Hình ảnh */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Hình ảnh (URL)</label>
                <input
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all font-bold outline-none"
                  placeholder="Link ảnh sân..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              {/* Mô tả */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Mô tả ngắn</label>
                <textarea
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all font-bold outline-none h-32"
                  placeholder="Thông tin về sân..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Submit */}
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-4 px-6 rounded-full font-black text-on-surface bg-surface-container-high hover:bg-surface-container transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 px-6 rounded-full font-black text-on-primary bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl hover:shadow-primary/20 transition-all"
                >
                  Thêm sân ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add padding to bottom for scrolling clearance */}
      <div className="h-24"></div>

      {/* Edit Court Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest">
              <div>
                <h3 className="text-2xl font-black text-on-surface tracking-tight">Chỉnh sửa sân con</h3>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Cập nhật thông tin</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 rounded-full text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEditCourt} className="p-8 overflow-y-auto space-y-6 no-scrollbar">
              {/* Tên sân */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Tên sân con</label>
                <input
                  required
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all font-bold outline-none"
                  placeholder="Ví dụ: Sân 1 - Hoa Lư"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Chọn cụm sân */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Thuộc cụm sân</label>
                <select
                  required
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface focus:ring-2 focus:ring-primary transition-all font-bold outline-none appearance-none"
                  value={formData.cluster_id}
                  onChange={(e) => setFormData({ ...formData, cluster_id: e.target.value })}
                >
                  <option value="">Chọn cụm sân</option>
                  {venues.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                </select>
              </div>

              {/* Chọn môn thể thao */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Môn thể thao</label>
                <select
                  required
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface focus:ring-2 focus:ring-primary transition-all font-bold outline-none appearance-none"
                  value={formData.sport_type_id}
                  onChange={(e) => setFormData({ ...formData, sport_type_id: e.target.value })}
                >
                  <option value="">Chọn môn thể thao</option>
                  {sportTypes.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              {/* Trạng thái */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Trạng thái hoạt động</label>
                <select
                  required
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface focus:ring-2 focus:ring-primary transition-all font-bold outline-none appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                  <option value="BLOCKED">Tạm khóa</option>
                </select>
              </div>

              {/* Hình ảnh */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Hình ảnh (URL)</label>
                <input
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all font-bold outline-none"
                  placeholder="Link ảnh sân..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              {/* Mô tả */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-on-surface ml-1">Mô tả ngắn</label>
                <textarea
                  className="w-full px-5 py-4 bg-[#f3f2ff] rounded-2xl border-none text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all font-bold outline-none h-32"
                  placeholder="Thông tin về sân..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Submit */}
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 px-6 rounded-full font-black text-on-surface bg-surface-container-high hover:bg-surface-container transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 px-6 rounded-full font-black text-on-primary bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl hover:shadow-primary/20 transition-all"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}