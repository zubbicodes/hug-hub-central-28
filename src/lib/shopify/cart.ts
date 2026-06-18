export const SHOPIFY_CART_ID_STORAGE_KEY = "spares_automation_cart_id";

export function getStoredCartId() {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(SHOPIFY_CART_ID_STORAGE_KEY) ?? undefined;
}

export function setStoredCartId(cartId: string) {
  window.localStorage.setItem(SHOPIFY_CART_ID_STORAGE_KEY, cartId);
  window.dispatchEvent(new CustomEvent("shopify-cart-updated", { detail: { cartId } }));
}

export function clearStoredCartId() {
  window.localStorage.removeItem(SHOPIFY_CART_ID_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("shopify-cart-updated"));
}
