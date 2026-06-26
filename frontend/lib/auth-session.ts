export const ACCESS_TOKEN_STORAGE_KEY = "paiduay_access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "paiduay_refresh_token";
export const ACCESS_TOKEN_COOKIE_NAME = "paiduay_access_token";

export type AuthSession = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
} | null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredAccessToken() {
  if (!isBrowser()) {
    return null;
  }

  const storedToken = extractAccessTokenFromValue(
    window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  );

  if (storedToken) {
    return storedToken;
  }

  const cookieToken = extractAccessTokenFromValue(
    getCookieValue(ACCESS_TOKEN_COOKIE_NAME)
  );

  if (cookieToken) {
    return cookieToken;
  }

  return getSupabaseStoredAccessToken() ?? getSupabaseCookieAccessToken();
}

export function getStoredRefreshToken() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function storeAuthSession(session: AuthSession) {
  if (!isBrowser() || !session?.access_token) {
    return false;
  }

  try {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, session.access_token);

    if (session.refresh_token) {
      window.localStorage.setItem(
        REFRESH_TOKEN_STORAGE_KEY,
        session.refresh_token
      );
    }
  } catch {
    return false;
  }

  const maxAge =
    session.expires_at === undefined
      ? undefined
      : Math.max(session.expires_at - Math.floor(Date.now() / 1000), 0);
  const cookieParts = [
    `${ACCESS_TOKEN_COOKIE_NAME}=${encodeURIComponent(session.access_token)}`,
    "path=/",
    "samesite=lax",
    ...(window.location.protocol === "https:" ? ["secure"] : []),
    ...(maxAge !== undefined ? [`max-age=${maxAge}`] : [])
  ];

  document.cookie = cookieParts.join("; ");

  return Boolean(getStoredAccessToken());
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
  clearSupabaseStoredAuth();
  clearSupabaseAuthCookies();
}

function getCookieValue(name: string) {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(name.length + 1));
}

function isJwtToken(value: string) {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
}

function decodeBase64Url(value: string) {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalizedValue.length % 4)) % 4;

  return window.atob(normalizedValue + "=".repeat(paddingLength));
}

function parsePossibleJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getTokenFromParsedValue(value: unknown): string | null {
  if (typeof value === "string") {
    return isJwtToken(value) ? value : null;
  }

  if (Array.isArray(value)) {
    const jwtValue = value.find(
      (entry): entry is string => typeof entry === "string" && isJwtToken(entry)
    );

    return jwtValue ?? null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const objectValue = value as {
    access_token?: unknown;
    session?: {
      access_token?: unknown;
    };
    currentSession?: {
      access_token?: unknown;
    };
  };

  const token =
    objectValue.access_token ??
    objectValue.session?.access_token ??
    objectValue.currentSession?.access_token;

  return typeof token === "string" && isJwtToken(token) ? token : null;
}

function extractAccessTokenFromValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const decodedValue = decodeURIComponent(value);

  if (isJwtToken(decodedValue)) {
    return decodedValue;
  }

  const jsonToken = getTokenFromParsedValue(parsePossibleJson(decodedValue));

  if (jsonToken) {
    return jsonToken;
  }

  if (decodedValue.startsWith("base64-")) {
    try {
      const decodedBase64Value = decodeBase64Url(decodedValue.slice(7));
      return getTokenFromParsedValue(parsePossibleJson(decodedBase64Value));
    } catch {
      return null;
    }
  }

  return null;
}

function getSupabaseStoredAccessToken() {
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key?.startsWith("sb-") || !key.endsWith("-auth-token")) {
      continue;
    }

    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      continue;
    }

    try {
      const accessToken = extractAccessTokenFromValue(rawValue);

      if (accessToken) {
        return accessToken;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function clearSupabaseStoredAuth() {
  const keysToRemove: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key?.startsWith("sb-")) {
      continue;
    }

    const isAuthStorageKey =
      key.endsWith("-auth-token") || key.includes("code-verifier");

    if (isAuthStorageKey) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    window.localStorage.removeItem(key);
  }
}

function getSupabaseCookieAccessToken() {
  const cookies = document.cookie.split("; ").filter(Boolean);

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");
    const name = separatorIndex >= 0 ? cookie.slice(0, separatorIndex) : cookie;
    const value = separatorIndex >= 0 ? cookie.slice(separatorIndex + 1) : "";

    if (!name.startsWith("sb-") || !name.includes("auth-token")) {
      continue;
    }

    const accessToken = extractAccessTokenFromValue(value);

    if (accessToken) {
      return accessToken;
    }
  }

  const chunkGroups = new Map<string, Array<{ index: number; value: string }>>();

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");
    const name = separatorIndex >= 0 ? cookie.slice(0, separatorIndex) : cookie;
    const value = separatorIndex >= 0 ? cookie.slice(separatorIndex + 1) : "";
    const match = name.match(/^(sb-.+auth-token)\.(\d+)$/);

    if (!match) {
      continue;
    }

    const [, baseName, index] = match;
    const chunks = chunkGroups.get(baseName) ?? [];

    chunks.push({
      index: Number(index),
      value
    });
    chunkGroups.set(baseName, chunks);
  }

  for (const chunks of chunkGroups.values()) {
    const accessToken = extractAccessTokenFromValue(
      chunks
        .sort((a, b) => a.index - b.index)
        .map((chunk) => chunk.value)
        .join("")
    );

    if (accessToken) {
      return accessToken;
    }
  }

  return null;
}

function clearSupabaseAuthCookies() {
  const cookies = document.cookie.split("; ").filter(Boolean);

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");
    const name = separatorIndex >= 0 ? cookie.slice(0, separatorIndex) : cookie;
    const isSupabaseAuthCookie =
      name.startsWith("sb-") &&
      (name.includes("auth-token") || name.includes("code-verifier"));

    if (isSupabaseAuthCookie) {
      document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
    }
  }
}
