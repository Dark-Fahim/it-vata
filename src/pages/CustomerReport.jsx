// src/pages/CustomerReport.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DownloadCloud, Printer } from "lucide-react";
import PortalMenu from "../components/PortalMenu";
import ThreeDotButton from "../components/ThreeDotButton";
import Modal from "../components/Modal";
import DeliveryModalContent from "../ui/DeliveryModalContent"; // we'll add small helper files below
import ChalanDetailsModal from "../ui/ChalanDetailsModal";
import buildPrintableChalanHTML from "../utils/printBuilders";
import buildPrintableCustomerHTML from "../utils/printBuilders";

export default function CustomerReport({ customers, updateDeliveryDate, exportCustomerCSV, exportCustomerPDF, printChalan }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = customers.find(c => String(c.id) === String(id));

  const [portalMenu, setPortalMenu] = useState({ open:false, anchorRect:null, customerId:null, chalanId:null });
  const [showDeliveryModal, setShowDeliveryModal] = useState(null);
  const [showChalanModal, setShowChalanModal] = useState(null);

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-4">Customer not found.</div>
          <button onClick={()=>navigate(-1)} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>
    );
  }

  function openPortalMenuFor(btnEl, customerId, chalanId) {
    if (!btnEl) return;
    const rect = btnEl.getBoundingClientRect();
    setPortalMenu({ open:true, anchorRect:{ left:rect.left, top:rect.top, width:rect.width, height:rect.height }, customerId, chalanId });
  }
  function closePortalMenu() { setPortalMenu({ open:false, anchorRect:null, customerId:null, chalanId:null }); }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-3xl font-bold text-emerald-700">{customer.id}</div>
            <div className="text-xl font-medium">{customer.name}</div>
            <div className="text-sm text-gray-500">{customer.address} • {customer.phone}</div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={()=>navigate(-1)} className="px-4 py-2 border rounded">Back</button>
            <button onClick={()=>exportCustomerCSV(customer)} className="px-3 py-2 border rounded inline-flex items-center gap-2"><DownloadCloud size={16}/> Export CSV</button>
            <button onClick={()=>exportCustomerPDF(customer)} className="px-3 py-2 bg-emerald-600 text-white rounded inline-flex items-center gap-2"><Printer size={16}/> Print (PDF)</button>
          </div>
        </div>

        {/* summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">মোট টুট ক্রয়</div>
              <div className="text-lg font-semibold">{customer.totalPackets}</div>
              <div className="text-xs text-gray-500 mt-1">ডেলিভারি: {customer.delivered}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">মোট মূল্য</div>
              <div className="text-lg font-semibold">৳ {customer.amount.toLocaleString("bn-BD")}</div>
              <div className="text-xs text-gray-500 mt-1">পরিশোধ: ৳ {customer.amount.toLocaleString("bn-BD")}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">পরিশোধের তারিখ</div>
              <div className="text-lg font-semibold">{customer.lastDue || "-"}</div>
              <div className="text-xs text-gray-500 mt-1">সিরিয়াল: 2425</div>
            </div>
          </div>

          <div>
            <div className="h-full border rounded p-4 flex flex-col justify-between">
              <div>
                <div className="text-sm text-gray-600">নোট</div>
                <div className="mt-2 text-sm text-gray-800">{customer.notes || "-"}</div>
              </div>
              <div className="mt-4 text-sm text-gray-600">মোট চালান: <span className="font-medium text-gray-800">{customer.chalans.length}</span></div>
            </div>
          </div>
        </div>

        {/* chalan table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">ঠিকানা</th>
                <th className="p-3 text-left">গ্রেড</th>
                <th className="p-3 text-left">পরিমান</th>
                <th className="p-3 text-left">রেট</th>
                <th className="p-3 text-left">মোটা মূল্য</th>
                <th className="p-3 text-left">ডিসকাউন্ট</th>
                <th className="p-3 text-left">VAT</th>
                <th className="p-3 text-left">সর্বমোট</th>
                <th className="p-3 text-left">নগদ</th>
                <th className="p-3 text-left">বাকি</th>
                <th className="p-3 text-left">ডেলিভারি দিন</th>
                <th className="p-3 text-left">রিটার্ন</th>
                <th className="p-3 text-left">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {customer.chalans.map(r => (
                <tr key={r.chalanId} className="border-b">
                  <td className="p-3">{r.chalanId}</td>
                  <td className="p-3">{r.address}</td>
                  <td className="p-3">{r.category}</td>
                  <td className="p-3">{r.qty}</td>
                  <td className="p-3">৳ {r.rate}</td>
                  <td className="p-3">৳ {r.value.toLocaleString("bn-BD")}</td>
                  <td className="p-3">৳ {r.discount || 0}</td>
                  <td className="p-3">৳ {r.vat || 0}</td>
                  <td className="p-3">৳ {r.total.toLocaleString("bn-BD")}</td>
                  <td className="p-3 text-green-700">৳ {r.paid.toLocaleString("bn-BD")}</td>
                  <td className="p-3 text-red-500">৳ {r.due.toLocaleString("bn-BD")}</td>

                  <td className="p-3">
                    <button onClick={()=>setShowDeliveryModal({ customerId: customer.id, chalanId: r.chalanId, dateEditableValue: r.deliveryDay || "" })} className="text-sm px-2 py-1 border rounded bg-white">{r.deliveryDay || "নির্ধারিত নেই"}</button>
                  </td>

                  <td className="p-3">{r.returnCount}</td>

                  <td className="p-3">
                    <ThreeDotButton onOpen={(btnEl)=>openPortalMenuFor(btnEl, customer.id, r.chalanId)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ printChalan(cust,ch); closePortalMenu(); }}>
                    Print Chalan
                  </button>

                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ setShowDeliveryModal({ customerId: cust.id, chalanId: ch.chalanId, dateEditableValue: ch.deliveryDay || "" }); closePortalMenu(); }}>
                    Delivery দিন দেখাও
                  </button>

                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ setShowChalanModal({ customerId: cust.id, chalanId: ch.chalanId }); closePortalMenu(); }}>
                    Chalan বিস্তারিত
                  </button>

                  <hr />

                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ exportCustomerCSV(cust); closePortalMenu(); }}>
                    Export customer CSV
                  </button>
                </>
              );
            })()}
          </div>
        </PortalMenu>

        {/* Delivery modal */}
        {showDeliveryModal && (
          <Modal onClose={()=>setShowDeliveryModal(null)}>
            <DeliveryModalContent customers={customers} payload={showDeliveryModal} onClose={()=>setShowDeliveryModal(null)} onSave={(cid, chid, nd)=>{ updateDeliveryDate(cid, chid, nd); setShowDeliveryModal(null); }} />
          </Modal>
        )}

        {/* Chalan details modal */}
        {showChalanModal && (
          <Modal onClose={()=>setShowChalanModal(null)}>
            <ChalanDetailsModal customers={customers} payload={showChalanModal} onClose={()=>setShowChalanModal(null)} onPrint={(c,ch)=>{ printChalan(c,ch); }} />
          </Modal>
        )}
      </div>
    </div>
  );
}
