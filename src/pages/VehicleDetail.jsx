import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Wallet, TrendingDown, Banknote, 
  NotebookPen, History, BookOpen, Printer, Download 
} from "lucide-react";

// ---- ১. ডামি ডেটা (Mock Data) ----
const MOCK_TRANSACTIONS = [
  { id: 1, type: "income", desc: "রাবিশের টিপ ১ টি", amount: 5000, paid: 5000, date: "2025-08-01" },
  { id: 2, type: "income", desc: "বালুর টিপ ৩ টা", amount: 12000, paid: 10000, date: "2025-08-02" }, // 2000 due
  { id: 3, type: "expense", desc: "ডিজেল ৫০ লিটার", amount: 5500, paid: 5500, date: "2025-08-03" },
  { id: 4, type: "expense", desc: "ড্রাইভার বেতন (অগ্রিম)", amount: 2000, paid: 2000, date: "2025-08-04" },
  { id: 5, type: "income", desc: "লোকাল ট্রিপ", amount: 3000, paid: 0, date: "2025-08-05" }, // 3000 due
];

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("income");

  // ---- মেনু আইটেম কনফিগারেশন ----
  const menuItems = [
    { id: "income", label: "আয়", icon: <Wallet size={20} />, color: "bg-emerald-600", text: "text-emerald-600", lightBg: "bg-emerald-50" },
    { id: "expense", label: "ব্যয়", icon: <TrendingDown size={20} />, color: "bg-rose-600", text: "text-rose-600", lightBg: "bg-rose-50" },
    { id: "cash", label: "ক্যাশ", icon: <Banknote size={20} />, color: "bg-blue-600", text: "text-blue-600", lightBg: "bg-blue-50" },
    { id: "due", label: "বাকি", icon: <NotebookPen size={20} />, color: "bg-orange-500", text: "text-orange-500", lightBg: "bg-orange-50" },
    { id: "history", label: "হিস্ট্রি", icon: <History size={20} />, color: "bg-gray-600", text: "text-gray-600", lightBg: "bg-gray-50" },
    { id: "ledger", label: "খতিয়ান", icon: <BookOpen size={20} />, color: "bg-indigo-600", text: "text-indigo-600", lightBg: "bg-indigo-50" },
  ];

  // ---- মূল রেন্ডারিং ফাংশন ----
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
      
      {/* Top Navbar */}
      <div className="bg-white shadow-sm border-b h-14 flex items-center px-4 justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">গাড়ি / বিবরণ (ID: {id})</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs bg-gray-100 px-2 py-1 rounded border text-gray-500">সিজন: ২৪-২৫</span>
            <button className="p-2 hover:bg-gray-100 rounded text-gray-500"><Printer size={18}/></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-[70px] md:w-64 bg-white border-r flex flex-col py-4 gap-2 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] overflow-y-auto shrink-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-3 px-3 py-3 mx-2 rounded-lg transition-all duration-200 group
                ${activeTab === item.id 
                  ? `${item.color} text-white shadow-md` 
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <div className={`p-1 rounded ${activeTab !== item.id ? "bg-gray-100 group-hover:bg-white" : ""}`}>
                {item.icon}
              </div>
              <span className="font-semibold text-sm hidden md:block">{item.label}</span>
              {/* Active Indicator Strip */}
              {activeTab === item.id && <div className="absolute left-0 top-2 bottom-2 w-1 bg-white/30 rounded-r"></div>}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 bg-slate-50 relative">
          <div className="max-w-6xl mx-auto min-h-full">
            {activeTab === "income" && <IncomeView />}
            {activeTab === "expense" && <ExpenseView />}
            {activeTab === "cash" && <CashView />}
            {activeTab === "due" && <DueView />}
            {activeTab === "history" && <HistoryView />}
            {activeTab === "ledger" && <LedgerView />}
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// ১. আয় (Income) View
// =========================================================================
function IncomeView() {
  const [form, setForm] = useState({ desc: "", amount: "", received: "" });
  const due = (parseFloat(form.amount) || 0) - (parseFloat(form.received) || 0);

  const data = MOCK_TRANSACTIONS.filter(t => t.type === 'income');
  const totalIncome = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
           <span className="bg-emerald-600 text-white px-4 py-1.5 rounded shadow-sm text-sm font-bold">নতুন আয়</span>
           <span className="bg-white text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded shadow-sm text-sm font-bold">
             মোট আয়: ৳ {totalIncome.toLocaleString()}
           </span>
        </div>
        <div className="flex gap-2">
            <input type="month" className="input-field w-auto" />
            <input type="date" className="input-field w-auto" />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-100/50">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="label">আয়ের বিবরণ</label>
            <input 
              placeholder="ট্রিপের নাম বা বিবরণ..." 
              className="input-field" 
              value={form.desc} onChange={e=>setForm({...form, desc: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label text-orange-500">ভাড়া (টাকা)</label>
            <input type="number" className="input-field text-right font-semibold" 
               value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label text-emerald-600">পেলাম</label>
            <input type="number" className="input-field text-right font-semibold" 
               value={form.received} onChange={e=>setForm({...form, received: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label text-red-500">বাকি</label>
            <input value={due} readOnly className="input-field bg-gray-100 text-right text-red-500 font-bold" />
          </div>
          <div className="md:col-span-1">
             <button className="btn-primary bg-emerald-600 hover:bg-emerald-700 w-full h-[42px]">সেভ</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-emerald-600 text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-3">তারিখ</th>
              <th className="px-6 py-3">বিবরণ</th>
              <th className="px-6 py-3 text-right">ভাড়া</th>
              <th className="px-6 py-3 text-right">পেয়েছি</th>
              <th className="px-6 py-3 text-right">বাকি</th>
              <th className="px-6 py-3 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-emerald-50/50 transition">
                <td className="px-6 py-3 text-gray-500">{row.date}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{row.desc}</td>
                <td className="px-6 py-3 text-right">৳ {row.amount}</td>
                <td className="px-6 py-3 text-right text-emerald-600">৳ {row.paid}</td>
                <td className="px-6 py-3 text-right text-red-500 font-bold">{row.amount - row.paid > 0 ? `৳ ${row.amount - row.paid}` : '-'}</td>
                <td className="px-6 py-3 text-center"><button className="text-gray-400 hover:text-red-500">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================================
// ২. ব্যয় (Expense) View
// =========================================================================
function ExpenseView() {
  const [form, setForm] = useState({ desc: "", amount: "" });
  const data = MOCK_TRANSACTIONS.filter(t => t.type === 'expense');
  const totalExpense = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
           <span className="bg-rose-600 text-white px-4 py-1.5 rounded shadow-sm text-sm font-bold">নতুন খরচ</span>
           <span className="bg-white text-rose-700 border border-rose-200 px-4 py-1.5 rounded shadow-sm text-sm font-bold">
             মোট ব্যয়: ৳ {totalExpense.toLocaleString()}
           </span>
        </div>
        <input type="date" className="input-field w-auto" />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-rose-100/50">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="label">খরচের বিবরণ</label>
            <input placeholder="তেল, পার্টস, বেতন..." className="input-field focus:ring-rose-500" 
              value={form.desc} onChange={e=>setForm({...form, desc: e.target.value})}
            />
          </div>
          <div className="md:col-span-3">
            <label className="label text-rose-600">টাকার পরিমাণ</label>
            <input type="number" className="input-field text-right font-semibold focus:ring-rose-500" 
              value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})}
            />
          </div>
          <div className="md:col-span-1">
             <button className="btn-primary bg-rose-600 hover:bg-rose-700 w-full h-[42px]">সেভ</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-rose-600 text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-3">তারিখ</th>
              <th className="px-6 py-3">বিবরণ</th>
              <th className="px-6 py-3 text-right">পরিমাণ</th>
              <th className="px-6 py-3 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-rose-50/50 transition">
                <td className="px-6 py-3 text-gray-500">{row.date}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{row.desc}</td>
                <td className="px-6 py-3 text-right font-bold text-gray-700">৳ {row.amount}</td>
                <td className="px-6 py-3 text-center"><button className="text-gray-400 hover:text-rose-500">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================================
// ৩. ক্যাশ (Cash) View
// =========================================================================
function CashView() {
  const income = MOCK_TRANSACTIONS.filter(t=>t.type==='income').reduce((s,t)=>s+t.paid,0);
  const expense = MOCK_TRANSACTIONS.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const netCash = income - expense;

  return (
    <div className="space-y-6 fade-in">
       <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
         <Banknote className="text-blue-600"/> ক্যাশ সামারি (Cashflow)
       </h2>

       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="text-emerald-100 text-sm font-medium">মোট জমা (Income)</div>
             <div className="text-3xl font-bold mt-2">৳ {income.toLocaleString()}</div>
             <Wallet className="absolute right-4 bottom-4 opacity-20" size={48} />
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="text-rose-100 text-sm font-medium">মোট খরচ (Expense)</div>
             <div className="text-3xl font-bold mt-2">৳ {expense.toLocaleString()}</div>
             <TrendingDown className="absolute right-4 bottom-4 opacity-20" size={48} />
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="text-blue-100 text-sm font-medium">হাতে আছে (Net Cash)</div>
             <div className="text-3xl font-bold mt-2">৳ {netCash.toLocaleString()}</div>
             <div className="text-xs text-blue-200 mt-1">সব খরচ বাদ দেওয়ার পর</div>
             <Banknote className="absolute right-4 bottom-4 opacity-20" size={48} />
          </div>
       </div>

       {/* Recent Cash Log */}
       <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="font-bold text-gray-600 mb-3 text-sm uppercase">সাম্প্রতিক লেনদেন</h3>
          <div className="space-y-2">
             {MOCK_TRANSACTIONS.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded border-b last:border-0 border-dashed">
                   <div>
                      <div className="font-medium text-gray-800">{t.desc}</div>
                      <div className="text-xs text-gray-400">{t.date}</div>
                   </div>
                   <div className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'} ৳ {t.type==='income' ? t.paid : t.amount}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}

// =========================================================================
// ৪. বাকি (Due) View
// =========================================================================
function DueView() {
  const dues = MOCK_TRANSACTIONS.filter(t => t.type === 'income' && (t.amount - t.paid) > 0);
  const totalDue = dues.reduce((s,t) => s + (t.amount - t.paid), 0);

  return (
    <div className="space-y-6 fade-in">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <NotebookPen className="text-orange-500"/> বাকি বা বকেয়া তালিকা
         </h2>
         <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-bold border border-orange-200">
            মোট বাকি: ৳ {totalDue.toLocaleString()}
         </div>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-orange-500 text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-3">তারিখ</th>
              <th className="px-6 py-3">পার্টি / বিবরণ</th>
              <th className="px-6 py-3 text-right">মোট ভাড়া</th>
              <th className="px-6 py-3 text-right">জমা দিয়েছে</th>
              <th className="px-6 py-3 text-right">বাকি আছে</th>
              <th className="px-6 py-3 text-center">তাগাদা</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dues.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">কোনো বাকি নেই! সব ক্লিয়ার।</td></tr>}
            {dues.map((row) => (
              <tr key={row.id} className="hover:bg-orange-50 transition">
                <td className="px-6 py-3 text-gray-500">{row.date}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{row.desc}</td>
                <td className="px-6 py-3 text-right text-gray-500">৳ {row.amount}</td>
                <td className="px-6 py-3 text-right text-emerald-600">৳ {row.paid}</td>
                <td className="px-6 py-3 text-right text-orange-600 font-bold bg-orange-50">৳ {row.amount - row.paid}</td>
                <td className="px-6 py-3 text-center">
                   <button className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-black">Collection</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
    </div>
  );
}

// =========================================================================
// ৫. হিস্ট্রি (History) View - All Combined
// =========================================================================
function HistoryView() {
  return (
    <div className="space-y-6 fade-in">
       <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
             <History className="text-gray-600"/> লেনদেন হিস্ট্রি (All)
          </h2>
          <button className="flex items-center gap-2 text-sm border px-3 py-1 rounded hover:bg-gray-50">
             <Download size={16}/> Download CSV
          </button>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-700 text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">তারিখ</th>
              <th className="px-6 py-3">বিবরণ</th>
              <th className="px-6 py-3 text-center">টাইপ</th>
              <th className="px-6 py-3 text-right">টাকা</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_TRANSACTIONS.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-gray-400">#{row.id}</td>
                <td className="px-6 py-3 text-gray-600">{row.date}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{row.desc}</td>
                <td className="px-6 py-3 text-center">
                   <span className={`px-2 py-0.5 rounded text-xs border ${
                      row.type === 'income' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                   }`}>
                      {row.type === 'income' ? 'আয়' : 'ব্যয়'}
                   </span>
                </td>
                <td className={`px-6 py-3 text-right font-bold ${row.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {row.type === 'income' ? '+' : '-'} ৳ {row.type === 'income' ? row.paid : row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
    </div>
  );
}

// =========================================================================
// ৬. খতিয়ান (Ledger) View
// =========================================================================
function LedgerView() {
   // Mock grouping
   const ledgers = [
      { name: "রাবিশ এন্টারপ্রাইজ", type: "party", balance: -5000 },
      { name: "ড্রাইভার (করিম)", type: "staff", balance: 2000 },
      { name: "মায়ের দোয়া ফিলিং স্টেশন", type: "vendor", balance: 15000 },
   ];

   return (
      <div className="space-y-6 fade-in">
         <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <BookOpen className="text-indigo-600"/> খতিয়ান / পার্টি লেজার
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ledgers.map((l, idx) => (
               <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer flex justify-between items-center group">
                  <div>
                     <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{l.type}</div>
                     <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600">{l.name}</h3>
                  </div>
                  <div className="text-right">
                     <div className="text-xs text-gray-400">ব্যালেন্স</div>
                     <div className="text-xl font-bold text-gray-700">৳ {l.balance.toLocaleString()}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

// ---- Utility Styling Classes (Embedded for ease) ----
// এই CSS ক্লাসগুলো Tailwind CSS এ ব্যবহার করা হচ্ছে। 
// ইনপুট ফিল্ড এবং বাটনের কমন স্টাইল নিচে ভেরিয়েবল আকারে নেই, সরাসরি ক্লাসে দেওয়া হয়েছে।
// input-field: "w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition"
// focus color is dynamic based on tab in logic above but hardcoded here for simplicity to emerald/rose.