type CookieMap = Record<string, string | undefined>;

export const ACCESS_TOKEN_COOKIE_NAME = "paiduay_access_token";

function isJwtToken(value: string) {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
}

function decodeBase64Url(value: string) {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalizedValue.length % 4)) % 4;

  return Buffer.from(
    normalizedValue + "=".repeat(paddingLength),
    "base64"
  ).toString("utf8");
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

export function extractAccessTokenFromValue(value: string | undefined) {
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
    const decodedBase64Value = decodeBase64Url(decodedValue.slice(7));
    return getTokenFromParsedValue(parsePossibleJson(decodedBase64Value));
  }

  return null;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getChunkedCookieValue(cookies: CookieMap, baseName: string) {
  const chunks = Object.entries(cookies)
    .map(([name, value]) => {
      const match = name.match(new RegExp(`^${escapeRegExp(baseName)}\\.(\\d+)$`));

      if (!match || value === undefined) {
        return null;
      }

      return {
        index: Number(match[1]),
        value
      };
    })
    .filter((chunk): chunk is { index: number; value: string } => Boolean(chunk))
    .sort((a, b) => a.index - b.index);

  if (chunks.length === 0) {
    return null;
  }

  return chunks.map((chunk) => chunk.value).join("");
}

export function getAuthCookieNames(cookies: CookieMap = {}) {
  return Object.keys(cookies).filter(
    (name) =>
      name === ACCESS_TOKEN_COOKIE_NAME ||
      (name.startsWith("sb-") && name.includes("auth-token"))
  );
}

export function extractAccessTokenFromCookies(cookies: CookieMap = {}) {
  const directToken = extractAccessTokenFromValue(
    cookies[ACCESS_TOKEN_COOKIE_NAME]
  );

  if (directToken) {
    return directToken;
  }

  for (const [name, value] of Object.entries(cookies)) {
    if (!name.startsWith("sb-") || !name.includes("auth-token")) {
      continue;
    }

    const token = extractAccessTokenFromValue(value);

    if (token) {
      return token;
    }
  }

  const chunkBaseNames = new Set(
    Object.keys(cookies)
      .map((name) => name.match(/^(sb-.+auth-token)\.\d+$/)?.[1])
      .filter((name): name is string => Boolean(name))
  );

  for (const baseName of chunkBaseNames) {
    const token = extractAccessTokenFromValue(
      getChunkedCookieValue(cookies, baseName) ?? undefined
    );

    if (token) {
      return token;
    }
  }

  return null;
}
