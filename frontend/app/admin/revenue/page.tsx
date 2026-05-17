"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Owner {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  commission_debt: number;
  commission_paid?: number;
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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalPlatformFee: 0,
    uncollectedCommission: 0,
    monthlyBreakdown: [] as { monthLabel: string; revenue: number; fee: number }[],
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json);
      }
    } catch (err) {
      console.error("Lỗi khi fetch dashboard stats:", err);
    }
  };

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
    fetchDashboardStats();
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
        setOwners(prev => prev.map(o => o._id === ownerId ? {
          ...o,
          commission_paid: (o.commission_paid || 0) + o.commission_debt,
          commission_debt: 0
        } : o));
        fetchOwners();
        fetchDashboardStats(); // Refresh platform totals as well
      } else {
        const err = await res.json();
        setToast({ msg: err.message || "Không thể thanh toán công nợ", type: "error" });
      }
    } catch (error) {
      setToast({ msg: "Lỗi kết nối server", type: "error" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleSeedData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/admin/seed-commission", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setToast({ msg: "Đã tạo dữ liệu công nợ mẫu thành công!", type: "success" });
        fetchOwners();
        fetchDashboardStats();
      } else {
        const err = await res.json();
        setToast({ msg: err.message || "Lỗi tạo dữ liệu mẫu", type: "error" });
      }
    } catch (error) {
      setToast({ msg: "Lỗi kết nối server", type: "error" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleCleanData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/admin/clean-commission", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setToast({ msg: "Đã dọn dẹp dữ liệu mẫu thành công!", type: "success" });
        fetchOwners();
        fetchDashboardStats();
      } else {
        const err = await res.json();
        setToast({ msg: err.message || "Lỗi xóa dữ liệu mẫu", type: "error" });
      }
    } catch (error) {
      setToast({ msg: "Lỗi kết nối server", type: "error" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const totalDebt = owners.reduce((sum, owner) => sum + (owner.commission_debt || 0), 0);

  const chartData = stats.monthlyBreakdown && stats.monthlyBreakdown.length > 0
    ? stats.monthlyBreakdown
    : [
        { monthLabel: "Tháng 12", revenue: 0, fee: 0 },
        { monthLabel: "Tháng 1", revenue: 0, fee: 0 },
        { monthLabel: "Tháng 2", revenue: 0, fee: 0 },
        { monthLabel: "Tháng 3", revenue: 0, fee: 0 },
        { monthLabel: "Tháng 4", revenue: 0, fee: 0 },
        { monthLabel: "Tháng 5", revenue: 0, fee: 0 },
      ];

  const maxRevenue = Math.max(...chartData.map(d => d.revenue)) || 1;
  const maxFee = Math.max(...chartData.map(d => d.fee)) || 1;

  const formatYAxis = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return val.toString();
  };

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
        <form onSubmit={handleSearch} className="w-full md:w-auto flex items-center gap-3 bg-surface-container-low rounded-full p-2 pl-6 shadow-sm border border-transparent focus-within:border-outline-variant/30 focus-within:bg-surface-bright transition-all">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 flex-1 w-full md:w-80 font-body outline-none"
            placeholder="Tìm theo tên chủ sân hoặc email..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-surface-container-highest p-3 rounded-full hover:bg-primary hover:text-on-primary transition-colors text-on-surface shrink-0">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </form>
      </header>

      {/* Metric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_12px_40px_rgba(25,27,37,0.02)] border border-outline-variant/10 relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary">
              <span className="material-symbols-outlined text-3xl">payments</span>
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Phí nền tảng</span>
          </div>
          <h3 className="text-on-surface-variant font-bold text-sm uppercase tracking-wider mb-2">Doanh thu 5% hoa hồng</h3>
          <div className="text-3xl font-display font-black text-primary">{(stats.totalPlatformFee || 0).toLocaleString()} ₫</div>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Doanh thu phí thu trên tất cả các sân</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_12px_40px_rgba(25,27,37,0.02)] border border-outline-variant/10 relative overflow-hidden group hover:border-error/20 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-error/10 p-4 rounded-2xl text-error">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <span className="text-[10px] font-black text-error uppercase tracking-widest bg-error/10 px-3 py-1 rounded-full">Chờ thu hồi</span>
          </div>
          <h3 className="text-on-surface-variant font-bold text-sm uppercase tracking-wider mb-2">Tổng công nợ cần thu</h3>
          <div className="text-3xl font-display font-black text-error">{(stats.uncollectedCommission || 0).toLocaleString()} ₫</div>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Số dư nợ chưa thanh toán từ chủ sân</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_12px_40px_rgba(25,27,37,0.02)] border border-outline-variant/10 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-secondary/10 p-4 rounded-2xl text-secondary">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full">Đối tác</span>
          </div>
          <h3 className="text-on-surface-variant font-bold text-sm uppercase tracking-wider mb-2">Số lượng chủ sân</h3>
          <div className="text-3xl font-display font-black text-on-surface">{stats.totalOwners || total}</div>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Tổng số chủ sân đang quản lý</p>
        </div>
      </div>

      {/* Chart Visualization Section */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_40px_rgba(25,27,37,0.03)] border border-outline-variant/10 mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Biểu đồ doanh thu & tăng trưởng
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">Xu hướng phí dịch vụ và dòng tiền hoa hồng theo tháng</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></span>
              Doanh thu tổng
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              Phí nền tảng (5%)
            </div>
          </div>
        </div>

        {/* Custom Interactive Column Chart */}
        <div className="relative w-full h-64 sm:h-80 bg-surface-container-low/40 rounded-3xl p-4 sm:p-6 border border-outline-variant/10 flex items-stretch">
          {/* Left Y-axis (Total Revenue) */}
          <div className="flex flex-col justify-between text-[10px] font-black text-on-surface-variant opacity-75 pr-3 select-none text-right w-14 sm:w-16 pb-8 pt-4">
            <div>{formatYAxis(maxRevenue)} ₫</div>
            <div>{formatYAxis(maxRevenue * 0.75)} ₫</div>
            <div>{formatYAxis(maxRevenue * 0.5)} ₫</div>
            <div>{formatYAxis(maxRevenue * 0.25)} ₫</div>
            <div>0 ₫</div>
          </div>

          {/* Chart area with grid lines */}
          <div className="flex-1 h-full relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pt-4 pointer-events-none">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="w-full border-t border-outline-variant/10 animate-pulse"></div >
              ))}
            </div>

            {/* Bars */}
            <div className="relative w-full h-full flex items-end justify-between gap-2 sm:gap-6 pt-4 px-2">
              {chartData.map((data, index) => {
                const revenueHeight = data.revenue > 0 ? Math.max(5, (data.revenue / maxRevenue) * 100) : 0;
                const feeHeight = data.fee > 0 ? Math.max(5, (data.fee / maxFee) * 100) : 0;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end h-full relative group/bar cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Tooltip Card */}
                    {hoveredIndex === index && (
                      <div className="absolute bottom-[105%] z-20 bg-surface-container-highest text-on-surface shadow-2xl p-4 rounded-2xl border border-outline-variant/20 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{data.monthLabel}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between gap-4">
                            <span className="text-on-surface-variant font-medium">Tổng đặt sân:</span>
                            <span className="font-bold">{data.revenue.toLocaleString()} ₫</span>
                          </div>
                          <div className="flex justify-between gap-4 border-t border-outline-variant/10 pt-1 mt-1">
                            <span className="text-primary font-bold">Phí sàn (5%):</span>
                            <span className="font-black text-primary">{data.fee.toLocaleString()} ₫</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dual Bar Chart Pillars */}
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full pb-8">
                      {/* Revenue Pillar */}
                      <div
                        style={{ height: `${revenueHeight}%` }}
                        className="w-3 sm:w-6 rounded-t-full bg-primary/20 border border-primary/30 transition-all duration-500 group-hover/bar:bg-primary/30"
                      ></div>
                      {/* Platform Fee Pillar */}
                      <div
                        style={{ height: `${feeHeight}%` }}
                        className="w-3 sm:w-6 rounded-t-full bg-gradient-to-t from-primary to-primary-container transition-all duration-500 group-hover/bar:scale-y-105 group-hover/bar:shadow-lg group-hover/bar:shadow-primary/20"
                      ></div>
                    </div>

                    {/* Month Label */}
                    <div className="absolute bottom-0 text-[10px] font-black uppercase text-on-surface-variant tracking-wider mt-2">
                      {data.monthLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Y-axis (Platform Fee) */}
          <div className="flex flex-col justify-between text-[10px] font-black text-primary opacity-90 pl-3 select-none text-left w-14 sm:w-16 pb-8 pt-4">
            <div>{formatYAxis(maxFee)} ₫</div>
            <div>{formatYAxis(maxFee * 0.75)} ₫</div>
            <div>{formatYAxis(maxFee * 0.5)} ₫</div>
            <div>{formatYAxis(maxFee * 0.25)} ₫</div>
            <div>0 ₫</div>
          </div>
        </div>
      </div>

      {/* Owners Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_60px_rgba(25,27,37,0.06)] overflow-hidden">
        <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-2xl font-display font-bold text-on-surface">Danh sách Công nợ</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSeedData}
              className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm shrink-0"
            >
              <span className="material-symbols-outlined text-sm">database</span> Tạo dữ liệu mẫu
            </button>
            <button
              onClick={handleCleanData}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-sm shrink-0"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span> Xóa dữ liệu mẫu
            </button>
            <button className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors shrink-0">
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
                <th className="p-6 font-body text-right">Số tiền đã nộp</th>
                <th className="p-6 font-body text-right">Công nợ (5% Phí nền tảng)</th>
                <th className="p-6 font-body text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p>Đang tải danh sách công nợ...</p>
                    </div>
                  </td>
                </tr>
              ) : owners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-on-surface-variant">Không tìm thấy chủ sân nào.</td>
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
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-500">
                        {(owner.commission_paid || 0).toLocaleString()} ₫
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="text-xl font-black text-error">
                        {(owner.commission_debt || 0).toLocaleString()} ₫
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
        <div className="p-6 border-t border-surface-container-low flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest">
          <div className="text-sm text-on-surface-variant font-medium text-center sm:text-left">
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
