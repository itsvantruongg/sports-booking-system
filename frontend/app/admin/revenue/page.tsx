"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Owner {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  commission_debt: number;
  status: "ACTIVE" | "BANNED";
  created_at: string;
}

export default function AdminRevenuePage() {
  const router = useRouter();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fetchOwners = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }

    try {
      let url = `http://localhost:5000/api/admin/users?role=OWNER&page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setOwners(json.data || []);
        setTotal(json.total || 0);
      }
    } catch (error) {
      console.error("Lỗi khi fetch owners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOwners();
  };

  const handleClearDebt = async (ownerId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${ownerId}/clear-debt`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setToast({ msg: "Đã thanh toán công nợ thành công", type: "success" });
        // Update local state to reflect the change
        setOwners(prev => prev.map(o => o._id === ownerId ? { ...o, commission_debt: 0 } : o));
      } else {
        const err = await res.json();
        setToast({ msg: err.message || "Không thể thanh toán công nợ", type: "error" });
      }
    } catch (error) {
      setToast({ msg: "Lỗi kết nối server", type: "error" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const totalDebt = owners.reduce((sum, owner) => sum + (owner.commission_debt || 0), 0);

  return (
    <div className="p-6 md:p-12 max-w-[1600px] mx-auto">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "success" ? "bg-primary text-white" : "bg-error text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-on-surface tracking-tight mb-2">Quản lý Doanh thu</h1>
          <p className="text-on-surface-variant text-lg">Theo dõi và quản lý công nợ hoa hồng 5% từ các chủ sân.</p>
        </div>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 bg-surface-container-low rounded-full p-2 pl-6 shadow-sm border border-transparent focus-within:border-outline-variant/30 focus-within:bg-surface-bright transition-all">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 w-64 md:w-80 font-body" 
            placeholder="Tìm theo tên chủ sân hoặc email..." 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-surface-container-highest p-3 rounded-full hover:bg-primary hover:text-on-primary transition-colors text-on-surface">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </form>
      </header>

      {/* Metric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-surface-container p-3 rounded-lg text-primary">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
          </div>
          <h3 className="text-on-surface-variant font-medium mb-1">Tổng công nợ cần thu (Trang này)</h3>
          <div className="text-4xl font-display font-bold text-on-surface">{totalDebt.toLocaleString()} ₫</div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-surface-container p-3 rounded-lg text-secondary">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
          </div>
          <h3 className="text-on-surface-variant font-medium mb-1">Số lượng chủ sân</h3>
          <div className="text-4xl font-display font-bold text-on-surface">{total}</div>
        </div>
      </div>

      {/* Owners Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_60px_rgba(25,27,37,0.06)] overflow-hidden">
        <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-2xl font-display font-bold text-on-surface">Danh sách Công nợ</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-sm">download</span> Xuất dữ liệu
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-sm font-semibold uppercase tracking-wider">
                <th className="p-6 font-body">Đối tác / Chủ sân</th>
                <th className="p-6 font-body">Liên hệ</th>
                <th className="p-6 font-body text-right">Công nợ (5% Phí nền tảng)</th>
                <th className="p-6 font-body text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p>Đang tải danh sách công nợ...</p>
                    </div>
                  </td>
                </tr>
              ) : owners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-on-surface-variant">Không tìm thấy chủ sân nào.</td>
                </tr>
              ) : (
                owners.map((owner) => (
                  <tr key={owner._id} className="hover:bg-surface-bright transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary font-black text-lg">
                          {owner.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface text-lg">{owner.name}</div>
                          <div className="text-xs text-on-surface-variant opacity-70">
                            ID: {owner._id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-medium text-on-surface">{owner.email}</div>
                      <div className="text-sm text-on-surface-variant">{owner.phone || 'Chưa cập nhật SĐT'}</div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="text-xl font-black text-error">
                        {owner.commission_debt?.toLocaleString() || 0} ₫
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleClearDebt(owner._id)}
                        disabled={!owner.commission_debt || owner.commission_debt <= 0}
                        className="px-4 py-2 rounded-full font-bold text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-primary/10 disabled:hover:text-primary"
                      >
                        Đã thanh toán
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
          <div className="text-sm text-on-surface-variant font-medium">
            Đang hiển thị {Math.min((page - 1) * 10 + 1, total)} đến {Math.min(page * 10, total)} của {total} đối tác
          </div>
          <div className="flex gap-2">
            <button 
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center px-4 font-bold text-primary">Trang {page}</div>
            <button 
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50" 
              disabled={page * 10 >= total}
              onClick={() => setPage(p => p + 1)}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
