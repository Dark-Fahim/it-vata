// src/components/VehicleAccounts.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VEHICLES } from "../data/vehicles";

/**
 * VehicleAccounts.jsx
 * - Click a vehicle tile to navigate to /vehicles/:id (React Router)
 * - Keeps the rest of your logic intact (summary cards, report, add modal, export/print)
 *
 * Usage: replace your current component file with this.
 */

const SAMPLE_VEHICLES = VEHICLES

export default function VehicleAccounts() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState(SAMPLE_VEHICLES);
  const [selectedId, setSelectedId] = useState(vehicles[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filters state
  const [range, setRange] = useState("today"); // today, 7, 15, all
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Add form state
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🚜");

  // Example transactions per vehicle (mock)
  const [transactions] = useState({
    v1: [
      { id: 1, type: "income", desc: "চালান বিক্রি #3843", date: "2025-08-05", amount: 12000 },
      { id: 2, type: "expense", desc: "পার্কিং", date: "2025-08-06", amount: 500 },
    ],
    v2: [
      { id: 3, type: "income", desc: "চালান বিক্রি #3848", date: "2025-08-08", amount: 22000 },
    ],
  });

  // Derived totals (for header cards)
  const totals = useMemo(() => {
    const allTransactions = Object.values(transactions).flat();
    const totalIncome = allTransactions.filter(t => t.type === "income").reduce((s,t)=>s+t.amount,0);
    const totalExpense = allTransactions.filter(t => t.type === "expense").reduce((s,t)=>s+t.amount,0);
    const totalCash = totalIncome - totalExpense;
    const totalChalan = allTransactions.filter(t=>t.type==="income").length;
    return { totalIncome, totalExpense, totalCash, totalChalan };
  }, [transactions]);

  // Filtered vehicles by search
  const filteredVehicles = vehicles.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  function addVehicle() {
    if (!newName.trim()) {
      alert("Vehicle name দিন");
      return;
    }
    const id = `v${Date.now()}`;
    setVehicles(prev => [...prev, { id, name: newName.trim(), icon: newIcon || "🚜", color: "bg-gray-50", income: 0, expense: 0, cash: 0 }]);
    setNewName("");
    setNewIcon("🚜");
    setShowAddModal(false);
  }

  const selectedVehicle = vehicles.find(v => v.id === selectedId);

  // Income table for selected vehicle (mock / filtered by date)
  const reportRows = (transactions[selectedId] || []).filter(row => {
    if (fromDate && row.date < fromDate) return false;
    if (toDate && row.date > toDate) return false;
    return true;
  });

  function exportReportCSV() {
    const rows = [["Txn ID","Type","Description","Date","Amount (৳)"]];
    reportRows.forEach(r => rows.push([r.id, r.type, r.desc, r.date, r.amount]));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `vehicle_${selectedId || "report"}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  function printReport() {
    window.print();
  }

  // NEW: onVehicleClick navigates to vehicle detail route AND also sets selection
  function onVehicleClick(v) {
    setSelectedId(v.id);          // keep UI selection
    navigate(`/vehicles/${v.id}`); // navigate to vehicle detail route
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Top controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold">গাড়ির হিসাব</h2>
            <div className="flex  flex-wrap items-center gap-2">
              <button onClick={() => setRange("today")} className={`px-3 py-1 rounded ${range==="today" ? "bg-emerald-600 text-white" : "bg-white    "}`}>আজকের হিসাব</button>
              <button onClick={() => setRange("7")} className={`px-3 py-1 rounded ${range==="7" ? "bg-emerald-600 text-white" : "bg-white    "}`}>গত ৭ দিনের হিসাব</button>
              <button onClick={() => setRange("15")} className={`px-3 py-1 rounded ${range==="15" ? "bg-emerald-600 text-white" : "bg-white    "}`}>গত ১৫ দিনের হিসাব</button>
              <button onClick={() => setRange("all")} className={`px-3 py-1 rounded ${range==="all" ? "bg-emerald-600 text-white" : "bg-white    "}`}>সর্বমোট হিসাব</button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="সার্চ গাড়ি" className="px-3 py-2     rounded" />
            <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className="px-3 py-2     rounded" />
            <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className="px-3 py-2     rounded" />
            <button onClick={() => { setFromDate(""); setToDate(""); }} className="px-3 py-2     rounded">রিসেট</button>
            <button onClick={printReport} className="px-3 py-2 bg-emerald-600 text-white rounded">Print</button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="col-span-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg p-4 shadow">
            <div className="text-sm">মোট আয়</div>
            <div className="text-2xl font-semibold mt-2">৳ {totals.totalIncome.toLocaleString('bn-BD')}</div>
          </div>
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg p-4 shadow">
            <div className="text-sm">মোট ব্যয়</div>
            <div className="text-2xl font-semibold mt-2">৳ {totals.totalExpense.toLocaleString('bn-BD')}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg p-4 shadow">
            <div className="text-sm">মোট ক্যাশ</div>
            <div className="text-2xl font-semibold mt-2">৳ {totals.totalCash.toLocaleString('bn-BD')}</div>
          </div>
          <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-lg p-4 shadow">
            <div className="text-sm">মোট চালান</div>
            <div className="text-2xl font-semibold mt-2">{totals.totalChalan.toLocaleString('bn-BD')}</div>
          </div>
          <div className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white rounded-lg p-4 shadow">
            <div className="text-sm">মুনাফা/লস</div>
            <div className="text-2xl font-semibold mt-2">৳ {(totals.totalIncome - totals.totalExpense).toLocaleString('bn-BD')}</div>
          </div>
          <div className="bg-gradient-to-r from-cyan-400 to-sky-600 text-white rounded-lg p-4 shadow">
            <div className="text-sm">ক্যাশ জেড</div>
            <div className="text-2xl font-semibold mt-2">৳ 0</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left: vehicle tiles */}
          <div className="col-span-2 bg-white rounded-2xl p-4 shadow    ">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredVehicles.map(v => (
                <div
                  key={v.id}
                  onClick={() => onVehicleClick(v)}
                  className={`relative cursor-pointer select-none rounded-lg     p-6 flex flex-col items-center justify-center transition-shadow ${selectedId===v.id ? "ring-2 ring-emerald-400" : "hover:shadow-md"}`}
                >
                  <div className="text-4xl">{v.icon}</div>
                  <div className="mt-3 font-medium">{v.name}</div>
                </div>
              ))}

              {/* Add vehicle tile */}
              <div onClick={() => setShowAddModal(true)} className="cursor-pointer rounded-lg    -dashed    -2    -gray-200 p-6 flex items-center justify-center hover:bg-gray-50">
                <div className="text-center text-gray-500">
                  <div className="text-3xl">＋</div>
                  <div className="mt-2">অ্যাড গাড়ি</div>
                </div>
              </div>
            </div>
          </div>

          {/* right: income report */}
          <div className="bg-white rounded-2xl p-4 shadow    ">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">{selectedVehicle ? `${selectedVehicle.name} — ইনকাম রিপোর্ট` : "কোনো গাড়ি নির্বাচন করুন"}</h3>
                <div className="text-xs text-gray-500">সারসংক্ষেপ ও টেবিল</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={exportReportCSV} className="px-3 py-1     rounded text-sm">Export CSV</button>
                <button onClick={printReport} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Print</button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-3">
                <div className="p-3     rounded text-center">
                  <div className="text-xs text-gray-500">আয়</div>
                  <div className="font-semibold mt-1">৳ { (reportRows.filter(r=>r.type==="income").reduce((s,r)=>s+r.amount,0)).toLocaleString('bn-BD') }</div>
                </div>
                <div className="p-3     rounded text-center">
                  <div className="text-xs text-gray-500">ব্যয়</div>
                  <div className="font-semibold mt-1">৳ { (reportRows.filter(r=>r.type==="expense").reduce((s,r)=>s+r.amount,0)).toLocaleString('bn-BD') }</div>
                </div>
                <div className="p-3     rounded text-center">
                  <div className="text-xs text-gray-500">নিট</div>
                  <div className="font-semibold mt-1">৳ { (reportRows.filter(r=>r.type==="income").reduce((s,r)=>s+r.amount,0) - reportRows.filter(r=>r.type==="expense").reduce((s,r)=>s+r.amount,0)).toLocaleString('bn-BD') }</div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="p-2 text-left">Txn ID</th>
                    <th className="p-2 text-left">বিবরণ</th>
                    <th className="p-2 text-left">টাইপ</th>
                    <th className="p-2 text-left">তারিখ</th>
                    <th className="p-2 text-right">মোট টাকা</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRows.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-gray-500">কোনো ট্রানজেকশন নেই</td></tr>
                  )}
                  {reportRows.map(r => (
                    <tr key={r.id} className="   -b">
                      <td className="p-2">{r.id}</td>
                      <td className="p-2">{r.desc}</td>
                      <td className="p-2">{r.type}</td>
                      <td className="p-2">{r.date}</td>
                      <td className="p-2 text-right">৳ {r.amount.toLocaleString('bn-BD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-xs text-gray-500">প্রদর্শিত: {reportRows.length} এন্ট্রি</div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-30" onClick={()=>setShowAddModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md z-10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">অ্যাড গাড়ি</h3>
              <button onClick={()=>setShowAddModal(false)} className="text-gray-500">✕</button>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-600">গাড়ির নাম</label>
              <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="নাম লিখুন" className="w-full p-2     rounded" />

              <label className="text-sm text-gray-600">আইকন (ইমোজি)</label>
              <input value={newIcon} onChange={e=>setNewIcon(e.target.value)} placeholder="🚜" className="w-full p-2     rounded" />

              <div className="flex items-center justify-end gap-2">
                <button onClick={()=>{ setNewName(""); setNewIcon("🚜"); }} className="px-3 py-2     rounded">Clear</button>
                <button onClick={addVehicle} className="px-3 py-2 bg-emerald-600 text-white rounded">Add Vehicle</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
