"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "ACTIVE" | "BANNED";
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }

    try {
      let url = `http://localhost:5000/api/admin/users?page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (roleFilter) url += `&role=${roleFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
        setTotal(json.total || 0);
      }
    } catch (error) {
      console.error("Lỗi khi fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    const token = localStorage.getItem("access_token");
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setToast({ msg: `Đã cập nhật trạng thái user thành ${newStatus}`, type: "success" });
        fetchUsers();
      } else {
        setToast({ msg: "Lỗi khi cập nhật trạng thái", type: "error" });
      }
    } catch (error) {
      setToast({ msg: "Lỗi kết nối server", type: "error" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const bannedCount = users.filter(u => u.status === 'BANNED').length; // This is only for current page, ideally should come from backend

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
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-on-surface tracking-tight mb-2">User Management</h1>
          <p className="text-on-surface-variant text-lg">Quản lý người dùng, chủ sân và quyền truy cập hệ thống.</p>
        </div>
        
        {/* Search & Filter */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 bg-surface-container-low rounded-full p-2 pl-6 shadow-sm border border-transparent focus-within:border-outline-variant/30 focus-within:bg-surface-bright transition-all">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 w-64 md:w-80 font-body" 
            placeholder="Tìm theo tên hoặc email..." 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-surface-container-highest p-3 rounded-full hover:bg-primary hover:text-on-primary transition-colors text-on-surface">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </form>
      </header>

      {/* Metric Bento Grid (Simplified for real data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-surface-container p-3 rounded-lg text-primary">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
          </div>
          <h3 className="text-on-surface-variant font-medium mb-1">Total Users</h3>
          <div className="text-4xl font-display font-bold text-on-surface">{total}</div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-surface-container p-3 rounded-lg text-secondary">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <select 
              className="bg-surface-container-high text-on-surface text-xs font-semibold px-3 py-1 rounded-full border-none outline-none focus:ring-0"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Roles</option>
              <option value="USER">Athletes</option>
              <option value="OWNER">Partners</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
          <h3 className="text-on-surface-variant font-medium mb-1">Filtered Group</h3>
          <div className="text-4xl font-display font-bold text-on-surface">{loading ? "..." : users.length}</div>
          <p className="text-xs text-on-surface-variant mt-2">Showing results for current page</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative overflow-hidden group border-l-4 border-error/20">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-error-container p-3 rounded-lg text-error">
              <span className="material-symbols-outlined text-3xl">block</span>
            </div>
          </div>
          <h3 className="text-on-surface-variant font-medium mb-1">Restricted Accounts</h3>
          <div className="text-4xl font-display font-bold text-on-surface">Live Data</div>
          <p className="text-xs text-error font-medium mt-2">Check details in table below</p>
        </div>
      </div>

      {/* User Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_60px_rgba(25,27,37,0.06)] overflow-hidden">
        <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-2xl font-display font-bold text-on-surface">Athlete & Partner Directory</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-sm font-semibold uppercase tracking-wider">
                <th className="p-6 font-body">User Info</th>
                <th className="p-6 font-body">Role</th>
                <th className="p-6 font-body">Joined Date</th>
                <th className="p-6 font-body">Status</th>
                <th className="p-6 font-body text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p>Đang tải danh sách người dùng...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-on-surface-variant">Không tìm thấy người dùng nào.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-surface-bright transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary font-black text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface text-lg">{user.name}</div>
                          <div className="text-sm text-on-surface-variant">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 
                        user.role === 'OWNER' ? 'bg-secondary/10 text-secondary' : 
                        'bg-tertiary/10 text-tertiary'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6 text-on-surface font-medium">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-error-container text-error'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-600' : 'bg-error'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => toggleUserStatus(user._id, user.status)}
                        className={`p-2 rounded-full transition-colors ${user.status === 'ACTIVE' ? 'text-on-surface-variant hover:text-error hover:bg-error/10' : 'text-primary hover:bg-primary/10'}`} 
                        title={user.status === 'ACTIVE' ? "Ban User" : "Unban User"}
                      >
                        <span className="material-symbols-outlined">{user.status === 'ACTIVE' ? 'block' : 'undo'}</span>
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
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} entries
          </div>
          <div className="flex gap-2">
            <button 
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center px-4 font-bold text-primary">Page {page}</div>
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
