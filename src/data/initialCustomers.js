// src/data/initialCustomers.js
const INITIAL_CUSTOMERS = Array.from({ length: 12 }).map((_, i) => {
  const names = ["রাকিব", "রাজিব", "এমদাদুল", "হাফিজুর", "আয়ানাল", "সুমন"];
  const addresses = ["বগলাগাড়ি", "বাগদা", "পলু পাড়া", "কাপ্তানবাজার", "ধানমন্ডি"];
  const phones = ["0000222551", "0000000662", "00000055557", "00009998852", "00000022228", "00011223344"];
  const packets = [2000, 300, 100, 200, 50, 120];
  const amounts = [20800, 1200, 1050, 2100, 325, 7800];
  const idx = i % names.length;

  const chalans = Array.from({ length: (i % 4) + 1 }).map((__, j) => {
    const value = amounts[idx];
    const discount = Math.round(value * 0.02 * j);
    const vat = Math.round(value * 0.0);
    const total = value - discount + vat;
    const paid = Math.round(total * (j === 0 ? 0.8 : 1));
    const due = total - paid;
    return {
      chalanId: 3843 + j + i * 10,
      address: addresses[(i + j) % addresses.length],
      category: `${(j % 3) + 1} নং`,
      qty: packets[idx],
      rate: (10.5).toFixed(1),
      value,
      discount,
      vat,
      total,
      paid,
      due,
      returnCount: 0,
      deliveryDay: j % 2 === 0 ? `2025-08-${String((j % 28) + 1).padStart(2, "0")}` : null,
      deliveryNote: j % 2 === 0 ? "ডেলিভারির সময় খোলা রাখবেন" : "",
      createdAt: `2025-08-${String(((i + j) % 28) + 1).padStart(2, "0")}`,
      serial: 2425 + j,
    };
  });

  return {
    id: 2952 - i,
    name: names[idx],
    address: addresses[i % addresses.length],
    phone: phones[idx % phones.length],
    totalPackets: packets[idx % packets.length],
    delivered: packets[idx % packets.length],
    amount: amounts[idx % amounts.length],
    lastDue: i % 3 === 0 ? `2025-08-${String((i % 28) + 1).padStart(2, "0")}` : null,
    notes: i % 4 === 0 ? "বিক্রেতা নোট আছে" : "",
    chalans,
  };
});

export default INITIAL_CUSTOMERS;
