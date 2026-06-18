import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  addCartLines,
  createCart,
  createCustomer,
  getCart,
  getCollectionByHandle,
  getProductByHandle,
  getProducts,
  removeCartLine,
  updateCartLine,
} from "../shopify/queries.server";

const positiveQuantity = z.number().int().min(1).max(99);

export const getCollection = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      handle: z.string().min(1),
      first: z.number().int().min(1).max(100).default(24),
    }),
  )
  .handler(async ({ data }) => getCollectionByHandle(data.handle, data.first));

export const getLatestProducts = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      first: z.number().int().min(1).max(100).default(24),
      query: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => getProducts(data.first, data.query));

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator(z.object({ handle: z.string().min(1) }))
  .handler(async ({ data }) => getProductByHandle(data.handle));

export const getShopifyCart = createServerFn({ method: "GET" })
  .inputValidator(z.object({ cartId: z.string().min(1) }))
  .handler(async ({ data }) => getCart(data.cartId));

export const addToShopifyCart = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      cartId: z.string().optional(),
      variantId: z.string().min(1),
      quantity: positiveQuantity,
    }),
  )
  .handler(async ({ data }) => {
    if (data.cartId) {
      return addCartLines(data.cartId, data.variantId, data.quantity);
    }
    return createCart(data.variantId, data.quantity);
  });

export const updateShopifyCartLine = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      cartId: z.string().min(1),
      lineId: z.string().min(1),
      quantity: z.number().int().min(0).max(99),
    }),
  )
  .handler(async ({ data }) => {
    if (data.quantity === 0) {
      return removeCartLine(data.cartId, data.lineId);
    }
    return updateCartLine(data.cartId, data.lineId, data.quantity);
  });

export const removeShopifyCartLine = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      cartId: z.string().min(1),
      lineId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => removeCartLine(data.cartId, data.lineId));

export const createShopifyCustomer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      firstName: z.string().trim().min(1, "First name is required").max(80),
      lastName: z.string().trim().min(1, "Last name is required").max(80),
      email: z.string().trim().email("Enter a valid email address"),
      phone: z
        .string()
        .trim()
        .max(20)
        .optional()
        .refine((phone) => !phone || /^\+[1-9]\d{6,14}$/.test(phone), {
          message: "Phone must be in international format, for example +923027458952",
        }),
      password: z.string().min(8, "Password must be at least 8 characters").max(72),
      acceptsMarketing: z.boolean().default(false),
    }),
  )
  .handler(async ({ data }) => {
    const result = await createCustomer({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || undefined,
      acceptsMarketing: data.acceptsMarketing,
    });

    return {
      customerId: result.customer?.id ?? null,
      errors: result.customerUserErrors.map((error) => ({
        code: error.code,
        message: error.message,
        field: error.field,
      })),
    };
  });
