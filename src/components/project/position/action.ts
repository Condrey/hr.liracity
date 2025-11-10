"use server";

import prisma from "@/lib/prisma";
import { positionDataInclude } from "@/lib/types";
import { positionSchema, PositionSchema } from "@/lib/validation";
import { cache } from "react";

async function allPositions() {
  return await prisma.position.findMany({
    include: positionDataInclude,
    orderBy: { jobTitle: "asc" },
  });
}
export const getAllPositions = cache(allPositions);

export async function upsertPosition(input: PositionSchema) {
  // TODO: perform auth
  const {
    id,
    departmentalMandate,
    duties,
    jobTitle,
    salaryScale,
    reportsToId,
  } = positionSchema.parse(input);
  const formattedDuties = duties
    .map((d) => d.value)
    .filter(Boolean) as string[];
  return await prisma.position.upsert({
    where: { id },
    create: {
      departmentalMandate,
      jobTitle,
      salaryScale,
      reportsToId: reportsToId || undefined,
      duties: formattedDuties,
    },
    update: {
      departmentalMandate,
      jobTitle,
      salaryScale,
      reportsToId: reportsToId || undefined,
      duties: formattedDuties,
    },
    include: positionDataInclude,
  });
}

export async function deletePosition(id: string) {
  // TODO: perform auth
  return await prisma.position.delete({
    where: { id },
    include: positionDataInclude,
  });
}
