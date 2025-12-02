// src/pages/CreditDetail.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PEOPLE } from "../data/people";
import { fmtMoney } from "../utils/format";
import { ArrowLeft } from "lucide-react";

/**
 * CreditDetail - আলাদা পেজ
 * - চরিত্রের সারসংক্ষেপ, quick actions, txn history placeholder
 */

export default function CreditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const person = PEOPLE.find(p => String(p.id) === String(id));

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-4">ব্যক্তি পাওয়া যায়নি</div>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded text-sm mr-3 inline-flex items-center gap-2"><ArrowLeft size={16}/> Back</button>
            <h1 className="text-2xl font-semibold">{person.name}</h1>
            <div className="text-xs text-gray-500 mt-1">{person.loc} • {person.phone}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-800 px-3 py-2 rounded font-semibold">{fmtMoney(person.owed)}</div>
            <button className="px-3 py-2 bg-emerald-600 text-white rounded">নতুন লেনদেন</button>
            <button className="px-3 py-2 border rounded">ঋণ পরিশোধ</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* profile card */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-sm text-gray-500 mb-2">ব্যক্তিগত তথ্য</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400">আইডি</div>
                  <div className="font-medium">{person.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">ফোন</div>
                  <div className="font-medium">{person.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">ঠিকানা</div>
                  <div className="font-medium">{person.loc}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">নোট</div>
                  <div className="font-medium">{person.notes || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* transactions / history placeholder */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-sm text-gray-500 mb-2">লেনদেন ইতিহাস</div>
              <div className="py-12 text-center text-gray-400">
                <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 7v5l3 3" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                কোনো লেনদেন ইতিহাস পাওয়া যায়নি
              </div>
            </div>
          </div>

          {/* right column summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-500">আর্থিক সারাংশ</div>
              <div className="mt-3">
                <div className="text-xs text-gray-400">মোট ঋণ</div>
                <div className="text-2xl font-semibold text-emerald-700 mt-1">{fmtMoney(person.owed)}</div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-gray-400">পরিশোধিত</div>
                <div className="text-lg font-semibold text-green-600">৳ 0</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-500">দ্রুত পদক্ষেপ</div>
              <div className="mt-3 flex flex-col gap-3">
                <button className="px-3 py-2 bg-sky-600 text-white rounded">+ নতুন লেনদেন</button>
                <button className="px-3 py-2 bg-emerald-600 text-white rounded">ঋণ পরিশোধ</button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
