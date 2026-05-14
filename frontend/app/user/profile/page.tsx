"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const router = useRouter();
  
  // Profile State
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", role: "" });
  const [loading, setLoading] = useState(true);
  
  // Password State
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
          setProfile({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            role: data.role || "USER"
          });
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
          name: profile.name,
          phone: profile.phone
        })
      });
      if (res.ok) {
        alert("Cập nhật thông tin thành công!");
      } else {
        const data = await res.json();
        alert(data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      alert("Lỗi kết nối");
    }
  };

  const handleUpdatePassword = async () => {
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    router.push("/login");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[500px]">Đang tải...</div>;
  }

  return (
    <>
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12">
<div className="mb-12">
<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface font-display mb-2">Your Profile</h1>
<p className="text-lg text-on-surface-variant font-body">Manage your personal details and security preferences.</p>
</div>
<div className="flex flex-col lg:flex-row gap-12 items-start">
{/* Left Side: Profile Card (Asymmetric Layout Focus) */}
<div className="w-full lg:w-1/3 flex flex-col gap-8">
{/* User Identity Card */}
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
<a className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group/link" href="#">
<span className="font-body font-medium text-on-surface group-hover/link:text-primary transition-colors">Booking History</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover/link:text-primary transition-colors" data-icon="history">history</span>
</a>
<a className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group/link" href="#">
<span className="font-body font-medium text-on-surface group-hover/link:text-primary transition-colors">Payment Methods</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover/link:text-primary transition-colors" data-icon="credit_card">credit_card</span>
</a>
<a className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group/link" href="#">
<span className="font-body font-medium text-on-surface group-hover/link:text-primary transition-colors">Preferences</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover/link:text-primary transition-colors" data-icon="tune">tune</span>
</a>
<a className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors group/link mt-2 cursor-pointer" onClick={handleSignOut}>
<span className="font-body font-medium text-red-600 group-hover/link:text-red-700 transition-colors">Sign Out</span>
<span className="material-symbols-outlined text-red-500 group-hover/link:text-red-700 transition-colors">logout</span>
</a>
</div>
</div>
</div>
</div>
{/* Right Side: Forms Container */}
<div className="w-full lg:w-2/3 flex flex-col gap-8">
{/* Personal Details Form */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
<h3 className="text-xl font-bold font-display text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary" data-icon="person">person</span>
                        Personal Details
                    </h3>
<div className="space-y-6">
<div className="grid grid-cols-1 gap-6">
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="fullName">Full Name</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="fullName" type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
</div>
</div>
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="email">Email Address</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface-variant font-body p-4" id="email" type="email" value={profile.email} disabled />
</div>
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="phone">Phone Number</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="phone" type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} placeholder="+84 987 654 321" />
</div>
<div className="pt-4 flex justify-end">
<button onClick={handleUpdateProfile} className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-body font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" type="button">
                                Save Changes
                            </button>
</div>
</div>
</div>
{/* Security Form */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
<h3 className="text-xl font-bold font-display text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary" data-icon="lock">lock</span>
                        Security
                    </h3>
<div className="space-y-6">
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="currentPassword">Current Password</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="currentPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="newPassword">New Password</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
</div>
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="confirmPassword">Confirm New Password</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
</div>
</div>
<div className="pt-4 flex justify-end">
<button onClick={handleUpdatePassword} className="px-8 py-3 rounded-full bg-surface-container-high text-on-surface font-body font-semibold hover:bg-surface-container-highest transition-colors duration-300" type="button">
                                Update Password
                            </button>
</div>
</div>
</div>
</div>
</div>
</main>
    </>
  );
}
