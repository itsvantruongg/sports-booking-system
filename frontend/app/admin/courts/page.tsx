"use client";

import React from "react";

export default function AdminCourtsPage() {
  return (
    <div className="p-6 md:p-12 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#191b25] tracking-tight mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Global Court Management
          </h2>
          <p className="text-lg text-[#434656]">Manage global facility availability and visibility settings.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#434656]">search</span>
            <input 
              className="pl-12 pr-4 py-3 rounded-full bg-[#f3f2ff] border-0 focus:ring-2 focus:ring-[#003ec7] focus:bg-white transition-colors w-64 md:w-80 outline-none" 
              placeholder="Search facilities..." 
              type="text"
            />
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="mb-10 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-semibold text-[#434656] uppercase tracking-wider mr-2">Filter by Sport:</span>
        <button className="px-6 py-2 rounded-full bg-[#5cfd80] text-[#00732c] font-bold shadow-sm transition-all">All Sports</button>
        <button className="px-6 py-2 rounded-full bg-[#e7e7f5] text-[#434656] font-bold hover:bg-[#e1e1ef] transition-all">Tennis</button>
        <button className="px-6 py-2 rounded-full bg-[#e7e7f5] text-[#434656] font-bold hover:bg-[#e1e1ef] transition-all">Padel</button>
        <button className="px-6 py-2 rounded-full bg-[#e7e7f5] text-[#434656] font-bold hover:bg-[#e1e1ef] transition-all">Pickleball</button>
        <button className="px-6 py-2 rounded-full bg-[#e7e7f5] text-[#434656] font-bold hover:bg-[#e1e1ef] transition-all">Squash</button>
      </section>

      {/* Court Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[
          { 
            name: "Downtown Center Court 1", 
            location: "Urban Athletics Complex, NY", 
            owner: "Metro Sports Group", 
            sport: "Tennis", 
            icon: "sports_tennis", 
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBO3D2CdhXjBRagu9Q-4WgBnHqpw6jF-5SX3CB-4-lukYLZ5_-FlG7VsQ9jP7CFaaoqBxYfWjYWnFn_2bT3udNFeJAzF41XPq0lDnQTVd02C3fhSbAahAh_QmHl70vQwj4aMGJipPNbeCqkTnSIqfxKJwIMvLwpfh-MKvJRNrWuJdJyddBdVMOjWbEDwEZgGwgSeJCB4XicphsDFf09t1c_Jj08jN4IaXwG_qol5cuAATqWLs8e1PkhSYmBZ20rJjczAWoruYQr9hY",
            isPublic: true
          },
          { 
            name: "Glass Arena Alpha", 
            location: "The Padel Hub, Miami", 
            owner: "Racket Ventures", 
            sport: "Padel", 
            icon: "sports_tennis", 
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-xGK8ibdxBIR5VsX4pLWMu8wAA0oX5IxJU8TtmmhfHv2A3rPafNnT3AlKqpht9j7ODTOx8_8uc46BSbW-JmtbL4J9hWnghOvXogJywXoySCZ83Gb2qzrwzTdDKPxV5WAQ43dXyUK0exe3szI88-DYhyIQP_yu1OfOd68HKY1p_TWk86JUzlOZYmS3DMT15pdgDz7_J-ZBa2MoPRqEE0LICotG8whT6MR_i6rhJbfVLn4oSB09KfpWw1EkH2xqCGv6pSFIWOIlCLs",
            isPublic: false
          },
          { 
            name: "Heritage Clay Court A", 
            location: "Westside Country Club, LA", 
            owner: "Westside Trust", 
            sport: "Tennis", 
            icon: "sports_tennis", 
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-ZFD3IVE4mbpVwCk7-hZxUhcQZTavwFmauY4IVKiLw7PL2howYqbW8LwHI5f1kPFDc3oEVM1zAI5SnLXJ0J_2rKef42JrYtk-JZCr4Cax6pSPoVjITa0jn8wtHfgQqx3PlfyYQoHBdh9aqh_zkjF-jYH2kMlxXGg90dzO3mG-QYaRCmv3MMibAqKc6i69tOEPVm3SRf495aYm8g43OGiGKUhtCU93Au9tGSe9jgSkcFhFydM1x9nizqomuAMJnWBEIMnLDHD6ZUU",
            isPublic: true
          }
        ].map((court, i) => (
          <article key={i} className="bg-[#f3f2ff] rounded-[2rem] p-3 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_60px_rgba(25,27,37,0.06)] group">
            <div className="relative h-48 w-full rounded-[1.5rem] overflow-hidden bg-[#e1e1ef]">
              <img alt={court.name} className="w-full h-full object-cover" src={court.img} />
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#003ec7] flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[16px]">{court.icon}</span> {court.sport}
              </div>
            </div>
            <div className="px-4 pb-4 flex flex-col flex-1">
              <h3 className="font-bold text-xl text-[#191b25] leading-tight mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {court.name}
              </h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#434656]">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span>{court.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#434656]">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span>Owner: {court.owner}</span>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#e1e1ef]">
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked={court.isPublic} className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-[#d9d9e7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006e2a]"></div>
                    <span className={`ms-3 text-sm font-semibold ${court.isPublic ? "text-[#006e2a]" : "text-[#434656]"}`}>
                      {court.isPublic ? "Public" : "Hidden"}
                    </span>
                  </label>
                </div>
                <button className="p-2 rounded-full hover:bg-[#e7e7f5] transition-colors text-[#003ec7]" title="Edit Facility Details">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
