import type { ShopifyMoney, ShopifyProduct } from "./types";

export function formatMoney(money: ShopifyMoney) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

export function formatProductPrice(product: Pick<ShopifyProduct, "priceRange">) {
  const min = product.priceRange.minVariantPrice;
  const max = product.priceRange.maxVariantPrice;

  if (min.amount === max.amount && min.currencyCode === max.currencyCode) {
    return formatMoney(min);
  }

  return `From ${formatMoney(min)}`;
}
