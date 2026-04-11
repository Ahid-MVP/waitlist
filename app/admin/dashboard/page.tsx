"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WaitlistEntry {
  id: number;
  email: string;
  brand_name: string | null;
  created_at: string;
  signup_date: string;
}

interface Stats {
  total_signups: string;
  unique_emails: string;
  with_brand_name: string;
  without_brand_name: string;
}

interface DailyCount {
  date: string;
  count: string;
}

interface DashboardData {
  stats: Stats;
  entries: WaitlistEntry[];
  count: number;
  daily: DailyCount[];
}

type SortField = "email" | "brand_name" | "created_at";
type SortDir = "asc" | "desc";
type BrandFilter = "all" | "with" | "without";

const PAGE_SIZE = 25;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div className={`rounded-2xl p-5 ${accent} flex flex-col gap-1`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-60">{label}</p>
      <p className="text-4xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs opacity-50 mt-1">{sub}</p>}
    </div>
  );
}

function BarChart({ data }: { data: DailyCount[] }) {
  // Fill every day in the last 30 days, including missing ones as 0
  const filled = useMemo(() => {
    const result: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = data.find((x) => String(x.date).startsWith(dateStr));
      result.push({ date: dateStr, count: found ? parseInt(found.count) : 0 });
    }
    return result;
  }, [data]);

  const maxCount = Math.max(...filled.map((d) => d.count), 1);
  const totalW = 800;
  const chartH = 120;
  const barW = totalW / filled.length;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${totalW} ${chartH + 28}`}
        className="w-full"
        style={{ height: "160px" }}
        preserveAspectRatio="none"
      >
        {filled.map((d, i) => {
          const barH = (d.count / maxCount) * chartH;
          const x = i * barW + barW * 0.1;
          const y = chartH - barH;
          const isToday = i === filled.length - 1;
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={barW * 0.8}
                height={Math.max(barH, 2)}
                fill={isToday ? "#84cc16" : "#2dd4bf"}
                rx={2}
                opacity={d.count === 0 ? 0.2 : 1}
              />
              {d.count > 0 && barH > 16 && (
                <text
                  x={x + (barW * 0.8) / 2}
                  y={y + 13}
                  textAnchor="middle"
                  fontSize={9}
                  fill="white"
                  fontWeight="bold"
                >
                  {d.count}
                </text>
              )}
              {i % 5 === 0 && (
                <text
                  x={x + (barW * 0.8) / 2}
                  y={chartH + 20}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#9ca3af"
                >
                  {d.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex items-center gap-4 mt-1 justify-end">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-teal-400" />
          Past days
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-lime-400" />
          Today
        </span>
      </div>
    </div>
  );
}

function exportCSV(entries: WaitlistEntry[]) {
  const header = ["ID", "Email", "Brand Name", "Signed Up At"];
  const rows = entries.map((e) => [
    e.id,
    e.email,
    e.brand_name ?? "",
    new Date(e.created_at).toLocaleString(),
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `waitlist-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filterBrand, setFilterBrand] = useState<BrandFilter>("all");

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const token =
        typeof window !== "undefined" ? sessionStorage.getItem("adminToken") : null;

      if (!token) {
        router.replace("/admin");
        return;
      }

      try {
        const res = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          sessionStorage.removeItem("adminAuth");
          sessionStorage.removeItem("adminToken");
          router.replace("/admin");
          return;
        }
        if (!res.ok) throw new Error("Request failed");
        const json = await res.json();
        setData(json);
        setLastUpdated(new Date());
      } catch {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminToken");
    router.replace("/admin");
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.entries;
    if (filterBrand === "with") list = list.filter((e) => e.brand_name);
    if (filterBrand === "without") list = list.filter((e) => !e.brand_name);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.email.toLowerCase().includes(q) ||
          (e.brand_name ?? "").toLowerCase().includes(q)
      );
    }
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = (a[sortField] ?? "") as string;
      const bv = (b[sortField] ?? "") as string;
      return av < bv ? -dir : av > bv ? dir : 0;
    });
  }, [data, search, sortField, sortDir, filterBrand]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const domainStats = useMemo(() => {
    if (!data) return [];
    const counts: Record<string, number> = {};
    for (const e of data.entries) {
      const d = e.email.split("@")[1]?.toLowerCase() ?? "unknown";
      counts[d] = (counts[d] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [data]);

  const recentCount = useMemo(() => {
    if (!data) return 0;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return data.entries.filter((e) => new Date(e.created_at) >= cutoff).length;
  }, [data]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const sortIcon = (field: SortField) =>
    sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕";

  // ── Render states ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-50 via-blue-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-teal-400 border-t-transparent"
            style={{ animation: "spin 0.7s linear infinite" }}
          />
          <p className="text-teal-700 font-medium text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-50 via-blue-50 to-white">
        <div className="text-center space-y-4 p-8">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => fetchData()}
            className="px-6 py-2 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-600 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats } = data;
  const totalSignups = parseInt(stats.total_signups);
  const withBrand = parseInt(stats.with_brand_name);
  const brandPct = totalSignups > 0 ? Math.round((withBrand / totalSignups) * 100) : 0;

  // page numbers to show
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-white">
      {/* ── Header ── */}
      <div className="sticky top-4 z-30 px-4 sm:px-8">
        <header className="max-w-7xl mx-auto px-5 py-3 bg-white/80 backdrop-blur-2xl rounded-full shadow-xl border border-gray-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/Pokecut_1775139303164.png"
              alt="ahid logo"
              width={40}
              height={40}
            />
            <div className="leading-tight">
              <p className="text-sm font-bold text-teal-900">Waitlist Dashboard</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Updated {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-full text-xs font-semibold disabled:opacity-50"
            >
              {refreshing ? "Refreshing…" : "↻ Refresh"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-full text-xs font-semibold"
            >
              Logout
            </button>
          </div>
        </header>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-24 space-y-6">
        {/* ── Stats row ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Signups"
            value={stats.total_signups}
            sub={`${recentCount} in the last 7 days`}
            accent="bg-teal-50 text-teal-900"
          />
          <StatCard
            label="Unique Emails"
            value={stats.unique_emails}
            accent="bg-cyan-50 text-cyan-900"
          />
          <StatCard
            label="With Brand Name"
            value={withBrand}
            sub={`${brandPct}% of signups`}
            accent="bg-lime-50 text-lime-900"
          />
          <StatCard
            label="No Brand Name"
            value={stats.without_brand_name}
            sub={`${100 - brandPct}% of signups`}
            accent="bg-orange-50 text-orange-900"
          />
        </section>

        {/* ── Chart + Domain breakdown ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow p-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Daily Signups — Last 30 Days
            </h2>
            <BarChart data={data.daily} />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow p-6 flex flex-col gap-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Top Email Domains
            </h2>
            {domainStats.length === 0 ? (
              <p className="text-gray-400 text-sm">No data yet</p>
            ) : (
              <ul className="space-y-3">
                {domainStats.map(([domain, count]) => (
                  <li key={domain}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 truncate">{domain}</span>
                      <span className="text-gray-400 font-mono text-xs ml-2">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-400 rounded-full"
                        style={{
                          width: `${totalSignups > 0 ? (count / totalSignups) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Brand adoption mini-donut via text */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Brand Adoption
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="3.5"
                      strokeDasharray={`${brandPct} ${100 - brandPct}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-teal-700">
                    {brandPct}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-1" />
                    {withBrand} with brand
                  </p>
                  <p>
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-200 mr-1" />
                    {parseInt(stats.without_brand_name)} without
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Entries table ── */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow overflow-hidden">
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search by email or brand…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 min-w-48 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-teal-400"
            />
            <div className="flex items-center gap-1.5">
              {(["all", "with", "without"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setFilterBrand(v);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    filterBrand === v
                      ? "bg-teal-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {v === "all" ? "All" : v === "with" ? "With Brand" : "No Brand"}
                </button>
              ))}
            </div>
            <button
              onClick={() => exportCSV(filtered)}
              className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-teal-900 rounded-full text-xs font-semibold ml-auto"
            >
              Export CSV
            </button>
          </div>

          {/* Count bar */}
          <div className="px-5 py-2 bg-gray-50/50 border-b border-gray-100">
            <p className="text-xs text-gray-400">
              {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
              {search && ` matching "${search}"`}
              {filterBrand !== "all" &&
                ` · ${filterBrand === "with" ? "with" : "without"} brand name`}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left bg-gray-50/30">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-teal-600 select-none"
                    onClick={() => handleSort("email")}
                  >
                    Email{sortIcon("email")}
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-teal-600 select-none"
                    onClick={() => handleSort("brand_name")}
                  >
                    Brand Name{sortIcon("brand_name")}
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-teal-600 select-none"
                    onClick={() => handleSort("created_at")}
                  >
                    Joined{sortIcon("created_at")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-14 text-center text-gray-300 text-sm">
                      No entries found
                    </td>
                  </tr>
                ) : (
                  paginated.map((entry, i) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-50 hover:bg-teal-50/40"
                    >
                      <td className="px-5 py-3 text-gray-300 font-mono text-xs">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-800">{entry.email}</td>
                      <td className="px-5 py-3">
                        {entry.brand_name ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800">
                            {entry.brand_name}
                          </span>
                        ) : (
                          <span className="text-gray-200 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-full text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                >
                  ← Prev
                </button>
                {pageNumbers.map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-1.5">
                    {idx > 0 && arr[idx - 1] < p - 1 && (
                      <span className="text-xs text-gray-300 px-1">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-full text-xs font-medium ${
                        page === p
                          ? "bg-teal-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-full text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
