"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerTimelinePage() {
  const router = useRouter();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<any[]>([]);
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Block-slot state
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [blockReason, setBlockReason] = useState("");
  const [showBlockPanel, setShowBlockPanel] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [unblockingSlotId, setUnblockingSlotId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTimeline = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    if (!date) return;

    setLoading(true);
    try {
      // Fetch Time Slots
      const slotsUrl = `http://localhost:5000/api/owner/time-slots?date=${date}`;
      console.log("Fetching timeline slots from:", slotsUrl);
      const slotsRes = await fetch(slotsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (slotsRes.ok) {
        const slotsData = await slotsRes.json();
        setSlots(Array.isArray(slotsData) ? slotsData : (slotsData.data ?? []));
      }

      // Fetch Courts
      const courtsUrl = `http://localhost:5000/api/owner/courts`;
      console.log("Fetching courts from:", courtsUrl);
      const courtsRes = await fetch(courtsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (courtsRes.ok) {
        const courtsData = await courtsRes.json();
        setCourts(Array.isArray(courtsData) ? courtsData : (courtsData.data ?? []));
      }
    } catch (err: any) {
      console.error("Timeline fetch error details:", {
        message: err.message,
        stack: err.stack,
        date,
        token: token ? "Present" : "Missing"
      });
      showToast(`Lỗi kết nối: ${err.message || "Không thể kết nối tới máy chủ"}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTimeline(); }, [date]);

  useEffect(() => {
    const handleGlobalClick = () => setUnblockingSlotId(null);
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const slotsByCourt = (courts || []).reduce((acc, court) => {
    if (!court?._id) return acc;
    acc[court._id] = (slots || []).filter(s => {
      if (!s || !s.court_id) return false;
      const cid = typeof s.court_id === 'object' ? s.court_id._id : s.court_id;
      return cid === court._id;
    });
    return acc;
  }, {} as Record<string, any[]>);

  const calculatePosition = (start_time: string, end_time: string) => {
    if (!start_time || !end_time) return { left: "0%", width: "0%" };
    const parseTime = (t: string) => {
      const parts = (t || "").split(':');
      if (parts.length < 2) return 0;
      const [h, m] = parts.map(Number);
      return (isNaN(h) ? 0 : h) + (isNaN(m) ? 0 : m) / 60;
    };
    const s = parseTime(start_time);
    const e = parseTime(end_time);
    const dayStart = 6, dayEnd = 24, totalHours = dayEnd - dayStart;
    const left = Math.max(0, ((s - dayStart) / totalHours) * 100);
    const width = Math.max(0, ((e - s) / totalHours) * 100);
    return { left: `${left}%`, width: `${width}%` };
  };

  const handlePrevDay = () => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d.toISOString().split('T')[0]); };
  const handleNextDay = () => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d.toISOString().split('T')[0]); };

  const toggleSlotSelect = (slotId: string, status: string) => {
    // Only allow selecting AVAILABLE slots
    if (status !== 'AVAILABLE') return;
    setSelectedSlots(prev =>
      prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
    );
  };

  const handleBlockSlots = async () => {
    if (selectedSlots.length === 0) return;
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setBlocking(true);
    try {
      const blockUrl = "http://localhost:5000/api/owner/time-slots/block";
      console.log("Posting to block slots:", blockUrl);
      const res = await fetch(blockUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ time_slot_ids: selectedSlots, block_reason: blockReason || "Bảo trì" }),
      });
      if (res.ok) {
        showToast(`✅ Đã khóa ${selectedSlots.length} slot thành công!`, "success");
        setSelectedSlots([]);
        setBlockReason("");
        setShowBlockPanel(false);
        await fetchTimeline();
      } else {
        const err = await res.json();
        showToast(err.message || "Khóa slot thất bại.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
    finally { setBlocking(false); }
  };

  const handleUnblockSlot = async (slotId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/owner/time-slots/unblock", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ time_slot_ids: [slotId] }),
      });
      if (res.ok) {
        showToast("✅ Đã mở khóa slot thành công!", "success");
        setUnblockingSlotId(null);
        await fetchTimeline();
      } else {
        const err = await res.json();
        showToast(err.message || "Mở khóa thất bại.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
  };

  return (
    <div className="flex-1 md:flex flex-col overflow-hidden p-6 md:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm transition-all ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {toast.msg}
        </div>
      )}

      {/* Block Panel */}
      {showBlockPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">lock</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-on-surface">Khóa {selectedSlots.length} slot</h3>
                <p className="text-sm text-on-surface-variant">Slot sẽ không còn cho phép đặt sân.</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Lý do khóa</label>
              <input
                type="text"
                value={blockReason}
                onChange={e => setBlockReason(e.target.value)}
                placeholder="Vd: Bảo trì sân, Sự kiện nội bộ..."
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-error transition"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowBlockPanel(false)}
                className="flex-1 py-3 rounded-full border border-outline-variant text-on-surface font-bold hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button onClick={handleBlockSlots} disabled={blocking}
                className="flex-1 py-3 rounded-full bg-error text-on-error font-bold hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {blocking ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[16px]">lock</span>}
                {blocking ? "Đang khóa..." : "Xác nhận khóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex-shrink-0 px-6 py-6 lg:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface z-10 shadow-sm relative rounded-xl mb-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-on-surface">Timeline Lịch Đặt Sân</h1>
          <p className="text-on-surface-variant font-body mt-1">
            {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Selection mode toggle */}
          <button
            onClick={() => setSelectedSlots([])}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${selectedSlots.length > 0 ? "bg-error/10 text-error border border-error/30" : "bg-surface-container-low text-on-surface-variant"}`}
          >
            <span className="material-symbols-outlined text-[16px]">{selectedSlots.length > 0 ? "deselect" : "touch_app"}</span>
            {selectedSlots.length > 0 ? `${selectedSlots.length} slot đã chọn` : "Chọn slot để khóa"}
          </button>
          {selectedSlots.length > 0 && (
            <button
              onClick={() => setShowBlockPanel(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-error text-on-error font-bold text-xs hover:shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span> Khóa {selectedSlots.length} slot
            </button>
          )}
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-surface-container-low border-none rounded-lg px-4 py-2 font-body text-sm text-on-surface shadow-sm focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-2">
            <button onClick={handlePrevDay} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button onClick={handleNextDay} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-2 mb-4 text-xs font-bold text-on-surface-variant">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-surface-container-low border border-outline-variant/30" /> Trống (click để chọn)</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary/20 border-l-4 border-primary" /> Đã đặt</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-error/20 border-l-4 border-error" /> Đã khóa</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-300 border-2 border-yellow-500" /> Đang chọn</div>
      </div>

      {/* Timeline Canvas */}
      <div className="flex-1 overflow-auto bg-surface-container-lowest rounded-xl relative scrollbar-hide p-6 lg:p-8 shadow-[0_12px_40px_rgba(25,27,37,0.06)] border border-surface-container-low border-t-0">
        {loading ? (
          <div className="flex justify-center items-center h-32 text-on-surface-variant">Đang tải lịch đặt sân...</div>
        ) : (
          <div className="min-w-[960px] lg:w-full bg-surface rounded-xl overflow-hidden flex flex-col">
            {/* Time Header */}
            <div className="flex border-b border-surface-variant bg-surface sticky top-0 z-20">
              <div className="w-44 flex-shrink-0 p-4 border-r border-surface-variant flex items-center justify-center bg-surface">
                <span className="text-sm font-label text-on-surface-variant font-medium">Sân / Giờ</span>
              </div>
              <div className="flex-1 flex">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="flex-1 min-w-[50px] p-2 text-center text-xs sm:text-sm font-label text-on-surface-variant border-r border-surface-variant">
                    {(i + 6).toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </div>

            {/* Courts */}
            <div className="relative">
              {/* Background Grid Overlay (Visible in gaps between rounded slots) */}
              <div className="absolute inset-0 flex ml-44 pointer-events-none z-0">
                {Array.from({ length: 18 * 2 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 min-w-[25px] border-r ${i % 2 === 1 ? 'border-surface-variant/40' : 'border-surface-variant/10 border-dashed'}`}
                  />
                ))}
              </div>

              {courts.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant">Chưa có dữ liệu sân.</div>
              ) : (
                courts.map(court => {
                  const courtSlots = slotsByCourt[court._id] ?? [];
                  // Build available 30-min slots for click-to-block
                  const availableSlots = courtSlots.filter((s: any) => s.status === 'AVAILABLE');

                  return (
                    <div key={court._id} className="flex border-b border-surface-variant/50 relative z-10 group bg-transparent">
                      <div className="w-44 flex-shrink-0 px-4 py-2 border-r border-surface-variant bg-surface flex flex-col justify-center relative z-20">
                        <span className="font-display font-semibold text-on-surface text-sm leading-tight" title={court.name}>{court.name}</span>
                        <span className="text-[10px] font-label text-on-surface-variant mt-0.5">{court.sport_type_id?.name || 'Sân thể thao'}</span>
                      </div>
                      <div className="flex-1 relative h-20 bg-transparent">
                        {/* Clickable available slots overlay */}
                        {availableSlots.map((slot: any) => {
                          const pos = calculatePosition(slot.start_time, slot.end_time);
                          const isSelected = selectedSlots.includes(slot._id);
                          return (
                            <div
                              key={`avail-${slot._id}`}
                              onClick={() => toggleSlotSelect(slot._id, slot.status)}
                              className={`absolute top-1.5 bottom-1.5 rounded-lg cursor-pointer border-2 transition-all z-10 ${isSelected
                                ? "bg-yellow-200 border-yellow-500 shadow-md scale-y-110"
                                : "border-transparent hover:bg-surface-container-low hover:border-outline-variant/50"
                                }`}
                              style={{ left: `calc(${pos.left} + 2px)`, width: `calc(${pos.width} - 4px)` }}
                              title={`${slot.start_time} - ${slot.end_time}: Trống${isSelected ? " (đang chọn)" : " - Click để chọn"}`}
                            />
                          );
                        })}

                        {/* Booked/Blocked slots */}
                        {courtSlots.map((slot: any) => {
                          const pos = calculatePosition(slot.start_time, slot.end_time);
                          if (slot.status === 'AVAILABLE') return null;
                          const isBlocked = slot.status === 'BLOCKED';
                          const isUnblocking = unblockingSlotId === slot._id;
                          const bgClass = isBlocked ? 'bg-error-container border-error/30' : 'bg-primary/10 border-primary/20';
                          const textClass = isBlocked ? 'text-error' : 'text-primary';
                          return (
                            <div
                              key={slot._id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isBlocked) setUnblockingSlotId(isUnblocking ? null : slot._id);
                              }}
                              className={`absolute top-1.5 bottom-1.5 rounded-lg border border-l-4 p-2 overflow-hidden hover:shadow-md transition-all cursor-pointer z-20 ${bgClass} ${isUnblocking ? 'ring-2 ring-error shadow-xl' : ''}`}
                              style={{ left: `calc(${pos.left} + 2px)`, width: `calc(${pos.width} - 4px)` }}
                              title={`${slot.start_time} - ${slot.end_time}: ${isBlocked ? (slot.block_reason || 'Bảo trì') + ' - Click để quản lý' : 'Đã đặt'}`}
                            >
                              <div className="flex flex-col h-full relative">
                                <p className={`text-xs font-bold truncate ${textClass}`}>
                                  {isBlocked
                                    ? <><span className="material-symbols-outlined text-[14px] align-middle">lock</span> {slot.block_reason || 'Khóa'}</>
                                    : 'Khách đặt'
                                  }
                                </p>
                                <p className={`text-[10px] truncate ${textClass} opacity-80`}>{slot.start_time} - {slot.end_time}</p>

                                {isUnblocking && (
                                  <div className="absolute inset-0 bg-error flex items-center justify-center z-30 animate-in fade-in zoom-in duration-200">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleUnblockSlot(slot._id); }}
                                      className="bg-white text-error text-xs font-black px-4 py-1.5 rounded-full shadow-lg hover:bg-error-container transition-colors"
                                    >
                                      MỞ KHÓA
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}