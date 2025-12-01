// src/utils/printBuilders.js
export function buildPrintableChalanHTML(customer, chalan) {
  const header = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div>
        <div style="font-size:20px;color:#047857;font-weight:700">${customer.name}</div>
        <div style="font-size:13px;color:#333">${customer.address} • ${customer.phone}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700">Chalan #${chalan.chalanId}</div>
        <div style="font-size:13px;color:#666">Date: ${chalan.createdAt || "-"}</div>
      </div>
    </div>
  `;
  const table = `
    <table style="width:100%;border-collapse:collapse;margin-top:8px">
      <thead>
        <tr style="background:#047857;color:white">
          <th style="padding:8px;border:1px solid #ddd">গ্রেড</th>
          <th style="padding:8px;border:1px solid #ddd">পরিমান</th>
          <th style="padding:8px;border:1px solid #ddd">রেট</th>
          <th style="padding:8px;border:1px solid #ddd">মোটা মূল্য</th>
          <th style="padding:8px;border:1px solid #ddd">ডিসকাউন্ট</th>
          <th style="padding:8px;border:1px solid #ddd">VAT</th>
          <th style="padding:8px;border:1px solid #ddd">সর্বমোট</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:8px;border:1px solid #ddd">${chalan.category}</td>
          <td style="padding:8px;border:1px solid #ddd">${chalan.qty}</td>
          <td style="padding:8px;border:1px solid #ddd">৳ ${chalan.rate}</td>
          <td style="padding:8px;border:1px solid #ddd">৳ ${chalan.value.toLocaleString("bn-BD")}</td>
          <td style="padding:8px;border:1px solid #ddd">৳ ${chalan.discount || 0}</td>
          <td style="padding:8px;border:1px solid #ddd">৳ ${chalan.vat || 0}</td>
          <td style="padding:8px;border:1px solid #ddd">৳ ${chalan.total.toLocaleString("bn-BD")}</td>
        </tr>
      </tbody>
    </table>
  `;
  const summary = `
    <div style="margin-top:12px;padding:10px;border:1px solid #d1fae5;background:#ecfdf5">
      <div>নগদ: ৳ ${chalan.paid.toLocaleString("bn-BD")}</div>
      <div>বাকি: ৳ ${chalan.due.toLocaleString("bn-BD")}</div>
      <div>ডেলিভারি: ${chalan.deliveryDay || "-"}</div>
    </div>
  `;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Chalan ${chalan.chalanId}</title></head><body style="font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111">${header}${table}${summary}<script>setTimeout(()=>{window.print();},300)</script></body></html>`;
}

export function buildPrintableCustomerHTML(customer) {
  const header = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div><div style="font-size:22px;color:#047857;font-weight:700">${customer.name} (#${customer.id})</div><div style="font-size:13px;color:#333">${customer.address} • ${customer.phone}</div></div><div style="text-align:right"><div style="font-weight:700">মোট চালান: ${customer.chalans.length}</div></div></div>`;
  const rows = customer.chalans.map((r) => `<tr>
    <td style="padding:8px;border:1px solid #ddd">${r.chalanId}</td>
    <td style="padding:8px;border:1px solid #ddd">${r.address}</td>
    <td style="padding:8px;border:1px solid #ddd">${r.category}</td>
    <td style="padding:8px;border:1px solid #ddd">${r.qty}</td>
    <td style="padding:8px;border:1px solid #ddd">৳ ${r.rate}</td>
    <td style="padding:8px;border:1px solid #ddd">৳ ${r.total.toLocaleString("bn-BD")}</td>
    <td style="padding:8px;border:1px solid #ddd">৳ ${r.paid.toLocaleString("bn-BD")}</td>
    <td style="padding:8px;border:1px solid #ddd">৳ ${r.due.toLocaleString("bn-BD")}</td>
    <td style="padding:8px;border:1px solid #ddd">${r.deliveryDay || "-"}</td>
  </tr>`).join("");
  const table = `<table style="width:100%;border-collapse:collapse"><thead><tr style="background:#047857;color:white"><th style="padding:8px;border:1px solid #ddd">#</th><th style="padding:8px;border:1px solid #ddd">ঠিকানা</th><th style="padding:8px;border:1px solid #ddd">গ্রেড</th><th style="padding:8px;border:1px solid #ddd">পরিমান</th><th style="padding:8px;border:1px solid #ddd">রেট</th><th style="padding:8px;border:1px solid #ddd">সর্বমোট</th><th style="padding:8px;border:1px solid #ddd">নগদ</th><th style="padding:8px;border:1px solid #ddd">বাকি</th><th style="padding:8px;border:1px solid #ddd">ডেলিভারি</th></tr></thead><tbody>${rows}</tbody></table>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Customer ${customer.id} Report</title></head><body style="font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111">${header}${table}<script>setTimeout(()=>{window.print();},300)</script></body></html>`;
}

export default buildPrintableChalanHTML;
