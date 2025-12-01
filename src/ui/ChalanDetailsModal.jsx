// src/ui/ChalanDetailsModal.jsx
import React from "react";
import { Printer } from "lucide-react";

export default function ChalanDetailsModal({ customers, payload, onClose, onPrint }) {
  const customer = customers.find((c) => c.id === payload.customerId);
  const chalan = customer?.chalans.find((ch) => ch.chalanId === payload.chalanId);
  if (!customer || !chalan) return null;

  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-lg font-bold">চালান বিস্তারিত — #{chalan.chalanId}</div>
          <div className="text-sm text-gray-500">{customer.name} • {customer.phone}</div>
          <div className="text-xs text-gray-400">Serial: {chalan.serial} • Created: {chalan.createdAt}</div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full border bg-white">X</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">ঠিকানা</div>
          <div className="font-medium">{chalan.address}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">গ্রেড</div>
          <div className="font-medium">{chalan.category}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">পরিমান</div>
          <div className="font-medium">{chalan.qty}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">রেট</div>
          <div className="font-medium">৳ {chalan.rate}</div>
        </div>
      </div>

      <div className="mb-4 p-4 border rounded bg-green-50">
        <div className="text-sm text-gray-600">মূল তথ্য</div>
        <div className="text-2xl font-bold text-emerald-700">৳ {chalan.total.toLocaleString("bn-BD")}</div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>মোট মূল্য: <span className="font-medium">৳ {chalan.value.toLocaleString("bn-BD")}</span></div>
          <div>ডিসকাউন্ট: <span className="font-medium">৳ {chalan.discount || 0}</span></div>
          <div>VAT: <span className="font-medium">৳ {chalan.vat || 0}</span></div>
          <div>নগদ: <span className="font-medium">৳ {chalan.paid.toLocaleString("bn-BD")}</span></div>
          <div>বাকি: <span className="font-medium text-red-500">৳ {chalan.due.toLocaleString("bn-BD")}</span></div>
          <div>রিটার্ন: <span className="font-medium">{chalan.returnCount}</span></div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={()=>onPrint(customer, chalan)} className="px-3 py-2 border rounded flex items-center gap-2"><Printer size={14}/> Print Chalan</button>
        <button onClick={onClose} className="px-3 py-2 bg-emerald-600 text-white rounded">Close</button>
      </div>
    </div>
  );
}
