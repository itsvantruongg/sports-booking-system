"use client";
import Link from "next/link";

export default function OwnerCustomersPage() {
  return (
    <div className="p-8 lg:p-12 xl:p-16 max-w-[1600px] w-full">
{/* Header Section */}
<header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight text-on-background mb-2">Customer Directory</h2>
<p className="text-on-surface-variant text-lg max-w-2xl">Manage and interact with your client base across all venues.</p>
</div>
<div className="flex items-center gap-4 shrink-0">
<button className="bg-surface-container-low text-primary hover:bg-surface-container transition-colors rounded-full py-3 px-6 flex items-center gap-2 font-medium">
<span className="material-symbols-outlined" data-icon="download">download</span>
                    Export CSV
                </button>
</div>
</header>
{/* Search & Filter Controls */}
<div className="bg-surface-container-lowest rounded-xl p-4 mb-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)] flex flex-col lg:flex-row gap-4 items-center">
{/* Search */}
<div className="relative flex-1 w-full group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" data-icon="search">search</span>
<input className="w-full bg-surface-container-low border-2 border-transparent focus:border-surface-variant/30 focus:bg-surface-bright focus:ring-0 rounded-lg py-3 pl-12 pr-4 text-on-background placeholder:text-outline transition-all" placeholder="Search by name, email, or phone..." type="text" />
</div>
{/* Filters */}
<div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
<button className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors">
                    High Frequency
                    <span className="material-symbols-outlined text-[16px]" data-icon="check">check</span>
</button>
<button className="bg-surface-container-low text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    Active
                </button>
<button className="bg-surface-container-low text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    Inactive
                </button>
<div className="w-px h-6 bg-outline-variant/30 mx-2 hidden lg:block"></div>
<button className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
</button>
</div>
</div>
{/* Data Table (Bento Style Rows) */}
<div className="space-y-4">
{/* Table Header (Visual Only) */}
<div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
<div className="col-span-4 lg:col-span-3">Customer</div>
<div className="col-span-4 lg:col-span-4">Contact Info</div>
<div className="col-span-2 text-center">Total Bookings</div>
<div className="col-span-2 text-right">Status</div>
</div>
{/* Row 1 */}
<div className="bg-surface-container-lowest rounded-lg p-4 md:p-6 shadow-[0_8px_30px_rgba(25,27,37,0.03)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-outline-variant/10">
<div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
{/* Customer Name & Avatar */}
<div className="col-span-4 lg:col-span-3 flex items-center gap-4 w-full">
<img alt="Profile portrait of a young woman with natural light" className="w-12 h-12 rounded-full object-cover shadow-sm" data-alt="Profile portrait of a young woman with natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAH834F5PId8HER6lAmkHUS9EA2lbjI5F4SwXIJWRaW8W-gVa-6jhQrkLnXARfmwK6uzG1dsDzldH3oQHEjj460VxBgMKOaBSMu9EUCIC3sqFdxYvXGhHbTJa3V_0DDiY20W9z9zbgT1GPNnbigspBhc99RCZcXKkhstxrjCryt1-Y2jqz3aA_QZU7WaPyg_3m3yv3fQia3s_Bq9vImIwIMy8AsxUsItauiirsR-VA5VwsY_KrKL2ZetxtKaxz7H80rYFKU3d6Qng" />
<div>
<h3 className="font-headline font-bold text-on-background group-hover:text-primary transition-colors">Elena Rodriguez</h3>
<p className="text-xs text-on-surface-variant">Joined Mar 2023</p>
</div>
</div>
{/* Contact Info */}
<div className="col-span-4 lg:col-span-4 flex flex-col justify-center w-full mt-2 md:mt-0">
<div className="flex items-center gap-2 text-sm text-on-background">
<span className="material-symbols-outlined text-[16px] text-outline" data-icon="mail">mail</span>
                            elena.r@example.com
                        </div>
<div className="flex items-center gap-2 text-sm text-on-surface-variant mt-1">
<span className="material-symbols-outlined text-[16px] text-outline" data-icon="phone">phone</span>
                            +1 (555) 019-2834
                        </div>
</div>
{/* Total Bookings */}
<div className="col-span-2 flex justify-center items-center w-full mt-4 md:mt-0">
<div className="flex flex-col items-center">
<span className="font-headline font-extrabold text-2xl text-primary">42</span>
<span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Bookings</span>
</div>
</div>
{/* Status */}
<div className="col-span-2 flex justify-end items-center w-full mt-4 md:mt-0">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            Active
                        </span>
<button className="ml-4 text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
</div>
</div>
{/* Row 2 */}
<div className="bg-surface-container-lowest rounded-lg p-4 md:p-6 shadow-[0_8px_30px_rgba(25,27,37,0.03)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-outline-variant/10">
<div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div className="col-span-4 lg:col-span-3 flex items-center gap-4 w-full">
<div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-headline font-bold text-lg">
                            MS
                        </div>
<div>
<h3 className="font-headline font-bold text-on-background group-hover:text-primary transition-colors">Marcus Smith</h3>
<p className="text-xs text-on-surface-variant">Joined Jan 2024</p>
</div>
</div>
<div className="col-span-4 lg:col-span-4 flex flex-col justify-center w-full mt-2 md:mt-0">
<div className="flex items-center gap-2 text-sm text-on-background">
<span className="material-symbols-outlined text-[16px] text-outline" data-icon="mail">mail</span>
                            m.smith88@example.com
                        </div>
<div className="flex items-center gap-2 text-sm text-on-surface-variant mt-1">
<span className="material-symbols-outlined text-[16px] text-outline" data-icon="phone">phone</span>
                            +1 (555) 923-1102
                        </div>
</div>
<div className="col-span-2 flex justify-center items-center w-full mt-4 md:mt-0">
<div className="flex flex-col items-center">
<span className="font-headline font-extrabold text-2xl text-on-background">14</span>
<span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Bookings</span>
</div>
</div>
<div className="col-span-2 flex justify-end items-center w-full mt-4 md:mt-0">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            Active
                        </span>
<button className="ml-4 text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
</div>
</div>
{/* Row 3 (Inactive) */}
<div className="bg-surface-container-lowest rounded-lg p-4 md:p-6 shadow-[0_8px_30px_rgba(25,27,37,0.03)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-outline-variant/10 opacity-75 hover:opacity-100">
<div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
<div className="col-span-4 lg:col-span-3 flex items-center gap-4 w-full">
<img alt="Portrait of a smiling man in a casual setting" className="w-12 h-12 rounded-full object-cover shadow-sm grayscale opacity-80 group-hover:grayscale-0 transition-all" data-alt="Portrait of a smiling man in a casual setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnmaQrN4FYif7oLXvl33Na8gZiZGxUixKEH84_VtZ-vAeRVpxqtMuqWoBAZUfuQ5U3YhTiCYaTeS78BXltbHFq5pg6KDwsbj59yx8r-WncbFxNyXdxmY5evFUlEjemYkHQv5wxJuCTFbYTCLXcGdUl1PZEudFscu6-sil9ds1b7L1LKirOpx1RwzhGBqaT1_FLq9480cHMNFqDoNb8DpYXJ0TWXL4_EXyHKZeVyt3XDk_q7R89ujnU5FCEintDdBgFO2HouPupAHs" />
<div>
<h3 className="font-headline font-bold text-on-background group-hover:text-primary transition-colors">David Chen</h3>
<p className="text-xs text-on-surface-variant">Joined Nov 2022</p>
</div>
</div>
<div className="col-span-4 lg:col-span-4 flex flex-col justify-center w-full mt-2 md:mt-0">
<div className="flex items-center gap-2 text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-outline" data-icon="mail">mail</span>
                            david.c@example.com
                        </div>
<div className="flex items-center gap-2 text-sm text-on-surface-variant mt-1">
<span className="material-symbols-outlined text-[16px] text-outline" data-icon="phone">phone</span>
                            +1 (555) 441-9008
                        </div>
</div>
<div className="col-span-2 flex justify-center items-center w-full mt-4 md:mt-0">
<div className="flex flex-col items-center text-on-surface-variant">
<span className="font-headline font-bold text-xl">3</span>
<span className="text-[10px] uppercase tracking-wider font-semibold">Bookings</span>
</div>
</div>
<div className="col-span-2 flex justify-end items-center w-full mt-4 md:mt-0">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                            Inactive
                        </span>
<button className="ml-4 text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
</div>
</div>
</div>
{/* Pagination */}
<div className="mt-8 flex justify-between items-center px-4">
<span className="text-sm text-on-surface-variant">Showing 1 to 3 of 156 customers</span>
<div className="flex gap-2">
<button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-lowest text-outline hover:bg-surface-container-low transition-colors shadow-sm">
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-on-primary shadow-sm">1</button>
<button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low transition-colors shadow-sm">2</button>
<button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low transition-colors shadow-sm">3</button>
<span className="w-10 h-10 flex items-center justify-center text-outline">...</span>
<button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-lowest text-outline hover:bg-surface-container-low transition-colors shadow-sm">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
    </div>
  );
}
