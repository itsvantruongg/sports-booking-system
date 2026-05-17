"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DAY_LABELS: Record<string, string> = {
  WEEKDAY: "Ngày thường (T2–T6)",
  WEEKEND: "Cuối tuần (T7–CN)",
};

interface PricingRule {
  _id: string;
  court_id: { _id: string; name: string };
  day_type: "WEEKDAY" | "WEEKEND";
  slot_start: string;
  slot_end: string;
  price_per_slot: number;
  label?: string;
}

interface Court {
  _id: string;
  name: string;
}

const emptyForm = {
  court_id: "",
  day_type: "WEEKDAY" as "WEEKDAY" | "WEEKEND",
  slot_start: "06:00",
  slot_end: "07:00",
  price_per_slot: 100000,
  label: "",
};

export default function OwnerPricingPage() {
  const router = useRouter();
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [filterCourtId, setFilterCourtId] = useState("all");
  const [courtSearch, setCourtSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [wizardForm, setWizardForm] = useState({
    start: "06:00",
    end: "22:00",
    interval: 120, // mins
    price: 150000,
    day_types: ["WEEKDAY"] as ("WEEKDAY" | "WEEKEND")[],
    court_ids: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [applyToAll, setApplyToAll] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getToken = () => localStorage.getItem("access_token") ?? "";

  const fetchAll = async () => {
    const token = getToken();
    setLoading(true);
    try {
      const [courtsData, rulesData] = await Promise.all([
        fetch("http://localhost:5000/api/owner/courts", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch("http://localhost:5000/api/owner/pricing-rules", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      setCourts(Array.isArray(courtsData) ? courtsData : []);
      setRules(Array.isArray(rulesData) ? rulesData : []);
      if (courtsData.length > 0) {
        if (!form.court_id) setForm(f => ({ ...f, court_id: courtsData[0]._id }));
        if (wizardForm.court_ids.length === 0) setWizardForm(w => ({ ...w, court_ids: [courtsData[0]._id] }));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    fetchAll();
  }, [router]);

  const handleSave = async () => {
    if (!form.court_id && !applyToAll) { showToast("Vui lòng chọn sân.", "error"); return; }
    const token = getToken();
    setSaving(true);
    try {
      const isEditing = !!editingId;
      const url = isEditing
        ? `http://localhost:5000/api/owner/pricing-rules/${editingId}`
        : "http://localhost:5000/api/owner/pricing-rules";

      const body = {
        ...form,
        court_id: applyToAll && !isEditing ? courts.map(c => c._id) : form.court_id
      };

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchAll();
        setShowForm(false);
        setEditingId(null);
        setApplyToAll(false);
        setForm({ ...emptyForm, court_id: courts[0]?._id ?? "" });
        showToast(isEditing ? "✅ Đã cập nhật quy tắc giá!" : "✅ Đã tạo quy tắc giá mới!", "success");
      } else {
        const err = await res.json();
        showToast(err.message || "Thao tác thất bại.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
    finally { setSaving(false); }
  };

  const handleWizardSubmit = async () => {
    if (wizardForm.court_ids.length === 0) { showToast("Chọn ít nhất 1 sân.", "error"); return; }
    if (wizardForm.day_types.length === 0) { showToast("Chọn ít nhất 1 loại ngày.", "error"); return; }

    const token = getToken();
    setSaving(true);
    try {
      // Calculate rules
      const rulesToCreate: any[] = [];
      const [startH, startM] = wizardForm.start.split(':').map(Number);
      const [endH, endM] = wizardForm.end.split(':').map(Number);

      let currentMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      while (currentMinutes + wizardForm.interval <= endMinutes) {
        const sH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
        const sM = (currentMinutes % 60).toString().padStart(2, '0');
        const eH = Math.floor((currentMinutes + wizardForm.interval) / 60).toString().padStart(2, '0');
        const eM = ((currentMinutes + wizardForm.interval) % 60).toString().padStart(2, '0');

        for (const dt of wizardForm.day_types) {
          rulesToCreate.push({
            day_type: dt,
            slot_start: `${sH}:${sM}`,
            slot_end: `${eH}:${eM}`,
            price_per_slot: wizardForm.price,
            label: `Tạo nhanh ${wizardForm.interval}p`
          });
        }
        currentMinutes += wizardForm.interval;
      }

      if (rulesToCreate.length === 0) {
        showToast("Khoảng thời gian không hợp lệ.", "error");
        setSaving(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/owner/pricing-rules/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          court_ids: wizardForm.court_ids,
          rules: rulesToCreate
        }),
      });

      if (res.ok) {
        await fetchAll();
        setShowWizard(false);
        showToast(`✅ Đã tạo thành công ${rulesToCreate.length * wizardForm.court_ids.length} quy tắc!`, "success");
      } else {
        const err = await res.json();
        showToast(err.message || "Lỗi thiết lập nhanh.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
    finally { setSaving(false); }
  };

  const handleEdit = (rule: PricingRule) => {
    setEditingId(rule._id);
    setForm({
      court_id: rule.court_id._id,
      day_type: rule.day_type,
      slot_start: rule.slot_start,
      slot_end: rule.slot_end,
      price_per_slot: rule.price_per_slot,
      label: rule.label || "",
    });
    setApplyToAll(false);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa quy tắc này?")) return;
    const token = getToken();
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/owner/pricing-rules/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRules(prev => prev.filter(r => r._id !== id));
        showToast("🗑️ Đã xóa quy tắc.", "success");
      } else {
        showToast("Xóa thất bại.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
    finally { setDeletingId(null); }
  };

  const fmtVND = (n: number) => n.toLocaleString("vi-VN") + " ₫";

  return (
    <div className="p-6 lg:p-12">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm transition-all ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-on-surface">Quản lý Giá Sân</h1>
          <p className="text-on-surface-variant font-body mt-2">Tạo và quản lý quy tắc giá theo khung giờ và ngày trong tuần.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-high text-primary font-black text-sm hover:bg-primary/10 transition-all border-2 border-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">magic_button</span> Thiết lập nhanh
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ ...emptyForm, court_id: courts[0]?._id ?? "" });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-black text-sm hover:shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Thêm quy tắc
          </button>
        </div>
      </header>

      {/* Court Filter Searchable Dropdown */}
      {(() => {
        const selectedCourt = courts.find(c => c._id === filterCourtId);
        const displayValue = isDropdownOpen 
          ? courtSearch 
          : (selectedCourt ? selectedCourt.name : "Tất cả sân");
        
        const filteredCourtsList = courts.filter(c => 
          c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
            courtSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          )
        );

        return (
          <div className="relative mb-8 max-w-md" style={{ zIndex: 45 }}>
            <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Lọc theo sân</label>
            
            <div className="relative">
              {/* Input Box */}
              <div 
                className={`flex items-center gap-3 bg-surface-container-low rounded-full px-5 py-3 border border-outline-variant/15 transition-all shadow-sm ${
                  isDropdownOpen ? "border-primary/45 bg-surface-bright ring-2 ring-primary/10 shadow-md" : "hover:border-outline-variant/30"
                }`}
              >
                <span className="material-symbols-outlined text-primary text-[20px]">sports_tennis</span>
                <input 
                  type="text"
                  value={displayValue}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                    setCourtSearch(""); // Clear typing search on focus to see all options initially
                  }}
                  onChange={(e) => {
                    setCourtSearch(e.target.value);
                  }}
                  placeholder="Nhập tên sân để tìm kiếm..."
                  className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 flex-grow font-body outline-none text-sm font-bold"
                />
                {/* Action Buttons inside Input */}
                <div className="flex items-center gap-1">
                  {filterCourtId !== "all" && !isDropdownOpen && (
                    <button 
                      onClick={() => {
                        setFilterCourtId("all");
                        setCourtSearch("");
                      }} 
                      className="text-on-surface-variant/60 hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors flex items-center"
                      title="Xóa bộ lọc"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                  <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-primary" : ""}`}>
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              {/* Transparent click-away layer */}
              {isDropdownOpen && (
                <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
              )}

              {/* Autocomplete Dropdown List */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 z-40 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.12)] max-h-72 overflow-y-auto custom-scrollbar p-2 transition-all duration-200">
                  {/* Option: "Tất cả sân" */}
                  <button
                    type="button"
                    onClick={() => {
                      setFilterCourtId("all");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all ${
                      filterCourtId === "all" 
                        ? "bg-primary/10 text-primary" 
                        : "text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    <span className="flex-grow">Tất cả sân</span>
                    {filterCourtId === "all" && <span className="material-symbols-outlined text-primary text-[18px]">check</span>}
                  </button>

                  <div className="h-px bg-outline-variant/20 my-1 mx-2" />

                  {/* Court List Options */}
                  {filteredCourtsList.length === 0 ? (
                    <div className="py-6 px-4 text-center text-on-surface-variant/60 text-xs italic">
                      <span className="material-symbols-outlined text-xl mb-1 block">search_off</span>
                      Không tìm thấy sân nào khớp với "{courtSearch}"
                    </div>
                  ) : (
                    filteredCourtsList.map(c => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => {
                          setFilterCourtId(c._id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all ${
                          filterCourtId === c._id 
                            ? "bg-primary/10 text-primary" 
                            : "text-on-surface hover:bg-surface-container-low"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant/60">stadium</span>
                        <span className="flex-grow truncate">{c.name}</span>
                        {filterCourtId === c._id && <span className="material-symbols-outlined text-primary text-[18px]">check</span>}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Info banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-8 flex gap-3">
        <span className="material-symbols-outlined text-primary mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
        <div>
          <p className="font-bold text-on-surface text-sm mb-1">Cách thức hoạt động</p>
          <p className="text-on-surface-variant text-sm">Mỗi quy tắc xác định giá cho một sân trong một khung giờ nhất định. Khi khách đặt sân, hệ thống tự động áp dụng giá phù hợp. Quy tắc cuối tuần ưu tiên hơn quy tắc ngày thường khi cùng khung giờ.</p>
        </div>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-hidden">
          <div className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-5xl lg:w-auto my-auto flex flex-col max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-6 rounded-t-3xl shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-display font-black text-on-primary">Thiết lập nhanh (Wizard)</h2>
                  <p className="text-on-primary/70 text-sm mt-1">Tự động tạo hàng loạt khung giờ cho nhiều sân</p>
                </div>
                <button onClick={() => setShowWizard(false)} className="text-on-primary/50 hover:text-on-primary"><span className="material-symbols-outlined">close</span></button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Selection */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Chọn sân áp dụng</label>
                    <div className="max-h-48 overflow-y-auto bg-surface-container rounded-2xl p-4 border border-outline-variant/30 custom-scrollbar">
                      <button
                        onClick={() => setWizardForm(w => ({ ...w, court_ids: w.court_ids.length === courts.length ? [] : courts.map(c => c._id) }))}
                        className="text-[10px] font-black text-primary uppercase mb-3 block hover:underline tracking-tight"
                      >
                        {wizardForm.court_ids.length === courts.length ? "Bỏ chọn tất cả" : "Chọn tất cả sân"}
                      </button>
                      <div className="flex flex-col gap-2">
                        {courts.map(c => (
                          <label key={c._id} className="flex items-center gap-3 py-1 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={wizardForm.court_ids.includes(c._id)}
                              onChange={e => {
                                if (e.target.checked) setWizardForm(w => ({ ...w, court_ids: [...w.court_ids, c._id] }));
                                else setWizardForm(w => ({ ...w, court_ids: w.court_ids.filter(id => id !== c._id) }));
                              }}
                              className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary transition-all"
                            />
                            <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{c.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Loại ngày áp dụng</label>
                    <div className="flex gap-3">
                      {["WEEKDAY", "WEEKEND"].map(dt => (
                        <button
                          key={dt}
                          onClick={() => {
                            const type = dt as "WEEKDAY" | "WEEKEND";
                            setWizardForm(w => ({ ...w, day_types: w.day_types.includes(type) ? w.day_types.filter(t => t !== type) : [...w.day_types, type] }));
                          }}
                          className={`flex-1 py-3 rounded-2xl text-xs font-black border-2 transition-all flex items-center justify-center gap-2 ${wizardForm.day_types.includes(dt as any) ? "bg-primary/10 border-primary text-primary shadow-sm" : "bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high"}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{dt === "WEEKDAY" ? "calendar_today" : "celebration"}</span>
                          {dt === "WEEKDAY" ? "Ngày thường" : "Cuối tuần"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 2: Configuration */}
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Bắt đầu từ</label>
                      <input type="time" value={wizardForm.start} onChange={e => setWizardForm(w => ({ ...w, start: e.target.value }))} className="w-full bg-surface-container-low rounded-2xl px-3 py-2.5 font-bold text-on-surface focus:ring-2 focus:ring-primary border-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Đến hết</label>
                      <input type="time" value={wizardForm.end} onChange={e => setWizardForm(w => ({ ...w, end: e.target.value }))} className="w-full bg-surface-container-low rounded-2xl px-3 py-2.5 font-bold text-on-surface focus:ring-2 focus:ring-primary border-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Độ dài ca (phút)</label>
                      <select value={wizardForm.interval} onChange={e => setWizardForm(w => ({ ...w, interval: Number(e.target.value) }))} className="w-full bg-surface-container-low rounded-2xl px-3 py-2.5 font-bold text-on-surface focus:ring-2 focus:ring-primary border-none text-sm">
                        {[30, 60, 90, 120, 180].map(m => <option key={m} value={m}>{m} phút</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Giá mỗi ca (₫)</label>
                      <input type="number" value={wizardForm.price} onChange={e => setWizardForm(w => ({ ...w, price: Number(e.target.value) }))} step={10000} className="w-full bg-surface-container-low rounded-2xl px-3 py-2.5 font-black text-on-surface focus:ring-2 focus:ring-primary border-none text-sm" />
                    </div>
                  </div>

                  <div className="mt-auto bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <p className="text-[11px] font-medium text-primary flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      Mẹo: Bạn nên thiết lập khung giờ theo chuẩn của sân để khách dễ dàng lựa chọn.
                    </p>
                  </div>
                </div>

                {/* Column 3: Preview */}
                <div className="flex flex-col gap-5 h-full">
                  <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Xem trước khung giờ</label>
                  <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 overflow-hidden flex flex-col h-full max-h-48">
                    <div className="overflow-y-auto custom-scrollbar flex flex-col gap-2">
                      {(() => {
                        const [sH, sM] = wizardForm.start.split(':').map(Number);
                        const [eH, eM] = wizardForm.end.split(':').map(Number);
                        let current = sH * 60 + sM;
                        const end = eH * 60 + eM;
                        const slots = [];
                        while (current + wizardForm.interval <= end) {
                          const startStr = `${Math.floor(current / 60).toString().padStart(2, '0')}:${(current % 60).toString().padStart(2, '0')}`;
                          current += wizardForm.interval;
                          const endStr = `${Math.floor(current / 60).toString().padStart(2, '0')}:${(current % 60).toString().padStart(2, '0')}`;
                          slots.push({ start: startStr, end: endStr });
                        }

                        if (slots.length === 0) return <p className="text-[10px] text-on-surface-variant italic p-4 text-center">Chưa có khung giờ nào hợp lệ</p>;

                        return slots.map((s, i) => (
                          <div key={i} className="flex items-center justify-between bg-surface-container-low px-3 py-2.5 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-black">{i + 1}</span>
                              <span className="text-xs font-black text-on-surface">{s.start} – {s.end}</span>
                            </div>
                            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">{fmtVND(wizardForm.price)}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="px-6 pb-6 mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowWizard(false)}
                  className="w-full sm:flex-1 py-3 rounded-full border-2 border-outline-variant font-black text-xs text-on-surface hover:bg-surface-container-low transition-all uppercase tracking-wider"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleWizardSubmit}
                  disabled={saving}
                  className="w-full sm:flex-[2] py-3 rounded-full bg-primary text-on-primary font-black text-xs flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 uppercase tracking-wider"
                >
                  {saving ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">magic_button</span>
                  )}
                  {saving ? "Đang xử lý..." : "Thiết lập ngay bây giờ"}
                </button>
              </div>

              <div className="bg-surface-container p-6 rounded-b-3xl border-t border-outline-variant/20 flex flex-col items-center gap-2">
                {(() => {
                  const [sH, sM] = wizardForm.start.split(':').map(Number);
                  const [eH, eM] = wizardForm.end.split(':').map(Number);
                  const totalMins = (eH * 60 + eM) - (sH * 60 + sM);
                  const slotsPerDay = totalMins > 0 ? Math.floor(totalMins / wizardForm.interval) : 0;
                  const totalRules = slotsPerDay * wizardForm.day_types.length * wizardForm.court_ids.length;

                  return (
                    <>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Xem trước kết quả thiết lập</p>
                      <div className="flex items-center gap-4 text-xs font-black">
                        <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          {slotsPerDay} ca / ngày
                        </div>
                        <div className="w-1 h-1 rounded-full bg-outline-variant" />
                        <div className="flex items-center gap-1.5 text-on-surface bg-surface-container-high px-3 py-1.5 rounded-full">
                          <span className="material-symbols-outlined text-[16px]">rule</span>
                          Tổng cộng {totalRules} quy tắc giá
                        </div>
                      </div>
                      {totalRules > 0 && (
                        <p className="text-[9px] font-medium text-on-surface-variant mt-1 italic">
                          * Bao gồm {wizardForm.court_ids.length} sân x {wizardForm.day_types.length} loại ngày x {slotsPerDay} khung giờ
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-lg my-auto">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-8 rounded-t-3xl">
              <h2 className="text-2xl font-display font-black text-on-primary">{editingId ? "Cập nhật quy tắc giá" : "Thêm quy tắc giá mới"}</h2>
              <p className="text-on-primary/70 text-sm mt-1">Giá sẽ được áp dụng tự động khi có đặt sân</p>
            </div>
            <div className="p-8 flex flex-col gap-5">
              {/* Batch Toggle (Only when creating) */}
              {!editingId && (
                <div className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-primary/10">
                  <div>
                    <p className="font-bold text-sm text-on-surface">Áp dụng cho tất cả sân</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-black">Nhanh hơn • 1 lần thiết lập</p>
                  </div>
                  <button
                    onClick={() => setApplyToAll(!applyToAll)}
                    className={`w-12 h-6 rounded-full transition-all relative ${applyToAll ? "bg-primary" : "bg-outline-variant"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${applyToAll ? "left-7" : "left-1"}`} />
                  </button>
                </div>
              )}

              {/* Court Selection (Disabled if apply to all) */}
              <div className={applyToAll && !editingId ? "opacity-50 pointer-events-none" : ""}>
                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Sân áp dụng *</label>
                {loading ? (
                  <div className="h-12 bg-surface-container rounded-xl animate-pulse" />
                ) : (
                  <select
                    value={form.court_id}
                    onChange={e => setForm(p => ({ ...p, court_id: e.target.value }))}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 text-on-surface font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {courts.map(c => <option key={c._id} value={c._id} className="text-on-surface">{c.name}</option>)}
                  </select>
                )}
              </div>

              {/* Day Type */}
              <div>
                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Loại ngày *</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["WEEKDAY", "WEEKEND"] as const).map(dt => (
                    <button
                      key={dt}
                      onClick={() => setForm(p => ({ ...p, day_type: dt }))}
                      className={`py-3 rounded-2xl font-black text-sm transition-all ${form.day_type === dt ? "bg-primary text-on-primary shadow-md" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"}`}
                    >
                      {dt === "WEEKDAY" ? "📅 Ngày thường" : "🎉 Cuối tuần"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Giờ bắt đầu *</label>
                  <input type="time" value={form.slot_start} onChange={e => setForm(p => ({ ...p, slot_start: e.target.value }))}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Giờ kết thúc *</label>
                  <input type="time" value={form.slot_end} onChange={e => setForm(p => ({ ...p, slot_end: e.target.value }))}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-bold" />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Giá / slot (30 phút) *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.price_per_slot}
                    onChange={e => setForm(p => ({ ...p, price_per_slot: Number(e.target.value) }))}
                    min={0}
                    step={10000}
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 pr-12 text-on-surface font-black text-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">₫</span>
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Nhãn ghi chú</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                  placeholder="Vd: Giờ cao điểm, Khuyến mãi..."
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-full border-2 border-outline-variant text-on-surface font-black hover:bg-surface-container-low transition-colors">
                  Hủy
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 rounded-full bg-primary text-on-primary font-black hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                  {saving ? "Đang xử lý..." : editingId ? "Lưu thay đổi" : "Tạo quy tắc"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      {rules.filter(r => filterCourtId === "all" || r.court_id?._id === filterCourtId).length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center shadow-[0_12px_40px_rgba(25,27,37,0.06)]">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">price_change</span>
          <h3 className="text-xl font-display font-black text-on-surface mb-2">
            {filterCourtId === "all" ? "Chưa có quy tắc giá nào" : "Không có quy tắc cho sân này"}
          </h3>
          <p className="text-on-surface-variant font-body mb-6">
            {filterCourtId === "all"
              ? "Tạo quy tắc giá để hệ thống tự động tính tiền khi khách đặt sân."
              : "Sân này hiện chưa có quy tắc giá riêng nào được thiết lập."}
          </p>
          <button onClick={() => {
            if (filterCourtId !== "all") setForm(f => ({ ...f, court_id: filterCourtId }));
            setShowForm(true);
          }}
            className="px-8 py-3 rounded-full bg-primary text-on-primary font-black hover:shadow-lg transition-all">
            Thêm quy tắc {filterCourtId !== "all" ? "cho sân này" : "đầu tiên"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules
            .filter(r => filterCourtId === "all" || r.court_id?._id === filterCourtId)
            .map(rule => (
              <div key={rule._id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_40px_rgba(25,27,37,0.06)] flex flex-col gap-4 hover:shadow-[0_20px_60px_rgba(25,27,37,0.1)] transition-all border border-transparent hover:border-primary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${rule.day_type === "WEEKEND" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                        {rule.day_type === "WEEKEND" ? "Cuối tuần" : "Ngày thường"}
                      </span>
                      {rule.label && <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-surface-container-low text-on-surface-variant uppercase">{rule.label}</span>}
                    </div>
                    <p className="font-bold text-on-surface">{rule.court_id?.name || "Sân không xác định"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-display font-black text-primary">{fmtVND(rule.price_per_slot)}</p>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase">/ 30 phút</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-on-surface-variant bg-surface-container-low px-4 py-3 rounded-xl">
                  <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                  <span className="font-black">{rule.slot_start} – {rule.slot_end}</span>

                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit_square</span>
                    </button>
                    <button
                      onClick={() => handleDelete(rule._id)}
                      disabled={deletingId === rule._id}
                      className="p-2 rounded-full text-error hover:bg-error/10 transition-colors disabled:opacity-30"
                      title="Xóa"
                    >
                      {deletingId === rule._id
                        ? <span className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin block" />
                        : <span className="material-symbols-outlined text-[20px]">delete</span>
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="h-16" />
    </div>
  );
}