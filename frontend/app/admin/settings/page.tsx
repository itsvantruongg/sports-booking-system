"use client";
import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <div className="p-8 lg:p-12 xl:p-16">
{/* Header */}
<header className="mb-12 flex justify-between items-end">
<div>
<h1 className="text-4xl md:text-5xl font-display font-extrabold text-on-surface tracking-tight mb-2">Cài đặt Hệ thống</h1>
<p className="text-lg text-on-surface-variant font-body">Manage platform taxonomy and visual identifiers.</p>
</div>
<div className="hidden md:flex gap-4">
<button className="bg-surface-container-low text-on-surface hover:bg-surface-container-high px-6 py-3 rounded-full font-bold transition-colors flex items-center gap-2">
<span className="material-symbols-outlined">undo</span>
                    Discard Changes
                </button>
<button className="bg-primary text-on-primary hover:bg-primary-container px-8 py-3 rounded-full font-bold transition-all bg-gradient-to-br hover:from-primary hover:to-primary-container shadow-lg flex items-center gap-2">
<span className="material-symbols-outlined">save</span>
                    Save Hierarchy
                </button>
</div>
</header>
{/* Asymmetrical Layout: Main Content (Left 2/3) + Sidebar (Right 1/3) */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
{/* Left Column: Sport Categories List */}
<div className="xl:col-span-2 space-y-8">
{/* Section Title */}
<div className="flex items-center justify-between">
<h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight flex items-center gap-3">
<span className="w-3 h-8 bg-primary rounded-full block"></span>
                        Sport Categories
                    </h2>
<span className="text-sm font-medium text-on-surface-variant bg-surface-container-low px-4 py-1.5 rounded-full">Drag to reorder</span>
</div>
{/* Draggable List (Bento-style rows) */}
<div className="space-y-4">
{/* Item 1: Tennis */}
<div className="bg-surface-container-lowest rounded-xl p-6 flex items-center gap-6 shadow-[0_4px_20px_rgba(25,27,37,0.02)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-all duration-300 group relative overflow-hidden border border-transparent hover:border-outline-variant/15">
{/* Drag Handle */}
<div className="text-outline-variant group-hover:text-primary cursor-grab transition-colors">
<span className="material-symbols-outlined text-3xl">drag_indicator</span>
</div>
{/* Icon & Info */}
<div className="flex-1 flex items-center gap-6">
<div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
</div>
<div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-1">Tennis</h3>
<div className="flex items-center gap-3 text-sm text-on-surface-variant font-medium">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span> 42 Active Venues</span>
<span>•</span>
<span>ID: cat_tennis</span>
</div>
</div>
</div>
{/* Actions */}
<div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="w-10 h-10 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-sm">edit</span>
</button>
<button className="w-10 h-10 rounded-full bg-error-container/50 text-error hover:bg-error-container flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-sm">delete</span>
</button>
</div>
</div>
{/* Item 2: Basketball */}
<div className="bg-surface-container-lowest rounded-xl p-6 flex items-center gap-6 shadow-[0_4px_20px_rgba(25,27,37,0.02)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-all duration-300 group relative overflow-hidden border border-transparent hover:border-outline-variant/15">
<div className="text-outline-variant group-hover:text-primary cursor-grab transition-colors">
<span className="material-symbols-outlined text-3xl">drag_indicator</span>
</div>
<div className="flex-1 flex items-center gap-6">
<div className="w-16 h-16 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_basketball</span>
</div>
<div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-1">Basketball</h3>
<div className="flex items-center gap-3 text-sm text-on-surface-variant font-medium">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span> 18 Active Venues</span>
<span>•</span>
<span>ID: cat_hoops</span>
</div>
</div>
</div>
<div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="w-10 h-10 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-sm">edit</span>
</button>
<button className="w-10 h-10 rounded-full bg-error-container/50 text-error hover:bg-error-container flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-sm">delete</span>
</button>
</div>
</div>
{/* Item 3: Soccer */}
<div className="bg-surface-container-lowest rounded-xl p-6 flex items-center gap-6 shadow-[0_4px_20px_rgba(25,27,37,0.02)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-all duration-300 group relative overflow-hidden border border-transparent hover:border-outline-variant/15">
<div className="text-outline-variant group-hover:text-primary cursor-grab transition-colors">
<span className="material-symbols-outlined text-3xl">drag_indicator</span>
</div>
<div className="flex-1 flex items-center gap-6">
<div className="w-16 h-16 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
</div>
<div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-1">Soccer</h3>
<div className="flex items-center gap-3 text-sm text-on-surface-variant font-medium">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span> 24 Active Venues</span>
<span>•</span>
<span>ID: cat_soccer</span>
</div>
</div>
</div>
<div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="w-10 h-10 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-sm">edit</span>
</button>
<button className="w-10 h-10 rounded-full bg-error-container/50 text-error hover:bg-error-container flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-sm">delete</span>
</button>
</div>
</div>
</div>
</div>
{/* Right Column: Add Form Sidebar (Floating Panel) */}
<div className="xl:col-span-1">
<div className="bg-surface-container-low rounded-[2rem] p-8 sticky top-8">
<h3 className="text-2xl font-headline font-bold text-on-surface mb-6">Add New Category</h3>
<form className="space-y-6">
{/* Input: Name */}
<div>
<label className="block text-sm font-semibold text-on-surface mb-2">Category Name</label>
<input className="w-full bg-surface-container-lowest border-0 rounded-[1.5rem] px-5 py-4 text-on-surface font-medium shadow-sm focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all placeholder:text-outline-variant" placeholder="e.g. Pickleball" type="text" />
</div>
{/* Input: Icon Identifier */}
<div>
<label className="block text-sm font-semibold text-on-surface mb-2">Material Icon ID</label>
<div className="relative">
<span className="absolute left-5 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined">search</span>
<input className="w-full bg-surface-container-lowest border-0 rounded-[1.5rem] pl-12 pr-5 py-4 text-on-surface font-medium shadow-sm focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all placeholder:text-outline-variant font-mono text-sm" placeholder="sports_gymnastics" type="text" />
</div>
<p className="text-xs text-on-surface-variant mt-2 ml-2">Must match a valid Google Material Symbol name.</p>
</div>
{/* Status Toggle (Custom) */}
<div>
<label className="block text-sm font-semibold text-on-surface mb-3">Initial Status</label>
<div className="flex items-center gap-4 bg-surface-container-lowest p-2 rounded-[1.5rem]">
<button className="flex-1 py-3 px-4 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-sm transition-colors text-center" type="button">Active</button>
<button className="flex-1 py-3 px-4 rounded-xl hover:bg-surface-container-high text-on-surface-variant font-medium text-sm transition-colors text-center" type="button">Draft</button>
</div>
</div>
{/* Submit CTA */}
<div className="pt-4">
<button className="w-full bg-primary text-on-primary hover:bg-primary-container py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl bg-gradient-to-br from-primary to-primary-container active:scale-[0.98]" type="button">
                                Create Category
                            </button>
</div>
</form>
</div>
</div>
</div>
    </div>
  );
}
