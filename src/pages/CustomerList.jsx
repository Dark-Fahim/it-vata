// src/pages/CustomerList.jsx
import React, { useMemo, useState } from "react";
import { Search, Plus, DownloadCloud, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PortalMenu from "../components/PortalMenu";
import ThreeDotButton from "../components/ThreeDotButton";
import buildPrintableChalanHTML from "../utils/printBuilders"; // we'll add small util below

export default function CustomerList({ customers }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [portalMenu, setPortalMenu] = useState({ open:false, anchorRect:null, customerId:null, chalanId:null });

  const filtered = useMemo(() => {
    const q = query.trim();
    let list = customers;
    if (filter === "overdue") list = list.filter((c) => c.lastDue);
    if (filter === "unpaid") list = list.filter((c) => c.amount > 0);
    if (!q) return list;
    return list.filter(
      (c) =>
        String(c.id).includes(q) ||
        c.name.includes(q) ||
        c.address.includes(q) ||
        c.phone.includes(q)
    );
  }, [customers, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);
  function goto(delta) { setPage((p) => Math.min(totalPages, Math.max(1, p + delta))); }

  function openPortalMenuFor(btnEl, customerId, chalanId) {
    if (!btnEl) return;
    const rect = btnEl.getBoundingClientRect();
    setPortalMenu({ open:true, anchorRect:{ left:rect.left, top:rect.top, width:rect.width, height:rect.height }, customerId, chalanId });
  }
  function closePortalMenu() { setPortalMenu({ open:false, anchorRect:null, customerId:null, chalanId:null }); }

  function exportAllFilteredCSV() {
    const rows = [["ID","Name","Phone","Amount"]];
    filtered.forEach(r => rows.push([r.id, r.name, r.phone, r.amount]));
    const csv = rows.map(rr => rr.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "customers.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">কাস্টমারস</h1>
            <p className="text-sm text-gray-500 mt-1">কোনো কাস্টমারের আইডি ক্লিক করলে সম্পূর্ণ রিপোর্ট পেজে যাবে</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input value={query} onChange={(e)=>{setQuery(e.target.value); setPage(1);}} placeholder="নাম, ফোন, আইডি, ঠিকানা..." className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
            </div>

            <button onClick={()=>alert("নতুন কাস্টমার")} className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm"><Plus size={16}/> নতুন</button>

            <button onClick={exportAllFilteredCSV} className="inline-flex items-center gap-2 px-3 py-2 border rounded-md bg-white"><DownloadCloud size={16}/> Export</button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button onClick={()=>{setFilter("all"); setPage(1);}} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>সব</button>
          <button onClick={()=>{setFilter("overdue"); setPage(1);}} className={`px-3 py-1 rounded ${filter==='overdue' ? 'bg-amber-500 text-white' : 'bg-white border'}`}>Overdue</button>
          <button onClick={()=>{setFilter("unpaid"); setPage(1);}} className={`px-3 py-1 rounded ${filter==='unpaid' ? 'bg-red-500 text-white' : 'bg-white border'}`}>Unpaid</button>
          <div className="ml-auto text-sm text-gray-600">মোট কাস্টমার: <span className="font-medium text-gray-800">{filtered.length}</span></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="hidden md:grid grid-cols-12 items-center bg-emerald-600 text-white p-3 text-sm font-medium">
            <div className="col-span-2">আইডি</div>
            <div className="col-span-4">নাম / ঠিকানা / ফোন</div>
            <div className="col-span-2">ডেলিভারি</div>
            <div className="col-span-2">টাকা</div>
            <div className="col-span-2">অ্যাকশন</div>
          </div>

          <div>
            {pageData.map(c => (
              <div key={c.id} className="grid grid-cols-12 border-b last:border-b-0">
                <div className="col-span-12 md:col-span-2 p-4 flex items-center gap-3">
                  <button onClick={()=>navigate(`/customers/${c.id}`)} className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-md bg-emerald-50 flex items-center justify-center shadow-sm">
                      <div className="text-xl font-bold text-emerald-700">{c.id}</div>
                    </div>
                  </button>
                  <div className="md:hidden">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.phone}</div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 p-4">
                  <div className="hidden md:block">
                    <div className="text-sm text-gray-600">নাম</div>
                    <div className="font-medium text-gray-800 mb-1">{c.name}</div>
                    <div className="text-xs text-gray-500 mb-1">{c.address}</div>
                    <div className="text-xs text-gray-500">{c.phone}</div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-2 p-4">
                  <div className="text-sm text-gray-600">মোট প্যাকেট</div>
                  <div className="font-medium text-gray-800">{c.totalPackets}</div>
                </div>

                <div className="col-span-12 md:col-span-2 p-4">
                  <div className="text-sm text-gray-600">মোট মূল্য</div>
                  <div className="font-medium text-gray-800">৳ {c.amount.toLocaleString("bn-BD")}</div>
                </div>

                <div className="col-span-12 md:col-span-2 p-4 flex items-center justify-end">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded">নোট</button>
                    <button className="px-3 py-1 border rounded">এডজাস্ট</button>
                    <ThreeDotButton onOpen={(btnEl)=>openPortalMenuFor(btnEl, c.id, c.chalans[0]?.chalanId)} />
                  </div>
                </div>
              </div>
            ))}

            {pageData.length === 0 && <div className="p-8 text-center text-gray-500">কোনো কাস্টমার মেলে নি</div>}
          </div>

          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">পেজ: {page} / {totalPages}</div>
            <div className="flex items-center gap-2">
              <button onClick={()=>goto(-1)} className="p-2 rounded border disabled:opacity-50" disabled={page===1}><ChevronLeft size={16}/></button>
              <div className="px-3 text-sm">গ্রাহক প্রদর্শিত: {pageData.length}</div>
              <button onClick={()=>goto(1)} className="p-2 rounded border disabled:opacity-50" disabled={page===totalPages}><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>

        {/* PortalMenu */}
        <PortalMenu open={portalMenu.open} anchorRect={portalMenu.anchorRect} onClose={closePortalMenu}>
          <div className="three-dot-menu">
            {(() => {
              const cust = customers.find(c => c.id === portalMenu.customerId);
              const ch = cust?.chalans.find(x => x.chalanId === portalMenu.chalanId);
              if (!cust || !ch) return <div className="p-3 text-sm text-gray-600">Invalid</div>;
              return (
                <>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ const html = buildPrintableChalanHTML(cust,ch); const w = window.open("","_blank","width=900,height=800"); if(!w){alert("Pop-up blocked"); return;} w.document.write(html); w.document.close(); closePortalMenu(); }}>
                    Print Chalan
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ navigate(`/customers/${cust.id}`); closePortalMenu(); }}>
                    Open customer report
                  </button>
                </>
              );
            })()}
          </div>
        </PortalMenu>
      </div>
    </div>
  );
}
