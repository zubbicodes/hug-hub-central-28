import { getServerConfig } from "../config.server";

type ShopifyGraphQLError = {
  message: string;
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: ShopifyGraphQLError[];
};

export async function shopifyStorefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const config = getServerConfig();
  const domain = config.shopifyStoreDomain;
  const privateToken = config.shopifyStorefrontPrivateAccessToken;
  const publicToken = config.shopifyStorefrontAccessToken;
  const token = privateToken || publicToken;
  const apiVersion = config.shopifyStorefrontApiVersion;

  if (!domain || !token) {
    throw new Error(
      "Missing Shopify credentials. Set SHOPIFY_STORE_DOMAIN and a Storefront API token.",
    );
  }

  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(privateToken
        ? { "Shopify-Storefront-Private-Token": privateToken }
        : { "X-Shopify-Storefront-Access-Token": token }),
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await response.json()) as ShopifyResponse<T>;

  if (!response.ok || payload.errors?.length) {
    const message =
      payload.errors?.map((error) => error.message).join("; ") ||
      `Shopify Storefront API request failed with ${response.status}`;
    throw new Error(message);
  }

  if (!payload.data) {
    throw new Error("Shopify Storefront API returned no data.");
  }

  return payload.data;
}
