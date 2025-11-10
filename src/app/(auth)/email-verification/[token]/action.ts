"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createSession } from "../../lib/session";
import { generateSessionToken, setSessionTokenCookie } from "../../lib/tokens";
import { sendEmailVerificationLink } from "../../user-verification/[userId]/email";
import { sendWelcomeRemarksEmail } from "./email";
import { generateEmailVerificationToken } from "./token";

export async function resendEmailVerificationLink(
  email: string,
): Promise<{ error: string | null }> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "User with email not found" };
    }
    const token = await generateEmailVerificationToken(user.id);
    await sendEmailVerificationLink({ email, token });
    return { error: null };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Error occurred while resending email verification link, please try again.",
    };
  }
}

export async function checkIsEmailVerified(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.emailVerified;
}

export async function sendWelcomingRemarks(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found.");
  if (!user.isWelcomed) {
    await sendWelcomeRemarksEmail({ email, name: user.name! });
  }
  const sessionToken = generateSessionToken();

  const [updatedUser, session] = await Promise.all([
    prisma.user.update({
      where: { email },
      data: {
        isWelcomed: true,
      },
    }),
    await createSession(sessionToken, user.id),
  ]);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  redirect("/");
}
