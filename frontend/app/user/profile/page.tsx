"use client";
import Link from "next/link";

export default function UserProfilePage() {
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
<div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-surface-container-low shadow-sm">
<img alt="Profile Picture" className="w-full h-full object-cover" data-alt="close up portrait of a confident young professional woman in athletic wear outdoors with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB42cLPzIxYnD053jAIeuGzp9Sc4v2RU206f9asY1MY_2HACJtKOyxWNBlYrmOnd0AE2y6dZlY2xDHAlxmTK9C6sFE9jtXp_TTdz529WBcmFkrvIliOaJAjHuaz2kcxogz4ByIof6-ODFvOQWkBBC5juZe6s2v3wluvAKQ4fmiTtivW8VQD8LiP210Fi-8-p-WRSZMRfx81Ighu5tg03FhgMbNGJDd53gzwNV3vaVoJsVjxqmwwBebB0_W-Gh0NJKsmEmho4fW2LL4" />
</div>
<h2 className="text-2xl font-bold font-display text-on-surface mb-1">Alex Morgan</h2>
<div className="flex items-center gap-2 mb-6">
<span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold font-body flex items-center gap-1">
<span className="material-symbols-outlined text-sm" data-icon="verified">verified</span>
                                Pro Member
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
<Link className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors group/link mt-2" href="/">
<span className="font-body font-medium text-red-600 group-hover/link:text-red-700 transition-colors">Sign Out</span>
<span className="material-symbols-outlined text-red-500 group-hover/link:text-red-700 transition-colors">logout</span>
</Link>
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
<form className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="firstName">First Name</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="firstName" type="text" defaultValue="Alex" />
</div>
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="lastName">Last Name</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="lastName" type="text" defaultValue="Morgan" />
</div>
</div>
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="email">Email Address</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="email" type="email" defaultValue="alex.morgan@example.com" />
</div>
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="phone">Phone Number</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
</div>
<div className="pt-4 flex justify-end">
<button className="px-8 py-3 rounded-full signature-gradient text-on-primary font-body font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" type="button">
                                Save Changes
                            </button>
</div>
</form>
</div>
{/* Security Form */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
<h3 className="text-xl font-bold font-display text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary" data-icon="lock">lock</span>
                        Security
                    </h3>
<form className="space-y-6">
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="currentPassword">Current Password</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="currentPassword" type="password" />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="newPassword">New Password</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="newPassword" type="password" />
</div>
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant font-body" htmlFor="confirmPassword">Confirm New Password</label>
<input className="w-full rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all text-on-surface font-body p-4" id="confirmPassword" type="password" />
</div>
</div>
<div className="pt-4 flex justify-end">
<button className="px-8 py-3 rounded-full bg-surface-container-high text-on-surface font-body font-semibold hover:bg-surface-container-highest transition-colors duration-300" type="button">
                                Update Password
                            </button>
</div>
</form>
</div>
</div>
</div>
</main>
    </>
  );
}
