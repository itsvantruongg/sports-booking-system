"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SportType {
  _id: string;
  name: string;
  slug: string;
  icon_url?: string;
  is_active?: boolean;
}

const ICON_SUGGESTIONS = [
  { label: "Tennis", icon: "sports_tennis" },
  { label: "Bóng đá", icon: "sports_soccer" },
  { label: "Bóng rổ", icon: "sports_basketball" },
  { label: "Cầu lông", icon: "sports_badminton" },
  { label: "Bóng chuyền", icon: "sports_volleyball" },
  { label: "Bơi lội", icon: "pool" },
  { label: "Bóng bàn", icon: "sports" },
  { label: "Golf", icon: "sports_golf" },
  { label: "Võ thuật", icon: "sports_martial_arts" },
  { label: "Thể dục", icon: "fitness_center" },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({ name: "", slug: "", icon_url: "" });
  const [showIconPicker, setShowIconPicker] = useState(false);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getToken = () => localStorage.getItem("access_token") ?? "";

  const fetchSportTypes = async () => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    setLoading(true);
    try {
      // Try admin endpoint first; fallback to public
      const res = await fetch("http://localhost:5000/api/public/sport-types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSportTypes(Array.isArray(data) ? data : data.data ?? []);
      }
    } catch { console.error("Fetch sport types error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSportTypes(); }, []);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/[đ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setForm(p => ({ ...p, name, slug }));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      showToast("Vui lòng nhập tên và slug.", "error");
      return;
    }
    const token = getToken();
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/sport-types", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, slug: form.slug, icon_url: form.icon_url || "sports" }),
      });
      if (res.ok) {
        const data = await res.json();
        const newSt = data.sportType ?? data;
        if (newSt?._id) {
          setSportTypes(prev => [newSt, ...prev]);
        } else {
          setSportTypes(prev => [{ _id: Date.now().toString(), ...form } as SportType, ...prev]);
        }
        setForm({ name: "", slug: "", icon_url: "" });
        showToast("✅ Đã tạo loại hình thể thao mới!", "success");
      } else {
        const err = await res.json();
        showToast(err.message || "Tạo thất bại.", "error");
      }
    } catch { showToast("Lỗi kết nối.", "error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 md:p-12 max-w-[1600px] mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm transition-all ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="mb-12 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Cài đặt Hệ thống</h1>
          <p className="text-lg text-on-surface-variant font-body">Quản lý danh mục môn thể thao trên nền tảng.</p>
        </div>
        <button onClick={fetchSportTypes} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-low text-on-surface font-bold text-sm hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-[16px]">refresh</span> Làm mới
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Sport Types List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-on-surface flex items-center gap-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              <span className="w-3 h-8 bg-primary rounded-full block" /> Danh mục môn thể thao
            </h2>
            <span className="text-sm font-medium text-on-surface-variant bg-surface-container-low px-4 py-1.5 rounded-full">
              {loading ? "..." : `${sportTypes.length} loại hình`}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 animate-pulse flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container" />
                  <div className="flex-1">
                    <div className="h-4 bg-surface-container rounded mb-2 w-1/3" />
                    <div className="h-3 bg-surface-container rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : sportTypes.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
              <span className="material-symbols-outlined text-6xl text-outline mb-4 block">sports</span>
              <p className="text-on-surface-variant font-bold">Chưa có loại hình thể thao nào.</p>
              <p className="text-sm text-on-surface-variant mt-1">Thêm loại hình đầu tiên bên phải →</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sportTypes.map(st => (
                <div
                  key={st._id}
                  className="bg-surface-container-lowest rounded-2xl p-6 flex items-center gap-6 shadow-[0_4px_20px_rgba(25,27,37,0.02)] hover:shadow-[0_12px_40px_rgba(25,27,37,0.06)] transition-all group border border-transparent hover:border-outline-variant/15"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {st.icon_url || "sports"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-on-surface mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{st.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-on-surface-variant flex-wrap">
                      <span className="font-mono bg-surface-container-low px-2 py-0.5 rounded text-xs">slug: {st.slug}</span>
                      {st.is_active !== undefined && (
                        <span className={`flex items-center gap-1 text-xs font-bold ${st.is_active ? "text-green-600" : "text-red-600"}`}>
                          <span className={`w-2 h-2 rounded-full ${st.is_active ? "bg-green-500" : "bg-red-500"}`} />
                          {st.is_active ? "Đang hoạt động" : "Tạm ẩn"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center text-xs font-black" title={`ID: ${st._id}`}>
                      <span className="material-symbols-outlined text-[14px]">info</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Add Form */}
        <div className="xl:col-span-1">
          <div className="bg-surface-container-low rounded-3xl p-8 sticky top-8">
            <h3 className="text-2xl font-black text-on-surface mb-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Thêm loại hình mới
            </h3>
            <div className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Tên môn thể thao *</label>
                <input
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  className="w-full bg-surface-container-lowest border-0 rounded-2xl px-5 py-4 text-on-surface font-bold shadow-sm focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all outline-none"
                  placeholder="Vd: Pickleball, Cầu lông..."
                />
              </div>

              {/* Slug (auto-generated) */}
              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Slug (URL) *</label>
                <input
                  value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full bg-surface-container-lowest border-0 rounded-2xl px-5 py-4 text-on-surface font-mono text-sm shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Tự động từ tên..."
                />
                <p className="text-xs text-on-surface-variant mt-1 ml-1">Tự động tạo từ tên, có thể chỉnh sửa.</p>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Material Icon</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-surface-container-lowest rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {form.icon_url || "sports"}
                    </span>
                    <input
                      value={form.icon_url}
                      onChange={e => setForm(p => ({ ...p, icon_url: e.target.value }))}
                      className="flex-1 bg-transparent outline-none font-mono text-sm text-on-surface"
                      placeholder="sports_tennis"
                    />
                  </div>
                  <button
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="w-12 h-12 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">grid_view</span>
                  </button>
                </div>

                {/* Icon Picker */}
                {showIconPicker && (
                  <div className="mt-3 bg-surface-container-lowest rounded-2xl p-4 shadow-md grid grid-cols-5 gap-2">
                    {ICON_SUGGESTIONS.map(s => (
                      <button
                        key={s.icon}
                        onClick={() => { setForm(p => ({ ...p, icon_url: s.icon })); setShowIconPicker(false); }}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all hover:bg-primary/10 ${form.icon_url === s.icon ? "bg-primary/10" : ""}`}
                        title={s.label}
                      >
                        <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                        <span className="text-[9px] text-on-surface-variant mt-1 text-center leading-tight">{s.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleCreate}
                disabled={saving || !form.name.trim()}
                className="w-full bg-primary text-on-primary py-4 rounded-full font-black text-base hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {saving
                  ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang tạo...</>
                  : <><span className="material-symbols-outlined text-[20px]">add</span> Tạo loại hình</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
