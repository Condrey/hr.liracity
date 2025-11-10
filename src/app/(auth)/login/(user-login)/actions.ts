"use server";

import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { createSession } from "../../lib/session";
import { generateSessionToken, setSessionTokenCookie } from "../../lib/tokens";

export async function loginAction(
  credentials: LoginValues,
  loginRedirectUrl: string,
): Promise<{ error: string }> {
  console.log(credentials);
  const { username, password } = loginSchema.parse(credentials);

  let existingUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });
  if (!existingUser) {
    existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
  }

  if (!existingUser || !existingUser.passwordHash) {
    return {
      error: "Incorrect username or password.",
    };
  }

  const validPassword = await verify(existingUser.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return {
      error: "Incorrect username or password.",
    };
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, existingUser.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  // Avoiding phishing
  if (!loginRedirectUrl.startsWith("/")) {
    loginRedirectUrl = "/";
  }
  return redirect(
    existingUser.isVerified
      ? loginRedirectUrl
      : `/user-verification/${existingUser.id}`,
  );
}
