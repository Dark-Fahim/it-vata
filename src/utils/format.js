// src/utils/format.js
export function fmtMoney(n) {
  if (n === null || n === undefined) return "৳ 0";
  const nf = new Intl.NumberFormat("bn-BD");
  return "৳ " + nf.format(Number(n) || 0);
}
