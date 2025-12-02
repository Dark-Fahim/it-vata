// src/pages/CreditList.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PEOPLE } from "../data/people";
import { fmtMoney } from "../utils/format";
import { Edit2, Search as SearchIcon } from "lucide-react";

/**
 * CreditList - তালিকা ভিউ
 * - রো-ওয়াইজ আলাদা ব্যাকগ্রাউন্ড (zebra)
 * - ভাড়া/ঋণের টাকাটা হাইলাইট যখন > 0
 * - Edit আইকন lucide-react থেকে
 * - নাম ক্লিক করলে detail route এ navigate হয়
 */

export default function CreditList() {
  const navigate = useNavigate();
  const [data, setData] = useState(PEOPLE);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter((p) =>
      String(p.id).includes(s) ||
      p.name.toLowerCase().includes(s) ||
      (p.loc || "").toLowerCase().includes(s) ||
      String(p.owed).includes(s)
    );
  }, [data, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  // open edit modal placeholder (you can replace with real modal)
  function onEdit(row) {
    alert("Edit for: " + row.name);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">ঋণ/বাকির তালিকা</h1>
            <p className="text-sm text-gray-500 mt-1">নাম ক্লিক করলে বিস্তারিত দেখুন</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="নাম/ঠিকানা/টাকা সার্চ..."
                className="pl-4 pr-10 py-2 w-72 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <SearchIcon className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div>
            <button
              onClick={() => {
                const rows = [["ID", "Name", "Location", "Owed"]];
                filtered.forEach(r => rows.push([r.id, r.name, r.loc, r.owed]));
                const csv = rows.map(rr => rr.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "credits.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500">মোট পজিশন</div>
            <div className="text-2xl font-semibold mt-1">{data.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500">মোট গ্রহণযোগ্য ঋণ</div>
            <div className="text-2xl font-semibold mt-1 text-emerald-700">{fmtMoney(data.reduce((s,d)=>s+(d.owed||0),0))}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500">মোট দেনা গ্রাহক</div>
            <div className="text-2xl font-semibold mt-1">{data.filter(d=>d.owed>0).length}</div>
          </div>
        </div>

        {/* list container */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* header */}
          <div className="hidden md:grid grid-cols-12 items-center bg-emerald-600 text-white px-4 py-3 text-sm font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-5">নাম / ঠিকানা</div>
            <div className="col-span-3">ঠিকানা</div>
            <div className="col-span-2 text-right">বাকিতে</div>
            <div className="col-span-1 text-center">অ্যাকশন</div>
          </div>

          {/* rows */}
          <div>
            {pageData.map((row, idx) => {
              const bgClass = idx % 2 === 0 ? "bg-white" : "bg-gray-50";
              return (
                <div key={row.id} className={`${bgClass} grid grid-cols-12 items-center gap-2 px-4 py-4`}>
                  <div className="col-span-1 text-sm text-gray-700">{row.id}</div>

                  <div className="col-span-12 md:col-span-5">
                    <button
                      onClick={() => navigate(`/credits/${row.id}`)}
                      className="text-left w-full text-sm font-medium text-gray-800 hover:underline"
                    >
                      {row.name}
                    </button>
                    <div className="text-xs text-gray-400 mt-1">{row.phone}</div>
                  </div>

                  <div className="col-span-6 md:col-span-3 text-sm text-orange-600">{row.loc || "-"}</div>

                  <div className="col-span-4 md:col-span-2 text-right">
                    <div className={`inline-block px-3 py-1 rounded text-sm ${row.owed > 0 ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-400"}`}>
                      {fmtMoney(row.owed)}
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-start md:justify-center">
                    <button
                      onClick={() => onEdit(row)}
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

        {/* pager */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>পৃষ্ঠা {page} / {totalPages}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded" disabled={page===1}>Prev</button>
            <div className="px-3">প্রদর্শিত: {pageData.length}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} className="px-3 py-1 border rounded" disabled={page===totalPages}>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
