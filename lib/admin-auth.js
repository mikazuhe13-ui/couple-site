import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "couple_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

function sessionToken() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;

  return createHmac("sha256", secret)
    .update("couple-site-admin-session-v1")
    .digest("hex");
}

export function isAdminRequest(request) {
  const expected = sessionToken();
  const received = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!expected || !received || expected.length !== received.length) return false;

  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

export function createAdminSession(response) {
  const token = sessionToken();
  if (!token) return false;

  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return true;
}

export function clearAdminSession(response) {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
