"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

const allPositions = async () =>
  await prisma.position.findMany({ orderBy: { jobTitle: "asc" } });
export const getAllPositions = cache(allPositions);
