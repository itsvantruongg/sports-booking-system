"use client";
import Link from "next/link";

export default function AdminUsersPage() {
  return (
    <div className="p-6 md:p-12 max-w-[1600px] mx-auto">
{/* Header Section */}
<header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h1 className="text-4xl md:text-5xl font-display font-extrabold text-on-surface tracking-tight mb-2">User Management</h1>
<p className="text-on-surface-variant text-lg">Oversee platform athletes, tier status, and access control.</p>
</div>
{/* Search & Filter */}
<div className="flex items-center gap-3 bg-surface-container-low rounded-full p-2 pl-6 shadow-sm border border-transparent focus-within:border-outline-variant/30 focus-within:bg-surface-bright transition-all">
<span className="material-symbols-outlined text-on-surface-variant">search</span>
<input className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 w-64 md:w-80 font-body" placeholder="Search athletes by name or email..." type="text" />
<button className="bg-surface-container-highest p-3 rounded-full hover:bg-primary hover:text-on-primary transition-colors text-on-surface">
<span className="material-symbols-outlined">tune</span>
</button>
</div>
</header>
{/* Metric Bento Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
{/* Total Users Card */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative overflow-hidden group">
<div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
<div className="flex justify-between items-start mb-6 relative z-10">
<div className="bg-surface-container p-3 rounded-lg text-primary">
<span className="material-symbols-outlined text-3xl">groups</span>
</div>
<span className="bg-surface-container-high text-on-surface text-sm font-semibold px-3 py-1 rounded-full">+12% this month</span>
</div>
<div className="relative z-10">
<h3 className="text-on-surface-variant font-medium mb-1">Total Registered Athletes</h3>
<div className="text-4xl font-display font-bold text-on-surface">24,592</div>
</div>
</div>
{/* Active Users Card */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative overflow-hidden group">
<div className="absolute -right-6 -top-6 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-all"></div>
<div className="flex justify-between items-start mb-6 relative z-10">
<div className="bg-surface-container p-3 rounded-lg text-secondary">
<span className="material-symbols-outlined text-3xl">directions_run</span>
</div>
<span className="bg-surface-container-high text-on-surface text-sm font-semibold px-3 py-1 rounded-full">Weekly Active</span>
</div>
<div className="relative z-10">
<h3 className="text-on-surface-variant font-medium mb-1">Active Athletes</h3>
<div className="text-4xl font-display font-bold text-on-surface">18,204</div>
</div>
</div>
{/* Banned Users Card */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,27,37,0.04)] relative overflow-hidden group">
<div className="absolute -right-6 -top-6 w-32 h-32 bg-error/5 rounded-full blur-2xl group-hover:bg-error/10 transition-all"></div>
<div className="flex justify-between items-start mb-6 relative z-10">
<div className="bg-error-container p-3 rounded-lg text-error">
<span className="material-symbols-outlined text-3xl">block</span>
</div>
</div>
<div className="relative z-10">
<h3 className="text-on-surface-variant font-medium mb-1">Restricted Accounts</h3>
<div className="text-4xl font-display font-bold text-on-surface">142</div>
</div>
</div>
</div>
{/* User Table Section */}
<div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_60px_rgba(25,27,37,0.06)] overflow-hidden">
{/* Table Controls */}
<div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
<h2 className="text-2xl font-display font-bold text-on-surface">Athlete Directory</h2>
<div className="flex gap-2">
<button className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-secondary-fixed transition-colors">
<span className="material-symbols-outlined text-sm">filter_list</span>
                        All Status
                    </button>
<button className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-sm">download</span>
                        Export
                    </button>
</div>
</div>
{/* Table */}
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant text-sm font-semibold uppercase tracking-wider">
<th className="p-6 font-body">Athlete</th>
<th className="p-6 font-body">Contact</th>
<th className="p-6 font-body">Joined Date</th>
<th className="p-6 font-body">Status</th>
<th className="p-6 font-body text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-low">
{/* Row 1 (Pro Tier, Active) */}
<tr className="hover:bg-surface-bright transition-colors group">
<td className="p-6">
<div className="flex items-center gap-4">
<div className="relative">
<img alt="Sarah Jenkins" className="w-12 h-12 rounded-full object-cover shadow-sm" data-alt="portrait of an athletic young woman in athletic wear outdoors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI9Cdn6vUOm-QQdf1mSNR75xdeKT1IDP1ii7L5HKMzNNaNGFYLAvWtlc5qF7NFmCr1VFlixVjVnEBRbq84Lbmyo-fLPJXKN7ySK6kcW7bKCSlSJGSlYBzcqVCVTn5x935m53jhM0fVVHSvxmbbqIm8y_eLt44Ts64ZIimHuhH-T8jI8zGh_UqzjJrxHnhIPZKg_L-UosVATYYvKIvCqk_acEwdmHt-pIBKugIR1S0m4-TwtwBt0Vx9mmc5JiYAFmMfhnDUP-6FyaQ" />
<div className="absolute -bottom-1 -right-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-1.5 py-0.5 rounded border-2 border-surface-container-lowest">PRO</div>
</div>
<div>
<div className="font-bold text-on-surface text-lg">Sarah Jenkins</div>
<div className="text-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">sports_tennis</span> Tennis Enthusiast
                                        </div>
</div>
</div>
</td>
<td className="p-6">
<div className="text-on-surface font-medium">sarah.j@example.com</div>
<div className="text-on-surface-variant text-sm">+1 (555) 123-4567</div>
</td>
<td className="p-6 text-on-surface font-medium">Oct 12, 2023</td>
<td className="p-6">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-bold">
<span className="w-2 h-2 rounded-full bg-secondary"></span> Active
                                </span>
</td>
<td className="p-6 text-right">
<button className="text-on-surface-variant hover:text-error p-2 rounded-full hover:bg-error/10 transition-colors" title="Ban User">
<span className="material-symbols-outlined">block</span>
</button>
<button className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-primary/10 transition-colors ml-2" title="More Options">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Row 2 (Standard, Active) */}
<tr className="hover:bg-surface-bright transition-colors group">
<td className="p-6">
<div className="flex items-center gap-4">
<div className="relative">
<img alt="Marcus Chen" className="w-12 h-12 rounded-full object-cover shadow-sm" data-alt="portrait of a confident young man in sportswear looking directly at camera" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwZCVV-9Bv-KvC2amB-bdP7CLaoU--eyWP3JY4na4EOKrG3DnBFk-wgubs-j_R5WOYX0b9Aq1VGBa-FwSA3TE7h_5dyoU73dkGWCdR74_DhrWgJAjf9j3k3V89OWTYqD2Ho-eXPQN3EQ--yZv4uV-36eOInDUeDl0MUSFU9XXWbiZ2muB2lQcQIR-OOkwS_RSFrVFgIBd1vgQJuG3fW9K_O3gWDNMxsJDFqq1ZwRMYxvTqCw4NV5MYHNuWNIMHf0biepafQ-PdPF8" />
</div>
<div>
<div className="font-bold text-on-surface text-lg">Marcus Chen</div>
<div className="text-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">sports_basketball</span> Basketball
                                        </div>
</div>
</div>
</td>
<td className="p-6">
<div className="text-on-surface font-medium">m.chen88@example.com</div>
<div className="text-on-surface-variant text-sm">+1 (555) 987-6543</div>
</td>
<td className="p-6 text-on-surface font-medium">Jan 05, 2024</td>
<td className="p-6">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-bold">
<span className="w-2 h-2 rounded-full bg-secondary"></span> Active
                                </span>
</td>
<td className="p-6 text-right">
<button className="text-on-surface-variant hover:text-error p-2 rounded-full hover:bg-error/10 transition-colors" title="Ban User">
<span className="material-symbols-outlined">block</span>
</button>
<button className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-primary/10 transition-colors ml-2" title="More Options">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Row 3 (Banned) */}
<tr className="hover:bg-surface-bright transition-colors group bg-surface-container-low/30">
<td className="p-6 opacity-70 group-hover:opacity-100 transition-opacity">
<div className="flex items-center gap-4">
<div className="relative">
<img alt="David Miller" className="w-12 h-12 rounded-full object-cover shadow-sm grayscale" data-alt="portrait of a man with short hair looking away" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6jbprGBeUYHlH1zkT5MzfpaZkLW2gOhalqf01Hah9ilGojik3fbPky9gYDOpvuCZSPvRwGhTumecYUCF-v-60FoEqoW2ScyiTbBypzJa4K2oPYXTumK2X8RT0WRPe3EQL2330GoRBI1nvFwXRtQDBQeJc6u8IDPeWi_lMozMNmG1J_y4lWafx27KkNwPyzeP8G0dcgzcYqFE-SazPafqysGcKe_CD974qksKFTBnP4Mrekwmsf-eV5PF7FbO7vq8bh0HSSHx-nxU" />
</div>
<div>
<div className="font-bold text-on-surface text-lg">David Miller</div>
<div className="text-sm text-on-surface-variant">Multiple={true} No-Shows</div>
</div>
</div>
</td>
<td className="p-6 opacity-70 group-hover:opacity-100 transition-opacity">
<div className="text-on-surface font-medium">davidm.banned@example.com</div>
<div className="text-on-surface-variant text-sm">--</div>
</td>
<td className="p-6 text-on-surface font-medium opacity-70 group-hover:opacity-100 transition-opacity">Nov 22, 2023</td>
<td className="p-6">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-error-container text-error rounded-full text-sm font-bold">
<span className="material-symbols-outlined text-[16px]">cancel</span> Banned
                                </span>
</td>
<td className="p-6 text-right">
<button className="text-primary hover:text-primary-container font-bold text-sm px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                                    Unban User
                                </button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination */}
<div className="p-6 border-t border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
<div className="text-sm text-on-surface-variant font-medium">Showing 1 to 3 of 24,592 entries</div>
<div className="flex gap-2">
<button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled={true}:opacity-50" disabled={true}>
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">1</button>
<button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors font-bold">2</button>
<button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors font-bold">3</button>
<span className="w-10 h-10 flex items-center justify-center text-on-surface-variant">...</span>
<button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
    </div>
  );
}
