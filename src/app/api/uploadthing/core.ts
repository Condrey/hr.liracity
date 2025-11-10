import { validateRequest } from "@/auth";
import { MAX_ATTACHMENTS } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import z from "zod";
const f = createUploadthing();

const meAvatarRouter = f({
  image: { maxFileSize: "512KB" },
})
  .middleware(async () => {
    const { user } = await validateRequest();
    if (!user) throw new UploadThingError("Unauthorized");
    return { user };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    const oldAvatarUrl = metadata.user.avatarUrl;
    if (oldAvatarUrl) {
      const key = oldAvatarUrl.split(
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      )[1];
      await new UTApi().deleteFiles(key);
    }

    const newAvatarUrl = file.url.replace(
      "/f/",
      `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
    );

    await prisma.user.update({
      where: { id: metadata.user.id },
      data: {
        avatarUrl: newAvatarUrl,
      },
    });

    return { avatarUrl: newAvatarUrl };
  });

const notMeAvatarRouter = f({
  image: { maxFileSize: "512KB" },
})
  .input(z.object({ userId: z.string().optional() }))
  .middleware(async ({ input }) => {
    const { user } = await validateRequest();
    if (!user) throw new UploadThingError("Unauthorized");
    // check whether user exists and update their avatarUrl
    return { userId: input.userId };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    if (!!metadata.userId) {
      const oldUser = await prisma.user.findFirst({
        where: { id: metadata.userId },
      });
      if (oldUser && oldUser.avatarUrl) {
        const oldAvatarUrl = oldUser.avatarUrl;
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        )[1];
        await new UTApi().deleteFiles(key);
      }
    }
    const newAvatarUrl = file.url.replace(
      "/f/",
      `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
    );
    await prisma.user.upsert({
      where: { id: metadata.userId },
      create: {
        avatarUrl: newAvatarUrl,
      },
      update: {
        avatarUrl: newAvatarUrl,
      },
    });

    return { avatarUrl: newAvatarUrl };
  });

const coverImageRouter = f({
  image: { maxFileSize: "512KB" },
})
  .middleware(async () => {
    const { user } = await validateRequest();
    if (!user) throw new UploadThingError("Unauthorized");
    return { user };
  })

  .onUploadComplete(async ({ file }) => {
    const coverImageUrl = file.url.replace(
      "/f/",
      `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
    );
    const media = await prisma.media.create({
      data: {
        url: file.url.replace(
          "/f/",
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        ),
        type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
      },
    });
    return { coverImageUrl, mediaId: media.id };
  });

const attachmentRouter = f({
  image: { maxFileSize: "2MB", maxFileCount: MAX_ATTACHMENTS },
  video: { maxFileSize: "4MB", maxFileCount: MAX_ATTACHMENTS },
})
  .middleware(async () => {
    const { user } = await validateRequest();
    if (!user) throw new UploadThingError("Unauthorized");
    return {};
  })
  .onUploadComplete(async ({ file }) => {
    const media = await prisma.media.create({
      data: {
        url: file.url.replace(
          "/f/",
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        ),
        type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
      },
    });

    return { mediaId: media.id };
  });

export const appFileRouter = {
  myAvatar: meAvatarRouter,
  notMyAvatar: notMeAvatarRouter,
  attachment: attachmentRouter,
  coverImageAttachment: coverImageRouter,
} satisfies FileRouter;

export type AppFileRouter = typeof appFileRouter;
