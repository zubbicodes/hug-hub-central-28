import { CART_FRAGMENT, PRODUCT_CARD_FRAGMENT, PRODUCT_DETAIL_FRAGMENT } from "./fragments";
import { shopifyStorefront } from "./storefront.server";
import type { ShopifyCart, ShopifyCollection, ShopifyProduct } from "./types";

type Connection<T> = {
  nodes: T[];
};

type ProductConnectionShape = Omit<ShopifyProduct, "variants" | "images"> & {
  variants: Connection<ShopifyProduct["variants"][number]>;
  images?: Connection<ShopifyProduct["images"][number]>;
};

type CollectionConnectionShape = Omit<ShopifyCollection, "products"> & {
  products: Connection<ProductConnectionShape>;
};

type CartConnectionShape = Omit<ShopifyCart, "lines"> & {
  lines: Connection<ShopifyCart["lines"][number]>;
};

type CartUserError = {
  field: string[] | null;
  message: string;
};

type CustomerUserError = {
  code?: string | null;
  field: string[] | null;
  message: string;
};

type CustomerCreateInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
};

function assertCartMutation(cart: ShopifyCart | null, errors: CartUserError[] = []) {
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join("; "));
  }
  if (!cart) {
    throw new Error("Shopify did not return a cart.");
  }
  return cart;
}

function normalizeProduct(product: ProductConnectionShape): ShopifyProduct {
  return {
    ...product,
    variants: product.variants.nodes,
    images: product.images?.nodes ?? [],
  };
}

function normalizeCollection(collection: CollectionConnectionShape): ShopifyCollection {
  return {
    ...collection,
    products: collection.products.nodes.map(normalizeProduct),
  };
}

function normalizeCart(cart: CartConnectionShape): ShopifyCart {
  return {
    ...cart,
    lines: cart.lines.nodes,
  };
}

function assertAndNormalizeCart(cart: CartConnectionShape | null, errors: CartUserError[] = []) {
  return normalizeCart(
    assertCartMutation(
      cart as unknown as ShopifyCart | null,
      errors,
    ) as unknown as CartConnectionShape,
  );
}

export async function getCollectionByHandle(handle: string, first = 24) {
  const data = await shopifyStorefront<{
    collection: CollectionConnectionShape | null;
  }>(
    `#graphql
      ${PRODUCT_CARD_FRAGMENT}
      query CollectionByHandle($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          id
          handle
          title
          description
          image {
            url
            altText
            width
            height
          }
          products(first: $first, sortKey: MANUAL) {
            nodes {
              ...ProductCardFields
            }
          }
        }
      }
    `,
    { handle, first },
  );

  if (!data.collection) return null;
  return normalizeCollection(data.collection);
}

export async function getProducts(first = 24, query?: string) {
  const data = await shopifyStorefront<{
    products: Connection<ProductConnectionShape>;
  }>(
    `#graphql
      ${PRODUCT_CARD_FRAGMENT}
      query Products($first: Int!, $query: String) {
        products(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
          nodes {
            ...ProductCardFields
          }
        }
      }
    `,
    { first, query },
  );

  return data.products.nodes.map(normalizeProduct);
}

export async function getProductByHandle(handle: string) {
  const data = await shopifyStorefront<{
    product: ProductConnectionShape | null;
  }>(
    `#graphql
      ${PRODUCT_DETAIL_FRAGMENT}
      query ProductByHandle($handle: String!) {
        product(handle: $handle) {
          ...ProductDetailFields
        }
      }
    `,
    { handle },
  );

  return data.product ? normalizeProduct(data.product) : null;
}

export async function getCart(cartId: string) {
  const data = await shopifyStorefront<{ cart: CartConnectionShape | null }>(
    `#graphql
      ${CART_FRAGMENT}
      query Cart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFields
        }
      }
    `,
    { cartId },
  );

  return data.cart ? normalizeCart(data.cart) : null;
}

export async function createCart(variantId: string, quantity: number) {
  const data = await shopifyStorefront<{
    cartCreate: {
      cart: CartConnectionShape | null;
      userErrors: CartUserError[];
    };
  }>(
    `#graphql
      ${CART_FRAGMENT}
      mutation CreateCart($variantId: ID!, $quantity: Int!) {
        cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: $quantity }] }) {
          cart {
            ...CartFields
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { variantId, quantity },
  );

  return assertAndNormalizeCart(data.cartCreate.cart, data.cartCreate.userErrors);
}

export async function addCartLines(cartId: string, variantId: string, quantity: number) {
  const data = await shopifyStorefront<{
    cartLinesAdd: {
      cart: CartConnectionShape | null;
      userErrors: CartUserError[];
    };
  }>(
    `#graphql
      ${CART_FRAGMENT}
      mutation AddCartLines($cartId: ID!, $variantId: ID!, $quantity: Int!) {
        cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $variantId, quantity: $quantity }]) {
          cart {
            ...CartFields
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { cartId, variantId, quantity },
  );

  return assertAndNormalizeCart(data.cartLinesAdd.cart, data.cartLinesAdd.userErrors);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await shopifyStorefront<{
    cartLinesUpdate: {
      cart: CartConnectionShape | null;
      userErrors: CartUserError[];
    };
  }>(
    `#graphql
      ${CART_FRAGMENT}
      mutation UpdateCartLine($cartId: ID!, $lineId: ID!, $quantity: Int!) {
        cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
          cart {
            ...CartFields
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { cartId, lineId, quantity },
  );

  return assertAndNormalizeCart(data.cartLinesUpdate.cart, data.cartLinesUpdate.userErrors);
}

export async function removeCartLine(cartId: string, lineId: string) {
  const data = await shopifyStorefront<{
    cartLinesRemove: {
      cart: CartConnectionShape | null;
      userErrors: CartUserError[];
    };
  }>(
    `#graphql
      ${CART_FRAGMENT}
      mutation RemoveCartLine($cartId: ID!, $lineId: ID!) {
        cartLinesRemove(cartId: $cartId, lineIds: [$lineId]) {
          cart {
            ...CartFields
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { cartId, lineId },
  );

  return assertAndNormalizeCart(data.cartLinesRemove.cart, data.cartLinesRemove.userErrors);
}

export async function createCustomer(input: CustomerCreateInput) {
  const data = await shopifyStorefront<{
    customerCreate: {
      customer: { id: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(
    `#graphql
      mutation CustomerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    { input },
  );

  return data.customerCreate;
}
