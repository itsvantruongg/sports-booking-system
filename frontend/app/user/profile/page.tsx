"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function UserProfilePage() {
  const router = useRouter();

  // Profile State
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'vouchers'>('overview');
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit State
  const [editData, setEditData] = useState({ name: "", email: "", phone: "" });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Voucher Wallet State
  const [myVouchers, setMyVouchers] = useState<any[]>([]);
  const [claimCode, setClaimCode] = useState("");
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          const p = {
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            role: data.role || "USER"
          };
          setProfile(p);
          setEditData({ name: p.name, email: p.email, phone: p.phone });
        } else {
          localStorage.removeItem("access_token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (activeTab === 'vouchers') {
      fetchMyVouchers();
    }
  }, [activeTab]);

  const fetchMyVouchers = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:5000/api/users/vouchers/my", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyVouchers(data);
      }
    } catch (err) { console.error(err); }
  };

  const handleClaimVoucher = async () => {
    if (!claimCode) return;
    setClaiming(true);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:5000/api/users/vouchers/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ code: claimCode })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Lưu mã giảm giá thành công!");
        setClaimCode("");
        fetchMyVouchers();
      } else {
        alert(data.message || "Không thể lưu mã này");
      }
    } catch (err) { alert("Lỗi kết nối"); }
    finally { setClaiming(false); }
  };

  const handleCloseModal = () => {
    // Reset editData to current profile
    setEditData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone
    });
    // Reset password fields
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowEditModal(false);
  };

  const handleSaveAll = async () => {
    // 1. Validations for password fields
    if (newPassword || oldPassword || confirmPassword) {
      if (!oldPassword) {
        alert("Vui lòng nhập mật khẩu hiện tại!");
        return;
      }
      if (!newPassword) {
        alert("Vui lòng nhập mật khẩu mới!");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }
      if (newPassword.length < 6) {
        alert("Mật khẩu mới phải từ 6 ký tự trở lên!");
        return;
      }
    }

    const token = localStorage.getItem("access_token");
    let profileUpdated = false;
    let passwordUpdated = false;

    // Check if profile fields actually changed
    const isProfileChanged = editData.name !== profile.name || 
                             editData.email !== profile.email || 
                             editData.phone !== profile.phone;

    try {
      // 2. Perform Profile Update
      if (isProfileChanged) {
        const resProfile = await fetch("http://localhost:5000/api/users/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name: editData.name,
            phone: editData.phone,
            email: editData.email
          })
        });

        if (resProfile.ok) {
          setProfile({ ...profile, ...editData });
          profileUpdated = true;
        } else {
          const data = await resProfile.json();
          alert(data.message || "Cập nhật thông tin thất bại");
          return; // Stop if profile update fails
        }
      }

      // 3. Perform Password Change
      if (newPassword) {
        const resPassword = await fetch("http://localhost:5000/api/auth/force-change", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword
          })
        });

        if (resPassword.ok) {
          passwordUpdated = true;
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          const data = await resPassword.json();
          alert(data.message || "Đổi mật khẩu thất bại");
          return; // Stop execution
        }
      }

      // 4. Show unified alert and close
      if (profileUpdated && passwordUpdated) {
        alert("Cập nhật thông tin và đổi mật khẩu thành công!");
      } else if (profileUpdated) {
        alert("Cập nhật thông tin cá nhân thành công!");
      } else if (passwordUpdated) {
        alert("Đổi mật khẩu thành công!");
      } else {
        alert("Không có thay đổi nào được thực hiện.");
      }

      setShowEditModal(false);
    } catch (error) {
      alert("Lỗi kết nối máy chủ");
    }
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.clear();
    window.location.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex flex-col">
        <div className="flex-grow flex justify-center items-center h-full min-h-[500px]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface font-display mb-2">
            {activeTab === 'overview' ? 'Hồ sơ cá nhân' : 'Ví Voucher'}
          </h1>
          <p className="text-lg text-on-surface-variant font-body">
            {activeTab === 'overview' ? 'Quản lý thông tin cá nhân và tài khoản của bạn.' : 'Nhập mã để nhận ưu đãi và quản lý các voucher đã lưu.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Side: Profile Card */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <div className="bg-white rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-on-primary text-5xl font-bold mb-6 border-4 border-surface-container-low shadow-sm">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold font-display text-on-surface mb-1">{profile.name}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold font-body flex items-center gap-1 uppercase">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    {profile.role}
                  </span>
                </div>
                <div className="w-full pt-6 border-t border-surface-container-low flex flex-col gap-3">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors group/link ${activeTab === 'overview' ? 'bg-primary/5' : 'hover:bg-surface-container-low'}`}
                  >
                    <span className={`font-body font-medium ${activeTab === 'overview' ? 'text-primary' : 'text-on-surface group-hover/link:text-primary'}`}>Hồ sơ</span>
                    <span className={`material-symbols-outlined ${activeTab === 'overview' ? 'text-primary' : 'text-on-surface-variant group-hover/link:text-primary'}`}>person</span>
                  </button>

                  <Link className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group/link" href="/user/history">
                    <span className="font-body font-medium text-on-surface group-hover/link:text-primary transition-colors">Lịch sử đặt sân</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover/link:text-primary transition-colors">history</span>
                  </Link>

                  <button
                    onClick={() => setActiveTab('vouchers')}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors group/link ${activeTab === 'vouchers' ? 'bg-primary/5' : 'hover:bg-surface-container-low'}`}
                  >
                    <span className={`font-body font-medium ${activeTab === 'vouchers' ? 'text-primary' : 'text-on-surface group-hover/link:text-primary'}`}>Ví Voucher</span>
                    <span className={`material-symbols-outlined ${activeTab === 'vouchers' ? 'text-primary' : 'text-on-surface-variant group-hover/link:text-primary'}`}>sell</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditData({ name: profile.name, email: profile.email, phone: profile.phone });
                      setShowEditModal(true);
                    }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group/link"
                  >
                    <span className="font-body font-medium text-on-surface group-hover/link:text-primary transition-colors">Cài đặt hồ sơ</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover/link:text-primary transition-colors">tune</span>
                  </button>

                  <a className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors group/link mt-2 cursor-pointer" onClick={handleSignOut}>
                    <span className="font-body font-medium text-red-600 group-hover/link:text-red-700 transition-colors">Đăng xuất</span>
                    <span className="material-symbols-outlined text-red-500 group-hover/link:text-red-700 transition-colors">logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Content Area */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500">
            {activeTab === 'overview' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-surface-container-low">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Họ và tên</p>
                  <p className="text-xl font-bold text-on-surface">{profile.name}</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-surface-container-low">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email</p>
                  <p className="text-xl font-bold text-on-surface">{profile.email}</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-surface-container-low">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Số điện thoại</p>
                  <p className="text-xl font-bold text-on-surface">{profile.phone || 'Chưa cập nhật'}</p>
                </div>
                <div className="bg-primary/5 p-8 rounded-xl shadow-sm border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Vai trò tài khoản</p>
                  <p className="text-xl font-bold text-primary">{profile.role}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Claim Input */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10">
                  <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">add_circle</span>
                    Nhập mã Voucher mới
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="VD: GIAM50K, CHAOSAN..."
                      className="flex-1 bg-surface-container-low px-6 py-4 rounded-2xl border-none font-bold text-on-surface focus:ring-2 focus:ring-primary outline-none uppercase"
                      value={claimCode}
                      onChange={(e) => setClaimCode(e.target.value)}
                    />
                    <button
                      onClick={handleClaimVoucher}
                      disabled={claiming || !claimCode}
                      className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-black hover:shadow-lg disabled:opacity-50 transition-all"
                    >
                      {claiming ? "Đang lưu..." : "Lưu vào ví"}
                    </button>
                  </div>
                </div>

                {/* Voucher List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myVouchers.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl border-2 border-dashed border-outline-variant p-12 text-center">
                      <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">confirmation_number</span>
                      <h3 className="text-xl font-bold text-on-surface mb-2">Ví trống</h3>
                      <p className="text-on-surface-variant">Bạn chưa có voucher nào. Hãy nhập mã ở trên hoặc săn thêm nhé!</p>
                    </div>
                  ) : (
                    myVouchers.map((v) => (
                      <div key={v._id} className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex gap-4 items-center group hover:border-primary/30 transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-3xl">confirmation_number</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{v.code}</p>
                          <h4 className="font-black text-lg text-on-surface mb-1">
                            {v.discount_type === 'PERCENT' ? `Giảm ${v.discount_value}%` : `Giảm ${v.discount_value.toLocaleString()}₫`}
                          </h4>
                          <p className="text-xs text-on-surface-variant font-medium">Đơn tối thiểu: {v.min_booking_amount?.toLocaleString()}₫</p>
                        </div>
                        <div className="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward_ios</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 flex flex-col max-h-[85vh] sm:max-h-[80vh]">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-primary/5 shrink-0">
                <h3 className="text-xl font-black text-on-surface">Cài đặt tài khoản</h3>
                <button onClick={handleCloseModal} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Họ và tên</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                      type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Email</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                      type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Số điện thoại</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                      type="tel" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                  <p className="text-xs font-black text-primary uppercase tracking-widest">Bảo mật</p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Mật khẩu hiện tại</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Mật khẩu mới</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Xác nhận mật khẩu</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-surface-container-low flex gap-3 shrink-0 pb-8 sm:pb-6">
                <button onClick={handleCloseModal} className="flex-1 py-3 rounded-xl font-bold text-on-surface-variant">Hủy</button>
                <button
                  onClick={handleSaveAll}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
