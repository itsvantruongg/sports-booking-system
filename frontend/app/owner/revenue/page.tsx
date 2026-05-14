"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerRevenuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<{ total_revenue: number, daily: any[] }>({ total_revenue: 0, daily: [] });
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/owner/reports?month=${month}&year=${year}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setReport(data);
        }
      } catch (error) {
        console.error("Lỗi tải báo cáo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [month, year, router]);

  // Xử lý dữ liệu biểu đồ dựa trên viewMode
  const rawChartItems = report.daily.map(d => ({
    date: d._id?.includes('-') ? d._id.split('-')[2] : (d._id || '??'),
    revenue: d.daily_revenue || 0,
    fullDate: d._id
  }));

  const getWeekData = () => {
    const now = new Date();
    const day = now.getDay(); // 0: CN, 1: T2...
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Chỉnh về Thứ 2
    const monday = new Date(now.setDate(diff));

    const weekLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    return weekLabels.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const found = rawChartItems.find(item => item.fullDate === dateStr);
      return {
        date: label,
        revenue: found ? found.revenue : 0,
        fullDate: dateStr,
      };
    });
  };

  const getMonthData = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const result = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const found = rawChartItems.find(item => item.fullDate === dateStr);
      result.push({
        date: String(i),
        revenue: found ? found.revenue : 0,
        fullDate: dateStr,
      });
    }
    return result;
  };

  const chartItems = viewMode === 'week'
    ? getWeekData()
    : getMonthData();

  const currentTotalRevenue = chartItems.reduce((sum, d) => sum + d.revenue, 0);
  const currentTotalBookings = report.daily.filter(d => chartItems.some(ci => ci.fullDate === d._id))
    .reduce((sum, d) => sum + d.booking_count, 0);

  const avgBookingValue = currentTotalBookings > 0 ? currentTotalRevenue / currentTotalBookings : 0;

  // Tính Max revenue để vẽ biểu đồ
  const maxDailyRevenue = chartItems.length > 0 ? Math.max(...chartItems.map(d => d.revenue || 0)) : 100;

  const getChartHeight = (revenue: number) => {
    return (revenue / (maxDailyRevenue || 1)) * 100;
  };

  const exportCSV = () => {
    const headers = ["Ngày", "Số lượt đặt", "Doanh thu (VNĐ)"];
    const totalBookings = report.daily.reduce((sum, d) => sum + (d.booking_count || 0), 0);
    const rows = report.daily.map(d => [
      d._id,
      d.booking_count,
      d.daily_revenue || 0,
    ]);
    rows.push(["TỔNG CỘNG", totalBookings, report.total_revenue]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kinetic_revenue_${month}_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-12 xl:p-16 max-w-[1600px] mx-auto w-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-surface mb-2 tracking-tight">Báo Cáo Doanh Thu</h1>
          <p className="font-body text-lg text-on-surface-variant">Tổng quan tài chính trong tháng</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* View Mode Switcher */}
          <div className="flex bg-surface-container-low rounded-full p-1 shadow-sm border border-outline-variant/10">
            <button
              onClick={() => setViewMode('week')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'week' ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-container-high"}`}
            >
              7 Ngày
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'month' ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-container-high"}`}
            >
              Tháng
            </button>
          </div>

          <div className="flex bg-surface-container-low rounded-full p-1 shadow-sm border border-outline-variant/10">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-4 py-2 bg-transparent border-none text-sm font-semibold text-on-surface-variant focus:ring-0 cursor-pointer"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-4 py-2 bg-transparent border-none text-sm font-semibold text-on-surface-variant focus:ring-0 cursor-pointer"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
              ))}
            </select>
          </div>
          <button
            onClick={exportCSV}
            disabled={loading || report.daily.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Xuất CSV
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-on-surface-variant">Đang tải dữ liệu doanh thu...</div>
      ) : (
        <>
          {/* KPI Metrics Grid */}
          {/* KPI Metrics Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* Total Revenue Card */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.03)] border-none relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                </div>
              </div>
              <h3 className="font-body text-on-surface-variant font-medium mb-1">Doanh Thu ({viewMode === 'week' ? '7 ngày' : 'Tháng'})</h3>
              <p className="font-display text-3xl font-extrabold text-on-surface tracking-tight">{(currentTotalRevenue || 0).toLocaleString('vi-VN')} ₫</p>
            </div>

            {/* Total Debt Card */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.03)] border-none relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-orange-500/10 rounded-2xl">
                  <span className="material-symbols-outlined text-orange-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
                </div>
              </div>
              <h3 className="font-body text-on-surface-variant font-medium mb-1">Công Nợ ({viewMode === 'week' ? '7 ngày' : 'Tháng'})</h3>
              <p className="font-display text-3xl font-extrabold text-on-surface tracking-tight">{((report as any).total_debt || 0).toLocaleString('vi-VN')} ₫</p>
            </div>

            {/* Avg Booking Value */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.03)] border-none relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-tertiary-container/5 rounded-full blur-3xl group-hover:bg-tertiary-container/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-tertiary-container/10 rounded-2xl">
                  <span className="material-symbols-outlined text-tertiary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                </div>
              </div>
              <h3 className="font-body text-on-surface-variant font-medium mb-1">Giá trị Đơn TTB</h3>
              <p className="font-display text-3xl font-extrabold text-on-surface tracking-tight">{Math.round(avgBookingValue).toLocaleString('vi-VN')} ₫</p>
            </div>

            {/* Top Performing Asset */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.03)] border-none relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-secondary/10 rounded-2xl">
                  <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
                </div>
              </div>
              <h3 className="font-body text-on-surface-variant font-medium mb-1">Tổng Số Lượt Đặt</h3>
              <p className="font-display text-3xl font-extrabold text-on-surface tracking-tight mb-1">{currentTotalBookings}</p>
            </div>
          </section>

          {/* Chart Section */}
          <section className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_12px_40px_rgba(25,27,37,0.03)] mb-12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-headline text-2xl font-bold text-on-surface">Biểu đồ doanh thu</h2>
                <p className="font-body text-on-surface-variant text-sm mt-1">
                  {viewMode === 'week' ? "Chi tiết doanh thu tuần này (T2 - CN)" : `Thống kê doanh thu tháng ${month}/${year}`}
                </p>
              </div>
            </div>

            {chartItems.length === 0 ? (
              <div className="h-[300px] flex justify-center items-center text-on-surface-variant">Không có dữ liệu doanh thu trong giai đoạn này.</div>
            ) : (
              <div className="h-[400px] w-full relative">
                <div className="h-[320px] w-full flex items-end relative">
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-on-surface-variant font-black pb-0 pr-4 border-r border-outline-variant/20 z-20 bg-surface-container-lowest/80 backdrop-blur-sm">
                    <span>{(maxDailyRevenue).toLocaleString('vi-VN')}</span>
                    <span>{(maxDailyRevenue * 0.75).toLocaleString('vi-VN')}</span>
                    <span>{(maxDailyRevenue * 0.5).toLocaleString('vi-VN')}</span>
                    <span>{(maxDailyRevenue * 0.25).toLocaleString('vi-VN')}</span>
                    <span>0</span>
                  </div>

                  <div className="ml-16 flex-1 h-full relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[0, 0.25, 0.5, 0.75, 1].map((_, i) => (
                        <div key={i} className="w-full border-t border-outline-variant/10"></div>
                      ))}
                    </div>

                    <div className="absolute inset-0 px-4">
                      {/* Vertical Grid Lines */}
                      <div className="absolute inset-y-0 left-0 right-0 flex justify-between pointer-events-none">
                        {chartItems.map((_, i) => (
                          <div key={i} className="h-full w-px bg-outline-variant/5"></div>
                        ))}
                      </div>
                      {viewMode === 'month' && (
                        <div className="h-full flex items-end">
                          {chartItems.map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center group/bar relative h-full justify-end">
                              <div
                                style={{ height: `${getChartHeight(item.revenue)}%` }}
                                className="w-[70%] max-w-[18px] bg-primary/30 rounded-t-[2px] group-hover/bar:bg-primary transition-all duration-300 relative"
                              >
                                {/* Tooltip on Hover (White Theme) */}
                                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-on-surface py-2 px-4 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl border border-outline-variant/50 z-50">
                                  <div className="text-[10px] text-on-surface-variant font-medium mb-0.5 uppercase tracking-wider">Ngày {item.date} Tháng {month}</div>
                                  <div className="text-sm font-black text-primary">{(item.revenue ?? 0).toLocaleString('vi-VN')} ₫</div>
                                  {/* Little Arrow */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {viewMode === 'week' && (
                        <div className="absolute inset-0">
                          <svg className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none" viewBox="0 0 1000 320">
                            <defs>
                              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgb(var(--primary-rgb, 103 80 164))" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="rgb(var(--primary-rgb, 103 80 164))" stopOpacity="0" />
                              </linearGradient>
                            </defs>

                            {(() => {
                              const colWidth = 1000 / chartItems.length;
                              const points = chartItems.map((item, idx) => ({
                                x: (idx + 0.5) * colWidth,
                                y: 320 - (getChartHeight(item.revenue) / 100) * 320
                              }));

                              const lineD = `M ${points[0].x},${points[0].y} ${points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')}`;
                              const areaD = `${lineD} L ${points[points.length - 1].x},320 L ${points[0].x},320 Z`;

                              return (
                                <>
                                  <path d={areaD} fill="url(#chart-gradient)" className="transition-all duration-700" />
                                  <path d={lineD} fill="none" stroke="rgb(var(--primary-rgb, 103 80 164))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                                  {points.map((p, idx) => (
                                    <circle key={idx} cx={p.x} cy={p.y} r="6" fill="white" stroke="rgb(var(--primary-rgb, 103 80 164))" strokeWidth="3" />
                                  ))}
                                </>
                              );
                            })()}
                          </svg>

                          {/* Full-Height Hover Zones for Week Mode */}
                          <div className="absolute inset-0 flex z-20">
                            {chartItems.map((item, idx) => (
                              <div key={idx} className="flex-1 group/week-zone relative cursor-pointer">
                                {/* Vertical Indicator Line */}
                                <div className="absolute inset-y-0 left-1/2 w-px bg-primary/30 opacity-0 group-hover/week-zone:opacity-100 transition-opacity pointer-events-none"></div>

                                {/* Highlight Dot Overlay */}
                                <div className="absolute w-3 h-3 bg-primary border-2 border-white rounded-full left-1/2 -translate-x-1/2 opacity-0 group-hover/week-zone:opacity-100 transition-opacity shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] pointer-events-none"
                                  style={{ bottom: `calc(${getChartHeight(item.revenue)}% - 6px)` }}></div>

                                {/* Tooltip (White Theme) */}
                                <div className="absolute top-[15%] left-1/2 -translate-x-1/2 bg-white text-on-surface py-3 px-5 rounded-2xl opacity-0 group-hover/week-zone:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl z-50 -translate-y-4 group-hover/week-zone:translate-y-0 border border-outline-variant/30">
                                  <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{item.date} • {item.fullDate}</div>
                                  <div className="text-xl font-black text-primary">{(item.revenue ?? 0).toLocaleString('vi-VN')} ₫</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ml-16 mt-8 relative h-6 px-4">
                  {chartItems.map((item, idx) => {
                    const showLabel = viewMode === 'week' || (idx % 2 === 0) || (idx === chartItems.length - 1);
                    if (!showLabel) return null;

                    return (
                      <span
                        key={idx}
                        className="absolute text-[10px] font-black text-on-surface-variant -translate-x-1/2 whitespace-nowrap"
                        style={{ left: `${((idx + 0.5) / chartItems.length) * 100}%` }}
                      >
                        {item.date}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
