// src/components/RentList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Edit2 } from "lucide-react";

/**
 * RentList.jsx
 * - Tailwind CSS required
 * - Bengali labels to match screenshots
 *
 * Features:
 * - Search, Export CSV, Pagination
 * - Table with green header, zebra rows
 * - ভাড়া column highlights when > 0
 * - Edit button opens modal (edit ঠিকানা | এলাকা | ভাড়া)
 * - Modal closes on ESC or backdrop click
 */

/* ----- sample data ----- */
const SAMPLE = [
  { id: 1, address: "মাজারপাড়া", area: "ভাটার আশপাশে", rent: 450 },
  { id: 2, address: "বেঙ্গনবাড়ি", area: "ভাটার আশপাশে", rent: 0 },
  { id: 3, address: "নাহিরাবাদ", area: "ভাটার আশপাশে", rent: 0 },
  { id: 4, address: "পলুপাড়া", area: "পলুপাড়া", rent: 0 },
  { id: 5, address: "বেতারা", area: "বাগদা", rent: 500 },
  { id: 6, address: "দক্ষিণ বেতারা", area: "বাগদা", rent: 600 },
  { id: 7, address: "দরবস্ত", area: "", rent: 0 },
  { id: 8, address: "২ নং কাটা বাড়ি", area: "কাটাবাড়ি", rent: 0 },
  { id: 9, address: "কালুকুঙ্গর", area: "ঘাটঘাট", rent: 500 },
  { id: 10, address: "সাহেবগঞ্জ", area: "মেরি", rent: 700 },
  { id: 11, address: "মাজারপাড়া", area: "ভাটার আশপাশে", rent: 450 },
  { id: 12, address: "বেঙ্গনবাড়ি", area: "ভাটার আশপাশে", rent: 0 },
  { id: 13, address: "নাহিরাবাদ", area: "ভাটার আশপাশে", rent: 0 },
  { id: 14, address: "পলুপাড়া", area: "পলুপাড়া", rent: 0 },
  { id: 15, address: "বেতারা", area: "বাগদা", rent: 500 },
  { id: 16, address: "দক্ষিণ বেতারা", area: "বাগদা", rent: 600 },
  { id: 17, address: "দরবস্ত", area: "", rent: 0 },
  { id: 18, address: "২ নং কাটা বাড়ি", area: "কাটাবাড়ি", rent: 0 },
  { id: 19, address: "কালুকুঙ্গর", area: "ঘাটঘাট", rent: 500 },
  { id: 20, address: "সাহেবগঞ্জ", area: "মেরি", rent: 700 },
  // ... add more if you want
];

/* ----- helper: format money in BD locale ----- */
function fmtMoney(n) {
  if (n === null || n === undefined) return "৳ 0";
  // Use bn-BD locale for digits grouping; prefix with ৳ and a space
  try {
    return "৳ " + Number(n).toLocaleString("bn-BD");
  } catch {
    return "৳ " + String(n);
  }
}

export default function RentList() {
  const [data, setData] = useState(SAMPLE);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // modal state
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ address: "", area: "", rent: "" });

  // filtered data
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter(
      (r) =>
        String(r.id).includes(s) ||
        r.address.toLowerCase().includes(s) ||
        (r.area || "").toLowerCase().includes(s) ||
        String(r.rent).includes(s)
    );
  }, [data, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  // open edit modal
  function openEdit(row) {
    setEditing(row.id);
    setForm({ address: row.address || "", area: row.area || "", rent: row.rent ?? 0 });
    // lock background scroll (optional)
    document.body.style.overflow = "hidden";
  }

  // close modal
  function closeModal() {
    setEditing(null);
    setForm({ address: "", area: "", rent: "" });
    document.body.style.overflow = "";
  }

  // handle Esc to close modal
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function saveEdit() {
    setData((prev) =>
      prev.map((r) =>
        r.id === editing
          ? { ...r, address: form.address.trim(), area: form.area.trim(), rent: Number(form.rent) || 0 }
          : r
      )
    );
    closeModal();
  }

  function exportCSV() {
    const rows = [["#","ঠিকানা","এলাকা","ভাড়া"]];
    filtered.forEach((r) => rows.push([r.id, r.address, r.area || "", r.rent || 0]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rent_list.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // derived stats
  const totalRentSum = data.reduce((s, r) => s + (Number(r.rent) || 0), 0);
  const avgRent = data.length ? Math.round(totalRentSum / data.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* heading + search + export */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-emerald-700">গাড়ি ভাড়া তালিকা</h1>
            <p className="text-sm text-gray-500 mt-1">ভাড়া আপডেট করুন এবং রিপোর্ট এক্সপোর্ট করুন</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="সার্চ করুন (ঠিকানা, এলাকা, ভাড়া)"
                className="pl-4 pr-10 py-2 w-72 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <svg className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" /></svg>
            </div>

            <button onClick={exportCSV} className="px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50">Export CSV</button>
          </div>
        </div>

        {/* stats row (optional) */}
        <div className="flex gap-4 mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
            <div className="text-xs text-gray-500">মোট এলাকা</div>
            <div className="text-lg font-semibold mt-1">{data.length}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
            <div className="text-xs text-gray-500">মোট ভাড়া (মোট)</div>
            <div className="text-lg font-semibold mt-1">{fmtMoney(totalRentSum)}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
            <div className="text-xs text-gray-500">মোট ভাড়া (গড়)</div>
            <div className="text-lg font-semibold mt-1">{fmtMoney(avgRent)}</div>
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* header (desktop) */}
          <div className="hidden md:grid grid-cols-12 items-center bg-emerald-600 text-white px-4 py-3 text-sm font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-6">ঠিকানা</div>
            <div className="col-span-3">এলাকা</div>
            <div className="col-span-1 text-right">ভাড়া</div>
            <div className="col-span-1 text-center">অ্যাকশন</div>
          </div>

          {/* rows */}
          <div>
            {pageData.map((row, idx) => {
              // choose per-row bg (you can change colors)
              const bgClass = idx % 2 === 0 ? "bg-white" : "bg-gray-50";
              return (
                <div
                  key={row.id}
                  className={`${bgClass} grid grid-cols-12 items-center gap-2 px-4 py-3 transition`}
                >
                  {/* id */}
                  <div className="col-span-1 text-sm text-gray-700">{row.id}</div>

                  {/* address */}
                  <div className="col-span-12 md:col-span-6 text-sm font-medium text-gray-800">
                    {row.address}
                  </div>

                  {/* area */}
                  <div className="col-span-6 md:col-span-3 text-sm text-orange-600">
                    {row.area || "-"}
                  </div>

                  {/* rent */}
                  <div className="col-span-3 md:col-span-1 text-right">
                    <div
                      className={`inline-block px-3 py-1 rounded text-sm ${
                        row.rent > 0 ? "bg-emerald-100 text-emerald-700 font-semibold" : "text-gray-400"
                      }`}
                    >
                      {fmtMoney(row.rent)}
                    </div>
                  </div>

                  {/* action (icon) */}
                  <div className="col-span-3 md:col-span-1 flex justify-start md:justify-center">
                    <button
                      onClick={() => openEdit(row)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100 transition"
                      title="Edit"
                    >
                      <Edit2 size={18} className="text-emerald-600" />
                    </button>
                  </div>
                </div>
              );
            })}

            {pageData.length === 0 && (
              <div className="p-8 text-center text-gray-500">কোনো ডাটা নেই</div>
            )}
          </div>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>পেজ: {page} / {totalPages}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-2 rounded border disabled:opacity-50" disabled={page === 1}>Prev</button>
            <div className="px-3 text-sm">প্রদর্শিত: {pageData.length}</div>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="p-2 rounded border disabled:opacity-50" disabled={page === totalPages}>Next</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeModal} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">ভাড়া আপডেট করুন</h3>
              <button onClick={closeModal} className="text-gray-500">✕</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-600">ঠিকানা</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">এলাকা</label>
                <input
                  value={form.area}
                  onChange={(e) => setForm(f => ({ ...f, area: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">ভাড়া</label>
                <input
                  type="number"
                  value={form.rent}
                  onChange={(e) => setForm(f => ({ ...f, rent: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button onClick={closeModal} className="px-3 py-2 border rounded">বাতিল</button>
                <button onClick={saveEdit} className="px-3 py-2 bg-emerald-600 text-white rounded">আপডেট</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
