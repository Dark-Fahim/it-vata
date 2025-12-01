// src/pages/SalesByAreaReport.jsx
import React, { useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";


function makeSampleData() {
    const areas = [
        "Dhaka (City)",
        "Vattor Ashapash",
        "Bagda",
        "Gopalpur",
        "Polupara",
        "Boglagari",
        "Meji",
        "Belamari",
        "Rajnibari",
        "Chatalgari",
        "Raninagor",
        "Komdia",
    ];

    // simulate data (customers, chalans, units, sales)
    return areas.map((area, i) => {
        const customers = Math.max(1, Math.round(Math.random() * 1800) + (i === 0 ? 1574 : i * 2));
        const chalans = Math.max(1, Math.round(customers * (Math.random() * 1.6 + 0.5)));
        const units = Math.max(1000, Math.round(Math.random() * 40000) + i * 1000);
        const sales = Math.round(units * (Math.random() * 10 + 7)); // sample avg price
        return {
            area,
            customers,
            chalans,
            units,
            sales,
            idx: i + 1,
        };
    });
}

export default function SalesByAreaReport() {
    const all = useMemo(() => makeSampleData(), []);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const totalAreas = all.length;
    const totalUnits = all.reduce((s, r) => s + r.units, 0);
    const totalChalans = all.reduce((s, r) => s + r.chalans, 0);
    const totalSales = all.reduce((s, r) => s + r.sales, 0);

    // charts data (top N or all)
    const ordersData = all.map((d) => ({ name: d.area, value: d.chalans }));
    const salesData = all.map((d) => ({ name: d.area, value: d.sales }));

    // table pagination
    const totalPages = Math.max(1, Math.ceil(all.length / perPage));
    const tableData = all.slice((page - 1) * perPage, page * perPage);

    function exportCSV() {
        const rows = [["Area", "Customers", "Chalans", "Units", "Sales (৳)"]];
        all.forEach((r) => rows.push([r.area, r.customers, r.chalans, r.units, r.sales]));
        const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sales_by_area.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function handlePrint() {
        window.print();
    }

    const bnFormat = (num) => {
        if (typeof num !== "number") return num;
        return num.toLocaleString("bn-BD");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">এলাকা অনুযায়ী বিক্রির রিপোর্ট</h1>
                        <p className="text-sm text-gray-500 mt-1">এলাকা ভিত্তিক সারাংশ — চার্ট ও বিস্তারিত টেবিল</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="search"
                            placeholder="সার্চ এলাকা..."
                            className="hidden md:inline-block w-64 pl-3 pr-3 py-2 rounded-full    -gray-200 bg-white shadow-sm focus:outline-none"
                        />
                        <button onClick={exportCSV} className="px-3 py-2 bg-white   rounded text-sm shadow-sm">Export CSV</button>
                        <button onClick={handlePrint} className="px-3 py-2 bg-emerald-600 text-white rounded text-sm shadow-sm">Print</button>
                    </div>
                </div>



                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-sm   p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">সর্বোচ্চ বিক্রি করা এলাকা (চালান)</h3>
                                <p className="text-xs text-gray-500 mt-1">টপ এলাকা অনুযায়ী চালান সংখ্যা</p>
                            </div>
                            <div className="text-sm text-gray-600">মোট চালান: <span className="font-semibold">{bnFormat(totalChalans)}</span></div>
                        </div>
                        <div style={{ height: 380 }} className="w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ordersData} margin={{ top: 10, right: 20, left: 8, bottom: 80 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={70} />
                                    <YAxis />
                                    <Tooltip formatter={(val) => [val, "চালান"]} />
                                    <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm   p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">সর্বোচ্চ বিক্রি করা এলাকা (টাকা)</h3>
                                <p className="text-xs text-gray-500 mt-1">টপ এলাকা অনুযায়ী মোট বিক্রয়</p>
                            </div>
                            <div className="text-sm text-gray-600">মোট টাকা: <span className="font-semibold">৳ {bnFormat(totalSales)}</span></div>
                        </div>
                        <div style={{ height: 380 }} className="w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesData} margin={{ top: 10, right: 20, left: 8, bottom: 80 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={70} />
                                    <YAxis tickFormatter={(v) => (v >= 1000 ? (v / 1000) + 'k' : v)} />
                                    <Tooltip formatter={(val) => [`৳ ${val.toLocaleString('bn-BD')}`, "টাকা"]} />
                                    <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm  p-4">
                        <div className="text-sm text-gray-500">মোট এলাকা</div>
                        <div className="text-2xl font-semibold text-gray-800 mt-2">{totalAreas}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm  p-4">
                        <div className="text-sm text-gray-500">মোট ইউনিট বিক্রি</div>
                        <div className="text-2xl font-semibold text-emerald-700 mt-2">{bnFormat(totalUnits)}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm   p-4">
                        <div className="text-sm text-gray-500">মোট চালান</div>
                        <div className="text-2xl font-semibold text-gray-800 mt-2">{bnFormat(totalChalans)}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm   p-4">
                        <div className="text-sm text-gray-500">মোট বিক্রয়</div>
                        <div className="text-2xl font-semibold text-emerald-700 mt-2">৳ {bnFormat(totalSales)}</div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm  p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="text-md font-medium text-gray-800">এলাকা ভিত্তিক বিস্তারিত</h3>
                            <p className="text-xs text-gray-500">কাস্টমার, চালান, ইউনিট ও মোট টাকা</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600">রেকর্ড / পেজ:</label>
                            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="p-2   rounded">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-emerald-600 text-white">
                                    <th className="p-3 text-left">এলাকা</th>
                                    <th className="p-3 text-left">কাস্টমার</th>
                                    <th className="p-3 text-left">চালান</th>
                                    <th className="p-3 text-left">মোট ইউনিট</th>
                                    <th className="p-3 text-left">মোট টাকা</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tableData.map((r) => (
                                    <tr key={r.area} className=" -b">
                                        <td className="p-3">{r.area}</td>
                                        <td className="p-3">{bnFormat(r.customers)}</td>
                                        <td className="p-3">{bnFormat(r.chalans)}</td>
                                        <td className="p-3">{bnFormat(r.units)}</td>
                                        <td className="p-3">৳ {bnFormat(r.sales)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* table footer / pagination */}
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                        <div>মোট রেকর্ড: {totalAreas}</div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="px-3 py-1   rounded disabled:opacity-50"
                                disabled={page === 1}
                            >
                                Prev
                            </button>
                            <div>পৃষ্ঠা {page} / {totalPages}</div>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="px-3 py-1   rounded disabled:opacity-50"
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                    নোট: ডেটা স্যাম্পল; বাস্তব ডেটা ফেচ করতে চাইলে বলো, আমি `useEffect`+`fetch` উদাহরণ যোগ করে দেবো (pagination backend-supported হলে আরও অপটিমাইজেশন করা হবে)।
                </div>
            </div>
        </div>
    );
}
