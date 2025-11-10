import { github } from "@/auth";
import prisma from "@/lib/prisma";
import { globalGETRateLimit } from "@/src/app/(auth)/lib/request";
import { createSession } from "@/src/app/(auth)/lib/session";
import {
  generateSessionToken,
  setSessionTokenCookie,
} from "@/src/app/(auth)/lib/tokens";
import { ObjectParser } from "@pilcrowjs/object-parser";
import type { OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  if (!globalGETRateLimit()) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
    return new Response("Please restart the process", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
      statusText: "Invalid State",
    });
  }
  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch (e) {
    // Invalid code or client credentials
    console.error(e);
    return new Response("Please, restart the process.", {
      status: 400,
      statusText: "Invalid Code",
    });
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const userResult: unknown = await userResponse.json();
  const userParser = new ObjectParser(userResult);

  const githubUserId = userParser.getNumber("id").toString();
  const githubUsername = userParser.getString("login");
  const githubAvatarUrl = userParser.getString("avatar_url");

  const existingUser = await prisma.user.findUnique({
    where: { githubId: githubUserId },
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
  const emailListResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const emailListResult: unknown = await emailListResponse.json();
  if (!Array.isArray(emailListResult) || emailListResult.length < 1) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }
  let email: string | null = null;
  for (const emailRecord of emailListResult) {
    const emailParser = new ObjectParser(emailRecord);
    const primaryEmail = emailParser.getBoolean("primary");
    const verifiedEmail = emailParser.getBoolean("verified");
    if (primaryEmail && verifiedEmail) {
      email = emailParser.getString("email");
    }
  }
  if (email === null) {
    return new Response("Please verify your GitHub email address.", {
      status: 400,
    });
  }

  const user = await prisma.user.create({
    data: {
      githubId: githubUserId,
      username: githubUsername,
      avatarUrl: githubAvatarUrl,
      email,
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
