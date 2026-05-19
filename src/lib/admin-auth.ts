import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type AdminSession = {
  username: string;
  expiresAt: number;
};

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.RAZORPAY_KEY_SECRET || "dev-admin-secret";
}

function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "changeme123",
  };
}

function sign(value: string) {
  return createHmac("sha256", getAdminSecret()).update(value).digest("hex");
}

function encodeSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function decodeSession(token: string): AdminSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    provided.length !== expectedBuffer.length ||
    !timingSafeEqual(provided, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (!parsed?.username || !parsed?.expiresAt) return null;
    if (Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(username: string, password: string) {
  const expected = getAdminCredentials();
  return username === expected.username && password === expected.password;
}

export function createAdminSessionCookie(username: string) {
  const session = encodeSession({
    username,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  });

  return [
    `${COOKIE_NAME}=${session}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ].join("; ");
}

export function clearAdminSessionCookie() {
  return [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

export function getAdminSession(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;

  return decodeSession(match.slice(`${COOKIE_NAME}=`.length));
}

export function requireAdminSession(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}
