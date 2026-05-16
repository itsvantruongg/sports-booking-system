"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editData.name,
          phone: editData.phone,
          email: editData.email // Assuming backend allows email update or handles it
        })
      });
      if (res.ok) {
        setProfile({ ...profile, ...editData });
        alert("Cập nhật thông tin thành công!");
        if (!newPassword) setShowEditModal(false);
      } else {
        const data = await res.json();
        alert(data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      alert("Lỗi kết nối");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:5000/api/auth/force-change", {
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
      if (res.ok) {
        alert("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowEditModal(false);
      } else {
        const data = await res.json();
        alert(data.message || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      alert("Lỗi kết nối");
    }
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.clear();
    window.location.replace("/login");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[500px]">Đang tải...</div>;
  }

  return (
    <>
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface font-display mb-2">
            {activeTab === 'overview' ? 'Your Profile' : 'Offers & Vouchers'}
          </h1>
          <p className="text-lg text-on-surface-variant font-body">
            {activeTab === 'overview' ? 'Manage your personal details and view your account status.' : 'View available discounts and rewards for your next booking.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Side: Profile Card */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-on-primary text-5xl font-bold mb-6 border-4 border-surface-container-low shadow-sm">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold font-display text-on-surface mb-1">{profile.name}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold font-body flex items-center gap-1 uppercase">
                    <span className="material-symbols-outlined text-sm" data-icon="verified">verified</span>
                    {profile.role}
                  </span>
                </div>
                <div className="w-full pt-6 border-t border-surface-container-low flex flex-col gap-3">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors group/link ${activeTab === 'overview' ? 'bg-primary/5' : 'hover:bg-surface-container-low'}`}
                  >
                    <span className={`font-body font-medium ${activeTab === 'overview' ? 'text-primary' : 'text-on-surface group-hover/link:text-primary'}`}>Overview</span>
                    <span className={`material-symbols-outlined ${activeTab === 'overview' ? 'text-primary' : 'text-on-surface-variant group-hover/link:text-primary'}`} data-icon="person">person</span>
                  </button>

                  <Link className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group/link" href="/user/history">
                    <span className="font-body font-medium text-on-surface group-hover/link:text-primary transition-colors">Booking History</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover/link:text-primary transition-colors" data-icon="history">history</span>
                  </Link>

                  <button 
                    onClick={() => setActiveTab('vouchers')}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors group/link ${activeTab === 'vouchers' ? 'bg-primary/5' : 'hover:bg-surface-container-low'}`}
                  >
                    <span className={`font-body font-medium ${activeTab === 'vouchers' ? 'text-primary' : 'text-on-surface group-hover/link:text-primary'}`}>Offers & Vouchers</span>
                    <span className={`material-symbols-outlined ${activeTab === 'vouchers' ? 'text-primary' : 'text-on-surface-variant group-hover/link:text-primary'}`} data-icon="sell">sell</span>
                  </button>

                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group/link"
                  >
                    <span className="font-body font-medium text-on-surface group-hover/link:text-primary transition-colors">Preferences</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover/link:text-primary transition-colors" data-icon="tune">tune</span>
                  </button>

                  <a className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors group/link mt-2 cursor-pointer" onClick={handleSignOut}>
                    <span className="font-body font-medium text-red-600 group-hover/link:text-red-700 transition-colors">Sign Out</span>
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
                <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-surface-container-low">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Full Name</p>
                  <p className="text-xl font-bold text-on-surface">{profile.name}</p>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-surface-container-low">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</p>
                  <p className="text-xl font-bold text-on-surface">{profile.email}</p>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-surface-container-low">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Phone Number</p>
                  <p className="text-xl font-bold text-on-surface">{profile.phone || 'Not updated'}</p>
                </div>
                <div className="bg-primary/5 p-8 rounded-xl shadow-sm border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Account Role</p>
                  <p className="text-xl font-bold text-primary">{profile.role}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">confirmation_number</span>
                <h3 className="text-xl font-bold text-on-surface mb-2">Không có voucher khả dụng</h3>
                <p className="text-on-surface-variant">Hiện tại bạn chưa có mã giảm giá nào. Hãy quay lại sau nhé!</p>
              </div>
            )}
          </div>
        </div>

        {/* Preferences Modal (UI nhỏ) */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-primary/5">
                <h3 className="text-xl font-black font-display text-on-surface">Preferences</h3>
                <button onClick={() => setShowEditModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <p className="text-xs font-black text-primary uppercase tracking-widest">Personal Info</p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Full Name</label>
                    <input 
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold" 
                      type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Email</label>
                    <input 
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold" 
                      type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Phone</label>
                    <input 
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold" 
                      type="tel" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                  <p className="text-xs font-black text-primary uppercase tracking-widest">Security</p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Current Password</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">New Password</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Confirm Password</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 outline-none" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-surface-container-low/50 flex gap-3">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    await handleUpdateProfile();
                    if (newPassword) await handleUpdatePassword();
                  }}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
