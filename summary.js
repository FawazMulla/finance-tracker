export function monthlySummary(txs) {
  const map = {};
  txs.forEach(t => {
    const m = t.date.slice(0,7); // YYYY-MM
    map[m] = (map[m] || 0) + t.amount;
  });
  return map;
}
