// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import INITIAL_CUSTOMERS from "./data/initialCustomers";
import CustomerList from "./pages/CustomerList";
import CustomerReport from "./pages/CustomerReport";
import { buildPrintableCustomerHTML, buildPrintableChalanHTML } from "./utils/printBuilders";
import SalesByAreaReport from "./pages/SalesByAreaReport";
import TaskManager from "./pages/TaskManager";
import VehicleAccounts from "./pages/VehicleAccounts";
import VehicleDetails from "./pages/VehicleDetail";
import RentList from "./pages/RentList";
import CreditList from "./pages/CreditList";
import CreditDetail from "./pages/CreditDetail";

/**
 * App.jsx (updated)
 *
 * - Redirect root "/" -> "/customers"
 * - Provide CustomerList with customers and setter so it can add/edit/remove
 * - Provide CustomerReport with handlers: updateDeliveryDate, export CSV/PDF, printChalan
 * - Add NotFound fallback route
 *
 * Note: For persistence replace setCustomers(...) with API calls (POST/PUT) and refresh from backend.
 */

export default function App() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);

  // update delivery date for a specific customer's chalan
  function updateDeliveryDate(customerId, chalanId, newDate) {
    setCustomers(prev =>
      prev.map(c =>
        c.id === customerId
          ? { ...c, chalans: c.chalans.map(ch => (ch.chalanId === chalanId ? { ...ch, deliveryDay: newDate } : ch)) }
          : c
      )
    );

    // TODO: call backend API here to persist change
    // fetch(`/api/customers/${customerId}/chalans/${chalanId}`, { method: 'PUT', body: JSON.stringify({ deliveryDay: newDate }) })
  }

  // export single customer chalans to CSV
  function exportCustomerCSV(customer) {
    const rows = [
      ["Chalan ID", "Address", "Grade", "Qty", "Rate", "Value", "Discount", "VAT", "Total", "Paid", "Due", "Delivery Day"]
    ];
    customer.chalans.forEach((r) =>
      rows.push([r.chalanId, r.address, r.category, r.qty, r.rate, r.value, r.discount || 0, r.vat || 0, r.total, r.paid, r.due, r.deliveryDay || ""])
    );
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer_${customer.id}_chalans.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // open a print window with formatted HTML for full-customer PDF/print
  function exportCustomerPDF(customer) {
    const html = buildPrintableCustomerHTML(customer);
    const w = window.open("", "_blank", "width=1000,height=900");
    if (!w) {
      alert("Pop-up blocked. Allow popups for printing.");
      return;
    }
    w.document.write(html);
    w.document.close();
  }

  // print a single chalan (opens print window)
  function printChalan(customer, chalan) {
    const html = buildPrintableChalanHTML(customer, chalan);
    const w = window.open("", "_blank", "width=900,height=800");
    if (!w) {
      alert("Pop-up blocked. Allow popups for printing.");
      return;
    }
    w.document.write(html);
    w.document.close();
  }

  // helper to add/update/delete customers from CustomerList (list page can call these)
  function addCustomer(newCustomer) {
    // newCustomer should be an object compatible with INITIAL_CUSTOMERS entry
    setCustomers(prev => [newCustomer, ...prev]);
    // TODO: persist to backend
  }

  function updateCustomer(updatedCustomer) {
    setCustomers(prev => prev.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c)));
    // TODO: persist to backend
  }

  function deleteCustomer(customerId) {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    // TODO: persist to backend
  }

  return (
    <Router>
      <Routes>
        {/* redirect root to customers list */}
        <Route path="/" element={<Navigate to="/customers" replace />} />

        {/* customers list page */}
        <Route
          path="/customers"
          element={
            <CustomerList
              customers={customers}
              addCustomer={addCustomer}
              updateCustomer={updateCustomer}
              deleteCustomer={deleteCustomer}
            />
          }
        />

        {/* area-sales report (separate page) */}
        <Route path="/reports/area-sales" element={<SalesByAreaReport />} />

        {/* vehicle accounts page */}
        <Route path="/vehicles" element={<VehicleAccounts />} />
        <Route path="/rent-list" element={<RentList />} />
        <Route path="/credits" element={<CreditList />} />
        <Route path="/credits/:id" element={<CreditDetail />} />

        {/* tasks page */}
        <Route path="/tasks" element={<TaskManager />} />

        <Route path="/vehicles/:id" element={<VehicleDetails />} />

        {/* customer detail / report (customer id in url) */}
        
        <Route
          path="/customers/:id"
          element={
            <CustomerReport
              customers={customers}
              updateDeliveryDate={updateDeliveryDate}
              exportCustomerCSV={exportCustomerCSV}
              exportCustomerPDF={exportCustomerPDF}
              printChalan={printChalan}
              // optionally pass updateCustomer/deleteCustomer if report can edit customer-level fields
              updateCustomer={updateCustomer}
            />
          }
        />

        {/* fallback */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center p-6">Page not found</div>} />
      </Routes>
    </Router>
  );
}
