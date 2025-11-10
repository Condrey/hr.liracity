import { google } from "@/auth";
import prisma from "@/lib/prisma";
import { globalGETRateLimit } from "@/src/app/(auth)/lib/request";
import { createSession } from "@/src/app/(auth)/lib/session";
import {
  generateSessionToken,
  setSessionTokenCookie,
} from "@/src/app/(auth)/lib/tokens";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  if (!globalGETRateLimit()) {
    return new Response("Too many requests", { status: 429 });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("state")?.value ?? null;
  const codeVerifier = cookieStore.get("code_verifier")?.value ?? null;

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  if (state !== storedState) {
    return new Response("Please, restart the process.", {
      status: 400,
      statusText: "Invalid State",
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    // Invalid code or client credentials
    return new Response("Please restart the process.", {
      status: 400,
      statusText: "Invalid Code",
    });
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);

  const googleUserId = claimsParser.getString("sub");
  const username = claimsParser.getString("name");
  const avatarUrl = claimsParser.getString("picture");
  const email = claimsParser.getString("email");

  const existingUser = await prisma.user.findUnique({
    where: { googleId: googleUserId },
  });

  // When a user already exists, update the session
  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  // When a user does not exist, create a new user and session
  const user = await prisma.user.create({
    data: {
      googleId: googleUserId,
      username: username,
      avatarUrl: avatarUrl,
      role: "USER",
      isVerified: false,
      emailVerified: false,
    },
  });
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
