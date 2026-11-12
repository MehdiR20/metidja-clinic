// Edge-safe JWT session helpers (used by middleware AND server code). No Node-only imports here.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "cm_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionRole = "PATIENT" | "STAFF" | "ADMIN";
export type SessionPayload = { sub: string; role: SessionRole; name: string };

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters long");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ role: payload.role, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.role !== "string") return null;
    return { sub: payload.sub, role: payload.role as SessionRole, name: String(payload.name ?? "") };
  } catch {
    return null;
  }
}

export const isStaffRole = (role?: SessionRole) => role === "ADMIN" || role === "STAFF";
