"use server";

import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { createSession } from "../../lib/session";
import { generateSessionToken, setSessionTokenCookie } from "../../lib/tokens";

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  const { username, email, password } = signUpSchema.parse(credentials);
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const existingUserName = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });
  if (existingUserName) {
    return {
      error: "Username is already taken, please select another",
    };
  }
  const existingEmail = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });
  if (existingEmail) {
    return {
      error:
        "Email is already taken or has been used to register before, just login",
    };
  }

  const user = await prisma.user.create({
    data: {
      username,
      name: username,
      email,
      passwordHash,
    },
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return redirect("/");
}
