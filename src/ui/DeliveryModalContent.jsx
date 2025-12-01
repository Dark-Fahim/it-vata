// src/ui/DeliveryModalContent.jsx
import React, { useState } from "react";

export default function DeliveryModalContent({ customers, payload, onClose, onSave }) {
  const customer = customers.find((c) => c.id === payload.customerId);
  const chalan = customer?.chalans.find((ch) => ch.chalanId === payload.chalanId);
  const [dateValue, setDateValue] = useState(payload.dateEditableValue || "");

  if (!customer || !chalan) return null;

  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-lg font-bold">Delivery দিন — চালান {chalan.chalanId}</div>
          <div className="text-sm text-gray-500">{customer.name} • {customer.phone}</div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full border bg-white">X</button>
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-600 block">ডেলিভারি তারিখ</label>
        <input type="date" value={dateValue} onChange={(e)=>setDateValue(e.target.value)} className="mt-1 p-2 border rounded w-full" />
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600">নোট</div>
        <div className="mt-1 p-3 border rounded bg-gray-50">{chalan.deliveryNote || "-"}</div>
      </div>

      <div className="flex gap-2">
        <button onClick={()=>onSave(customer.id, chalan.chalanId, dateValue || null)} className="px-3 py-2 bg-emerald-600 text-white rounded">Save</button>
        <button onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
      </div>
    </div>
  );
}
