export const formatCurrencyUSD = (price: number | null) => {
  if (price === null) return "---";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};
