import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import {
  deleteSessionById,
  getSessionById,
  LuciaSession,
  LuciaUser,
  sessionExpiryDate,
  SessionValidationResult,
} from "./session";
import {
  constantTimeEqual,
  generateSecureRandomString,
  hashSecret,
  stringToUint8Array,
} from "./utils";

const activityCheckIntervalSeconds = 1000 * 60 * 60 * 3; // 3 hours

export function generateSessionToken(): string {
  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const token = id + "." + secret;
  return token;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const now = new Date();

  const tokenParts = token.split(".");
  if (tokenParts.length != 2) {
    return { user: null, session: null };
  }
  const sessionId = tokenParts[0];
  const sessionSecret = tokenParts[1];

  const session = await getSessionById(sessionId);
  if (!session) {
    console.error("No session found for ID:", sessionId);
    return { session: null, user: null };
  }

  const tokenSecretHash = await hashSecret(sessionSecret);
  const sessionSecretHashBytes = stringToUint8Array(session.secretHash);
  const validSecret = constantTimeEqual(
    tokenSecretHash,
    sessionSecretHashBytes,
  );
  if (!validSecret) {
    console.error("Session secret does not match for session ID:", sessionId);
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await deleteSessionById(sessionId);
    return { session: null, user: null };
  }
  // Has it been 3 hours (activityCheckIntervalSeconds) since the session was last verified
  // If yes then set the last time it was verified to now (refresh the timestamp) and in db too
  // “If it’s been more than 3 hours since we last saw this session active, mark it as active again and save that time in the database.”
  if (
    now.getTime() - session.lastVerifiedAt.getTime() >=
    activityCheckIntervalSeconds
  ) {
    session.lastVerifiedAt = now;
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        lastVerifiedAt: now,
      },
    });
  }
  // rolling session expiration:
  // If the session is going to expire within 15 days, it’s time to extend its lifetime to 30 days so as to keep active users logged in.
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + sessionExpiryDate); // To expire in 30 days
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: session.expiresAt },
    });
  }
  return {
    session: session satisfies LuciaSession,
    user: session.user as LuciaUser,
  };
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("oauth_session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Set to 0 to delete the cookie
  });
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("oauth_session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}
