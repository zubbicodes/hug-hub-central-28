import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  clearCustomerSession,
  completeCustomerAuthorization,
  createCustomerAuthorizationUrl,
  getCustomerAccountStatus,
  getCustomerProfile,
} from "../shopify/customer-account.server";

export const startCustomerAuth = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      mode: z.enum(["login", "register"]).default("login"),
    }),
  )
  .handler(async ({ data }) => createCustomerAuthorizationUrl(data.mode));

export const finishCustomerAuth = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      code: z.string().min(1),
      state: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => completeCustomerAuthorization(data.code, data.state));

export const getCustomerAuthStatus = createServerFn({ method: "GET" }).handler(async () =>
  getCustomerAccountStatus(),
);

export const getCustomerAccountProfile = createServerFn({ method: "GET" }).handler(async () =>
  getCustomerProfile(),
);

export const logoutCustomer = createServerFn({ method: "POST" }).handler(async () => {
  await clearCustomerSession();
  return { ok: true };
});
