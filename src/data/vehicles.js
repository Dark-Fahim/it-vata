// src/data/vehicles.js
export const VEHICLES = [
  { id: "v1", name: "বেকে", icon: "🚜" },
  { id: "v2", name: "মেসি", icon: "🚜" },
  { id: "v3", name: "ট্র্যাক্টর-৩", icon: "🚜" },
];

export const TRANSACTIONS = {
  v1: [
    { id: 1, title: "চালান বিক্রি #3843", type: "income", amount: 12000, paid: 12000, due: 0, date: "2025-08-05", note: "" },
    { id: 2, title: "পেট্রোল", type: "expense", amount: 1500, paid: 1500, due: 0, date: "2025-08-06", note: "ড্রাইভার" },
  ],
  v2: [
    { id: 3, title: "চালান বিক্রি #3848", type: "income", amount: 22000, paid: 22000, due: 0, date: "2025-08-08", note: "" },
  ],
  v3: [],
};
