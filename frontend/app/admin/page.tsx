"use client";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-6 lg:p-12">
{/* Header Section */}
<header className="flex justify-between items-end mb-12">
<div>
<p className="text-on-surface-variant font-medium text-sm mb-1 uppercase tracking-wider">Super Admin Overview</p>
<h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-primary">Master Dashboard</h2>
</div>
<div className="hidden md:flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full">
<span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
<span className="font-medium text-sm text-on-surface">Platform Status: Healthy</span>
</div>
</header>
{/* Bento Grid Layout */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
{/* Macro Metrics (Top Row) */}
<div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Total Users */}
<div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden group">
<div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-primary">group</span>
</div>
<p className="text-on-surface-variant font-medium text-sm mb-2">Total Users</p>
<h3 className="text-4xl font-headline font-bold text-on-surface tracking-tight">142k</h3>
<div className="mt-4 flex items-center gap-2 text-secondary font-medium text-sm">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
<span>+12% this month</span>
</div>
</div>
{/* Total Partners */}
<div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden group">
<div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-primary">storefront</span>
</div>
<p className="text-on-surface-variant font-medium text-sm mb-2">Total Partners</p>
<h3 className="text-4xl font-headline font-bold text-on-surface tracking-tight">3,402</h3>
<div className="mt-4 flex items-center gap-2 text-secondary font-medium text-sm">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
<span>+45 new this week</span>
</div>
</div>
{/* Platform Bookings */}
<div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden group">
<div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-primary">book_online</span>
</div>
<p className="text-on-surface-variant font-medium text-sm mb-2">Platform Bookings</p>
<h3 className="text-4xl font-headline font-bold text-on-surface tracking-tight">89k</h3>
<div className="mt-4 flex items-center gap-2 text-secondary font-medium text-sm">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
<span>+8% vs last week</span>
</div>
</div>
</div>
{/* Revenue Overview (Large Chart Area) */}
<div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-lg relative overflow-hidden">
<div className="flex justify-between items-center mb-8">
<div>
<h3 className="text-xl font-headline font-bold text-on-surface">Revenue Overview</h3>
<p className="text-on-surface-variant text-sm mt-1">Monthly platform GMV across all regions</p>
</div>
<select className="bg-surface-container-low border-none rounded-full text-sm font-medium text-on-surface px-4 py-2 focus:ring-0 cursor-pointer">
<option>This Year</option>
<option>Last Year</option>
</select>
</div>
{/* Stylized Bar Chart Representation */}
<div className="h-64 flex items-end justify-between gap-2 mt-4">
<div className="w-full bg-surface-container rounded-t-md h-[40%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-surface-container rounded-t-md h-[55%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-surface-container rounded-t-md h-[45%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-surface-container rounded-t-md h-[70%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-surface-container rounded-t-md h-[65%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-primary/80 rounded-t-md h-[85%] relative group cursor-pointer hover:bg-primary transition-colors">
<div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$1.2M</div>
</div>
<div className="w-full bg-surface-container rounded-t-md h-[60%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-surface-container rounded-t-md h-[75%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-surface-container rounded-t-md h-[50%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-surface-container rounded-t-md h-[80%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-surface-container rounded-t-md h-[90%] relative group cursor-pointer hover:bg-primary-fixed transition-colors"></div>
<div className="w-full bg-primary rounded-t-md h-[100%] relative group cursor-pointer shadow-[0_0_20px_rgba(0,62,199,0.3)]">
<div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-100">$1.8M</div>
</div>
</div>
<div className="flex justify-between text-xs text-on-surface-variant font-medium mt-4 px-2 uppercase">
<span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
</div>
</div>
{/* New Partners Sidebar */}
<div className="lg:col-span-4 bg-surface-container-low p-8 rounded-lg lg:row-span-2 flex flex-col">
<div className="flex justify-between items-center mb-6">
<h3 className="text-xl font-headline font-bold text-on-surface">New Partners</h3>
<button className="text-primary hover:text-primary-container font-medium text-sm transition-colors">View All</button>
</div>
<div className="flex flex-col gap-4 flex-grow">
{/* Partner Item 1 */}
<div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-all cursor-pointer">
<div className="w-12 h-12 rounded-full bg-tertiary-container overflow-hidden shrink-0">
<img alt="Padel Court facility exterior" className="w-full h-full object-cover" data-alt="modern indoor sports facility exterior with glass walls and bright lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzVG-zN2ZFuAkwhpacezMnNh8RRZ7nGcW9NJv3QfALO5D9h11hj0SbGBDsPL8ipcgobtKbz7jaOxPFkunwZZbNh4EIj7yv1zhf2GJZaC9eUvTgKJXtbyrG0fP6Sf2gKYFi7MFOP1YwEwk3oAL_V6ERVGd3wDBw7mvegbV7cZVC_wqyI05qVQWWdBxbK4lSF3MYXnL-FAhyBeXh7QZzVacNJ1IMC0oD7lWY34UIbrCr7gWEwidk6_4tB3HJwzh_d_HET4QmJdcz4z8" />
</div>
<div className="flex-grow">
<h4 className="font-headline font-bold text-sm text-on-surface">Apex Padel Club</h4>
<p className="text-xs text-on-surface-variant">Miami, FL • 8 Courts</p>
</div>
<div className="text-xs font-medium text-secondary bg-secondary-container px-2 py-1 rounded-md">New</div>
</div>
{/* Partner Item 2 */}
<div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-all cursor-pointer">
<div className="w-12 h-12 rounded-full bg-primary-container overflow-hidden shrink-0">
<img alt="Tennis court surface" className="w-full h-full object-cover" data-alt="close up of blue tennis court surface with white line in bright sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSGyoh-H7tHNY6Ov6Bh87QMyUzFYe2-AeF-m5JIPBPbA7mTeMi2WFR_TiIVX65gfWaVP3XnFJB-yawmXHTFthgI8J__uqa66UYhyg5i9Cmh9JTSwpUq2lJgSWN21lLJQXg0pUz5nbLD4m2lcVkin7iKwXVlaLoasC7FSR5RZk_5ZX7p4L2V8y1R26GFOT5hcamlOJgfQ9L5MgJ8j9AU69vZu7XODHo5qk5dhveCeDKz7kk-6N2QvN76aldjT7i_06gK9kBSCrcha8" />
</div>
<div className="flex-grow">
<h4 className="font-headline font-bold text-sm text-on-surface">Racket &amp; Rhythm</h4>
<p className="text-xs text-on-surface-variant">Austin, TX • 12 Courts</p>
</div>
<div className="text-xs font-medium text-on-surface-variant">2d ago</div>
</div>
{/* Partner Item 3 */}
<div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-all cursor-pointer">
<div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary">sports_tennis</span>
</div>
<div className="flex-grow">
<h4 className="font-headline font-bold text-sm text-on-surface">Metro Pickleball</h4>
<p className="text-xs text-on-surface-variant">Chicago, IL • 6 Courts</p>
</div>
<div className="text-xs font-medium text-on-surface-variant">3d ago</div>
</div>
{/* Partner Item 4 */}
<div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-all cursor-pointer">
<div className="w-12 h-12 rounded-full bg-tertiary-container overflow-hidden shrink-0">
<img alt="Indoor sports venue" className="w-full h-full object-cover" data-alt="wide shot of empty indoor basketball court with wooden floor and bright overhead lights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt-xf4FWLsRzrU4rNja0IY_VtMMM_66VoxijDTxli7L1-TSOZbOIlgX-CM_712JTs24X4Ou3wsMDOu2isqWCnelfYHJe4WfJsXGsoKOoCPk_AmVIL51appCa2Ck84Bzwh9HtERfdbykmOSAJVXW1_jzdOnRFZMy1WD9PWoAzwlR78URU2qE9FHwg1dXDDs1X0DEmIrZKSA7vKRrb3ufci2VuBB5dnKBk3MJAQiB3vylgXnlCVp6EQZTZ4LSOGLltRDJ4DcwoopmCE" />
</div>
<div className="flex-grow">
<h4 className="font-headline font-bold text-sm text-on-surface">The Vault Athletics</h4>
<p className="text-xs text-on-surface-variant">Denver, CO • 4 Courts</p>
</div>
<div className="text-xs font-medium text-on-surface-variant">5d ago</div>
</div>
</div>
<button className="w-full mt-6 py-3 rounded-full border-2 border-outline-variant/30 text-primary font-headline font-semibold hover:bg-surface-container transition-colors text-sm">
                    Manage Applications
                </button>
</div>
</div>
    </div>
  );
}
