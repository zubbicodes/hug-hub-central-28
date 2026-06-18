import crypto from "node:crypto";

import {
  clearSession,
  deleteCookie,
  getCookie,
  setCookie,
  useSession as getServerSessionManager,
} from "@tanstack/react-start/server";

const AUTH_STATE_COOKIE = "sa_customer_auth_state";
const AUTH_VERIFIER_COOKIE = "sa_customer_auth_verifier";
const CUSTOMER_SESSION_COOKIE = "sa_customer_session";
const AUTH_COOKIE_MAX_AGE = 10 * 60;
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

type CustomerAccountSession = {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
};

type CustomerAccountConfig = {
  clientId?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  logoutEndpoint?: string;
  apiUrl?: string;
  redirectUri?: string;
  apiVersion: string;
  sessionSecret?: string;
};

type CustomerAccountTokenResponse = {
  access_token: string;
  expires_in?: number;
  id_token?: string;
  refresh_token?: string;
  token_type?: string;
};

export type CustomerAccountProfile = {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

function getCustomerAccountConfig(): CustomerAccountConfig {
  return {
    clientId: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
    authorizationEndpoint: process.env.SHOPIFY_CUSTOMER_ACCOUNT_AUTHORIZATION_ENDPOINT,
    tokenEndpoint: process.env.SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_ENDPOINT,
    logoutEndpoint: process.env.SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_ENDPOINT,
    apiUrl: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL,
    redirectUri: process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI,
    apiVersion: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION ?? "2026-04",
    sessionSecret: process.env.APP_SESSION_SECRET,
  };
}

function missingCustomerAccountConfig(config = getCustomerAccountConfig()) {
  const missing: string[] = [];
  if (!config.clientId) missing.push("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID");
  if (!config.authorizationEndpoint) {
    missing.push("SHOPIFY_CUSTOMER_ACCOUNT_AUTHORIZATION_ENDPOINT");
  }
  if (!config.tokenEndpoint) missing.push("SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_ENDPOINT");
  if (!config.redirectUri) missing.push("SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI");
  if (!config.sessionSecret) missing.push("APP_SESSION_SECRET");
  return missing;
}

function sessionConfig(secret: string) {
  return {
    name: CUSTOMER_SESSION_COOKIE,
    password: secret,
    maxAge: SESSION_MAX_AGE,
    cookie: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  };
}

function randomBase64Url(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

function sha256Base64Url(value: string) {
  return crypto.createHash("sha256").update(value).digest("base64url");
}

function setOAuthCookie(name: string, value: string) {
  setCookie(name, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
}

function deleteOAuthCookie(name: string) {
  deleteCookie(name, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function createCustomerAuthorizationUrl(mode: "login" | "register") {
  const config = getCustomerAccountConfig();
  const missing = missingCustomerAccountConfig(config);
  if (missing.length > 0) {
    return { ok: false as const, missing };
  }

  const state = randomBase64Url();
  const codeVerifier = randomBase64Url(64);
  const codeChallenge = sha256Base64Url(codeVerifier);

  setOAuthCookie(AUTH_STATE_COOKIE, state);
  setOAuthCookie(AUTH_VERIFIER_COOKIE, codeVerifier);

  const authorizationUrl = new URL(config.authorizationEndpoint!);
  authorizationUrl.searchParams.set("client_id", config.clientId!);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("redirect_uri", config.redirectUri!);
  authorizationUrl.searchParams.set("scope", "openid email customer-account-api:full");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", codeChallenge);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");

  if (mode === "register") {
    authorizationUrl.searchParams.set("prompt", "login");
  }

  return { ok: true as const, url: authorizationUrl.toString() };
}

export async function completeCustomerAuthorization(code: string, state: string) {
  const config = getCustomerAccountConfig();
  const missing = missingCustomerAccountConfig(config);
  if (missing.length > 0) {
    return { ok: false as const, missing };
  }

  const expectedState = getCookie(AUTH_STATE_COOKIE);
  const codeVerifier = getCookie(AUTH_VERIFIER_COOKIE);
  if (!expectedState || !codeVerifier || expectedState !== state) {
    return {
      ok: false as const,
      error: "Your Shopify login session expired. Please start sign in again.",
    };
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId!,
    code,
    redirect_uri: config.redirectUri!,
    code_verifier: codeVerifier,
  });

  const response = await fetch(config.tokenEndpoint!, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
    body,
  });

  if (!response.ok) {
    return {
      ok: false as const,
      error: "Shopify could not complete this customer login.",
    };
  }

  const token = (await response.json()) as CustomerAccountTokenResponse;
  const session = await getServerSessionManager<CustomerAccountSession>(
    sessionConfig(config.sessionSecret!),
  );
  await session.update({
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    idToken: token.id_token,
    expiresAt: Date.now() + (token.expires_in ?? SESSION_MAX_AGE) * 1000,
  });

  deleteOAuthCookie(AUTH_STATE_COOKIE);
  deleteOAuthCookie(AUTH_VERIFIER_COOKIE);

  return { ok: true as const };
}

export async function getCustomerSession() {
  const config = getCustomerAccountConfig();
  if (!config.sessionSecret) return null;

  const session = await getServerSessionManager<CustomerAccountSession>(
    sessionConfig(config.sessionSecret),
  );
  if (!session.data.accessToken) return null;
  if (session.data.expiresAt && session.data.expiresAt <= Date.now()) {
    await session.clear();
    return null;
  }
  return session.data;
}

export async function clearCustomerSession() {
  const config = getCustomerAccountConfig();
  if (!config.sessionSecret) return;
  await clearSession({
    name: CUSTOMER_SESSION_COOKIE,
    password: config.sessionSecret,
    cookie: { path: "/" },
  });
}

export async function getCustomerAccountStatus() {
  const config = getCustomerAccountConfig();
  const missing = missingCustomerAccountConfig(config);
  const session = await getCustomerSession();
  return {
    configured: missing.length === 0,
    missing,
    loggedIn: Boolean(session?.accessToken),
    hasProfileApi: Boolean(config.apiUrl),
  };
}

export async function getCustomerProfile(): Promise<CustomerAccountProfile | null> {
  const config = getCustomerAccountConfig();
  const session = await getCustomerSession();
  if (!config.apiUrl || !session?.accessToken) return null;

  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({
      query: `#graphql
        query CustomerAccountProfile {
          customer {
            displayName
            firstName
            lastName
            emailAddress {
              emailAddress
            }
          }
        }
      `,
    }),
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as {
    data?: {
      customer?: {
        displayName?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        emailAddress?: { emailAddress?: string | null } | null;
      };
    };
  };

  const customer = payload.data?.customer;
  if (!customer) return null;
  return {
    displayName: customer.displayName,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.emailAddress?.emailAddress,
  };
}
